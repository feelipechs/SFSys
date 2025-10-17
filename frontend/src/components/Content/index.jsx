import { Link } from 'react-router-dom';
import { FaHandHoldingHeart } from 'react-icons/fa';
import { GoArrowUpRight } from 'react-icons/go';

const Content = () => {
  return (
    <section className="bg-white lg:grid lg:h-screen lg:place-content-center dark:bg-gray-900">
      <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-4 lg:px-8 lg:py-32">
        <div className="max-w-prose text-left">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
            Garanta o alimento na mesa e reacenda a
            <strong className="text-indigo-600"> esperança </strong>
            de quem mais precisa.
          </h1>

          <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed dark:text-gray-200">
            Nossa missão é levar dignidade através da distribuição contínua de
            alimentos e produtos essenciais. Com o seu apoio, podemos expandir o
            alcance e garantir que famílias em situação de vulnerabilidade
            tenham acesso ao básico para viver.
          </p>

          <div className="mt-4 flex gap-4 sm:mt-6">
            <Link
              to="/campanhas"
              className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-mono font-medium tracking-tighter text-white bg-indigo-600 rounded-lg group"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-purple-500 rounded-full group-hover:w-56 group-hover:h-56"></span>

              <span className="relative flex items-center space-x-2">
                <span>Doe Agora</span>
                <FaHandHoldingHeart className="w-6 h-6" />
              </span>
            </Link>

            <Link
              to="/ajuda"
              className="group relative inline-flex items-center rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <span className="flex items-center space-x-2">
                <span>Ler mais</span>

                <div className="relative h-5 w-5 overflow-hidden">
                  <div className="absolute transition-all duration-200 group-hover:-translate-y-5 group-hover:translate-x-4">
                    <GoArrowUpRight className="h-6 w-6" />

                    <GoArrowUpRight className="-translate-x-4" size={16} />
                  </div>
                </div>
              </span>
            </Link>
          </div>
        </div>

        <img src="/images/imagem.png" alt="boneco" />
      </div>
    </section>
  );
};

export default Content;
