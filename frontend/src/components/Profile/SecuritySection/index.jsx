import React, { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SecuritySection = () => {
  const [email, setEmail] = useState('john.doe@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // Lógica de Salvamento (Apenas para exemplo)
  const handleSaveEmail = () => {
    console.log('Email salvo:', email);
    setIsEditingEmail(false);
  };

  const handleSavePassword = () => {
    if (newPassword === confirmNewPassword && newPassword.length >= 6) {
      console.log('Senha salva:', newPassword);
      setIsEditingPassword(false);
      // Limpar campos de senha após salvar
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      alert('As senhas não coincidem ou são inválidas.');
    }
  };

  const handleCancelEdit =
    (setter, resetState = null) =>
    () => {
      setter(false);
      if (resetState) resetState(); // Função opcional para resetar campos no cancelamento
    };

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 transition-colors duration-300">
      <h2
        className="text-2xl font-semibold mb-6 border-b pb-3 border-gray-200 dark:border-gray-800
                     text-gray-900 dark:text-white"
      >
        Segurança
      </h2>

      {/* Edição de Email */}
      <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <div className="flex justify-between items-center">
          {isEditingEmail ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500
                           bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700
                           text-gray-900 dark:text-gray-100 mr-4"
            />
          ) : (
            <p className="text-lg text-gray-800 dark:text-gray-200">{email}</p>
          )}

          {!isEditingEmail ? (
            <button
              onClick={() => setIsEditingEmail(true)}
              className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
            >
              <PencilIcon className="h-5 w-5 mr-1" /> Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveEmail}
                className="p-2 text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400"
              >
                <CheckIcon className="h-6 w-6" />
              </button>
              <button
                onClick={handleCancelEdit(setIsEditingEmail)}
                className="p-2 text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edição de Senha */}
      <div className="pt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Senha
        </label>
        {!isEditingPassword ? (
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-800 dark:text-gray-200">********</p>
            <button
              onClick={() => setIsEditingPassword(true)}
              className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
            >
              <PencilIcon className="h-5 w-5 mr-1" /> Alterar Senha
            </button>
          </div>
        ) : (
          <form>
            {/* ... Campos de Senha (igual ao componente anterior) ... */}
            <div className="mb-4">
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Senha Atual
              </label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nova Senha
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirm-new-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                id="confirm-new-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-800 mt-6">
              <button
                type="button"
                onClick={handleSavePassword}
                className="flex items-center px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
              >
                <CheckIcon className="h-5 w-5 mr-2" /> Salvar Senha
              </button>
              <button
                type="button"
                onClick={handleCancelEdit(setIsEditingPassword, () => {
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                })}
                className="flex items-center px-5 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200"
              >
                <XMarkIcon className="h-5 w-5 mr-2" /> Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SecuritySection;
