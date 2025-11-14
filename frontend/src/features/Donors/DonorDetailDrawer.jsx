import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { EntityDetailDrawer } from '@/components/EntityDetailDrawer';
import { DonorForm } from './DonorForm';
import { Button } from '@/components/ui/button';
import { IconLoader2, IconTrash } from '@tabler/icons-react';
import { useDonorMutations } from '@/hooks/mutations/useDonorMutations';

const DeleteDonorButton = ({ donorId, donorName, onDrawerClose }) => {
  const { remove, isPending } = useDonorMutations();

  const handleDeleteConfirm = () => {
    const mutationCallbacks = {
      onSuccess: () => {
        if (onDrawerClose) onDrawerClose();
      },
    };

    remove.mutate(donorId, mutationCallbacks);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isPending}>
          <IconTrash className="size-4" />
          <span className="ml-2 hidden sm:inline">Excluir</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmação de Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja deletar o doador{' '}
            <strong>
              {donorName} (ID: {donorId})
            </strong>
            ? Esta ação é irreversível.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDeleteConfirm}
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            {isPending ? (
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Sim, Deletar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function DonorDetailDrawer({ donor, triggerContent }) {
  const FORM_ID = `donor-form-${donor.id}`;

  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const handleCloseDrawer = () => setIsEditDrawerOpen(false);

  const deleteAction = (
    <DeleteDonorButton
      donorId={donor.id}
      donorName={donor.name}
      onDrawerClose={handleCloseDrawer}
    />
  );

  return (
    <EntityDetailDrawer
      title={`Editar Doador: ${donor.name} (ID: ${donor.id})`}
      formId={FORM_ID}
      open={isEditDrawerOpen}
      onOpenChange={setIsEditDrawerOpen}
      extraButtons={deleteAction}
      triggerContent={triggerContent}
      description="Altere os dados do doador e clique em 'Salvar Alterações'."
    >
      <DonorForm donor={donor} formId={FORM_ID} onClose={handleCloseDrawer} />
    </EntityDetailDrawer>
  );
}
