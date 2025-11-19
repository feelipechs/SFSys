import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '@/hooks/mutations/useLoginMutation';
import { IconLoader2 } from '@tabler/icons-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit, setError, control } = form;

  const { mutate, isPending } = useLoginMutation();

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        navigate('/');
      },
      onError: (error) => {
        const statusCode = error.response?.status;
        const serverMessage = error.response?.data?.message;

        if (
          statusCode === 401 ||
          (statusCode === 400 && serverMessage === 'Invalid credentials')
        ) {
          setError(
            'email',
            {
              type: 'server',
              message: 'Email ou senha inválidos. Tente novamente.',
            },
            { shouldFocus: true }
          );
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
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* email */}
              <FormField
                name="email"
                control={control}
                rules={{ required: 'O email é obrigatório.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="exemplo@exemplo.com"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    {/* exibe o erro de required OU o erro do server (401/400) */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* senha */}
              <FormField
                name="password"
                control={control}
                rules={{ required: 'A senha é obrigatória.' }}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Senha</FormLabel>
                    </div>
                    <FormControl>
                      <Input type="password" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* botão de submit */}
              <FormItem className="pt-4">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </FormItem>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
