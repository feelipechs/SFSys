import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const USER_ROLES = [
  { value: 'manager', label: 'Gerente' },
  { value: 'volunteer', label: 'Voluntário' },
];

export function RoleSelect({ value, onChange, disabled, className, onBlur }) {
  return (
    <Select
      onValueChange={onChange} // usa o onChange do RHF
      value={value} // usa o value do RHF
      onBlur={onBlur} // passa o onBlur para marcar como 'touched'
      disabled={disabled}
    >
      <SelectTrigger
        id="role"
        className={className} // opcional, para passar estilos como classes de erro
      >
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
  );
}
