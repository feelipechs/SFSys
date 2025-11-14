import { Button } from '@/components/ui/button';
import { IconEdit } from '@tabler/icons-react';
import { DonationDetailDrawer } from './DonationDetailDrawer';

export function DonationEditCell({ donation }) {
  return (
    <DonationDetailDrawer
      donation={donation}
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
