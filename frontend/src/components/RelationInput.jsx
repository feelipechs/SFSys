import { useState } from 'react';
import { Controller } from 'react-hook-form';
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

export function RelationInput({
  control,
  rules,
  disabled,
  name,
  options,
  placeholder,
  idModePlaceholder = 'Digite o ID diretamente',
}) {
  // estado para alternar entre SELECT e INPUT ID
  const [isIDMode, setIsIDMode] = useState(false);

  const toggleMode = () => {
    setIsIDMode((prev) => !prev);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            {/* select ou input */}
            {isIDMode ? (
              // modo input id
              <Input
                type="number" // garante que o usuário só digite números
                placeholder={idModePlaceholder}
                // o valor precisa ser tratado como String para o input e depois convertido para Number no onChange
                value={field.value !== '' ? String(field.value) : ''}
                // onChange={(e) => field.onChange(Number(e.target.value))}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === '' ? null : Number(value));
                }}
                disabled={disabled}
                className={error ? 'border-red-500 flex-1' : 'flex-1'}
              />
            ) : (
              // select (default)
              // <Select
              //   onValueChange={(value) => field.onChange(Number(value))}
              //   value={field.value ? String(field.value) : ''}
              //   disabled={disabled}
              // >
              <Select
                onValueChange={(value) => {
                  // Se o valor for 'none', envia null (ou undefined), senão, converte para Number
                  field.onChange(value === 'none' ? null : Number(value));
                }}
                // Se field.value for null ou undefined, usa 'none' para selecionar o item 'Nenhuma'
                value={
                  field.value !== null && field.value !== undefined
                    ? String(field.value)
                    : 'none'
                }
                disabled={disabled}
              >
                <SelectTrigger
                  id={name}
                  className={error ? 'border-red-500' : ''}
                >
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

          {/* feedback de erro */}
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
      )}
    />
  );
}
