import FAQ from '@/components/faq-component';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const faqItems = [
  {
    question: 'Como funciona o site?',
    answer:
      'Nossa plataforma está disponível tanto para o usuário, quanto para o doador. Através do menu superior ou lateral (dependendo da sua página atual), clique em "Entrar", você será redirecionado à página de Login (caso não possua conta, poderá cadastrar uma). Acesse "Campanhas" para ver quais são as campanhas de arrecadação atuais.',
  },
  {
    question: 'Quero ser um beneficiário (receber doações)',
    answer:
      'Após a criação de sua conta, basta acessar "Campanhas" para acessar as campanhas de arrecadação em andamento. Clique em "Ver detalhes" caso tenha interesse, e então, clique em "Registrar interesse" para que nosso sistema seja notificado do seu desejo.',
  },
  {
    question: 'Quero ser um doador (realizar doações)',
    answer:
      'Após a criação de sua conta, basta acessar "Campanhas" para acessar as campanhas de arrecadação em andamento. Clique em "Ver detalhes" caso tenha interesse em doar, e então, clique em "Realizar doação" para que seja encaminhado ao formulário de doações de produtos. Também é possível realizar doações via dinheiro, basta acessar "Doações Monetárias".',
  },
  {
    question: 'ADICIONAR EM BREVE',
    answer: 'ADICIONAR EM BREVE',
  },
];

const FAQPage = () => {
  return (
    <>
      <Header />
      <FAQ faqItems={faqItems} />
      <Footer />
    </>
  );
};

export default FAQPage;
