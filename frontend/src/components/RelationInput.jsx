import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Zap, ListChecks } from 'lucide-react';

// recebe props de campo (field) diretamente do FormField, e outras props auxiliares. Ele não aceita 'control' ou 'rules'
export function RelationInput({
  value,
  onChange,
  onBlur,
  name,
  disabled,
  options,
  placeholder,
  idModePlaceholder = 'Digite o ID diretamente',
}) {
  // estado para alternar entre SELECT e INPUT ID
  const [isIDMode, setIsIDMode] = useState(false);

  const toggleMode = () => {
    setIsIDMode((prev) => !prev);
  };

  // o valor do RHF é 'value'. Se for null/undefined, o Select deve usar 'none'
  const selectValue =
    value !== null && value !== undefined ? String(value) : 'none';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {/* select ou input */}
        {isIDMode ? (
          // modo input id
          <Input
            type="number"
            placeholder={idModePlaceholder}
            // o valor precisa ser tratado como String para o input
            value={value !== null && value !== undefined ? String(value) : ''}
            // O RHF precisa ser notificado no 'onChange' e no 'onBlur'
            onChange={(e) => {
              const newValue = e.target.value;
              onChange(newValue === '' ? null : Number(newValue));
            }}
            onBlur={onBlur}
            name={name}
            disabled={disabled}
          />
        ) : (
          <Select
            onValueChange={(newValue) => {
              onChange(newValue === 'none' ? null : Number(newValue));
            }}
            value={selectValue}
            name={name}
            disabled={disabled}
          >
            <SelectTrigger id={name} onBlur={onBlur}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="none" value="none">
                N/A
              </SelectItem>
              {options.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* botão toggle*/}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleMode}
          title={
            isIDMode
              ? 'Voltar para seleção por nome'
              : 'Alternar para input de ID'
          }
        >
          {isIDMode ? (
            <ListChecks className="h-4 w-4" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
