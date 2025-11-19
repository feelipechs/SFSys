import { Input } from '@/components/ui/input';
import { useBeneficiaryMutations } from '@/hooks/mutations/useBeneficiaryMutations';
import { useForm } from 'react-hook-form';
import { FormValidators } from '@/utils/validators';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useHookFormMask } from 'use-mask-input';
import { DatePicker } from '@/components/DatePicker';

export function BeneficiaryForm({ beneficiary, formId, onClose }) {
  const { create, update, isPending } = useBeneficiaryMutations();

  const form = useForm({
    defaultValues: beneficiary
      ? {
          registrationDate: beneficiary.registrationDate
            ? new Date(beneficiary.registrationDate)
            : '',

          responsibleName: beneficiary.responsibleName || '',
          responsibleCpf: beneficiary.responsibleCpf || '',
          address: beneficiary.address || '',
          familiyMembersCounts: beneficiary.familiyMembersCounts || 1,
        }
      : {
          responsibleName: '',
          responsibleCpf: '',
          registrationDate: '',
          address: '',
          familiyMembersCounts: 1,
        },
    mode: 'onBlur',
  });

  const { control, handleSubmit, register } = form;
  const withMask = useHookFormMask(register);

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

        {/* endereço */}
        <FormField
          name="address"
          control={control}
          rules={{ required: 'O endereço é obrigatório' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Rua Exemplo, 00 - Bairro Exemplo, Cidade Exemplo - UF"
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
          rules={{ required: 'O número de membros da família é obrigatório.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de Membros da Família</FormLabel>
              <FormControl>
                <Input {...field} placeholder="1" disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
