import { InputSearch } from '@/components/input-search';
import { SelectFilter } from '@/components/select-filter';
import { SelectFilterStatus } from '@/components/select-filter-status';

const CampaignFilter = () => {
  return (
    <div className="flex place-content-between mt-5 mb-5">
      <InputSearch />
      <SelectFilter />
      <SelectFilterStatus />
    </div>
  );
};

export default CampaignFilter;
