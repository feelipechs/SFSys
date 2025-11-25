import { Input } from '@/components/ui/input';
import { useProductMutations } from '@/hooks/mutations/useProductMutations';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CategorySelect } from './CategorySelect';

export function ProductForm({ product, formId, onClose }) {
  const { create, update, isPending } = useProductMutations();

  const form = useForm({
    defaultValues: product
      ? {
          name: product.name || '',
          unitOfMeasurement: product.unitOfMeasurement || '',
          category: product.category || '',
        }
      : { name: '', unitOfMeasurement: '', category: '' },
    mode: 'onBlur',
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data) => {
    const payload = { ...data };

    const mutationCallbacks = {
      onSuccess: () => {
        if (onClose) onClose();
        form.reset(product ? data : undefined);
      },
    };

    if (product && product.id) {
      update.mutate({ id: product.id, ...payload }, mutationCallbacks);
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
          rules={{ required: 'O nome do produto é obrigatório.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome do Produto"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* unidade de medida */}
        <FormField
          name="unitOfMeasurement"
          control={control}
          rules={{ required: 'A unidade de medida é obrigatória.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade de Medida</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="kg, l, un"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* categoria */}
        <FormField
          name="category"
          control={control}
          rules={{ required: 'A categoria é obrigatória' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <CategorySelect {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
