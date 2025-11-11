import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserMutations } from '@/hooks/mutations/useUserMutations';
import { useForm } from 'react-hook-form';
import { FrontendValidators } from '@/utils/formValidator';
import { RoleSelect } from './RoleSelect';

export function UserForm({ user, formId, onClose }) {
  const { create, update, isPending } = useUserMutations();

  const form = useForm({
    defaultValues: user
      ? user
      : // o role agora é inicializado como string vazia ou o valor do usuário
        { name: '', email: '', password: '', role: '' },
    mode: 'onBlur', // ao clicar em outro local dispara o erro (ex: formato inválido)
  });

  // a função onSubmit agora usa o método .mutate para integração com TanStack Query
  const onSubmit = (data) => {
    // define a função de callback para sucesso (chamada após a invalidação do cache)
    const mutationCallbacks = {
      onSuccess: () => {
        // fecha o Drawer após o sucesso real da operação.
        if (onClose) onClose();
        form.reset(user ? data : undefined);
      },
      // o tratamento de erro é centralizado no useUserMutations
    };

    if (user && user.id) {
      // update
      const payload = { ...data };

      // se o campo de senha estiver vazio, remove ele do payload
      if (!payload.password) {
        delete payload.password;
      }

      // chama o método .mutate (sem await)
      update.mutate({ id: user.id, ...payload }, mutationCallbacks);
    } else {
      // create

      // chama o método .mutate (sem await)
      create.mutate(data, mutationCallbacks);
    }
  };

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 p-4"
    >
      <div className="flex flex-col gap-3">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Nome Completo"
          {...form.register('name', { required: 'O nome é obrigatório.' })}
          disabled={isPending}
        />
        {/* feedback de erro */}
        {form.formState.errors.name && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="email@exemplo.com"
          type="email"
          {...form.register('email', {
            required: 'O email é obrigatório.',
            validate: FrontendValidators.email,
          })}
          disabled={isPending}
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          placeholder={user ? 'Deixe em branco para não alterar' : 'Senha'}
          type="password"
          {...form.register('password', {
            // mensagem de erro que só é ativada se for obrigatório (!user)
            required: !user
              ? 'A senha é obrigatória para novos usuários.'
              : false,
          })}
          disabled={isPending}
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="role">Perfil</Label>
        <RoleSelect
          control={form.control} // passa o controle do formulário
          rules={{ required: 'O perfil é obrigatório' }}
          disabled={isPending}
        />
      </div>
    </form>
  );
}
