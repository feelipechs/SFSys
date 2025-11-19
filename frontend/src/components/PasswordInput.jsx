import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

// aceita todas as props de um input (value, onChange, disabled, etc.)
export const PasswordInput = React.forwardRef(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    // alterna o estado de visibilidade
    const toggleVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative">
        <Input
          // alterna o tipo: 'text' se visível, 'password' se oculto
          type={showPassword ? 'text' : 'password'}
          ref={ref}
          {...props} // passa todas as props (incluindo as do RHF: value, onChange, onBlur, etc.)
          className={className}
        />
        <Button
          type="button" // evita que o botão submeta o formulário
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={toggleVisibility}
          // desabilita o botão se o input principal estiver desabilitado
          disabled={props.disabled}
        >
          {/* icone que reflete o estado atual */}
          {showPassword ? (
            <IconEye className="h-4 w-4 text-muted-foreground" />
          ) : (
            <IconEyeOff className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
