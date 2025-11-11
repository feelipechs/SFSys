import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '@/hooks/mutations/useLoginMutation';
import { IconLoader2 } from '@tabler/icons-react';

export function LoginForm({ className, ...props }) {
  // inicializa hooks
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const { mutate, isPending } = useLoginMutation(); // useLoginMutation já cuida do AuthContext e do Toast

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        navigate('/');
      },
      onError: (error) => {
        const statusCode = error.response?.status;
        const serverMessage = error.response?.data?.message;

        // exemplo de injeção de erro
        if (
          statusCode === 401 ||
          (statusCode === 400 && serverMessage === 'Invalid credentials')
        ) {
          // se a condição for atendida, injeta o erro no campo email
          setError(
            'email',
            {
              type: 'server',
              message: 'Email ou senha inválidos. Tente novamente.',
            },
            { shouldFocus: true }
          );
        } else {
          // se não for o erro de credenciais, o erro deve ser tratado pelo Toast
          // (useLoginMutation já deve fazer isso)
        }
      },
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Link to="/">
        <img
          alt="logo"
          src="/images/logo.png"
          className="mx-auto h-24 w-auto"
        />
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Faça login na sua conta</CardTitle>
          <CardDescription>
            Digite seus dados abaixo para fazer login em sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* liga o formulário ao RHF */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@exemplo.com"
                  // RHF: registro e validação
                  {...register('email', { required: 'O email é obrigatório.' })}
                  disabled={isPending}
                />
                {/* feedback de erro */}
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  // RHF: registro e validação
                  {...register('password', {
                    required: 'A senha é obrigatória.',
                  })}
                  disabled={isPending}
                />
                {/* feedback de erro */}
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              <Field>
                {/* isPending desabilita o botão e mostra o loading */}
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
