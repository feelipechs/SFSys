import { Controller } from 'react-hook-form';
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

export function StatusSelect({ control, rules, disabled }) {
  return (
    <Controller
      name="status"
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-3">
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <SelectTrigger
              id="status"
              className={error ? 'border-red-500' : ''}
            >
              <SelectValue placeholder="Selecione ..." />
            </SelectTrigger>
            <SelectContent>
              {VALID_STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* adiciona o feedback de erro aqui dentro do componente isolado */}
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
      )}
    />
  );
}
