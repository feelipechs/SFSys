import { ActivityTrendChart } from './ActivityTrendChart';
import SectionCards from './SectionCards';

const DashboardOverview = () => {
  // não há 'isLoading' ou 'isError' porque os dados são locais. AGORA SAO DINAMICOS, COLOCAR ERROR

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />

        <div className="px-4 lg:px-6">
          <ActivityTrendChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
