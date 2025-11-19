import { Button } from '@/components/ui/button';
import { IconEdit } from '@tabler/icons-react';
import { BeneficiaryDetailDrawer } from './BeneficiaryDetailDrawer';

export function BeneficiaryEditCell({ beneficiary }) {
  // BeneficiaryDetailDrawer já gerencia o estado de abertura/fechamento
  return (
    <BeneficiaryDetailDrawer
      beneficiary={beneficiary}
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
