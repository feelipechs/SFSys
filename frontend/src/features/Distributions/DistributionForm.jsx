import { Input } from '@/components/ui/input';
import { DateTimePicker } from '@/components/DateTimePicker';
import { useDistributionMutations } from '@/hooks/mutations/useDistributionMutations';
import { useForm } from 'react-hook-form';
import { RelationInput } from '../../components/RelationInput';
import { useUsersQuery } from '@/hooks/queries/useUsersQuery';
import { useCampaignsQuery } from '@/hooks/queries/useCampaignsQuery';
import { useProductsQuery } from '@/hooks/queries/useProductsQuery';
import { ItemRepeater } from '@/components/ItemRepeater';
import { Textarea } from '@/components/ui/textarea';
import { useBeneficiariesQuery } from '@/hooks/queries/useBeneficiariesQuery';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function DistributionForm({ distribution, formId, onClose }) {
  const { create, update, isPending } = useDistributionMutations();

  const isUpdateMode = !!distribution;

  const form = useForm({
    defaultValues: distribution
      ? {
          // mapeamento dos campos de cabeçalho
          dateTime: distribution.dateTime || '',
          observation: distribution.observation || '',
          quantityBaskets: distribution.quantityBaskets || 0,
          beneficiaryId: distribution.beneficiaryId || '',
          responsibleUserId: distribution.responsibleUserId || '',
          campaignId: distribution.campaignId || '',

          // mapeamento de items (garantindo Date para o DatePicker)
          items: distribution.items.map((item) => ({
            productId: item.productId,
            quantity: parseFloat(item.quantity),
            validity: item.validity ? new Date(item.validity) : null,
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
          items: [{ productId: '', quantity: 1, validity: null }],
        },
    mode: 'onBlur',
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  // buscar dados
  const { data: beneficiaries = [], isLoading: loadingBeneficiaries } =
    useBeneficiariesQuery();
  const { data: users = [], isLoading: loadingUsers } = useUsersQuery();
  const { data: campaigns = [], isLoading: loadingCampaigns } =
    useCampaignsQuery();
  const { data: products = [], isLoading: loadingProducts } =
    useProductsQuery();

  // mapear para o formato { value: id, label: nome }
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
      create.mutate(data, mutationCallbacks);
    }
  };

  const isFormLoading = isPending || loadingProducts;

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-4"
      >
        {/* data e hora */}
        <FormField
          name="dateTime"
          control={control}
          rules={{ required: 'A Data e Hora são obrigatórias.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data e Hora</FormLabel>
              <FormControl>
                <DateTimePicker {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* beneficiário */}
        <FormField
          name="beneficiaryId"
          control={control}
          rules={{ required: 'O beneficiário é obrigatório.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beneficiário</FormLabel>
              <FormControl>
                <RelationInput
                  options={beneficiaryOptions}
                  placeholder={
                    loadingBeneficiaries
                      ? 'Carregando beneficiários...'
                      : 'Selecione ...'
                  }
                  disabled={isPending || loadingBeneficiaries}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* usuário responsável */}
        <FormField
          name="responsibleUserId"
          control={control}
          rules={{ required: 'O usuário responsável é obrigatório.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário Responsável</FormLabel>
              <FormControl>
                <RelationInput
                  options={userOptions}
                  placeholder={
                    loadingUsers ? 'Carregando usuários...' : 'Selecione ...'
                  }
                  disabled={isPending || loadingUsers}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* campanha */}
        <FormField
          name="campaignId"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campanha (Opcional)</FormLabel>
              <FormControl>
                <RelationInput
                  options={campaignOptions}
                  placeholder={
                    loadingCampaigns
                      ? 'Carregando campanhas...'
                      : 'Selecione ...'
                  }
                  disabled={isPending || loadingCampaigns}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ItemRepeater */}
        <div className="flex flex-col gap-3">
          <ItemRepeater
            name="items"
            control={control}
            itemOptions={productOptions}
            itemLabel="Produto"
            productsData={products}
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
          {errors.items && (
            <FormMessage>Verifique os itens da distribuição.</FormMessage>
          )}
        </div>

        {/* Qtd. de Cestas */}
        <FormField
          name="quantityBaskets"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qtd. de Cestas (opcional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="..."
                  {...register('quantityBaskets')}
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* observação */}
        <FormField
          name="observation"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação (opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="..." {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
