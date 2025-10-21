import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const [isShow, setIsShow] = useState(false);

  const handlePassword = () => setIsShow(!isShow);

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-gray-900">
        <div>
          <Link to="/">
            <img
              alt="logo"
              src="/images/logo.png"
              className="mx-auto h-24 w-auto"
            />
          </Link>
        </div>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Faça login na sua conta</CardTitle>
            <CardDescription>
              Digite seu e-mail abaixo para fazer login em sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplo@exemplo.com"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Esqueceu sua senha?
                    </a>
                  </div>

                  {/* 1. Div Pai com 'relative' */}
                  <div className="relative">
                    <Input
                      id="password"
                      type={isShow ? 'text' : 'password'}
                      required
                      // 2. Adicione um padding à direita (pr-10 ou pr-12) para que o texto
                      // não fique por baixo do botão. pr-10 = padding right de 2.5rem
                      className="pr-10"
                    />

                    {/* 3. Botão do Olho com 'absolute' */}
                    <button
                      type="button"
                      onClick={handlePassword}
                      // Posiciona o botão à direita e centraliza verticalmente
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 h-full px-3 text-muted-foreground"
                    >
                      {isShow ? (
                        <FaEyeSlash aria-hidden="true" />
                      ) : (
                        <FaEye aria-hidden="true" />
                      )}
                      {/* Adicione um span para acessibilidade */}
                      <span className="sr-only">
                        {isShow ? 'Ocultar senha' : 'Mostrar senha'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Entrar
            </Button>
            <p className="text-center text-sm/6 text-gray-400">
              Não possui conta?{' '}
              <Link
                to="/registrar"
                className="font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Cadastre-se agora
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Login;
