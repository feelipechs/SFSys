import { Label } from '@/components/ui/label';
import { DateTime } from '@/components/DateTime';
import { useDonationMutations } from '@/hooks/mutations/useDonationMutations';
import { Controller, useForm } from 'react-hook-form';
import { RelationInput } from '../../components/RelationInput';
import { useDonorsQuery } from '@/hooks/queries/useDonorsQuery';
import { useUsersQuery } from '@/hooks/queries/useUsersQuery';
import { useCampaignsQuery } from '@/hooks/queries/useCampaignsQuery';
import { useProductsQuery } from '@/hooks/queries/useProductsQuery';
import { ItemRepeater } from '@/components/ItemRepeater';
import { Textarea } from '@/components/ui/textarea';

export function DonationForm({ donation, formId, onClose }) {
  const { create, update, isPending } = useDonationMutations();

  // determina se estamos editando uma doação existente (update) ou criando uma nova
  const isUpdateMode = !!donation;

  const form = useForm({
    defaultValues: donation
      ? {
          // mapeamento dos campos de cabeçalho
          dateTime: donation.dateTime || '',
          observation: donation.observation || '',
          donorId: donation.donorId || '',
          responsibleUserId: donation.responsibleUserId || '',
          campaignId: donation.campaignId || '',

          // mapeamento de items (productId -> itemId)
          items: donation.items.map((item) => ({
            // o ItemRepeater precisa de 'idFieldName' para preencher o <select>
            productId: item.productId,
            quantity: parseFloat(item.quantity), // bom garantir que a quantidade seja tratada como número
            validity: item.validity
              ? item.validity.substring(0, 10) // pega apenas os primeiros 10 caracteres (YYYY-MM-DD)
              : '',
            // ,antém o id do item, se for necessário para operações futuras
            id: item.id,
          })),
        }
      : {
          // valores padrão para criação
          dateTime: '',
          observation: '',
          donorId: '',
          responsibleUserId: '',
          campaignId: '',
          items: [{ productId: '', quantity: 1, validity: '' }],
        },
    mode: 'onBlur',
  });

  // buscar dados
  const { data: donors = [], isLoading: loadingDonors } = useDonorsQuery();
  const { data: users = [], isLoading: loadingUsers } = useUsersQuery();
  const { data: campaigns = [], isLoading: loadingCampaigns } =
    useCampaignsQuery();
  const { data: products = [], isLoading: loadingProducts } =
    useProductsQuery();

  // mapear para o formato { value: id, label: Nome }
  const donorOptions = donors.map((d) => ({ value: d.id, label: d.name }));
  const userOptions = users.map((u) => ({ value: u.id, label: u.name }));
  const campaignOptions = campaigns.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  const productOptions = products.map((p) => ({ value: p.id, label: p.name }));

  const onSubmit = (data) => {
    const mutationCallbacks = {
      onSuccess: () => {
        if (onClose) onClose();
        form.reset(donation ? data : undefined);
      },
    };

    if (donation && donation.id) {
      // update

      const payload = { ...data };

      update.mutate({ id: donation.id, ...payload }, mutationCallbacks);
    } else {
      // create
      // para criação, envie todos os dados, incluindo os items
      create.mutate(data, mutationCallbacks);
    }
  };

  const formControl = form.control;
  const isFormLoading = isPending || loadingProducts;

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 p-4"
    >
      <div className="flex flex-col gap-3">
        <Label htmlFor="dateTime">Data e Hora</Label>

        <Controller
          name="dateTime"
          control={formControl}
          rules={{ required: 'A Data e Hora são obrigatórias.' }}
          render={({ field }) => (
            // DateTime recebe value e onChange do 'field'
            <DateTime
              value={field.value} // valor atual do formulário (string ISO)
              onChange={field.onChange} // função para atualizar o valor no formulário
              disabled={isPending}
            />
          )}
        />
        {form.formState.errors.dateTime && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.dateTime.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="donorId">Doador</Label>
        <RelationInput
          name="donorId"
          control={formControl}
          options={donorOptions}
          placeholder={
            loadingDonors ? 'Carregando doadores...' : 'Selecione ...'
          }
          disabled={isPending || loadingDonors}
          rules={{ required: 'O doador é obrigatório.' }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="responsibleUserId">Usuário Responsável</Label>
        <RelationInput
          name="responsibleUserId"
          control={formControl}
          options={userOptions}
          placeholder={
            loadingUsers ? 'Carregando usuários...' : 'Selecione ...'
          }
          disabled={isPending || loadingUsers}
          rules={{ required: 'O usuário responsável é obrigatório.' }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="campaignId">Campanha (Opcional)</Label>
        <RelationInput
          name="campaignId"
          control={formControl}
          options={campaignOptions}
          placeholder={
            loadingCampaigns ? 'Carregando campanhas...' : 'Selecione ...'
          }
          disabled={isPending || loadingCampaigns}
          rules={{ required: false }}
        />
      </div>
      <div className="flex flex-col gap-3">
        <ItemRepeater
          name="items" // nome do array no useForm
          control={formControl}
          itemOptions={productOptions} // lista de produtos disponíveis
          itemLabel="Produto" // rótulo para esta transação
          idFieldName="productId"
          isPending={isFormLoading}
          disabled={isUpdateMode}
        />
        {isUpdateMode && (
          <p className="text-sm text-yellow-600 mt-[-0.5rem]">
            A lista de produtos e quantidades não pode ser alterada após a
            doação ser registrada.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="observation">Observação (opcional)</Label>
        <Textarea
          placeholder="..."
          id="observation"
          {...form.register('observation', {
            required: false,
          })}
          disabled={isPending}
        />
      </div>
    </form>
  );
}
