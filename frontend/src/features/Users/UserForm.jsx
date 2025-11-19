import { Input } from '@/components/ui/input';
import { useUserMutations } from '@/hooks/mutations/useUserMutations';
import { useForm } from 'react-hook-form';
import { FormValidators } from '@/utils/validators';
import { RoleSelect } from './RoleSelect';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/components/PasswordInput';

export function UserForm({ user, formId, onClose }) {
  const { create, update, isPending } = useUserMutations();

  const form = useForm({
    defaultValues: user
      ? user
      : // o role é inicializado como string vazia ou o valor do usuário
        { name: '', email: '', password: '', role: '' },
    mode: 'onBlur',
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data) => {
    const mutationCallbacks = {
      onSuccess: () => {
        if (onClose) onClose();
        form.reset(user ? data : undefined);
      },
    };

    if (user && user.id) {
      // update
      const payload = { ...data };

      // se o campo de senha estiver vazio, remove ele do payload
      if (!payload.password) {
        delete payload.password;
      }

      update.mutate({ id: user.id, ...payload }, mutationCallbacks);
    } else {
      // create
      create.mutate(data, mutationCallbacks);
    }
  };

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-4"
      >
        {/* nome */}
        <FormField
          name="name"
          control={control}
          rules={{ required: 'O nome é obrigatório.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome Completo"
                  disabled={isPending}
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
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@exemplo.com"
                  type="email"
                  disabled={isPending}
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
            required: !user
              ? 'A senha é obrigatória para novos usuários.'
              : false,
            validate: FormValidators.password,
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput
                  maxLength={128}
                  placeholder={
                    user ? 'Deixe em branco para não alterar' : 'Senha'
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
        <FormField
          name="role"
          control={control}
          rules={{ required: 'O perfil é obrigatório' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perfil</FormLabel>
              <FormControl>
                <RoleSelect {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
