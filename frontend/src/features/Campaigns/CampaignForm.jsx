import { Input } from '@/components/ui/input';
import { useCampaignMutations } from '@/hooks/mutations/useCampaignMutations';
import { useForm } from 'react-hook-form';
import { StatusSelect } from './StatusSelect';
import CampaignPeriod from '@/features/Campaigns/CampaignPeriod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function CampaignForm({ campaign, formId, onClose }) {
  const { create, update, isPending } = useCampaignMutations();

  const form = useForm({
    defaultValues: campaign
      ? {
          // garante que as datas sejam strings se vierem do backend como tal, ou ajusta se o CampaignPeriod exigir objetos Date
          name: campaign.name || '',
          startDate: campaign.startDate || '',
          endDate: campaign.endDate || '',
          status: campaign.status || '',
        }
      : { name: '', startDate: '', endDate: '', status: '' },
    mode: 'onBlur',
  });

  const { control, handleSubmit, watch, setValue } = form;

  const onSubmit = (data) => {
    // se o CampaignPeriod usa objetos Date internamente, a conversão para string ISO deve ser feita aqui se o backend esperar string (necessário testar)

    const payload = { ...data };

    const mutationCallbacks = {
      onSuccess: () => {
        if (onClose) onClose();
        form.reset(campaign ? data : undefined);
      },
    };

    if (campaign && campaign.id) {
      update.mutate({ id: campaign.id, ...payload }, mutationCallbacks);
    } else {
      create.mutate(payload, mutationCallbacks);
    }
  };

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-4"
      >
        {/* nome */}
        <FormField
          name="name"
          control={control}
          rules={{ required: 'O nome da campanha é obrigatório.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome da Campanha"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* período da campanha */}
        <FormField
          // startDate como o nome primário para forçar a validação principal e o 'touched'
          name="startDate"
          control={control}
          rules={{ required: 'O período da campanha é obrigatório.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Período da Campanha</FormLabel>
              <FormControl>
                {/* CampaignPeriod não usa {...field} diretamente pois lida com 2 campos */}
                <CampaignPeriod
                  // objeto contendo ambas as datas (valor atual)
                  value={{
                    startDate: watch('startDate'),
                    endDate: watch('endDate'),
                  }}
                  // onChange recebe o payload { startDate, endDate } do CampaignPeriod
                  onChange={(newValues) => {
                    // atualiza ambos os campos no RHF usando setValue
                    setValue('startDate', newValues.startDate, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setValue('endDate', newValues.endDate, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });

                    // chama o onChange do Controller apenas no campo primário (startDate), para garantir que o RHF marque este FormField como modificado/validado
                    field.onChange(newValues.startDate);
                  }}
                  disabled={isPending}
                />
              </FormControl>
              {/* FormMessage para o erro da startDate */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* status */}
        <FormField
          name="status"
          control={control}
          rules={{ required: 'O status é obrigatório' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <StatusSelect {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
