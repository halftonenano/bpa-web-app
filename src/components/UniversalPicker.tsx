'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, RefreshCcw, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import { pb } from '@/lib/pocketbase/client';
import { RecordModel } from 'pocketbase';
import toast from 'react-hot-toast';

export default function UniversalPicker({
  type,
  property,
  setSelectedId,
  filter,
  initialValue,
  className,
}: {
  type: 'courses' | 'quizzes' | 'assignments';
  property: string;
  setSelectedId: (id: string) => void;
  filter?: string;
  initialValue?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue || '');

  const [list, setList] = useState<RecordModel[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    pb.collection(type)
      .getFullList(filter ? { filter } : undefined)
      .then((data) => setList(data))
      .catch((e) => {
        toast.error(e.data.message);
      });
  }

  useEffect(() => {
    setSelectedId(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('justify-between', className)}
        >
          {value
            ? list.find((item) => item.id === value)
              ? list.find((item) => item.id === value)![property]
              : undefined
            : `Select from ${type}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('rounded-[0.5rem] p-0', className)}>
        <Command>
          <CommandInput placeholder={`Search ${type}`} />
          <CommandEmpty>No {type} found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              key={':clear'}
              value={':clear'}
              onSelect={() => {
                setValue('');
                setOpen(false);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </CommandItem>
            <CommandItem
              key={':refresh'}
              value={':refresh'}
              onSelect={() => {
                refresh();
              }}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            {list.map((item) => (
              <CommandItem
                key={item.id}
                value={item[property]}
                onSelect={(currentValue) => {
                  setValue(item.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === item.value ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {item[property]}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
