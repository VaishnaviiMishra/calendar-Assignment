import { useDateStore, useEventStore, useGoalTaskStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React from "react";
import { EventRenderer } from "./event-renderer";

export default function MonthViewBox({
  day,
  rowIndex,
}: {
  day: dayjs.Dayjs | null;
  rowIndex: number;
}) {
  const { openPopover, events } = useEventStore();
  const { setDate } = useDateStore();
  const { selectedGoal, goal } = useGoalTaskStore();

  if (!day) {
    return (
      <div className="h-32 w-full border border-gray-200 bg-gray-50/20 md:h-36 lg:h-full"></div>
    );
  }

  const filteredEvents = events.filter(event => {
    // First filter by date
    const dateMatch = dayjs(event.date).isSame(day, 'day');
    
    // Then filter by goal if one is selected
    return selectedGoal 
      ? dateMatch && event.goal === selectedGoal
      : dateMatch;
  });

  const isFirstDayOfMonth = day.date() === 1;
  const isToday = day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");
  const hasEvents = filteredEvents.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDate(day);
    openPopover();
  };

  return (
    <div
      className={cn(
        "group relative flex h-32 flex-col border border-pink-200 p-2",
        "transition-all duration-200 ease-in-out hover:bg-pink-50/60 hover:shadow-xs md:h-36 lg:h-full",
        "rounded-lg overflow-hidden",
        hasEvents && "bg-pink-50/30 border-pink-300",
        isToday && "border-2 border-pink-500 shadow-md"
      )}
      onClick={handleClick}
    >
      {/* Day header */}
      <div className="flex items-center justify-between px-1">
        {rowIndex === 0 && (
          <span className="text-xs font-medium text-blue-700">
            {day.format("ddd")}
          </span>
        )}
        <span
          className={cn(
            "ml-auto flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors",
            isToday && "bg-pink-500 font-medium text-white shadow-sm",
            !isToday && "text-pink-800 hover:bg-pink-100"
          )}
        >
          {isFirstDayOfMonth ? day.format("MMM D") : day.format("D")}
        </span>
      </div>
  
      {/* Events container */}
      <div className="mt-1.5 flex-1 space-y-1 overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
        <EventRenderer 
          date={day} 
          view="month" 
          events={filteredEvents}
        />
      </div>
  
      {/* Current day indicator */}
      {isToday && (
        <div className="absolute right-2 top-2 h-1 w-1 rounded-full bg-pink-100"></div>
      )}
  
      {/* Goal indicator badge */}
      {selectedGoal && (
        <div className="absolute bottom-1 left-1">
          <span className="inline-flex items-center rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-800">
            {goal.find(g => g.id === selectedGoal)?.title}
          </span>
        </div>
      )}
    </div>
  );
}