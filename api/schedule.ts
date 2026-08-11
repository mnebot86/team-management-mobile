import api from './axios';

export type ScheduleEventType = 'event' | 'game' | 'practice' | 'other';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | null;

export interface ScheduleRecurrenceInput {
  isRecurring: boolean;
  frequency: RecurrenceFrequency;
  daysOfWeek: number[];
  endDate: string | Date | null;
}

export interface CreateScheduleInput {
  teamId: string;
  title: string;
  description?: string;
  eventType: ScheduleEventType;
  opponentName?: string | null;
  isHomeGame?: boolean | null;
  startDate?: string | Date;
  startTime?: string | Date;
  endTime?: string | Date;
  locationName?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  recurrence: ScheduleRecurrenceInput;
}

export type ScheduleMutationScope = 'occurrence' | 'series';
export type UpdateScheduleInput = Partial<Omit<CreateScheduleInput, 'teamId'>> & {
  scope?: ScheduleMutationScope;
  occurrenceDate?: string;
};

export type ScheduleStatus = 'scheduled' | 'cancelled';

export interface ScheduleOccurrence {
  scheduleId: string;
  recurrenceGroupId?: string | null;
  recurrenceDate?: string;
  title: string;
  description?: string;
  type: ScheduleEventType;
  startDate: string;
  startTime?: string | null;
  endTime?: string | null;
  status: ScheduleStatus;
  cancellationReason?: string | null;
  location: {
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  recurrence: {
    isRecurring: boolean;
    frequency?: RecurrenceFrequency;
    daysOfWeek: number[];
    endDate?: string | null;
  };
}

export type CancellationScope = ScheduleMutationScope;

export interface CancelScheduleInput {
  scope?: CancellationScope;
  occurrenceDate?: string;
  reason?: string;
}

export const createSchedule = async (payload: CreateScheduleInput) => {
  const response = await api.post('/schedules', payload);

  return response.data.data;
};

export const updateSchedule = async (
  scheduleId: string,
  payload: UpdateScheduleInput,
) => {
  const response = await api.patch(`/schedules/${scheduleId}`, payload);

  return response.data.data;
};

export const cancelSchedule = async (
  scheduleId: string,
  payload: CancelScheduleInput = {},
) => {
  const response = await api.patch(`/schedules/${scheduleId}/cancel`, payload);

  return response.data.data;
};

export const deleteSchedule = async (
  scheduleId: string,
  scope: ScheduleMutationScope,
) => {
  const response = await api.delete(`/schedules/${scheduleId}`, {
    params: { scope },
  });

  return response.data.data;
};

export type SchedulePeriod = 'upcoming' | 'past';

export const getTeamSchedule = async (
  teamId: string,
  period: SchedulePeriod = 'upcoming',
) => {
  const response = await api.get(`schedules/team/${teamId}`, {
    params: { period },
  });

  return response.data.data;
};

export const getNextPractice = async (teamId: string) => {
  const response = await api.get(`schedules/team/${teamId}/next-practice`);

  return response.data.data;
};

export const getLastPractice = async (teamId: string) => {
  const response = await api.get(`schedules/team/${teamId}/last-practice`);

  return response.data.data;
};

export const getNextGame = async (teamId: string) => {
  const response = await api.get(`schedules/team/${teamId}/next-game`);

  return response.data.data;
};

export const updateAttendance = async (scheduleId: string, payload: any) => {
  const response = await api.patch(`/schedules/${scheduleId}/attendance`, payload);

  return response.data.data;
};

export const getPlayerAttendanceRecord = async (profileId: string) => {
  const response = await api.get(`/schedules/player/${profileId}/attendance`);

  return response.data.data;
};
