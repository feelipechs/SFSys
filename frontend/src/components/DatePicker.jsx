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

// aceita as props do RHF: value (Date | string | undefined), onChange, onBlur
export function DatePicker({ value, onChange, disabled, className, ...props }) {
  const [open, setOpen] = React.useState(false);

  // verifica se é uma instância de Date E se é válido
  const dateToDisplay = value instanceof Date && !isNaN(value) ? value : null; // usa null quando o valor é inválido (Invalid Date) ou não existe

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal h-10',
            !dateToDisplay && 'text-muted-foreground', // usa dateToDisplay para determinar a classe
            className
          )}
          disabled={disabled}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {/* a formatação só ocorre se houver uma data válida */}
          {dateToDisplay ? (
            <span className="ml-2">
              {format(dateToDisplay, 'P', { locale: ptBR })}
            </span>
          ) : (
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
          selected={dateToDisplay}
          onSelect={(selectedDate) => {
            // chama o onChange do RHF com o objeto Date ou undefined/null
            // se o RHF espera null para desmarcar, usar 'selectedDate || null'
            onChange(selectedDate);
            setOpen(false); // fecha o popover após a seleção
          }}
          captionLayout="dropdown"
          initialFocus
          locale={ptBR}
          disabled={disabled}
          // desativa todas as datas APÓS o dia de hoje (acho que é desnecessario, confirmar depois)
          toDate={new Date()}
          // permite pular para anos passados de forma fácil
          fromYear={1900}
          toYear={new Date().getFullYear()}
        />
      </PopoverContent>
    </Popover>
  );
}

// aceita as props do RHF: value (Date | string | undefined), onChange, onBlur
export function DatePickerExpiry({
  value,
  onChange,
  disabled,
  className,
  ...props
}) {
  const [open, setOpen] = React.useState(false);
  const dateValue = value instanceof Date ? value : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal h-10',
            !value && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {/* formata o valor se houver, ou mostra o placeholder */}
          {value ? (
            <span className="ml-2">
              {format(dateValue, 'P', { locale: ptBR })}
            </span>
          ) : (
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
            // chama o onChange do RHF com o objeto Date ou undefined
            onChange(selectedDate);
            setOpen(false); // fecha o popover após a seleção
          }}
          captionLayout="dropdown"
          initialFocus
          locale={ptBR}
          disabled={disabled}
          // desativa todas as datas ANTES do dia de hoje
          fromDate={new Date()}
          // permite pular para anos futuros de forma fácil
          toYear={new Date().getFullYear() + 20}
        />
      </PopoverContent>
    </Popover>
  );
}
