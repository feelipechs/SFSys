import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RelationInput } from './RelationInput';
import { DatePicker } from './DatePicker';

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
  const defaultNewItem = { [idFieldName]: '', quantity: 1, validity: '' };

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
        const rawSelectedId = currentItemValue
          ? currentItemValue[idFieldName]
          : field[idFieldName];

        // se o valor é 0, nulo ou string vazia, não há produto selecionado
        if (!rawSelectedId) {
          // se não houver ID, o unitOfMeasure será '-' e a busca será ignorada
          const unitOfMeasure = '-';
        }

        // garante que o id é um número (continua importante)
        const selectedId = Number(rawSelectedId);

        // faz a busca na lista de produtos usando o id selecionado
        const selectedProduct = productsData
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
              <RelationInput
                name={`${name}.${index}.${idFieldName}`}
                control={control}
                options={itemOptions}
                placeholder={`Selecione o ${itemLabel}`}
                rules={{ required: `${itemLabel} é obrigatório` }}
                disabled={isPending}
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

            {/* validade (útil para itens alimentícios ou medicamentos) */}
            {/* <div className="w-32">
              <label className="text-sm font-medium leading-none">
                Validade
              </label>
              <Input
                type="date"
                {...control.register(`${name}.${index}.validity`)}
                disabled={isPending}
              />
            </div> */}
            <div className="w-44">
              <label className="text-sm font-medium leading-none">
                Validade (Opcional)
              </label>
              <Controller
                control={control}
                name={`${name}.${index}.validity`}
                render={({ field }) => (
                  <DatePicker
                    // O DatePicker deve aceitar um objeto Date e retornar a string YYYY-MM-DD ou o objeto Date
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    disabled={isPending}
                  />
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
