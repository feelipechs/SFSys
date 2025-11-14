import { Button } from '@/components/ui/button';
import { IconEdit } from '@tabler/icons-react';
import { DonorDetailDrawer } from './DonorDetailDrawer';

export function DonorEditCell({ donor }) {
  return (
    <DonorDetailDrawer
      donor={donor}
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
