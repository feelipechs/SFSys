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
import { DonationForm } from './DonationForm';
import { Button } from '@/components/ui/button';
import { IconLoader2, IconTrash } from '@tabler/icons-react';
import { useDonationMutations } from '@/hooks/mutations/useDonationMutations';

const DeleteDonationButton = ({ donationId, onDrawerClose }) => {
  const { remove, isPending } = useDonationMutations();

  const handleDeleteConfirm = () => {
    const mutationCallbacks = {
      onSuccess: () => {
        if (onDrawerClose) onDrawerClose();
      },
    };

    remove.mutate(donationId, mutationCallbacks);
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
            Você tem certeza que deseja deletar a doação{' '}
            <strong>(ID: {donationId})</strong>? Esta ação é irreversível.
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

export function DonationDetailDrawer({ donation, triggerContent }) {
  const FORM_ID = `donation-form-${donation.id}`;

  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const handleCloseDrawer = () => setIsEditDrawerOpen(false);

  const deleteAction = (
    <DeleteDonationButton
      donationId={donation.id}
      onDrawerClose={handleCloseDrawer}
    />
  );

  return (
    <EntityDetailDrawer
      title={`Editar Doação: (ID: ${donation.id})`}
      formId={FORM_ID}
      open={isEditDrawerOpen}
      onOpenChange={setIsEditDrawerOpen}
      extraButtons={deleteAction}
      triggerContent={triggerContent}
    >
      <DonationForm
        donation={donation}
        formId={FORM_ID}
        onClose={handleCloseDrawer}
      />
    </EntityDetailDrawer>
  );
}
