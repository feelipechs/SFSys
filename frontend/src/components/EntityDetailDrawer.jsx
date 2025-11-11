import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

const EntityDetailDrawer = ({
  children,
  title,
  triggerContent,
  description,
  formId,
  extraButtons, // Usaremos esta prop para o botão Delete no rodapé
  open,
  onOpenChange,
}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{triggerContent}</DrawerTrigger>
      <DrawerContent>
        {/* HEADER: Limpo, sem ações de botão */}
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>

        <div className="p-4 overflow-y-auto max-h-[80vh]">{children}</div>

        {/* FOOTER: Botões de ação. Usamos justify-between para separar o Delete 
          (à esquerda) das ações primárias (Salvar/Cancelar à direita).
        */}
        <DrawerFooter className="flex flex-row items-center justify-between">
          {/* SLOT PARA BOTÕES EXTRAS (DELETE) - Fica à esquerda */}
          <div className="flex-shrink-0">{extraButtons}</div>

          {/* Botões de Ação Principal (Submit/Cancel) - Fica à direita */}
          <div className="flex gap-2">
            {formId && ( // Renderiza Submit apenas se houver um formId
              <Button type="submit" form={formId}>
                Salvar Alterações
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EntityDetailDrawer;
