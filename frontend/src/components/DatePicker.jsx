'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DatePicker({ value, onChange, disabled, className, ...props }) {
  const [open, setOpen] = React.useState(false);

  // A validação para o Calendar deve ser undefined para null/undefined
  const dateValue = value instanceof Date ? value : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal h-10', // Ajuste de estilo
            !value && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {/* Formata o valor se houver, ou mostra o placeholder */}
          {value ? (
            <span className="ml-2">{format(value, 'P', { locale: ptBR })}</span>
          ) : (
            // ✅ AQUI ESTÁ O NOVO PLACEHOLDER
            <span className="ml-2 text-muted-foreground/80 italic">
              dd/mm/aaaa
            </span>
          )}
          <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={(selectedDate) => {
            // Chama o onChange do RHF com o objeto Date ou undefined
            onChange(selectedDate);
            setOpen(false); // Fecha o popover após a seleção
          }}
          captionLayout="dropdown" // Mantém os dropdowns para ano e mês
          initialFocus
          locale={ptBR}
          disabled={disabled}
          startMonth={new Date()}
          endMonth={new Date(2050, 11)}
        />
      </PopoverContent>
    </Popover>
  );
}
