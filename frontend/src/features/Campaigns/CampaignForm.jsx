import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCampaignMutations } from '@/hooks/mutations/useCampaignMutations';
import { Controller, useForm } from 'react-hook-form';
import { StatusSelect } from './StatusSelect';
import CampaignPeriod from '@/features/Campaigns/CampaignPeriod';

export function CampaignForm({ campaign, formId, onClose }) {
  const { create, update, isPending } = useCampaignMutations();

  const form = useForm({
    defaultValues: campaign
      ? campaign
      : { name: '', startDate: '', endDate: '', status: '' },
    mode: 'onBlur',
  });

  const onSubmit = (data) => {
    const mutationCallbacks = {
      onSuccess: () => {
        if (onClose) onClose();
        form.reset(campaign ? data : undefined);
      },
    };

    if (campaign && campaign.id) {
      // update
      const payload = { ...data };

      // chama o método .mutate (sem await)
      update.mutate({ id: campaign.id, ...payload }, mutationCallbacks);
    } else {
      // create

      // chama o método .mutate (sem await)
      create.mutate(data, mutationCallbacks);
    }
  };

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 p-4"
    >
      <div className="flex flex-col gap-3">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Nome da Campanha"
          {...form.register('name', {
            required: 'O nome da campanha é obrigatório.',
          })}
          disabled={isPending}
        />
        {/* feedback de erro */}
        {form.formState.errors.name && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="dateRange">Período da Campanha</Label>
        <Controller
          // startDate como o nome primário para forçar a validação principal
          name="startDate"
          control={form.control}
          rules={{ required: 'O período da campanha é obrigatório.' }}
          render={({ field, fieldState }) => (
            <CampaignPeriod
              // objeto contendo ambas as datas (valor atual)
              value={{
                startDate: form.watch('startDate'),
                endDate: form.watch('endDate'),
              }}
              // onChange recebe o payload { startDate, endDate } do CampaignPeriod
              onChange={(newValues) => {
                // atualiza ambos os campos no form
                form.setValue('startDate', newValues.startDate, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                form.setValue('endDate', newValues.endDate, {
                  shouldValidate: true,
                  shouldDirty: true,
                });

                // chama o onChange do Controller
                // field.onChange com a startDate, pois é o nome do campo principal
                field.onChange(newValues.startDate);
              }}
              disabled={isPending}
            />
          )}
        />
        {/* feedback de erro para startDate */}
        {form.formState.errors.startDate && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.startDate.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="status">Status</Label>
        <StatusSelect
          control={form.control}
          rules={{ required: 'O status é obrigatório' }}
          disabled={isPending}
        />
      </div>
    </form>
  );
}
