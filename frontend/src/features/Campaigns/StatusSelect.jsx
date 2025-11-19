import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const VALID_STATUS = [
  { value: 'inProgress', label: 'Em Andamento' },
  { value: 'finished', label: 'Finalizada' },
  { value: 'canceled', label: 'Cancelada' },
  { value: 'pending', label: 'Pendente' },
];

export function StatusSelect({ value, onChange, disabled, onBlur }) {
  return (
    <Select
      onValueChange={onChange}
      value={value}
      onBlur={onBlur}
      disabled={disabled}
    >
      <SelectTrigger id="status">
        <SelectValue placeholder="Selecione o Status da Campanha" />
      </SelectTrigger>
      <SelectContent>
        {VALID_STATUS.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
