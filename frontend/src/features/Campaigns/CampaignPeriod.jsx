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

export default function CampaignPeriod({ value, onChange, disabled }) {
  // estados para popover
  const [openFrom, setOpenFrom] = React.useState(false);
  const [openTo, setOpenTo] = React.useState(false);

  // estados derivados (usando as funções utilitárias)
  const dateFromObject = createDateObject(value.startDate);
  const dateToObject = createDateObject(value.endDate);

  const [timeFrom, setTimeFrom] = React.useState(extractTime(value.startDate));
  const [timeTo, setTimeTo] = React.useState(extractTime(value.endDate));

  // handler central (simplificado drasticamente)
  const handleCombinedDateTimeChange = React.useCallback(
    (type, dateObject, time) => {
      if (!dateObject) return;

      // chama a função utilitária para obter a string ISO final
      const newIsoString = combineDateTimeToISO(new Date(dateObject), time);

      let newValues;
      if (type === 'from') {
        newValues = { ...value, startDate: newIsoString };
      } else {
        newValues = { ...value, endDate: newIsoString };
      }

      // notifica o Controller do react-hook-form
      onChange(newValues);
    },
    [value, onChange]
  );

  // handler de data (onSelect do Calendar)
  const handleDateSelect = (type, newDate) => {
    // pega a hora atual do estado
    const time = type === 'from' ? timeFrom : timeTo;

    if (newDate) {
      handleCombinedDateTimeChange(type, newDate, time);
    }
    type === 'from' ? setOpenFrom(false) : setOpenTo(false);
  };

  // handler de hora (onChange do Input)
  const handleTimeChange = (type, e) => {
    const newTime = e.target.value;

    // atualiza o estado da hora
    const currentDateObject = type === 'from' ? dateFromObject : dateToObject;

    if (type === 'from') {
      setTimeFrom(newTime);
    } else {
      setTimeTo(newTime);
    }

    // se a data já foi selecionada, combina e notifica
    if (currentDateObject) {
      handleCombinedDateTimeChange(type, currentDateObject, newTime);
    }
  };

  return (
    <div className="flex w-full max-w-64 min-w-0 flex-col gap-6">
      {/* data inicial */}
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-3">
          <Label htmlFor="date-from" className="px-1">
            Data Inicial
          </Label>
          <Popover open={openFrom} onOpenChange={setOpenFrom}>
            <PopoverTrigger asChild disabled={disabled}>
              <Button
                variant="outline"
                id="date-from"
                className="w-full justify-between font-normal"
                disabled={disabled}
              >
                {dateFromObject
                  ? dateFromObject.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Selecione ...'}
                <ChevronDownIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateFromObject}
                captionLayout="dropdown"
                onSelect={(date) => {
                  handleDateSelect('from', date);
                }}
                disabled={disabled}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* hora inicial */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="time-from" className="invisible px-1">
            De
          </Label>
          <Input
            type="time"
            id="time-from"
            step="1"
            value={timeFrom}
            onChange={(e) => handleTimeChange('from', e)}
            disabled={disabled}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </div>

      {/* data final */}
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-3">
          <Label htmlFor="date-to" className="px-1">
            Data Final
          </Label>
          <Popover open={openTo} onOpenChange={setOpenTo}>
            <PopoverTrigger asChild disabled={disabled}>
              <Button
                variant="outline"
                id="date-to"
                className="w-full justify-between font-normal"
                disabled={disabled}
              >
                {dateToObject
                  ? dateToObject.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Selecione ...'}
                <ChevronDownIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateToObject}
                captionLayout="dropdown"
                onSelect={(date) => {
                  handleDateSelect('to', date);
                }}
                // desabilita datas antes da Data Inicial
                disabled={
                  (dateFromObject && { before: dateFromObject }) || disabled
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* hora final */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="time-to" className="invisible px-1">
            Para
          </Label>
          <Input
            type="time"
            id="time-to"
            step="1"
            value={timeTo}
            onChange={(e) => handleTimeChange('to', e)}
            disabled={disabled}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </div>
    </div>
  );
}
