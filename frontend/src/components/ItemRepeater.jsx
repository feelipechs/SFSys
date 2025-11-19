import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RelationInput } from './RelationInput';
import { DatePickerExpiry } from './DatePicker';

export function ItemRepeater({
  control,
  name,
  itemOptions, // lista de opções (produtos etc.)
  productsData,
  itemLabel = 'Item', // rótulo genérico (produto, material etc.)
  idFieldName = 'itemId',
  isPending,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name, // array no useForm (ex: 'products' ou 'materials')
  });

  // valor inicial de um novo item
  // usa null para o ID, que representa "nada selecionado"
  const defaultNewItem = { [idFieldName]: null, quantity: 1, validity: null };

  const watchedItems = useWatch({
    control,
    name: name, // ex: 'items'
    defaultValue: fields, // fallback para o array inicial
  });

  return (
    <div className="flex flex-col gap-4 border p-4 rounded-lg">
      <h3 className="text-lg font-semibold">{itemLabel}s da Transação</h3>

      {fields.map((field, index) => {
        const currentItemValue = watchedItems?.[index];

        // se o valor inicial é null, ele é tratado corretamente
        const rawSelectedId = currentItemValue
          ? currentItemValue[idFieldName]
          : field[idFieldName];

        // tratar rawSelectedId como 0, null, ou undefined como "nada"
        const selectedId = Number(rawSelectedId) || 0;

        // faz a busca na lista de produtos usando o id selecionado
        const selectedProduct =
          selectedId > 0 && productsData
            ? productsData.find((p) => p.id === selectedId)
            : null;

        // acessa a propriedade corretamente
        const unitOfMeasure = selectedProduct?.unitOfMeasurement || '-';
        // fim

        return (
          <div key={field.id} className="flex gap-4 items-end">
            {/* seleção do item (produto/material) */}
            <div className="flex-1">
              <label className="text-sm font-medium leading-none">
                {itemLabel}
              </label>

              <Controller
                control={control}
                name={`${name}.${index}.${idFieldName}`}
                rules={{
                  required: `${itemLabel} é obrigatório`,
                  // validação extra para garantir que o valor não seja 'none'
                  validate: (value) =>
                    (value !== null && value !== 0) ||
                    `${itemLabel} é obrigatório`,
                }}
                render={({ field }) => (
                  <RelationInput
                    {...field} // passa value, onChange, onBlur
                    options={itemOptions}
                    placeholder={`Selecione o ${itemLabel}`}
                    disabled={isPending}
                  />
                )}
              />
            </div>

            {/* quantidade */}
            <div className="w-24">
              <label className="text-sm font-medium leading-none">Qtd.</label>
              <Input
                type="number"
                {...control.register(`${name}.${index}.quantity`, {
                  valueAsNumber: true,
                  required: 'Qtd. é obrigatória',
                  min: { value: 1, message: 'Mínimo 1' },
                })}
                disabled={isPending}
                placeholder="1"
              />
            </div>

            {/* campo de exibição da unidade de medida */}
            <div className="w-16 flex flex-col justify-end">
              <label className="text-sm font-medium leading-none">Unid.</label>
              {/* usa um <p> estilizado para se alinhar com o Input */}
              <p className="py-2 text-center font-semibold border-b border-input capitalize">
                {unitOfMeasure}
              </p>
            </div>

            {/* validade (Opcional) */}
            <div className="w-44">
              <label className="text-sm font-medium leading-none">
                Validade (Opcional)
              </label>
              <Controller
                control={control}
                name={`${name}.${index}.validity`}
                defaultValue={field.validity}
                render={({ field }) => (
                  <DatePickerExpiry {...field} disabled={isPending} />
                )}
              />
            </div>

            {/* botões de remover */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              disabled={isPending}
              title={`Remover ${itemLabel}`}
            >
              <MinusCircle className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        );
      })}

      {/* botões de adicionar */}
      <Button
        type="button"
        variant="outline"
        className="w-full mt-2"
        onClick={() => append(defaultNewItem)}
        disabled={isPending}
      >
        <PlusCircle className="h-4 w-4 mr-2" /> Adicionar {itemLabel}
      </Button>
    </div>
  );
}
