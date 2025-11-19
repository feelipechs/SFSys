import { DateTimePicker } from '@/components/DateTimePicker';
import { useDonationMutations } from '@/hooks/mutations/useDonationMutations';
import { useForm } from 'react-hook-form';
import { RelationInput } from '../../components/RelationInput';
import { useDonorsQuery } from '@/hooks/queries/useDonorsQuery';
import { useUsersQuery } from '@/hooks/queries/useUsersQuery';
import { useCampaignsQuery } from '@/hooks/queries/useCampaignsQuery';
import { useProductsQuery } from '@/hooks/queries/useProductsQuery';
import { ItemRepeater } from '@/components/ItemRepeater';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';

export function DonationForm({ donation, formId, onClose }) {
  const { user } = useAuth();
  const currentUserId = user?.id;
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
            validity: item.validity ? new Date(item.validity) : null,
            // ,antém o id do item, se for necessário para operações futuras
            id: item.id,
          })),
        }
      : {
          // valores padrão para criação
          dateTime: '',
          observation: '',
          donorId: '',
          responsibleUserId: currentUserId ?? '',
          campaignId: '',
          items: [{ productId: '', quantity: 1, validity: null }],
        },
    mode: 'onBlur',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

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
  const activeCampaigns = campaigns.filter((c) => c.status === 'inProgress');
  const campaignOptions = activeCampaigns.map((c) => ({
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

  const isFormLoading = isPending || loadingProducts;

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-4"
      >
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

        {/* doador */}
        <FormField
          name="donorId"
          control={control}
          rules={{ required: 'O doador é obrigatório.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doador</FormLabel>
              <FormControl>
                <RelationInput
                  {...field} // passa value, onChange, onBlur
                  options={donorOptions}
                  placeholder={
                    loadingDonors ? 'Carregando doadores...' : 'Selecione ...'
                  }
                  disabled={isPending || loadingDonors}
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
                  {...field}
                  options={userOptions}
                  placeholder={
                    loadingUsers ? 'Carregando usuários...' : 'Selecione ...'
                  }
                  disabled={isPending || loadingUsers}
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
                  {...field}
                  options={campaignOptions}
                  placeholder={
                    loadingCampaigns
                      ? 'Carregando campanhas...'
                      : 'Selecione ...'
                  }
                  disabled={isPending || loadingCampaigns}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ItemRepeater (Array), não usa FormField diretamente, mas está dentro do <form> */}
        <div className="flex flex-col gap-3">
          <ItemRepeater
            name="items" // nome do array no useForm
            control={control}
            itemOptions={productOptions} // lista de produtos disponíveis
            productsData={products}
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
          {/* exibe erro de array (se houver, ex: minLength) */}
          {errors.items && (
            <FormMessage>Verifique os itens da transação.</FormMessage>
          )}
        </div>

        {/* observação */}
        <FormField
          name="observation"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação (opcional)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="..." disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
