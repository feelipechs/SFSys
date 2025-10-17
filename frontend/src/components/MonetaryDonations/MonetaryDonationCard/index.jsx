import React from 'react';

const MonetaryDonationCard = ({
  title,
  description,
  value,
  features,
  buttonText,
  buttonLink,
}) => {
  const FeatureItem = ({ text }) => {
    // O Path do CheckIcon é 'M4.5 12.75l6 6 9-13.5'
    const checkPath = 'M4.5 12.75l6 6 9-13.5';
    const checkColor = 'text-indigo-600'; // Cor única e positiva

    return (
      <li className="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={`size-5 shadow-sm ${checkColor}`} // Cor única
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={checkPath} />
        </svg>
        <span className="text-gray-700 dark:text-gray-300"> {text} </span>
      </li>
    );
  };

  // 1. Classes BASE para o container
  const baseClasses =
    'divide-y divide-gray-200 rounded-2xl border transition duration-300 ease-in-out cursor-pointer';

  // 2. Classes de HOVER: Fica em destaque ao passar o mouse
  const hoverClasses = 'hover:border-indigo-600 hover:shadow-xl';

  return (
    <div
      // Combina as classes, o hover garante a interação
      className={`${baseClasses} ${hoverClasses}`}
      // Opcional: Adicionar um link ao card inteiro (para cobrir a área clicável)
      onClick={() => (window.location.href = buttonLink)}
    >
      <div className="p-6 sm:px-8">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          {title}
          <span className="sr-only">Doação Monetária</span>
        </h2>

        <p className="mt-2 text-gray-700 dark:text-gray-300">{description}</p>

        <p className="mt-2 sm:mt-4">
          <strong className="text-3xl font-bold sm:text-4xl text-gray-900 dark:text-gray-100">
            {' '}
            {value}{' '}
          </strong>
        </p>

        <a
          className="mt-4 block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden sm:mt-6"
          href={buttonLink}
          // Usamos e.stopPropagation() para garantir que o clique no botão não
          // acione o redirecionamento (se você optou por um link no card inteiro)
          onClick={(e) => e.stopPropagation()}
        >
          {buttonText}
        </a>
      </div>

      {/* ... (Seção de "What's included") ... */}
      <div className="p-6 sm:px-8">
        <p className="text-lg font-medium sm:text-xl text-gray-900 dark:text-gray-100">
          O que está incluido:
        </p>

        <ul className="mt-2 space-y-2 sm:mt-4">
          {features.map((feature, index) => (
            <FeatureItem key={index} text={feature.text} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MonetaryDonationCard;
