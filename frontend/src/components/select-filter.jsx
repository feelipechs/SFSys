import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SelectFilter() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Categoria" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categorias</SelectLabel>
          <SelectItem value="default">Todas</SelectItem>
          <SelectItem value="alimentos">Alimentos</SelectItem>
          <SelectItem value="roupas">Roupas</SelectItem>
          <SelectItem value="produtos">Produtos de Higiene</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
