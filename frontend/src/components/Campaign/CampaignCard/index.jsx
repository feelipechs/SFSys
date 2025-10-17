import React from 'react';

// Exemplo de componente funcional do Card
const CampaignCard = ({
  imageUrl,
  title,
  description,
  linkDetails,
  linkText = 'Ver Detalhes',
}) => {
  return (
    // Card Wrapper
    <div className="w-full md:max-w-sm md:mx-auto rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900 transition-shadow duration-300 hover:shadow-xl flex flex-col h-full">
      {/* 1. IMAGEM: Altura fixa com proporção */}
      <div className="relative">
        <div className="w-full pb-[60%] relative">
          {' '}
          {/* 60% para proporção 16:9 (altura é 60% da largura) */}
          <img
            className="absolute h-full w-full object-cover"
            src={imageUrl}
            alt={`Imagem da campanha ${title}`}
          />
        </div>
      </div>

      {/* 2. CONTEÚDO: Área Flex para alinhar Título/Descrição/Botão */}
      <div className="p-4 flex flex-col flex-grow">
        {/* 2a. TÍTULO: Altura fixa forçada com linha única + ellipsis */}
        {/* h-10 é uma altura aproximada para 2 linhas de texto grande. */}
        <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100 mb-2 overflow-hidden line-clamp-2">
          {title}
        </h3>

        {/* 2b. DESCRIÇÃO: Altura fixa forçada com múltiplas linhas + ellipsis */}
        {/* h-20 é uma altura aproximada para 3-4 linhas de texto normal. */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {description}
        </p>

        {/* Separador flex-grow: Garante que o botão fique sempre embaixo */}
        <div className="flex-grow"></div>

        {/* 2c. BOTÃO: Sempre no final */}
        <a
          href={linkDetails}
          className="mt-4 inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          {linkText}
        </a>
      </div>
    </div>
  );
};

export default CampaignCard;

// --- Exemplo de Uso ---
/*
function ListaDeCampanhas() {
  const campanhas = [
    {
      id: 1,
      title: "Alimentos para Famílias Carentes",
      description: "Nossa meta é arrecadar 5 toneladas de alimentos não-perecíveis para distribuir em comunidades vulneráveis. Toda ajuda conta!",
      imageUrl: "caminho/para/imagem1.jpg", // Substitua pelo caminho real
      linkDetails: "/campanha/alimentos",
    },
    {
      id: 2,
      title: "Reforma do Abrigo de Animais",
      description: "Precisamos de fundos para reformar os canis e gatil e garantir um inverno seguro e confortável para 50+ animais resgatados.",
      imageUrl: "caminho/para/imagem2.jpg", // Substitua pelo caminho real
      linkDetails: "/campanha/abrigo-animais",
    },
    // Adicione mais campanhas aqui
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {campanhas.map(campanha => (
        <CampaignCard 
          key={campanha.id}
          imageUrl={campanha.imageUrl}
          title={campanha.title}
          description={campanha.description}
          linkDetails={campanha.linkDetails}
        />
      ))}
    </div>
  );
}
*/
