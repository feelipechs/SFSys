import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package } from 'lucide-react';

export function MultiItemsCell({
  items,
  headerLabel = 'Itens', // rótulo do cabeçalho da coluna (ex: "Produtos", "Materiais")
  // chaves para acessar os dados dentro do objeto 'item'
  quantityKey = 'quantity',
  productObjectKey = 'product', // chave que contém o objeto aninhado do produto
  productNameKey = 'name',
  productUnitKey = 'unitOfMeasurement',
  validityKey = 'validity', // se a validade for um campo opcional
}) {
  const [open, setOpen] = useState(false);

  if (!items || items.length === 0) {
    return <span>Nenhum Item</span>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="min-w-[100px] justify-start"
        >
          <Package className="h-4 w-4 mr-2" /> {items.length} {headerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            Detalhes dos {headerLabel} ({items.length})
          </DialogTitle>
          <DialogDescription>
            Lista de todos os itens e suas quantidades associadas a esta
            transação.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 w-full">
          <ul className="space-y-3 p-1">
            {items.map((item, index) => {
              // acessa o objeto do produto usando a chave dinâmica (ex: item.product)
              const product = item[productObjectKey];

              if (!product) return null; // garante que o produto existe

              return (
                <li key={index} className="border-b pb-2">
                  {/* acessa o nome e a unidade do produto */}
                  <p className="font-semibold text-gray-500">
                    {product[productNameKey]}
                  </p>
                  <p className="text-sm">
                    Quantidade: {item[quantityKey]} ({product[productUnitKey]})
                  </p>

                  {/* exibição condicional da validade */}
                  {item[validityKey] && (
                    <p className="text-xs text-gray-500">
                      Válido até:{' '}
                      {new Date(item[validityKey]).toLocaleDateString('pt-BR', {
                        // garante que a data seja tratada como UTC, evitando a mudança de dia
                        timeZone: 'UTC',
                      })}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
