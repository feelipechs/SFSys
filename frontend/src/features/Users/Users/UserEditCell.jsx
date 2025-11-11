import { Button } from '@/components/ui/button';
import { IconEdit } from '@tabler/icons-react';
import { UserDetailDrawer } from './UserDetailDrawer';

export function UserEditCell({ user }) {
  // UserDetailDrawer já gerencia o estado de abertura/fechamento
  return (
    <UserDetailDrawer
      user={user}
      // triggerContent será o botão de ícone de edição
      triggerContent={
        <Button
          title="Gerenciar"
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground"
        >
          <IconEdit className="size-4" />
        </Button>
      }
    />
  );
}
