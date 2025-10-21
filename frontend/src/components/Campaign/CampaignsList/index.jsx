import CampaignCard from '../CampaignCard';

const campaignsData = [
  {
    id: 1,
    title: 'Alimentos para Famílias Carentes',
    description:
      'Nossa meta é arrecadar 5 toneladas de alimentos não-perecíveis para distribuir em comunidades vulneráveis. Toda ajuda conta!',
    imageUrl: '/images/1.png', //  // proporção de imagem recomendada: 16:9
    linkDetails: '/campanha/alimentos',
  },
  {
    id: 2,
    title: 'Alimentos para Famílias Carentes 02',
    description:
      'Nossa meta é arrecadar 5 toneladas de alimentos não-perecíveis para distribuir em comunidades vulneráveis. Toda ajuda conta!',
    imageUrl: '/images/1.png',
    linkDetails: '/campanha/alimentos',
  },
  {
    id: 3,
    title: 'Alimentos para Famílias Carentes 03',
    description:
      'Nossa meta é arrecadar 5 toneladas de alimentos não-perecíveis para distribuir em comunidades vulneráveis. Toda ajuda conta!',
    imageUrl: '/images/1.png',
    linkDetails: '/campanha/alimentos',
  },
  {
    id: 4,
    title: 'Alimentos para Famílias Carentes 04',
    description:
      'Nossa meta é arrecadar 5 toneladas de alimentos não-perecíveis para distribuir em comunidades vulneráveis. Toda ajuda conta!',
    imageUrl: '/images/1.png',
    linkDetails: '/campanha/alimentos',
  },
  {
    id: 5,
    title: 'Alimentos para Famílias Carentes 05',
    description:
      'Nossa meta é arrecadar 5 toneladas de alimentos não-perecíveis para distribuir em comunidades vulneráveis. Toda ajuda conta!',
    imageUrl: '/images/1.png',
    linkDetails: '/campanha/alimentos',
  },
  {
    id: 6,
    title: 'Alimentos para Famílias Carentes 06',
    description:
      'Nossa meta é arrecadar 5 toneladas de alimentos não-perecíveis para distribuir em comunidades vulneráveis. Toda ajuda conta!',
    imageUrl: '/images/1.png',
    linkDetails: '/campanha/alimentos',
  },
  {
    id: 7,
    title: 'Alimentos para Famílias Carentes 07',
    description:
      'Nossa meta é arrecadar 5 toneladas de alimentos não-perecíveis para distribuir em comunidades vulneráveis. Toda ajuda conta!',
    imageUrl: '/images/1.png',
    linkDetails: '/campanha/alimentos',
  },
  {
    id: 8,
    title: 'Alimentos para Famílias Carentes 08',
    description:
      'Nossa meta é arrecadar 5 toneladas de alimentos não-perecíveis para distribuir em comunidades vulneráveis. Toda ajuda conta!',
    imageUrl: '/images/1.png',
    linkDetails: '/campanha/alimentos',
  },

  // Adicione mais campanhas aqui
];

const CampaignsList = () => {
  return (
    // Mantendo o padding no container externo para o espaçamento geral da tela
    <div className="h-full p-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 dark:text-white">
        Campanhas em Destaque
      </h1>
      <div></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {campaignsData.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            imageUrl={campaign.imageUrl}
            title={campaign.title}
            description={campaign.description}
            linkDetails={campaign.linkDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default CampaignsList;
