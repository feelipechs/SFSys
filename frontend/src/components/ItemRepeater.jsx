import { useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RelationInput } from './RelationInput';

export function ItemRepeater({
  control,
  name,
  itemOptions, // lista de opções (produtos etc.)
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

  return (
    <div className="flex flex-col gap-4 border p-4 rounded-lg">
      <h3 className="text-lg font-semibold">{itemLabel}s da Transação</h3>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4 items-end">
          {/* seleção do item (produto/material) */}
          <div className="flex-1">
            <label className="text-sm font-medium leading-none">
              {itemLabel}
            </label>
            <RelationInput
              // nome do campo para o ID: [name].[index].itemId
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
              // nome do campo para a Quantidade: [name].[index].quantity
              {...control.register(`${name}.${index}.quantity`, {
                valueAsNumber: true,
                required: 'Qtd. é obrigatória',
                min: { value: 1, message: 'Mínimo 1' },
              })}
              disabled={isPending}
              placeholder="1"
            />
          </div>

          {/* validade (útil para itens alimentícios ou medicamentos) */}
          <div className="w-32">
            <label className="text-sm font-medium leading-none">Validade</label>
            <Input
              type="date"
              // nome do campo para a Validade: [name].[index].validity
              {...control.register(`${name}.${index}.validity`)}
              disabled={isPending}
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
      ))}

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
