'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@sunghoon-log/shared';
import gsap from 'gsap';
import { Text } from '../text';

/* ---------------------------------- Types --------------------------------- */

export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: Date;
  max?: Date;
  locale?: string;
  className?: string;
}

/* ---------------------------------- Utils --------------------------------- */

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDateDisabled(date: Date, min?: Date, max?: Date): boolean {
  if (min) {
    const minDay = new Date(min.getFullYear(), min.getMonth(), min.getDate());
    if (date < minDay) return true;
  }
  if (max) {
    const maxDay = new Date(max.getFullYear(), max.getMonth(), max.getDate());
    if (date > maxDay) return true;
  }
  return false;
}

function generateCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDay.getDay();

  const days: Date[] = [];

  // Pad start with previous month's days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  // Current month days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  // Pad end to complete 6 rows (42 cells)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

function getWeekdayNames(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const names: string[] = [];
  // Use a known Sunday (2024-01-07) as base
  for (let i = 0; i < 7; i++) {
    const date = new Date(2024, 0, 7 + i);
    names.push(formatter.format(date));
  }
  return names;
}

/* --------------------------------- Icons ---------------------------------- */

function CalendarIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        width={18}
        height={18}
        x={3}
        y={4}
        rx={2}
      />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* -------------------------------- Calendar -------------------------------- */

interface CalendarProps {
  selectedDate: Date | null;
  viewDate: Date;
  onSelect: (date: Date) => void;
  onViewDateChange: (date: Date) => void;
  min?: Date;
  max?: Date;
  locale: string;
}

function Calendar({
  selectedDate,
  viewDate,
  onSelect,
  onViewDateChange,
  min,
  max,
  locale,
}: CalendarProps) {
  const today = useMemo(() => new Date(), []);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const days = useMemo(() => generateCalendarDays(year, month), [year, month]);
  const weekdayNames = useMemo(() => getWeekdayNames(locale), [locale]);

  const monthYearLabel = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
    });
    return formatter.format(viewDate);
  }, [locale, viewDate]);

  const handlePrevMonth = () => {
    onViewDateChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onViewDateChange(new Date(year, month + 1, 1));
  };

  return (
    <div data-test-id="date-picker-calendar">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={handlePrevMonth}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            'hover:bg-muted transition-all duration-200',
            'text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40'
          )}
          aria-label="Previous month"
          data-test-id="date-picker-prev-month"
        >
          <ChevronLeftIcon />
        </button>
        <Text
          as="span"
          typography="label-sm-semibold"
          color="foreground"
        >
          {monthYearLabel}
        </Text>
        <button
          type="button"
          onClick={handleNextMonth}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            'hover:bg-muted transition-all duration-200',
            'text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40'
          )}
          aria-label="Next month"
          data-test-id="date-picker-next-month"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {weekdayNames.map((name) => (
          <div
            key={name}
            className="h-8 flex items-center justify-center"
          >
            <Text
              as="span"
              typography="text-xs-medium"
              color="muted"
            >
              {name}
            </Text>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === month;
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isToday = isSameDay(day, today);
          const disabled = isDateDisabled(day, min, max);

          return (
            <button
              key={`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}-${index}`}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  onSelect(day);
                }
              }}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
                isCurrentMonth ? 'cursor-pointer' : 'cursor-pointer',
                // Selected state
                isSelected && 'bg-primary text-primary-foreground',
                // Today (not selected)
                isToday && !isSelected && 'border border-border',
                // Normal hover (not selected)
                !isSelected && isCurrentMonth && 'text-foreground hover:bg-muted',
                // Other month days
                !isCurrentMonth && !isSelected && 'text-muted-foreground opacity-50 hover:bg-muted',
                // Disabled
                disabled && 'opacity-30 cursor-not-allowed hover:bg-transparent'
              )}
              aria-label={day.toLocaleDateString(locale)}
              aria-pressed={isSelected}
              aria-disabled={disabled}
              data-test-id="date-picker-day"
            >
              <Text
                as="span"
                typography="text-sm-regular"
                color="inherit"
              >
                {day.getDate()}
              </Text>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------- DatePicker ------------------------------- */

export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select a date',
  disabled = false,
  min,
  max,
  locale = 'ko-KR',
  className,
}: DatePickerProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue ?? null);
  const selectedDate = isControlled ? (value ?? null) : internalValue;

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => selectedDate ?? new Date());

  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSelect = useCallback(
    (date: Date) => {
      if (!isControlled) {
        setInternalValue(date);
      }
      onValueChange?.(date);
      setOpen(false);
    },
    [isControlled, onValueChange]
  );

  const handleToggle = useCallback(() => {
    if (disabled) return;
    if (!open) {
      // Reset view to selected date or today when opening
      setViewDate(selectedDate ?? new Date());
    }
    setOpen((prev) => !prev);
  }, [disabled, open, selectedDate]);

  // Mount when open becomes true
  useEffect(() => {
    if (open) {
      setMounted(true);
    }
  }, [open]);

  // Enter animation
  useEffect(() => {
    if (!open || !mounted) return;
    if (!calendarRef.current) return;

    gsap.fromTo(
      calendarRef.current,
      { opacity: 0, y: -4, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.15, ease: 'power2.out' }
    );
  }, [open, mounted]);

  // Exit animation
  useEffect(() => {
    if (open || !mounted) return;
    if (!calendarRef.current) return;

    gsap.to(calendarRef.current, {
      opacity: 0,
      y: -4,
      scale: 0.98,
      duration: 0.1,
      ease: 'power2.in',
      onComplete: () => {
        setMounted(false);
      },
    });
  }, [open, mounted]);

  // Close on click outside
  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mounted]);

  // Close on Escape
  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mounted]);

  const displayValue = selectedDate ? selectedDate.toLocaleDateString(locale) : '';

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      data-test-id="date-picker"
    >
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="dialog"
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          'flex w-full items-center justify-between',
          'bg-input-bg border border-transparent rounded-xl h-12 px-3',
          'transition-all duration-200',
          'hover:bg-input-bg-hover',
          'focus-visible:outline-none focus-visible:bg-input-bg-focus focus-visible:border-input-border-focus',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'cursor-pointer'
        )}
        data-test-id="date-picker-trigger"
      >
        {displayValue ? (
          <Text
            as="span"
            typography="text-sm-regular"
            color="foreground"
          >
            {displayValue}
          </Text>
        ) : (
          <Text
            as="span"
            typography="text-sm-regular"
            color="muted"
          >
            {placeholder}
          </Text>
        )}
        <span className="shrink-0 text-muted-foreground">
          <CalendarIcon />
        </span>
      </button>

      {/* Calendar popup */}
      {mounted && (
        <div
          ref={calendarRef}
          role="dialog"
          aria-label="Calendar"
          className={cn(
            'absolute left-0 z-50 mt-1 w-[300px]',
            'bg-background border border-border rounded-xl shadow-soft-lg p-4'
          )}
          style={{ opacity: 0 }}
          data-test-id="date-picker-popup"
        >
          <Calendar
            selectedDate={selectedDate}
            viewDate={viewDate}
            onSelect={handleSelect}
            onViewDateChange={setViewDate}
            min={min}
            max={max}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
