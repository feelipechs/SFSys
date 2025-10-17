/* eslint-disable no-unused-vars */
import React from 'react';
import { useTheme } from '../contexts/ThemeProvider'; // Importa o hook de consumo
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/20/solid'; // Importa ícones úteis

// Mapeamento de temas para texto e ícone
const themeOptions = [
  { value: 'light', label: 'Claro', Icon: SunIcon },
  { value: 'dark', label: 'Escuro', Icon: MoonIcon },
  { value: 'system', label: 'Sistema', Icon: ComputerDesktopIcon },
];

// Função para obter o nome/ícone do tema ativo
const getActiveThemeData = (themeValue) => {
  return themeOptions.find((opt) => opt.value === themeValue);
};

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme(); // theme é o valor ('light', 'dark', 'system')
  const activeData = getActiveThemeData(theme);
  const ActiveIcon = activeData.Icon;

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      {/* 1. Botão que exibe o tema ATIVO */}
      <MenuButton
        className="inline-flex w-full justify-center items-center gap-x-1.5 
                   rounded-md px-3 py-2 text-sm font-semibold 
                   text-gray-900 dark:text-white 
                   bg-gray-100 dark:bg-white/10 
                   shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/5 
                   hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-200"
      >
        <ActiveIcon aria-hidden="true" className="size-5" />
        {activeData.label}
        <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5" />
      </MenuButton>

      {/* 2. O Dropdown (Menu Itens) */}
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-48 origin-top-right 
                   rounded-md p-1 
                   bg-white dark:bg-gray-800 
                   shadow-lg ring-1 ring-black ring-opacity-5 
                   focus:outline-none 
                   transition ease-out duration-100 data-closed:opacity-0 data-closed:scale-95"
      >
        {themeOptions.map(({ value, label, Icon }) => (
          <MenuItem key={value}>
            {({ focus }) => (
              <button
                onClick={() => handleThemeChange(value)}
                className={`
                  ${
                    focus
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }
                  group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors duration-100
                  ${
                    theme === value ? 'font-bold' : 'font-normal'
                  } // Opcional: Destacar o ativo
                `}
              >
                <Icon
                  aria-hidden="true"
                  className={`mr-3 size-5 ${
                    focus ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
                {label}
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};

export default ThemeSwitcher;
