import MonetaryDonationCard from '../MonetaryDonationCard';
import { FaRegLaughSquint } from 'react-icons/fa';

const monetaryDonationsData = [
  {
    title: 'Doação Inicial',
    description: 'Muito obrigado pela doação!',
    value: 'R$ 1 ~ 99',
    buttonText: 'Doar',
    buttonLink: '#inicial',
    features: [
      { text: 'Email de agradecimento personalizado' },
      { text: 'Seu nome na lista de doadores no site' },
      { text: 'Chaveiro (caso realize doação presencialmente)' },
    ],
  },
  {
    title: 'Doação Intermediária',
    description: 'Caramba, é muito dinheiro!',
    value: 'R$ 100 ~ 999',
    buttonText: 'Doar',
    buttonLink: '#intermediaria',
    features: [
      { text: 'Todos os benefícios do plano Inicial' },
      { text: 'Brinde físico: Caneca exclusiva' },
      { text: 'Acesso à comunidade de Voluntários (Online)' },
      { text: 'Certificado de Doador Oficial (Digital)' },
      { text: 'Reconhecimento nas Redes Sociais da ONG' },
    ],
  },
  {
    title: 'Doação Avançada',
    description: (
      <>
        Tá evitando imposto, hein?{' '}
        <FaRegLaughSquint size={20} className="inline text-yellow-500" />
      </>
    ),
    value: 'R$ 1000 +',
    buttonText: 'Doar', // Para grandes doadores
    buttonLink: '#avancada',
    features: [
      { text: 'Todos os benefícios anteriores' },
      {
        text: 'Brinde físico: Camiseta Oficial + Caneca',
      },
      {
        text: 'Certificado de Doador Oficial (Placa Física)',
      },
      {
        text: 'Tour presencial por um centro de distribuição',
      },
      {
        text: 'Logo da sua empresa na seção de Patrocinadores (B2B)',
      },
      { text: 'Consulta fiscal sobre abatimento (PF ou PJ)' },
    ],
  },
];

const MonetaryDonationsList = () => {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-gray-200">
        Deseja doar em dinheiro?
      </h1>
      <p className="text-center mb-10 text-gray-600 dark:text-gray-400">
        Você pode ganhar um brinde de acordo com o valor, é uma forma de
        demonstrarmos gratidão!
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
        {/* Apenas mapeia e passa as props, sem lógica de estado */}
        {monetaryDonationsData.map((monetaryDonation) => (
          <MonetaryDonationCard
            key={monetaryDonation.title}
            {...monetaryDonation}
          />
        ))}
      </div>
    </div>
  );
};

export default MonetaryDonationsList;
