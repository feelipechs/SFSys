import { Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const USER_ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'manager', label: 'Gerente' },
  { value: 'volunteer', label: 'Voluntário' },
];

export function RoleSelect({ control, rules, disabled }) {
  return (
    <Controller
      name="role"
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-3">
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <SelectTrigger id="role" className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione o Perfil do Usuário" />
            </SelectTrigger>
            <SelectContent>
              {USER_ROLES.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
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
