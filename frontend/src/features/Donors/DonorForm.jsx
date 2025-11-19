import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDonorMutations } from '@/hooks/mutations/useDonorMutations';
import { useHookFormMask } from 'use-mask-input';
import { DatePicker } from '@/components/DatePicker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormValidators } from '@/utils/validators';

const INITIAL_TYPE = 'individual';

export function DonorForm({ donor, formId, onClose }) {
  const { create, update, isPending } = useDonorMutations();

  const isUpdateMode = !!donor;

  const form = useForm({
    defaultValues: donor
      ? {
          type: donor.type || INITIAL_TYPE,
          name: donor.name || '',
          phone: donor.phone || '',
          email: donor.email || '',

          // campos PF (individual)
          cpf: donor.individual ? donor.individual.cpf : '',
          dateOfBirth: donor.individual?.dateOfBirth
            ? new Date(donor.individual.dateOfBirth)
            : '',

          // campos PJ (legal)
          cnpj: donor.legal ? donor.legal.cnpj : '',
          tradeName: donor.legal ? donor.legal.tradeName : '',
          companyName: donor.legal ? donor.legal.companyName : '',
        }
      : {
          // valores padrão para criação
          type: INITIAL_TYPE,
          name: '',
          phone: '',
          email: '',

          // valores padrão para campos específicos
          cpf: '',
          dateOfBirth: '',
          cnpj: '',
          tradeName: '',
          companyName: '',
        },
    mode: 'onBlur',
  });

  const { control, handleSubmit, watch, setValue, register } = form;
  const withMask = useHookFormMask(register);

  const currentType = watch('type');
  const isIndividual = currentType === 'individual';
  const isLegal = currentType === 'legal';

  const onSubmit = (data) => {
    const basePayload = {
      type: data.type,
      name: data.name,
      phone: data.phone,
      email: data.email,
    };

    let specificData = {};

    if (isIndividual) {
      specificData = {
        individual: {
          cpf: data.cpf,
          // garante que 'dateOfBirth' é enviada no formato correto (YYYY-MM-DD)
          dateOfBirth: data.dateOfBirth,
        },
      };
    } else if (isLegal) {
      specificData = {
        legal: {
          cnpj: data.cnpj,
          tradeName: data.tradeName,
          companyName: data.companyName,
        },
      };
    }

    const payload = {
      ...basePayload,
      ...specificData,
    };

    const mutationCallbacks = {
      onSuccess: () => {
        if (onClose) onClose();
        form.reset(donor ? data : undefined);
      },
    };

    if (donor && donor.id) {
      update.mutate({ id: donor.id, ...payload }, mutationCallbacks);
    } else {
      create.mutate(payload, mutationCallbacks);
    }
  };

  const handleTypeChange = (value) => {
    if (isUpdateMode) return;
    setValue('type', value, { shouldValidate: true });
  };

  return (
    // envolve o formulário com o provedor de contexto 'Form'
    <Form {...form}>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-4"
      >
        {/* seleção do tipo de doador (aba PF/PJ) */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="donor-type">Tipo de Entidade</Label>
          <Tabs
            value={currentType}
            onValueChange={handleTypeChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual" disabled={isUpdateMode}>
                Pessoa Física (PF)
              </TabsTrigger>
              <TabsTrigger value="legal" disabled={isUpdateMode}>
                Pessoa Jurídica (PJ)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* dados base (comum a PF/PJ) */}
        <h3 className="text-lg font-semibold mt-2">Dados de Contato</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {/* nome */}
          <FormField
            control={control}
            name="name"
            rules={{ required: 'O Nome é obrigatório.' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isIndividual ? 'Nome Completo' : 'Nome'}</FormLabel>
                <FormControl>
                  {/* transfere as props de registro do RHF para o FormField, via {...field} */}
                  <Input
                    {...field}
                    placeholder={
                      isIndividual ? 'Nome Completo' : 'Ex: Empresa Lorem Ipsum'
                    }
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage /> {/* exibe o erro de validação (regras acima) */}
              </FormItem>
            )}
          />

          {/* email */}
          <FormField
            control={control}
            name="email"
            rules={{
              required: 'O E-mail é obrigatório.',
              validate: FormValidators.email,
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="email@exemplo.com"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="phone"
            rules={{
              validate: FormValidators.phone,
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="(00) [0]0000-0000"
                    {...withMask('phone', '99 [9]9999-9999', {
                      removeMaskOnSubmit: true,
                    })}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* dados pessoas fisíca (PF) */}
        {isIndividual && (
          <React.Fragment>
            <h3 className="text-lg font-semibold mt-2">Documentação PF</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name="cpf"
                rules={{
                  required: 'O CPF é obrigatório.',
                  validate: FormValidators.cpf,
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="000.000.000-00"
                        {...withMask('cpf', '999.999.999-99', {
                          removeMaskOnSubmit: true,
                        })}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* data de nascimento */}
              <FormField
                control={control}
                name="dateOfBirth"
                rules={{ required: 'A data de nascimento é obrigatória.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </React.Fragment>
        )}

        {/* dados pessoa jurídica (PJ) */}
        {isLegal && (
          <React.Fragment>
            <h3 className="text-lg font-semibold mt-2">Detalhes da Empresa</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name="cnpj"
                rules={{
                  required: 'O CNPJ é obrigatório.',
                  validate: FormValidators.cnpj,
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="000.000.000-00"
                        {...withMask('cnpj', '99.999.999/9999-99', {
                          removeMaskOnSubmit: true,
                        })}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* razão social */}
              <FormField
                control={control}
                name="tradeName"
                rules={{ required: 'A Razão Social é obrigatória.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão Social</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: LoremIpsum"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* nome fantasia */}
              <FormField
                control={control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Fantasia (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nome Fantasia"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </React.Fragment>
        )}
      </form>
    </Form>
  );
}
