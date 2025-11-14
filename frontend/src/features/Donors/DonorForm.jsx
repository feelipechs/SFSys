import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDonorMutations } from '@/hooks/mutations/useDonorMutations';

const INITIAL_TYPE = 'individual';

export function DonorForm({ donor, formId, onClose }) {
  const { create, update, isPending } = useDonorMutations();

  const isUpdateMode = !!donor;

  const form = useForm({
    defaultValues: donor
      ? {
          // campos base (Donor) - comum a PF/PJ
          type: donor.type || INITIAL_TYPE,
          name: donor.name || '',
          phone: donor.phone || '',
          email: donor.email || '',

          // campos PF (individual)
          cpf: donor.individual ? donor.individual.cpf : '',
          dateOfBirth: donor.individual
            ? donor.individual.dateOfBirth
              ? donor.individual.dateOfBirth.substring(0, 10)
              : ''
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

  const { register, handleSubmit, watch, formState, setValue } = form;
  const { errors } = formState;

  const currentType = watch('type');
  const isIndividual = currentType === 'individual';
  const isLegal = currentType === 'legal';

  const onSubmit = (data) => {
    // payload base (comum a PF e PJ)
    const basePayload = {
      type: data.type,
      name: data.name,
      phone: data.phone,
      email: data.email,
      // o campo 'name' no payload é exatamente o que está no input 'name'
    };

    let specificData = {};

    if (isIndividual) {
      // payload PF - mapeamento direto
      specificData = {
        individual: {
          cpf: data.cpf,
          dateOfBirth: data.dateOfBirth,
        },
      };
    } else if (isLegal) {
      // payload PJ - mapeamento direto
      specificData = {
        legal: {
          cnpj: data.cnpj,
          tradeName: data.tradeName,
          companyName: data.companyName,
        },
      };
    }

    // combina e envia (gera o formato exato)
    const payload = {
      ...basePayload,
      ...specificData,
    };

    // mutação
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

  const isFormLoading = isPending;

  const handleTypeChange = (value) => {
    if (isUpdateMode) return;
    setValue('type', value, { shouldValidate: true });
  };

  return (
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
        {/* nome (campo 'name' do modelo base) */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">{isIndividual ? 'Nome' : 'Nome'}</Label>
          <Input
            id="name"
            placeholder={
              isIndividual ? 'Nome Completo' : 'Ex: Empresa Lorem Ipsum'
            }
            {...register('name', { required: 'O Nome é obrigatório.' })}
            disabled={isFormLoading}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* email (comum) */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="contato@exemplo.com"
            {...register('email', {
              required: 'O E-mail é obrigatório.',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Formato de e-mail inválido.', // tirar essa validação e usar do utils.js
              },
            })}
            disabled={isFormLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* telefone (comum) */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="phone">Telefone (Opcional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(99) 99999-9999"
            {...register('phone')}
            disabled={isFormLoading}
          />
        </div>
      </div>

      {/* dados pessoas fisíca (PF) */}
      {isIndividual && (
        <React.Fragment>
          <h3 className="text-lg font-semibold mt-2">Documentação PF</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                {...register('cpf', { required: 'O CPF é obrigatório.' })}
                disabled={isFormLoading}
              />
              {errors.cpf && (
                <p className="text-red-500 text-sm">{errors.cpf.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth', {
                  required: 'A Data de Nascimento é obrigatória.',
                })}
                disabled={isFormLoading}
              />
            </div>
          </div>
        </React.Fragment>
      )}

      {/* dados pessoa jurídica (PJ) */}
      {isLegal && (
        <React.Fragment>
          <h3 className="text-lg font-semibold mt-2">Detalhes da Empresa</h3>
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  {...register('cnpj', { required: 'O CNPJ é obrigatório.' })}
                  disabled={isFormLoading}
                />
                {errors.cnpj && (
                  <p className="text-red-500 text-sm">{errors.cnpj.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="tradeName">Razão Social</Label>
                <Input
                  id="tradeName"
                  placeholder="Ex: LoremIpsum"
                  {...register('tradeName', {
                    required: 'A Razão Social é obrigatória.',
                  })}
                  disabled={isFormLoading}
                />
                {errors.tradeName && (
                  <p className="text-red-500 text-sm">
                    {errors.tradeName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="companyName">Nome Fantasia (Opcional)</Label>
                <Input
                  id="companyName"
                  placeholder="Nome Fantasia"
                  {...register('companyName', {
                    required: false,
                  })}
                  disabled={isFormLoading}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </form>
  );
}
