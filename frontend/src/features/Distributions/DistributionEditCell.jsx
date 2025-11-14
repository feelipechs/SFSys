import { Button } from '@/components/ui/button';
import { IconEdit } from '@tabler/icons-react';
import { DistributionDetailDrawer } from './DistributionDetailDrawer';

export function DistributionEditCell({ distribution }) {
  return (
    <DistributionDetailDrawer
      distribution={distribution}
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
