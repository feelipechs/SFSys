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
import { BeneficiaryForm } from './BeneficiaryForm';
import { Button } from '@/components/ui/button';
import { IconLoader2, IconTrash } from '@tabler/icons-react';
import { useBeneficiaryMutations } from '@/hooks/mutations/useBeneficiaryMutations';

const DeleteBeneficiaryButton = ({
  beneficiaryId,
  beneficiaryName,
  onDrawerClose,
}) => {
  const { remove, isPending } = useBeneficiaryMutations();

  const handleDeleteConfirm = () => {
    const mutationCallbacks = {
      onSuccess: () => {
        if (onDrawerClose) onDrawerClose();
      },
    };

    remove.mutate(beneficiaryId, mutationCallbacks);
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
            Você tem certeza que deseja deletar o beneficiário{' '}
            <strong>
              {beneficiaryName} (ID: {beneficiaryId})
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

export function BeneficiaryDetailDrawer({ beneficiary, triggerContent }) {
  const FORM_ID = `beneficiary-form-${beneficiary.id}`;

  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const handleCloseDrawer = () => setIsEditDrawerOpen(false);

  const deleteAction = (
    <DeleteBeneficiaryButton
      beneficiaryId={beneficiary.id}
      beneficiaryName={beneficiary.responsibleName}
      onDrawerClose={handleCloseDrawer}
    />
  );

  return (
    <EntityDetailDrawer
      title={`Editar Beneficiário: ${beneficiary.name} (ID: ${beneficiary.id})`}
      formId={FORM_ID}
      open={isEditDrawerOpen}
      onOpenChange={setIsEditDrawerOpen}
      extraButtons={deleteAction}
      triggerContent={triggerContent}
      description="Altere os dados do beneficiário e clique em 'Salvar Alterações'."
    >
      <BeneficiaryForm
        beneficiary={beneficiary}
        formId={FORM_ID}
        onClose={handleCloseDrawer}
      />
    </EntityDetailDrawer>
  );
}
