import { create } from 'zustand';

export type DateTimeField =
  | 'startDate'
  | 'startTime'
  | 'endTime'
  | 'recurrenceEndDate';

interface DateTimeStore {
  startDate?: Date;
  startTime?: Date;
  endTime?: Date;
  recurrenceEndDate?: Date;

  setField: (field: DateTimeField, value: Date) => void;
  reset: () => void;
}

export const useDateTimeStore = create<DateTimeStore>((set) => ({
  startDate: undefined,
  startTime: undefined,
  endTime: undefined,
  recurrenceEndDate: undefined,

  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),

  reset: () =>
    set({
      startDate: undefined,
      startTime: undefined,
      endTime: undefined,
      recurrenceEndDate: undefined,
    }),
}));
