import dayjs, { Dayjs } from "dayjs";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getMonth } from "./getTime";

interface ViewStoreType {
  selectedView: string;
  setView: (value: string) => void;
}

interface DateStoreType {
  userSelectedDate: Dayjs;
  setDate: (value: Dayjs) => void;
  twoDMonthArray: dayjs.Dayjs[][];
  selectedMonthIndex: number;
  setMonth: (index: number) => void;
}
export type CalendarEventType = {
  id: string;
  title: string;
  date: dayjs.Dayjs;
  description: string;
  goal: string; // Optional link to a goal
};

export type GoalType = {
  id: string;
  title: string;
  completed: boolean;
  color: string;
};

export type TaskType = {
  id: string;
  goal: string; // Links to a goal
  title: string;
  date: dayjs.Dayjs;
  completed: boolean;
};
type GoalTaskStore = {
  goal: GoalType[];
  tasks: TaskType[];
  calendars: CalendarItem[];
  selectedGoal: string | null;
  addGoal: (goal: Omit<GoalType, 'id'>) => void;
  toggleGoal: (id: string) => void;
  addTask: (task: Omit<TaskType, 'id'>) => void;
  toggleTask: (id: string) => void;
  selectGoal: (id: string | null) => void;
  toggleCalendar: (id: string) => void;
};

type EventStore = {
  events: CalendarEventType[];
  isPopoverOpen: boolean;
  isEventSummaryOpen: boolean;
  selectedEvent: CalendarEventType | null;
  setEvents: (events: CalendarEventType[]) => void;
  openPopover: () => void;
  closePopover: () => void;
  openEventSummary: (event: CalendarEventType) => void;
  closeEventSummary: () => void;
  updateEventDate: (id: string, newDate: Date) => void; // New method
};

export type CalendarItem = {
  id: string;
  title: string;
  color: string;
  visible: boolean;
};

interface ToggleSideBarType {
  isSideBarOpen: boolean;
  setSideBarOpen: () => void;
}

export const useViewStore = create<ViewStoreType>()(
  devtools(
    persist(
      (set) => ({
        selectedView: "month",
        setView: (value: string) => {
          set({ selectedView: value });
        },
      }),
      { name: "calendar_view", skipHydration: true },
    ),
  ),
);

export const useDateStore = create<DateStoreType>()(
  devtools(
    persist(
      (set) => ({
        userSelectedDate: dayjs(),
        twoDMonthArray: getMonth(),
        selectedMonthIndex: dayjs().month(),
        setDate: (value: Dayjs) => {
          set({ userSelectedDate: value });
        },
        setMonth: (index) => {
          set({ twoDMonthArray: getMonth(index), selectedMonthIndex: index });
        },
      }),
      { name: "date_data", skipHydration: true },
    ),
  ),
);
export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  isPopoverOpen: false,
  isEventSummaryOpen: false,
  selectedEvent: null,
  setEvents: (events) => set({ events }),
  openPopover: () => set({ isPopoverOpen: true }),
  closePopover: () => set({ isPopoverOpen: false }),
  openEventSummary: (event) =>
    set({ isEventSummaryOpen: true, selectedEvent: event }),
  closeEventSummary: () =>
    set({ isEventSummaryOpen: false, selectedEvent: null }),
  updateEventDate: (id, newDate) => {
    const { events } = get();
    set({
      events: events.map(event => 
        event.id === id 
          ? { ...event, date: dayjs(newDate) } 
          : event
      )
    });
  }
}));

export const useToggleSideBarStore = create<ToggleSideBarType>()(
  (set, get) => ({
    isSideBarOpen: true,
    setSideBarOpen: () => {
      set({ isSideBarOpen: !get().isSideBarOpen });
    },
  }),
);


  export const useGoalTaskStore = create<GoalTaskStore>()(
    devtools(
      persist(
        (set) => ({
          goal: [
            { id: 'goal1', title: 'Exercise', completed: false, color: 'bg-blue-500' },
            { id: 'goal2', title: 'Work', completed: false, color: 'bg-green-500' },
            { id: 'goal3', title: 'Eat', completed: false, color: 'bg-blue-500' },
            { id: 'goal4', title: 'Relax', completed: false, color: 'bg-green-500' },
            { id: 'goal5', title: 'Family', completed: false, color: 'bg-blue-500' },
            { id: 'goal6', title: 'Friends', completed: false, color: 'bg-green-500' },
          ],
          tasks: [
            { id: 'task1', goal: 'goal1', title: 'Complete React course', date: dayjs(), completed: false },
            { id: 'task2', goal: 'goal2', title: 'Gym session', date: dayjs(), completed: false },
          ],
          calendars: [
            { id: "cal1", title: "Work", color: "bg-rose-500", visible: true },
            { id: "cal2", title: "Personal", color: "bg-fuchsia-500", visible: true },
            { id: "cal3", title: "Fitness", color: "bg-pink-400", visible: true },
          ],
          selectedGoal: null,
          addGoal: (goal) => set((state) => ({ 
            goal: [...state.goal, { ...goal, id: `goal${state.goal.length + 1}` }] 
          })),
          toggleGoal: (id) => set((state) => ({
            goal: state.goal.map(g => 
              g.id === id ? { ...g, completed: !g.completed } : g
            )
          })),
          addTask: (task) => set((state) => ({ 
            tasks: [...state.tasks, { ...task, id: `task${state.tasks.length + 1}` }] 
          })),
          toggleTask: (id) => set((state) => ({
            tasks: state.tasks.map(t => 
              t.id === id ? { ...t, completed: !t.completed } : t
            )
          })),
          selectGoal: (id) => set({ selectedGoal: id }),
          toggleCalendar: (id) => set((state) => ({
            calendars: state.calendars.map(cal => 
              cal.id === id ? { ...cal, visible: !cal.visible } : cal
            )
          })),
        }),
        { 
          name: "goal_task_store",
          skipHydration: true 
        }
      )
    )
  );