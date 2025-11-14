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
import { CampaignForm } from './CampaignForm';
import { Button } from '@/components/ui/button';
import { IconLoader2, IconTrash } from '@tabler/icons-react';
import { useCampaignMutations } from '@/hooks/mutations/useCampaignMutations';

// componente local: lógica do botão de exclusão
const DeleteCampaignButton = ({ campaignId, campaignName, onDrawerClose }) => {
  const { remove, isPending } = useCampaignMutations();

  // a função de exclusão real só é chamada após a confirmação no AlertDialog
  const handleDeleteConfirm = () => {
    const mutationCallbacks = {
      onSuccess: () => {
        // fecha o Drawer após a exclusão e a invalidação do cache
        if (onDrawerClose) onDrawerClose();
      },
      // o onError global (no useUserMutations) já trata o erro
    };

    remove.mutate(campaignId, mutationCallbacks);
  };

  return (
    <AlertDialog>
      {/* trigger: o botão "Excluir" no rodapé do Drawer */}
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isPending}>
          <IconTrash className="size-4" />
          <span className="ml-2 hidden sm:inline">Excluir</span>
        </Button>
      </AlertDialogTrigger>

      {/* o conteúdo do modal de confirmação */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmação de Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja deletar a campanha{' '}
            <strong>
              {campaignName} (ID: {campaignId})
            </strong>
            ? Esta ação é irreversível.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>

          {/* AlertDialogAction chama a mutação após a confirmação */}
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

// componente principal de ação de linha
export function CampaignDetailDrawer({ campaign, triggerContent }) {
  const FORM_ID = `campaign-form-${campaign.id}`;

  // lógica de estado do Drawer
  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const handleCloseDrawer = () => setIsEditDrawerOpen(false);

  // ação de delete (injetada no cabeçalho)
  const deleteAction = (
    <DeleteCampaignButton
      campaignId={campaign.id}
      campaignName={campaign.name}
      onDrawerClose={handleCloseDrawer}
    />
  );

  return (
    <EntityDetailDrawer
      title={`Editar Campanha: ${campaign.name} (ID: ${campaign.id})`}
      formId={FORM_ID}
      open={isEditDrawerOpen}
      onOpenChange={setIsEditDrawerOpen}
      extraButtons={deleteAction}
      // usa o triggerContent passado pela prop (botão editar ou nome)
      triggerContent={triggerContent}
      description="Altere os dados da campanha e clique em 'Salvar Alterações'."
    >
      <CampaignForm
        campaign={campaign}
        formId={FORM_ID}
        onClose={handleCloseDrawer}
      />
    </EntityDetailDrawer>
  );
}
