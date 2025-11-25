import { Button } from '@/components/ui/button';
import { IconEdit } from '@tabler/icons-react';
import { ProductDetailDrawer } from './ProductDetailDrawer';

export function ProductEditCell({ product }) {
  return (
    <ProductDetailDrawer
      product={product}
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
