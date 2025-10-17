import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';

const Login = () => {
  const [isShow, setIsShow] = useState(false);

  const handlePassword = () => setIsShow(!isShow);
  return (
    <>
      <div className="h-screen flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-900">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link to="/">
            {' '}
            <img
              alt="logo"
              src="/images/logo.png"
              className="mx-auto h-24 w-auto"
            />
          </Link>

          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-700 dark:text-white">
            Faça login na sua conta
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-700 dark:text-gray-100"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="
                        block 
                        w-full 
                        rounded-md 
                        
                        /* === MODO CLARO (PADRÃO) === */
                        bg-gray-100               /* Fundo claro para o modo claro */
                        text-gray-900             /* Texto escuro para o modo claro */
                        placeholder:text-gray-500 /* Placeholder visível */
                        
                        /* Borda (Outline) em modo claro */
                        outline-1 
                        -outline-offset-1 
                        outline-gray-300          /* Borda/outline mais visível em modo claro */

                        /* === MODO ESCURO (PREFIXO dark:) === */
                        dark:bg-white/5           /* Seu fundo escuro atual, funciona no modo escuro */
                        dark:text-white           /* Seu texto branco atual, funciona no modo escuro */
                        dark:outline-white/10     /* Seu outline escuro atual */
                        
                        /* === FOCO (Focus) - Aplicado em ambos, se não for sobrescrito por dark:focus: === */
                        focus:outline-2 
                        focus:-outline-offset-2 
                        focus:outline-indigo-500 
                        
                        /* Outras classes */
                        px-3 
                        py-1.5 
                        text-base 
                        sm:text-sm/6
                    "
                />
              </div>
            </div>

            <div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-700 dark:text-gray-100"
                  >
                    Senha
                  </label>
                </div>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={isShow ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    className="
                        block 
                        w-full 
                        rounded-md 
                        
                        /* === MODO CLARO (PADRÃO) === */
                        bg-gray-100               /* Fundo claro para o modo claro */
                        text-gray-900             /* Texto escuro para o modo claro */
                        placeholder:text-gray-500 /* Placeholder visível */
                        
                        /* Borda (Outline) em modo claro */
                        outline-1 
                        -outline-offset-1 
                        outline-gray-300          /* Borda/outline mais visível em modo claro */

                        /* === MODO ESCURO (PREFIXO dark:) === */
                        dark:bg-white/5           /* Seu fundo escuro atual, funciona no modo escuro */
                        dark:text-white           /* Seu texto branco atual, funciona no modo escuro */
                        dark:outline-white/10     /* Seu outline escuro atual */
                        
                        /* === FOCO (Focus) - Aplicado em ambos, se não for sobrescrito por dark:focus: === */
                        focus:outline-2 
                        focus:-outline-offset-2 
                        focus:outline-indigo-500 
                        
                        /* Outras classes */
                        px-3 
                        py-1.5 
                        text-base 
                        sm:text-sm/6
                    "
                  />
                  <button
                    onClick={handlePassword}
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    {isShow ? (
                      <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Entrar
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Não é membro?{' '}
            <Link
              to="/registrar"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
