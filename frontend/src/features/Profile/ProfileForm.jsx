'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useUserMutations } from '@/hooks/mutations/useUserMutations';
import { FrontendValidators } from '@/utils/formValidator';
import { LoadingContent } from '../../components/LoadingContent';
import { useUserStatsQuery } from '@/hooks/queries/useUserStatsQuery';

export function ProfileForm({ formId, onClose }) {
  const { updateProfile, isPending } = useUserMutations();
  // obter updateUser (função de atualização do AuthContext)
  const { user: authUser, isLoading: isAuthLoading, updateUser } = useAuth();
  const { data: stats, isLoading: statsLoading } = useUserStatsQuery();
  const [isEditing, setIsEditing] = React.useState(false);
  const isSaving = isPending;

  const donationsCount = statsLoading ? '...' : stats?.registeredDonations || 0;
  const familiesCount = statsLoading
    ? '...'
    : stats?.registeredDistributions || 0;

  // inicialização do form: usando authUser
  const form = useForm({
    // usa authUser se estiver disponível, caso contrário, usa fallback
    defaultValues: authUser || { name: '', email: '', password: '', role: '' },
    mode: 'onBlur',
  });

  // carregamento assíncrono
  // preenche o formulário quando authUser (o usuário logado) chega
  React.useEffect(() => {
    // usa authUser como dependência
    if (authUser) {
      form.reset(authUser);
    }
  }, [authUser, form.reset]);

  // funções de controle de estado
  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    // usa o reset com os dados atuais do authUser para descartar as alterações do formulário
    form.reset(authUser);
    form.clearErrors();
  };

  const onSubmit = (data) => {
    const mutationCallbacks = {
      // recebe a resposta do backend (updatedUser)
      onSuccess: (updatedUser) => {
        // sincroniza o estado global do AuthContext
        updateUser(updatedUser);

        // reseta o formulário com os novos dados, garante que o estado interno do react-hook-form seja atualizado e 'isDirty' seja false
        // cria uma cópia dos dados atualizados para limpar a senha
        const resetData = { ...updatedUser, password: '' };

        // r3. Reseta o formulário com o campo de senha vazio
        form.reset(resetData);

        setIsEditing(false); // sai do modo de edição
        if (onClose) onClose();
      },
    };

    if (authUser && authUser.id) {
      // ... (payload e chamada da mutação)
      const payload = { ...data };
      if (!payload.password || payload.password.trim() === '') {
        delete payload.password;
      }
      delete payload.role;

      updateProfile.mutate(payload, mutationCallbacks);
    }
  };

  // se 'user' for null e não estiver em edição, mostra um loading
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
        {/* Sidebar */}
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
              {/* ... Stats ... */}
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

        {/* Main Content */}
        <div className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Informações Gerais</TabsTrigger>
            <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-background p-6 border border-border">
              <form
                id={formId}
                onSubmit={
                  isEditing
                    ? form.handleSubmit(onSubmit)
                    : (e) => e.preventDefault()
                }
              >
                <div className="space-y-6">
                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      placeholder="Nome Completo"
                      {...form.register('name', {
                        required: 'O nome é obrigatório.',
                      })}
                      disabled={!isEditing || isSaving}
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="email@exemplo.com"
                      type="email"
                      {...form.register('email', {
                        validate: FrontendValidators.email,
                      })}
                      disabled={!isEditing || isSaving}
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Nova Senha</Label>
                    <Input
                      id="password"
                      placeholder={'Deixe em branco para não alterar'}
                      type="password"
                      {...form.register('password', {
                        // remove a obrigatoriedade da senha no modo de edição
                        // a senha só deve ser validada se for preenchida, fazer validação no bakcend
                        // minLength: {
                        //   value: 6,
                        //   message: 'A senha deve ter pelo menos 6 caracteres',
                        // },
                      })}
                      disabled={!isEditing || isSaving}
                    />
                    {form.formState.errors.password && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="text-foreground font-medium"
                    >
                      Perfil
                    </Label>
                    <Input
                      id="role"
                      disabled
                      value={authUser?.role || ''} // apenas exibe o valor
                      className="bg-muted border-border text-foreground"
                      placeholder="ex: Designer, Desenvolvedor..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                  {isEditing ? (
                    // modo de edição ativo
                    <>
                      <Button
                        type="submit"
                        disabled={isSaving || !form.formState.isDirty} // adicionado isDirty para desabilitar se não houver mudanças
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
            </Card>
          </TabsContent>

          {/* ... TabsContent "privacy" ... */}
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
