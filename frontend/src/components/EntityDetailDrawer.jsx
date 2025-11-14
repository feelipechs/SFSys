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

export const EntityDetailDrawer = ({
  children,
  title,
  triggerContent,
  description,
  formId,
  extraButtons, // prop para o botão delete no footer
  open,
  onOpenChange,
}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{triggerContent}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>

        <div className="p-4 overflow-y-auto max-h-[80vh]">{children}</div>

        {/* footer: botões de ação */}
        <DrawerFooter className="flex flex-row items-center justify-between">
          {/* botôes extras (delete) - esquerda */}
          <div className="flex-shrink-0">{extraButtons}</div>

          {/* botões principais (submit/cancel) - direita */}
          <div className="flex gap-2">
            {formId && ( // renderiza submit apenas se houver um formId
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
