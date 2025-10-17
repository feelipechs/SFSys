import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import {
  FaHandHoldingHeart, // Substitui BsCreditCard (Foco em Doação)
  FaTruck, // Substitui BsFileEarmarkMedical (Foco em Logística/Coleta)
  FaUsers, // Substitui BsPencil (Foco em Voluntariado/Equipe)
  FaShieldAlt, // Substitui LiaCertificateSolid (Foco em Segurança/Transparência)
  FaQuestion, // Substitui BsQuestionLg
  FaHandsHelping, // Substitui BsHeadphones (Foco em Apoio Comunitário)
} from 'react-icons/fa'; // Usando o pacote Font Awesome (Fa) para ícones robustos
import { BsChevronDown } from 'react-icons/bs'; // Mantido para o Acordeão

// Componente simples de Acordeão com Tailwind (MANTIDO)
const TailwindAccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="border border-gray-200 rounded-lg mt-2 shadow-sm">
      <button
        className="flex justify-between items-center w-full p-4 text-left font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition duration-300 rounded-t-lg"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <BsChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-screen p-4' : 'max-h-0 p-0'
        }`}
      >
        <div className={isOpen ? 'pt-2' : ''}>{children}</div>
      </div>
    </div>
  );
};

// Mapeamento dos ícones e textos para a seção de FAQ (ADAPTADO PARA ONG)
const faqItems = [
  {
    icon: FaHandHoldingHeart, // Coração na Mão (Doação)
    title: 'Como posso fazer uma doação de alimentos?',
    content:
      'Você pode doar alimentos em nossos pontos de coleta parceiros listados na página "Doe Agora" ou agendar a retirada de grandes volumes. Aceitamos alimentos não perecíveis dentro do prazo de validade.',
  },
  {
    icon: FaTruck, // Caminhão (Logística/Coleta)
    title: 'Quais são as áreas e horários de coleta?',
    content:
      'Operamos com coletas semanais nas regiões metropolitanas X, Y e Z. Nossos horários de coleta são de segunda a sexta, das 9h às 17h. Para agendamentos, verifique a disponibilidade em nosso formulário de contato.',
  },
  {
    icon: FaQuestion, // Ponto de Interrogação (Dúvidas Gerais)
    title: 'Onde os alimentos arrecadados são entregues?',
    content:
      'Os alimentos são distribuídos mensalmente para famílias carentes cadastradas e instituições de caridade parceiras em nossa região. Priorizamos comunidades com maior índice de vulnerabilidade social.',
  },
  {
    icon: FaShieldAlt, // Escudo (Segurança/Transparência)
    title: 'Como é garantida a transparência das doações?',
    content:
      'Mantemos a máxima transparência, publicando relatórios trimestrais com a quantidade de alimentos arrecadados e o número de famílias atendidas. Você também pode solicitar um recibo de doação ao nosso financeiro.',
  },
  {
    icon: FaUsers, // Usuários/Grupo (Voluntariado)
    title: 'Como faço para me tornar um voluntário?',
    content:
      'Estamos sempre em busca de novos voluntários! Acesse a seção "Seja Voluntário" para preencher nosso formulário de inscrição. Temos vagas para logística, triagem de alimentos e apoio administrativo.',
  },
  {
    icon: FaHandsHelping, // Mãos Dadas (Apoio Comunitário/Contato)
    title: 'Como entrar em contato com a ONG?',
    content:
      'Para falar conosco, você pode ligar para (01) 23456-7890, enviar um e-mail para contato@ongsemfome.org, ou usar o chat online em nosso site. Nosso horário de atendimento é de segunda a sexta, das 8h às 18h.',
  },
];

const Help = () => {
  const [openItem, setOpenItem] = useState(null); // Estado para o Acordeão

  const handleToggle = (itemKey) => {
    setOpenItem(openItem === itemKey ? null : itemKey);
  };

  return (
    <>
      <Header />
      {/* Container principal */}
      <div className="px-4 bg-white dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto py-12">
          <section>
            <h3 className="text-center mb-4 pb-2 text-3xl font-bold text-green-600">
              Central de Ajuda (ONG)
            </h3>
            <p className="text-center mb-10 text-gray-600 dark:text-gray-400">
              Tire suas dúvidas sobre doações, voluntariado e logística da nossa
              causa.
            </p>

            {/* Grid de FAQ (Perguntas Frequentes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-md"
                >
                  <h6 className="mb-3 text-xl font-semibold text-green-600 flex items-start">
                    {/* Ícone com margem direita (mr-2) e tamanho (size=32) */}
                    <item.icon className="mr-2 flex-shrink-0" size={32} />
                    {item.title}
                  </h6>
                  <p className="text-gray-700 dark:text-gray-300">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Acordeão (FAQ Expandido) */}
          <p className="text-center mt-12 text-lg text-gray-700 dark:text-gray-300 font-medium">
            Documentação Legal da ONG
          </p>
          <div className="mt-5 max-w-4xl mx-auto">
            <TailwindAccordionItem
              title="Código de Conduta e Ética do Voluntário"
              isOpen={openItem === 'etica'}
              onClick={() => handleToggle('etica')}
            >
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Nosso compromisso é proporcionar um ambiente de trabalho
                voluntário seguro, respeitoso e produtivo. Esperamos que todos
                os voluntários sigam as seguintes diretrizes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>
                  <strong>Respeito à Causa:</strong> Tratar todas as doações,
                  beneficiários e colegas com dignidade e respeito.
                </li>
                <li>
                  <strong>Transparência:</strong> Informações sobre as operações
                  e beneficiários devem ser tratadas com confidencialidade,
                  exceto as destinadas à divulgação pública.
                </li>
                <li>
                  <strong>Segurança Alimentar:</strong> Seguir todos os
                  protocolos de higiene e triagem para garantir a qualidade dos
                  alimentos distribuídos.
                </li>
                <li>
                  <strong>Responsabilidade:</strong> Cumprir os horários e
                  tarefas acordadas com a coordenação da ONG.
                </li>
              </ul>
            </TailwindAccordionItem>

            <TailwindAccordionItem
              title="Politícas de Privacidade e Proteção de Dados"
              isOpen={openItem === 'privacidade'}
              onClick={() => handleToggle('privacidade')}
            >
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                A proteção dos dados de nossos doadores, voluntários e
                beneficiários é nossa prioridade. Esta política detalha como
                lidamos com as informações pessoais:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>
                  <strong>Coleta de dados:</strong> Coletamos informações (nome,
                  contato, CPF) apenas com a finalidade de emitir recibos de
                  doação, cadastrar voluntários ou acompanhar a entrega aos
                  beneficiários.
                </li>
                <li>
                  <strong>Uso de dados:</strong> As informações são usadas
                  estritamente para fins operacionais da ONG e comunicação sobre
                  nossas atividades.
                </li>
                <li>
                  <strong>Proteção de dados:</strong> Implementamos medidas
                  rigorosas para proteger suas informações contra acesso
                  indevido, conforme a Lei Geral de Proteção de Dados (LGPD).
                </li>
                <li>
                  <strong>Compartilhamento de dados:</strong> Não compartilhamos
                  dados de doadores ou beneficiários com terceiros para fins
                  comerciais.
                </li>
              </ul>
            </TailwindAccordionItem>

            <TailwindAccordionItem
              title="Termos e Condições de Doação"
              isOpen={openItem === 'termos'}
              onClick={() => handleToggle('termos')}
            >
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Ao realizar uma doação (monetária ou de alimentos) à nossa ONG,
                você concorda com os seguintes termos:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>
                  <strong>Uso dos Recursos:</strong> Todas as doações serão
                  integralmente utilizadas para financiar as operações da ONG,
                  como logística, transporte e compra de alimentos
                  complementares.
                </li>
                <li>
                  <strong>Doações de Alimentos:</strong> Os alimentos doados
                  devem ser não perecíveis, estar lacrados e dentro do prazo de
                  validade. A ONG reserva-se o direito de recusar itens
                  inadequados.
                </li>
                <li>
                  <strong>Confirmação:</strong> A doação é considerada
                  finalizada e irrevogável após a entrega ou a confirmação
                  bancária.
                </li>
                <li>
                  <strong>Prestação de Contas:</strong> Nos comprometemos a
                  manter a transparência na aplicação dos recursos e a fornecer
                  recibos de doação quando solicitados.
                </li>
              </ul>
            </TailwindAccordionItem>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Help;
