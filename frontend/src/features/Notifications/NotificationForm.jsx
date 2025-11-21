'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { useNotificationMutations } from '@/hooks/mutations/useNotificationMutations';
import { useUsersQuery } from '@/hooks/queries/useUsersQuery';

export default function NotificationForm() {
  const { sendBulk } = useNotificationMutations();

  const form = useForm({
    defaultValues: {
      recipientIds: [],
      title: '',
      message: '',
      type: 'info',
    },
  });

  const { handleSubmit, reset } = form;

  const { data: users = [], isLoading: loadingUsers } = useUsersQuery();
  const userOptions = users.map((u) => ({
    value: String(u.id),
    label: u.name || `ID: ${u.id}`,
  }));

  const onSubmit = (data) => {
    // data.recipientIds já é um array de strings ['1', '5', '8'] vindo do MultiSelect

    // converte as strings de volta para números (necessário para a API do backend)
    const recipientIds = data.recipientIds
      .map((idString) => Number(idString))
      .filter((id) => !isNaN(id)); // garante que apenas números válidos sejam enviados

    if (recipientIds.length === 0) {
      // fallback
      return;
    }

    sendBulk.mutate(
      {
        recipientIds,
        title: data.title,
        message: data.message,
        type: data.type,
      },
      {
        onSuccess: () => {
          reset({
            recipientIds: [], // çimpa o MultiSelect resetando para array vazio
            title: '',
            message: '',
            type: 'info',
          });
        },
      }
    );
  };

  return (
    <Card className="bg-background p-6 border-2">
      <h2 className="text-xl font-bold mb-4">Enviar Notificação em Massa</h2>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ids dos destinatarios */}
          <FormField
            control={form.control}
            name="recipientIds"
            rules={{
              validate: (value) =>
                value.length > 0 || 'Selecione pelo menos um destinatário.',
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destinatários</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={userOptions}
                    placeholder={
                      loadingUsers
                        ? 'Carregando usuários...'
                        : 'Selecione os usuários...'
                    }
                    value={field.value} // RHF passa o array de strings
                    onValueChange={field.onChange} // RHF recebe o array de strings do MultiSelect
                    onBlur={field.onBlur}
                    disabled={loadingUsers || sendBulk.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* título */}
          <FormField
            control={form.control}
            name="title"
            rules={{ required: 'O título é obrigatório.' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Nova atualização disponível"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* mensagem */}
          <FormField
            control={form.control}
            name="message"
            rules={{ required: 'A mensagem é obrigatória.' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva a notificação detalhadamente..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* tipo */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="success">Sucesso</SelectItem>
                    <SelectItem value="error">Erro</SelectItem>
                    <SelectItem value="info">Informação</SelectItem>
                    <SelectItem value="warning">Aviso</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={sendBulk.isPending}
          >
            {sendBulk.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {sendBulk.isPending ? 'Enviando...' : 'Enviar Notificações'}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
