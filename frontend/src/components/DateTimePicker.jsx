'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  createDateObject,
  extractTime,
  combineDateTimeToISO,
} from '@/utils/dateTimeHandlers';

export function DateTimePicker({ value, onChange, disabled, onBlur }) {
  const [open, setOpen] = React.useState(false);

  // usando as funções para carregar o valor
  const dateObject = createDateObject(value);
  // garante que o estado de time seja inicializado, senão 'time' será null/undefined
  const [time, setTime] = React.useState(extractTime(value) || '00:00');

  // funções para combinar e notificar o Controller
  const handleCombinedChange = React.useCallback(
    (newDateObject, newTime) => {
      const newIsoString = combineDateTimeToISO(newDateObject, newTime);
      onChange(newIsoString); // RHF armazena a string ISO (ou string vazia)
      if (onBlur) onBlur();
    },
    [onChange, onBlur]
  );

  // handler para o calendário
  const handleDateSelect = (newDate) => {
    setOpen(false);
    if (newDate) {
      handleCombinedChange(newDate, time);
    } else {
      // se a data for desmarcada (se permitido)
      onChange('');
      if (onBlur) onBlur();
    }
  };

  // handler para o input de hora
  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime);

    if (dateObject) {
      handleCombinedChange(new Date(dateObject), newTime);
    }
    // se não houver data, apenas atualiza a hora (o que não deve acontecer se o campo de data for obrigatório, mas é seguro tratar)
  };

  // handler para marcar o campo como tocado ao sair do input de hora
  const handleTimeBlur = (e) => {
    // se o RHF precisa de um onBlur separado para o input de hora
    if (onBlur) onBlur(e);
  };

  return (
    <div className="flex gap-4">
      {/* data */}
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
              disabled={disabled}
              // onBlur={onBlur}
            >
              <span className="flex-1 overflow-hidden truncate text-left">
                {dateObject
                  ? dateObject.toLocaleDateString('pt-BR')
                  : 'Selecione a data'}
              </span>
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={dateObject}
              onSelect={handleDateSelect}
              disabled={disabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* hora */}
      <div className="flex flex-col gap-3">
        <Input
          type="time"
          id="time-picker"
          step="1"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          value={time}
          onChange={handleTimeChange}
          onBlur={handleTimeBlur}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
