'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

export function DateTime({ value, onChange, disabled }) {
  const [open, setOpen] = React.useState(false);

  // usando as funções para carregar o valor
  const dateObject = createDateObject(value);
  const [time, setTime] = React.useState(extractTime(value));

  // funções para combinar e notificar o Controller
  const handleCombinedChange = React.useCallback(
    (newDateObject, newTime) => {
      // chama a função utilitária e passa o resultado para o Controller
      const newIsoString = combineDateTimeToISO(newDateObject, newTime);
      if (newIsoString) {
        onChange(newIsoString);
      }
    },
    [onChange]
  );

  // handler para o calendário
  const handleDateSelect = (newDate) => {
    setOpen(false);
    if (newDate) {
      // usa a data nova e a hora atual (time)
      handleCombinedChange(newDate, time);
    }
  };

  // handler para o input de hora
  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime); // atualiza o estado visual da hora

    // usa a data atual (dateObject) e a nova hora
    if (dateObject) {
      // cópia para garantir que o objeto Date não seja alterado antes da combinação
      handleCombinedChange(new Date(dateObject), newTime);
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Data
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
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
              // selected={date}
              captionLayout="dropdown"
              selected={dateObject}
              onSelect={handleDateSelect}
              // onSelect={(date) => {
              //   setDate(date);
              //   setOpen(false);
              // }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Hora
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          value={time} // usa o estado 'time'
          onChange={handleTimeChange}
        />
      </div>
    </div>
  );
}
