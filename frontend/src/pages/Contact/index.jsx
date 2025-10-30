import {
  Clock8Icon,
  MapPinIcon,
  BriefcaseBusinessIcon,
  PhoneIcon,
  MailIcon,
} from 'lucide-react';

import ContactUs from '@/components/contact-us';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const contactInfo = [
  {
    title: 'Horário de Funcionamento',
    icon: Clock8Icon,
    description: 'Segunda-Sexta\n10:00 às 15:00',
  },
  {
    title: 'Nosso Endereço',
    icon: MapPinIcon,
    description: '123 Rua, Cidade\nEstado, Brasil',
  },
  {
    title: 'E-mail',
    icon: MailIcon,
    description: 'contato@ongsemfome.org',
  },
  {
    title: 'Telefone',
    icon: PhoneIcon,
    description: '+55 (12) 34567-8901\n+55 (12) 3456-7890',
  },
];

const ContactUsPage = () => {
  //   return <ContactUs contactInfo={contactInfo} />;
  return (
    <>
      <Header />
      <ContactUs contactInfo={contactInfo} />
      <Footer />
    </>
  );
};

export default ContactUsPage;
