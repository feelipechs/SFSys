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
import { DistributionForm } from './DistributionForm';
import { Button } from '@/components/ui/button';
import { IconLoader2, IconTrash } from '@tabler/icons-react';
import { useDistributionMutations } from '@/hooks/mutations/useDistributionMutations';

const DeleteDistributionButton = ({ distributionId, onDrawerClose }) => {
  const { remove, isPending } = useDistributionMutations();

  const handleDeleteConfirm = () => {
    const mutationCallbacks = {
      onSuccess: () => {
        if (onDrawerClose) onDrawerClose();
      },
    };

    remove.mutate(distributionId, mutationCallbacks);
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
            Você tem certeza que deseja deletar a distribuição{' '}
            <strong>(ID: {distributionId})</strong>? Esta ação é irreversível.
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

export function DistributionDetailDrawer({ distribution, triggerContent }) {
  const FORM_ID = `distribution-form-${distribution.id}`;

  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const handleCloseDrawer = () => setIsEditDrawerOpen(false);

  const deleteAction = (
    <DeleteDistributionButton
      distributionId={distribution.id}
      onDrawerClose={handleCloseDrawer}
    />
  );

  return (
    <EntityDetailDrawer
      title={`Editar Distribuição: (ID: ${distribution.id})`}
      formId={FORM_ID}
      open={isEditDrawerOpen}
      onOpenChange={setIsEditDrawerOpen}
      extraButtons={deleteAction}
      triggerContent={triggerContent}
      description="Altere os dados da distribuição e clique em 'Salvar Alterações'."
    >
      <DistributionForm
        distribution={distribution}
        formId={FORM_ID}
        onClose={handleCloseDrawer}
      />
    </EntityDetailDrawer>
  );
}
