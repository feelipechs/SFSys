// import { Link } from 'react-router-dom';
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
// import { useState } from 'react';

// const Register = () => {
//   const [isShow, setIsShow] = useState(false);

//   const handlePassword = () => setIsShow(!isShow);
//   return (
//     <>
//       <div className="h-screen flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-900">
//         <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//           <Link to="/">
//             {' '}
//             <img
//               alt="logo"
//               src="/images/logo.png"
//               className="mx-auto h-24 w-auto"
//             />
//           </Link>

//           <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-700 dark:text-white">
//             Crie sua conta
//           </h2>
//         </div>

//         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//           <form action="#" method="POST" className="space-y-6">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm/6 font-medium text-gray-700 dark:text-gray-100"
//               >
//                 Nome
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="name"
//                   name="name"
//                   type="name"
//                   required
//                   autoComplete="name"
//                   className="
//                         block
//                         w-full
//                         rounded-md

//                         /* === MODO CLARO (PADRÃO) === */
//                         bg-gray-100               /* Fundo claro para o modo claro */
//                         text-gray-900             /* Texto escuro para o modo claro */
//                         placeholder:text-gray-500 /* Placeholder visível */

//                         /* Borda (Outline) em modo claro */
//                         outline-1
//                         -outline-offset-1
//                         outline-gray-300          /* Borda/outline mais visível em modo claro */

//                         /* === MODO ESCURO (PREFIXO dark:) === */
//                         dark:bg-white/5           /* Seu fundo escuro atual, funciona no modo escuro */
//                         dark:text-white           /* Seu texto branco atual, funciona no modo escuro */
//                         dark:outline-white/10     /* Seu outline escuro atual */

//                         /* === FOCO (Focus) - Aplicado em ambos, se não for sobrescrito por dark:focus: === */
//                         focus:outline-2
//                         focus:-outline-offset-2
//                         focus:outline-indigo-500

//                         /* Outras classes */
//                         px-3
//                         py-1.5
//                         text-base
//                         sm:text-sm/6
//                     "
//                 />
//               </div>
//             </div>
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm/6 font-medium text-gray-700 dark:text-gray-100"
//               >
//                 Email
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   required
//                   autoComplete="email"
//                   className="
//                         block
//                         w-full
//                         rounded-md

//                         /* === MODO CLARO (PADRÃO) === */
//                         bg-gray-100               /* Fundo claro para o modo claro */
//                         text-gray-900             /* Texto escuro para o modo claro */
//                         placeholder:text-gray-500 /* Placeholder visível */

//                         /* Borda (Outline) em modo claro */
//                         outline-1
//                         -outline-offset-1
//                         outline-gray-300          /* Borda/outline mais visível em modo claro */

//                         /* === MODO ESCURO (PREFIXO dark:) === */
//                         dark:bg-white/5           /* Seu fundo escuro atual, funciona no modo escuro */
//                         dark:text-white           /* Seu texto branco atual, funciona no modo escuro */
//                         dark:outline-white/10     /* Seu outline escuro atual */

//                         /* === FOCO (Focus) - Aplicado em ambos, se não for sobrescrito por dark:focus: === */
//                         focus:outline-2
//                         focus:-outline-offset-2
//                         focus:outline-indigo-500

//                         /* Outras classes */
//                         px-3
//                         py-1.5
//                         text-base
//                         sm:text-sm/6
//                     "
//                 />
//               </div>
//             </div>
//             <div>
//               <div className="flex items-center justify-between">
//                 <label
//                   htmlFor="password"
//                   className="block text-sm/6 font-medium text-gray-700 dark:text-gray-100"
//                 >
//                   Senha
//                 </label>
//               </div>
//               <div className="mt-2 relative">
//                 <input
//                   id="password"
//                   name="password"
//                   type={isShow ? 'text' : 'password'}
//                   required
//                   autoComplete="new-password"
//                   className="
//                         block
//                         w-full
//                         rounded-md

//                         /* === MODO CLARO (PADRÃO) === */
//                         bg-gray-100               /* Fundo claro para o modo claro */
//                         text-gray-900             /* Texto escuro para o modo claro */
//                         placeholder:text-gray-500 /* Placeholder visível */

//                         /* Borda (Outline) em modo claro */
//                         outline-1
//                         -outline-offset-1
//                         outline-gray-300          /* Borda/outline mais visível em modo claro */

//                         /* === MODO ESCURO (PREFIXO dark:) === */
//                         dark:bg-white/5           /* Seu fundo escuro atual, funciona no modo escuro */
//                         dark:text-white           /* Seu texto branco atual, funciona no modo escuro */
//                         dark:outline-white/10     /* Seu outline escuro atual */

//                         /* === FOCO (Focus) - Aplicado em ambos, se não for sobrescrito por dark:focus: === */
//                         focus:outline-2
//                         focus:-outline-offset-2
//                         focus:outline-indigo-500

//                         /* Outras classes */
//                         px-3
//                         py-1.5
//                         text-base
//                         sm:text-sm/6
//                     "
//                 />
//                 <button
//                   onClick={handlePassword}
//                   type="button"
//                   className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
//                 >
//                   {isShow ? (
//                     <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
//                   ) : (
//                     <EyeIcon className="h-5 w-5" aria-hidden="true" />
//                   )}
//                 </button>
//               </div>
//             </div>
//             <div>
//               <div className="mt-10 text-sm/6 text-gray-700 dark:text-gray-100">
//                 <label
//                   htmlFor="terms"
//                   className="inline-flex items-center gap-1"
//                 >
//                   <input
//                     type="checkbox"
//                     className="size-5 rounded border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:ring-offset-gray-900 dark:checked:bg-blue-600"
//                     id="terms"
//                   />
//                   Concordo com os{' '}
//                   <a className="font-semibold text-indigo-400 hover:text-indigo-300">
//                     Termos
//                   </a>
//                 </label>
//               </div>
//               <button
//                 type="submit"
//                 className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
//               >
//                 Cadastrar
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Register;

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

const Register = () => {
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
            <CardTitle>Crie sua conta</CardTitle>
            <CardDescription>
              Insira os dados requisitados para a criação de sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" type="name" placeholder="Nome" required />
                </div>

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
              Cadastrar
            </Button>
            <p className="text-center text-sm/6 text-gray-400">
              Já possui conta?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Entre
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Register;
