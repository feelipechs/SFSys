/* eslint-disable no-unused-vars */
import { FaFacebook, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const socialLinks = [
  {
    name: 'Facebook',
    Icon: FaFacebook,
    href: 'https://facebook.com/seuperfil',
  },
  {
    name: 'Instagram',
    Icon: FaInstagram,
    href: 'https://instagram.com/seuperfil',
  },
  {
    name: 'Twitter',
    Icon: FaTwitter,
    href: 'https://twitter.com/seuperfil',
  },
  {
    name: 'GitHub',
    Icon: FaGithub,
    href: 'https://github.com/seuperfil',
  },
];
const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t-1 border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-center text-teal-600 sm:justify-start dark:text-teal-300">
              <img src="/images/logo.png" className="w-24" alt="logo" />
            </div>
            <p className="mt-6 max-w-md text-center leading-relaxed text-gray-500 sm:max-w-xs sm:text-left dark:text-gray-400">
              A ONG Sem Fome tem a missão de garantir que nenhuma família
              precise enfrentar a insegurança alimentar. Através da distribuição
              contínua de cestas e itens essenciais, transformamos doações em
              dignidade e esperança para milhares de pessoas.
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ name, Icon, href }) => (
                <li key={name}>
                  <a
                    href={href}
                    rel="noreferrer"
                    target="_blank"
                    className="text-teal-700 transition hover:text-teal-700/75 dark:text-teal-500 dark:hover:text-teal-500/75"
                  >
                    <span className="sr-only">{name}</span>
                    <Icon size={24} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Nossa Causa
              </p>
              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    Nossa Missão
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    Transparência
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    Relatório Anual
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Como Ajudar
              </p>
              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    Faça uma Doação
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    Seja Voluntário
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    Fale Conosco
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Contato
              </p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a
                    className="flex items-center justify-center gap-1.5 sm:justify-start"
                    href="mailto:contato@ongsemfome.org"
                  >
                    <FaEnvelope className="size-5 shrink-0 text-gray-900 dark:text-white" />

                    <span className="flex-1 text-gray-700 dark:text-gray-300">
                      contato@ongsemfome.org
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    className="flex items-center justify-center gap-1.5 sm:justify-start"
                    href="tel:01234567890"
                  >
                    <FaPhone className="size-5 shrink-0 text-gray-900 dark:text-white" />

                    <span className="flex-1 text-gray-700 dark:text-gray-300">
                      (01) 23456-7890
                    </span>
                  </a>
                </li>

                <li className="flex items-start justify-center gap-1.5 sm:justify-start">
                  <FaMapMarkerAlt className="size-5 shrink-0 text-gray-900 dark:text-white" />

                  <address className="-mt-0.5 flex-1 text-gray-700 not-italic dark:text-gray-300">
                    São Paulo, Brasil
                  </address>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6 dark:border-gray-800">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="block sm:inline">
                Todos os direitos reservados.
              </span>

              <a
                className="inline-block text-teal-600 underline transition hover:text-teal-600/75 dark:text-teal-500 dark:hover:text-teal-500/75"
                href="#"
              >
                Termos & Condições
              </a>

              <span>&middot;</span>

              <a
                className="inline-block text-teal-600 underline transition hover:text-teal-600/75 dark:text-teal-500 dark:hover:text-teal-500/75"
                href="#"
              >
                Políticas de Privacidade
              </a>
            </p>

            <p className="mt-4 text-sm text-gray-500 sm:order-first sm:mt-0 dark:text-gray-400">
              &copy; 2025 SFSys
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
