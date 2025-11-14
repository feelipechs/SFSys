import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateTime } from '@/components/DateTime';
import { useDistributionMutations } from '@/hooks/mutations/useDistributionMutations';
import { Controller, useForm } from 'react-hook-form';
import { RelationInput } from '../../components/RelationInput';
import { useUsersQuery } from '@/hooks/queries/useUsersQuery';
import { useCampaignsQuery } from '@/hooks/queries/useCampaignsQuery';
import { useProductsQuery } from '@/hooks/queries/useProductsQuery';
import { ItemRepeater } from '@/components/ItemRepeater';
import { Textarea } from '@/components/ui/textarea';
import { useBeneficiariesQuery } from '@/hooks/queries/useBeneficiariesQuery';

export function DistributionForm({ distribution, formId, onClose }) {
  const { create, update, isPending } = useDistributionMutations();

  // determina se estamos editando uma distribuição existente (update) ou criando uma nova
  const isUpdateMode = !!distribution;

  const form = useForm({
    defaultValues: distribution
      ? {
          // mapeamento dos campos de cabeçalho
          dateTime: distribution.dateTime,
          observation: distribution.observation || '',
          quantityBaskets: distribution.quantityBaskets || 0,
          beneficiaryId: distribution.beneficiaryId,
          responsibleUserId: distribution.responsibleUserId,
          campaignId: distribution.campaignId,

          // mapeamento de items (productId -> itemId)
          items: distribution.items.map((item) => ({
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
          quantityBaskets: 0,
          beneficiaryId: '',
          responsibleUserId: '',
          campaignId: '',
          items: [{ productId: '', quantity: 1, validity: '' }],
        },
    mode: 'onBlur',
  });

  // buscar dados
  const { data: beneficiaries = [], isLoading: loadingBeneficiaries } =
    useBeneficiariesQuery();
  const { data: users = [], isLoading: loadingUsers } = useUsersQuery();
  const { data: campaigns = [], isLoading: loadingCampaigns } =
    useCampaignsQuery();
  const { data: products = [], isLoading: loadingProducts } =
    useProductsQuery();

  // mapear para o formato { value: id, label: Nome }
  const beneficiaryOptions = beneficiaries.map((b) => ({
    value: b.id,
    label: b.responsibleName,
  }));
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
        form.reset(distribution ? data : undefined);
      },
    };

    if (distribution && distribution.id) {
      // update

      const payload = { ...data };

      update.mutate({ id: distribution.id, ...payload }, mutationCallbacks);
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
        <Label htmlFor="beneficiaryId">Beneficiário</Label>
        <RelationInput
          name="beneficiaryId"
          control={formControl}
          options={beneficiaryOptions}
          placeholder={
            loadingBeneficiaries
              ? 'Carregando beneficiários...'
              : 'Selecione ...'
          }
          disabled={isPending || loadingBeneficiaries}
          rules={{ required: 'O beneficiário é obrigatório.' }}
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
        <Label htmlFor="campaignId">Campanha</Label>
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
            distribuição ser registrada.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="quantityBaskets">Qtd. de Cestas(opcional)</Label>
        <Input
          type="number"
          placeholder="..."
          id="quantityBaskets"
          {...form.register('quantityBaskets', {
            required: false,
          })}
          disabled={isPending}
        />
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
