// /* eslint-disable no-unused-vars */
// import {
//   FaFacebook,
//   FaGithub,
//   FaInstagram,
//   FaTwitter,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaHeart,
// } from 'react-icons/fa';

// const socialLinks = [
//   {
//     name: 'Facebook',
//     Icon: FaFacebook,
//     href: 'https://facebook.com',
//   },
//   {
//     name: 'Instagram',
//     Icon: FaInstagram,
//     href: 'https://instagram.com',
//   },
//   {
//     name: 'Twitter',
//     Icon: FaTwitter,
//     href: 'https://twitter.com',
//   },
//   {
//     name: 'GitHub',
//     Icon: FaGithub,
//     href: 'https://github.com',
//   },
// ];
// const Footer = () => {
//   return (
//     <footer className="border-t border-gray-200 dark:border-gray-700">
//       <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
//           <div>
//             <div className="flex justify-center sm:justify-start">
//               <img src="/images/logo.png" className="w-24" alt="logo" />
//             </div>
//             <p className="mt-6 max-w-md text-center leading-relaxed text-gray-500 sm:max-w-xs sm:text-left dark:text-gray-400">
//               A ONG Sem Fome tem a missão de garantir que nenhuma família
//               precise enfrentar a insegurança alimentar. Através da distribuição
//               contínua de cestas e itens essenciais, transformamos doações em
//               dignidade e esperança para milhares de pessoas.
//             </p>

//             <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
//               {socialLinks.map(({ name, Icon, href }) => (
//                 <li key={name}>
//                   <a
//                     href={href}
//                     rel="noreferrer"
//                     target="_blank"
//                     className="text-teal-700 transition hover:text-teal-700/75 dark:text-teal-500 dark:hover:text-teal-500/75"
//                   >
//                     <span className="sr-only">{name}</span>
//                     <Icon size={24} />
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
//             <div className="text-center sm:text-left">
//               <p className="text-lg font-medium">Nossa Causa</p>
//               <ul className="mt-8 space-y-4 text-sm">
//                 <li>
//                   <a href="#">Nossa Missão</a>
//                 </li>
//                 <li>
//                   <a href="#">Transparência</a>
//                 </li>
//                 <li>
//                   <a href="#">Relatório Anual</a>
//                 </li>
//               </ul>
//             </div>

//             <div className="text-center sm:text-left">
//               <p className="text-lg font-medium">Como Ajudar</p>
//               <ul className="mt-8 space-y-4 text-sm">
//                 <li>
//                   <a href="#">Faça uma Doação</a>
//                 </li>
//                 <li>
//                   <a href="#">Seja Voluntário</a>
//                 </li>
//                 <li>
//                   <a href="#">Fale Conosco</a>
//                 </li>
//               </ul>
//             </div>

//             <div className="text-center sm:text-left">
//               <p className="text-lg font-medium">Contato</p>

//               <ul className="mt-8 space-y-4 text-sm">
//                 <li>
//                   <a
//                     className="flex items-center justify-center gap-1.5 sm:justify-start"
//                     href="#"
//                   >
//                     <FaEnvelope className="size-5 shrink-0" />

//                     <span className="flex-1">contato@ongsemfome.org</span>
//                   </a>
//                 </li>

//                 <li>
//                   <a
//                     className="flex items-center justify-center gap-1.5 sm:justify-start"
//                     href="#"
//                   >
//                     <FaPhone className="size-5 shrink-0" />

//                     <span className="flex-1">(01) 23456-7890</span>
//                   </a>
//                 </li>

//                 <li className="flex items-start justify-center gap-1.5 sm:justify-start">
//                   <FaMapMarkerAlt className="size-5 shrink-0" />

//                   <address className="-mt-0.5 flex-1 not-italic">
//                     São Paulo, Brasil
//                   </address>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         <div className="mt-12 border-t border-gray-100 pt-6 dark:border-gray-800">
//           <div className="text-center sm:flex sm:justify-between sm:text-left">
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               <span className="block sm:inline">
//                 Desenvolvido com ❤️ por{' '}
//                 <a href="https://www.github.com/feelipechs" target="_blank">
//                   <strong>chagas</strong>
//                 </a>
//               </span>
//             </p>

//             <p className="mt-4 text-sm text-gray-500 sm:order-first sm:mt-0 dark:text-gray-400">
//               &copy; 2025 SFSys
//             </p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from 'lucide-react';

import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8">
        <a href="#">
          <div className="flex items-center gap-3">
            {/* <Logo className="gap-3" /> */}
            <img src="/images/logo.png" alt="logo" className="h-16" />
          </div>
        </a>

        <div className="flex items-center gap-5 whitespace-nowrap">
          <a href="#">Seja Voluntário</a>
          <a href="#">Transparência</a>
          <a href="#">Fale Conosco</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="#">
            <FacebookIcon className="size-5" />
          </a>
          <a href="#">
            <InstagramIcon className="size-5" />
          </a>
          <a href="#">
            <TwitterIcon className="size-5" />
          </a>
          <a href="#">
            <YoutubeIcon className="size-5" />
          </a>
        </div>
      </div>

      <Separator />

      <div className="mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6">
        <p className="text-center font-medium text-balance">
          {`©${new Date().getFullYear()}`} <a href="#">SFSys</a>, desenvolvido
          com ❤️ por{' '}
          <a href="https://www.github.com/feelipechs" target="_blank">
            <strong>chagas</strong>
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
