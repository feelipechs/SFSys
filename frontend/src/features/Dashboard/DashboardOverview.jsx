import { ChartAreaInteractive } from '@/components/ChartAreaInteractive';
import { DataTable } from '@/components/DataTable';
import { SectionCards } from '@/components/SectionCards';

const overviewTabsData = [
  // o value deve ser outline para a aba da tabela principal
  { label: 'Outline', value: 'outline' },
  { label: 'Past Performance', value: 'past-performance', badge: 3 }, // badge é opcional
  { label: 'Key Personnel', value: 'key-personnel', badge: 2 },
  { label: 'Focus Documents', value: 'focus-documents' },
];

// definição do conteúdo para abas extras
const overviewExtraTabsContent = [
  // define o que cada aba renderiza
  {
    value: 'past-performance',
    component: <div>Conteúdo da Aba: Lista 01</div>,
  },
  {
    value: 'key-personnel',
    component: <div>Conteúdo da Aba: Lista 02</div>,
  },
  {
    value: 'focus-documents',
    component: <div>Conteúdo da Aba: Lista 03</div>,
  },
];

// dados fixos (mock) para a tabela de visão geral
const mockOverviewData = [
  { id: 1, metric: 'Total Usuários', valor: 78 },
  { id: 2, metric: 'Total Doações', valor: 'R$ 54.000' },
  { id: 3, metric: 'Leads Mês', valor: 450 },
];

// colunas fixas
const overviewColumns = [
  { accessorKey: 'metric', header: 'Métrica' },
  { accessorKey: 'valor', header: 'Valor' },
  // geralmente, tabelas de visão geral são simples e não precisam de Drag/Drop
];

const DashboardOverview = () => {
  // dados de cards e gráficos também seriam mockados ou gerenciados por outro hook/context

  // não há 'isLoading' ou 'isError' porque os dados são locais

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* cards (sem dados dinâmicos por enquanto) */}
        <SectionCards />

        {/* gráficos (sem dados dinâmicos por enquanto) */}
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>

        {/* tabela de visão geral: usa dados e colunas fixas com o DataTable reutilizável */}
        <DataTable
          data={mockOverviewData} // mock
          columns={overviewColumns} // mock
          tabsData={overviewTabsData}
          extraTabsContent={overviewExtraTabsContent}
        />
      </div>
    </div>
  );
};

export default DashboardOverview;
