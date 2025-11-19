'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useUserMutations } from '@/hooks/mutations/useUserMutations';
import { FormValidators } from '@/utils/validators';
import { LoadingContent } from '../../components/LoadingContent';
import { useUserStatsQuery } from '@/hooks/queries/useUserStatsQuery';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/components/PasswordInput';

export function ProfileForm({ formId, onClose }) {
  const { updateProfile, isPending } = useUserMutations();
  const { user: authUser, isLoading: isAuthLoading, updateUser } = useAuth();
  const { data: stats, isLoading: statsLoading } = useUserStatsQuery();
  const [isEditing, setIsEditing] = React.useState(false);
  const isSaving = isPending;

  const donationsCount = statsLoading ? '...' : stats?.registeredDonations || 0;
  const familiesCount = statsLoading
    ? '...'
    : stats?.registeredDistributions || 0;

  // inicialização do form
  const form = useForm({
    defaultValues: authUser || { name: '', email: '', password: '', role: '' },
    mode: 'onBlur',
  });

  const { control, handleSubmit } = form;

  // carrega dados no formulário
  React.useEffect(() => {
    if (authUser) {
      form.reset(authUser);
    }
  }, [authUser, form.reset]);

  // funções de controle de estado
  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    form.reset(authUser);
    form.clearErrors();
  };

  const onSubmit = (data) => {
    const mutationCallbacks = {
      onSuccess: (updatedUser) => {
        updateUser(updatedUser);
        const resetData = { ...updatedUser, password: '' };
        form.reset(resetData);
        setIsEditing(false);
        if (onClose) onClose();
      },
    };

    if (authUser && authUser.id) {
      const payload = { ...data };
      if (!payload.password || payload.password.trim() === '') {
        delete payload.password;
      }
      delete payload.role;

      updateProfile.mutate(payload, mutationCallbacks);
    }
  };

  if (isAuthLoading || !authUser) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <LoadingContent>dados do perfil</LoadingContent>
        </div>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <div className="grid md:grid-cols-[1fr_2fr] gap-6">
        {/* sidebar*/}
        <div className="md:sticky md:top-8 md:h-fit">
          <Card className="bg-background p-6 border border-border">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={'https://api.dicebear.com/9.x/bottts/svg?seed=Amaya'}
                  />
                  <AvatarFallback>
                    {authUser?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {authUser?.name || 'Nome do Usuário'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {authUser?.role}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                id: {authUser?.id}
              </p>

              {/* status*/}
              <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-border">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {statsLoading ? '...' : donationsCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Doações Registradas
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {statsLoading ? '...' : familiesCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Famílías Atendidas
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* conteúdo principal */}
        <div className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Informações Gerais</TabsTrigger>
            <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-background p-6 border border-border">
              <Form {...form}>
                <form
                  id={formId}
                  onSubmit={
                    isEditing
                      ? handleSubmit(onSubmit)
                      : (e) => e.preventDefault()
                  }
                >
                  <div className="space-y-6">
                    {/* nome */}
                    <FormField
                      name="name"
                      control={control}
                      rules={{ required: 'O nome é obrigatório.' }}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel htmlFor="name">Nome</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nome Completo"
                              disabled={!isEditing || isSaving}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* email */}
                    <FormField
                      name="email"
                      control={control}
                      rules={{
                        required: 'O email é obrigatório.',
                        validate: FormValidators.email,
                      }}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel htmlFor="email">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="email@exemplo.com"
                              type="email"
                              disabled={!isEditing || isSaving}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* senha */}
                    <FormField
                      name="password"
                      control={control}
                      rules={{
                        validate: FormValidators.password, // senha opcional na edição
                      }}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel htmlFor="password">Nova Senha</FormLabel>
                          <FormControl>
                            <PasswordInput
                              maxLength={128}
                              placeholder={
                                authUser
                                  ? 'Deixe em branco para não alterar'
                                  : 'Senha'
                              }
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* role */}
                    <div className="space-y-2">
                      <FormLabel
                        htmlFor="role"
                        className="text-foreground font-medium"
                      >
                        Perfil
                      </FormLabel>
                      <Input
                        id="role"
                        disabled
                        value={authUser?.role || ''} // apenas exibe o valor
                        className="bg-muted border-border text-foreground"
                        placeholder="..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                    {isEditing ? (
                      // modo de edição ativo
                      <>
                        <Button
                          type="submit"
                          disabled={isSaving || !form.formState.isDirty}
                          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          type="button"
                          variant="outline"
                          className="flex-1 border-border text-foreground hover:bg-muted"
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      // modo de edição inativo
                      <Button
                        onClick={handleEdit}
                        type="button"
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Editar
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </Card>
          </TabsContent>

          {/* privacidde */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-background p-6 border border-border">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">
                      Notificações por Email
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Receba atualizações importantes
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">
                        Dois Fatores
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Adicione uma camada extra de segurança
                      </p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  Salvar Preferências
                </Button>
              </div>
            </Card>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
