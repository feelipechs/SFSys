import React, { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProfileSection = () => {
  const [name, setName] = useState('John Doe');
  const [isEditingName, setIsEditingName] = useState(false);
  const [originalName, setOriginalName] = useState(name); // Para reverter no cancelamento

  const handleEdit = () => {
    setOriginalName(name); // Salva o nome atual antes de editar
    setIsEditingName(true);
  };

  const handleSave = () => {
    // Lógica para salvar o nome no backend
    console.log('Nome salvo:', name);
    setIsEditingName(false);
  };

  const handleCancel = () => {
    setName(originalName); // Reverte para o nome original
    setIsEditingName(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6 border-b pb-3 border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Perfil
        </h2>
        {!isEditingName && (
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600
                       dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <PencilIcon className="h-5 w-5 mr-2" /> Editar
          </button>
        )}
      </div>

      {/* Campo de Nome */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nome Completo
        </label>
        {isEditingName ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500
                       bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700
                       text-gray-900 dark:text-gray-100"
          />
        ) : (
          <p className="text-lg text-gray-800 dark:text-gray-200">{name}</p>
        )}
      </div>

      {/* Botões de Ação */}
      {isEditingName && (
        <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-800 mt-6">
          <button
            onClick={handleSave}
            className="flex items-center px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md
                       hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <CheckIcon className="h-5 w-5 mr-2" /> Salvar
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center px-5 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md
                       hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
                       dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <XMarkIcon className="h-5 w-5 mr-2" /> Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
