import { Input } from '@/components/ui/input';
import { useBeneficiaryMutations } from '@/hooks/mutations/useBeneficiaryMutations';
import { useCepQuery } from '@/hooks/queries/useCepQuery';
import { useForm } from 'react-hook-form';
import { FormValidators } from '@/utils/validators';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useHookFormMask } from 'use-mask-input';
import { DatePicker } from '@/components/DatePicker';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function BeneficiaryForm({ beneficiary, formId, onClose }) {
  const { create, update, isPending } = useBeneficiaryMutations();

  const form = useForm({
    defaultValues: beneficiary
      ? {
          registrationDate: beneficiary.registrationDate
            ? new Date(beneficiary.registrationDate)
            : null,
          responsibleName: beneficiary.responsibleName || '',
          responsibleCpf: beneficiary.responsibleCpf || '',
          cep: beneficiary.address?.cep || '',
          number: beneficiary.address?.number || '',
          complement: beneficiary.address?.complement || '',
          familyMembersCount: beneficiary.familyMembersCount || 1,
        }
      : {
          responsibleName: '',
          responsibleCpf: '',
          registrationDate: null,
          cep: '',
          number: '',
          complement: '',
          familyMembersCount: 1,
        },
    mode: 'onBlur',
  });

  const { control, handleSubmit, register, watch } = form;
  const withMask = useHookFormMask(register);
  const cepValue = watch('cep');

  // React Query para buscar CEP
  const {
    data: addressData,
    isLoading: isLoadingCEP,
    isError: isCEPError,
    error: cepError,
  } = useCepQuery(cepValue);

  const onSubmit = (data) => {
    const mutationCallbacks = {
      onSuccess: () => {
        if (onClose) onClose();
        form.reset(beneficiary ? data : undefined);
      },
    };

    if (beneficiary && beneficiary.id) {
      // update
      const payload = { ...data };
      update.mutate({ id: beneficiary.id, ...payload }, mutationCallbacks);
    } else {
      // create
      create.mutate(data, mutationCallbacks);
    }
  };

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-4"
      >
        {/* nome do responsável */}
        <FormField
          name="responsibleName"
          control={control}
          rules={{ required: 'O nome do responsável é obrigatório.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Responsável</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome Completo"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* cpf do responsável */}
        <FormField
          name="responsibleCpf"
          control={control}
          rules={{
            required: 'O CPF do responsável é obrigatório.',
            validate: FormValidators.cpf,
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF do Responsável</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="000.000.000-00"
                  {...withMask('responsibleCpf', '999.999.999-99', {
                    removeMaskOnSubmit: true,
                  })}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* data de cadastro */}
        <FormField
          name="registrationDate"
          control={control}
          rules={{
            required: 'A data de cadastro é obrigatória.',
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Cadastro</FormLabel>
              <FormControl>
                <DatePicker {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CEP */}
        <FormField
          name="cep"
          control={control}
          rules={{
            required: 'O CEP é obrigatório',
            validate: (value) => {
              const clean = value?.replace(/\D/g, '');
              return clean?.length === 8 || 'CEP deve ter 8 dígitos';
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="00000-000"
                  {...withMask('cep', '99999-999', {
                    removeMaskOnSubmit: true,
                  })}
                  disabled={isPending || isLoadingCEP}
                />
              </FormControl>
              <FormMessage />

              {/* Feedback do CEP */}
              {isLoadingCEP && (
                <FormDescription className="text-blue-600">
                  Buscando endereço...
                </FormDescription>
              )}

              {addressData && !isLoadingCEP && (
                <Alert className="mt-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    {addressData.street}
                    {addressData.neighborhood &&
                      `, ${addressData.neighborhood}`}
                    {` - ${addressData.city}/${addressData.state}`}
                  </AlertDescription>
                </Alert>
              )}

              {isCEPError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    CEP não encontrado. Verifique e tente novamente.
                  </AlertDescription>
                </Alert>
              )}
            </FormItem>
          )}
        />

        {/* Número */}
        <FormField
          name="number"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input {...field} placeholder="123" disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Complemento */}
        <FormField
          name="complement"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento (opcional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Apto 101, Bloco A, etc."
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* quantidade de membros da família */}
        <FormField
          name="familyMembersCount"
          control={control}
          rules={{
            valueAsNumber: true,
            required: 'O número de membros da família é obrigatório.',
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de Membros da Família</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="1"
                  disabled={isPending}
                  type="number"
                  min="1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
