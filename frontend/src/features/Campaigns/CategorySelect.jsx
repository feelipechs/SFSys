import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const VALID_CATEGORIES = [
  { value: 'food', label: 'Alimento' },
  { value: 'clothing', label: 'Vestimenta' },
  { value: 'hygiene', label: 'Higiene' },
  { value: 'others', label: 'Outros' },
];

export function CategorySelect({ value, onChange, disabled, onBlur }) {
  return (
    <Select
      onValueChange={onChange}
      value={value}
      onBlur={onBlur}
      disabled={disabled}
    >
      <SelectTrigger id="category">
        <SelectValue placeholder="Selecione a Categoria da Campanha" />
      </SelectTrigger>
      <SelectContent>
        {VALID_CATEGORIES.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
