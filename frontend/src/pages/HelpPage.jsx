import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'Como o sistema funciona?',
    answer:
      'Para acessar o sistema, é necessário realizar o login utilizando sua conta e senha. Após o acesso, todos os itens de navegação e módulos de gerenciamento estarão disponíveis no menu lateral esquerdo.',
  },
  {
    question: 'Quais módulos o sistema possui?',
    answer:
      'O sistema oferece módulos completos para o gerenciamento de: Beneficiários, Campanhas, Distribuições, Doações, Doadores, Produtos e Usuários.',
  },
  {
    question: 'Onde encontro a Ajuda e a Configuração do Sistema?',
    answer:
      'Os itens de gerenciamento da ONG estão localizados na seção superior do menu lateral. Abaixo deles, você encontrará as páginas "Contato" (para falar com a equipe de desenvolvimento) e "Ajuda" (a página atual).\n\nNo canto superior direito, há um botão para mudar o tema (Escuro/Claro) e um link para a documentação completa da aplicação. No rodapé do menu lateral, o seu nome de usuário oferece acesso às páginas de configuração de perfil, e a opção "Sair" para desconectar-se do sistema.',
  },
  {
    question: 'Como gerencio os dados (Beneficiários, Doadores, etc.)?',
    answer:
      'O gerenciamento de dados é feito através de uma tabela centralizada. Você pode:\n\n* Ordenar: Clique no nome de qualquer coluna para ordenar os dados (ascendente/descendente).\n* Filtrar/Pesquisar: Use o campo de "Pesquisa" acima da tabela para filtrar os resultados por nome, documento, ID, etc.\n* Ações: No lado direito da tabela, há botões para "Customizar Colunas" (escolher quais colunas são visíveis) e "Adicionar novo [nome da entidade]" (abrir o formulário de cadastro).\n* Paginação: Na parte inferior, escolha quantos itens exibir por página e navegue entre as páginas.',
  },
];

const HelpPage = () => {
  return (
    <section className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* FAQ Header */}
        <div className="mb-12 space-y-4 text-center sm:mb-16 lg:mb-24">
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            Precisa de ajuda?
          </h2>
          <p className="text-muted-foreground text-xl">
            Explore nossas perguntas mais frequentes e encontre as informações
            que você precisa.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger className="text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground whitespace-pre-line">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default HelpPage;
