import { Button } from '@/components/ui/button';
import { IconEdit } from '@tabler/icons-react';
import { CampaignDetailDrawer } from './CampaignDetailDrawer';

export function CampaignEditCell({ campaign }) {
  return (
    <CampaignDetailDrawer
      campaign={campaign}
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
