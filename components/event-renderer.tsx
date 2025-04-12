"use client";

import { useDrag, useDrop } from 'react-dnd';
import { CalendarEventType, useEventStore, useGoalTaskStore } from "@/lib/store";
import dayjs from "dayjs";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

type EventRendererProps = {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
};

type DraggableEventItem = {
  event: CalendarEventType;
  originalDate: dayjs.Dayjs;
};

export function EventRenderer({ date, view, events }: EventRendererProps) {
  const { openEventSummary, updateEventDate } = useEventStore();
  const { selectedGoal } = useGoalTaskStore();
  const dropRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'calendar-event',
    drop: (item: DraggableEventItem) => {
      if (!dayjs(item.originalDate).isSame(date, 'day')) {
        updateEventDate(item.event.id, date.toDate());
      }
    },
  });

  drop(dropRef);

  const filteredEvents = events.filter((event) => {
    // Filter by view type first
    const matchesView = view === "month" 
      ? dayjs(event.date).isSame(date, 'day')
      : dayjs(event.date).isSame(date, 'hour');
    
    // Then filter by selected goal if one is selected
    return selectedGoal
      ? matchesView && event.goal === selectedGoal
      : matchesView;
  });

  return (
    <div ref={dropRef} className="h-full">
      {filteredEvents.map((event) => (
        <DraggableEvent 
          key={event.id} 
          event={event}
          originalDate={date}
          onClick={() => openEventSummary(event)}
        />
      ))}
    </div>
  );
}

function DraggableEvent({ 
  event, 
  originalDate,
  onClick 
}: { 
  event: CalendarEventType;
  originalDate: dayjs.Dayjs;
  onClick: () => void;
}) {
  const dragRef = useRef<HTMLDivElement>(null);
  const { goal } = useGoalTaskStore();
  const [, drag] = useDrag({
    type: 'calendar-event',
    item: { event, originalDate },
  });

  drag(dragRef);

  // Find the goal color if this event has a goal
  const goalColor = event.goal 
    ? goal.find(g => g.title === event.goal)?.color 
    : 'bg-pink-500'; // Default color

  return (
    <div
      ref={dragRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "line-clamp-1 w-full cursor-pointer rounded-md p-1.5 text-sm",
        "text-white shadow-sm hover:opacity-90",
        "transition-colors duration-200 ease-in-out",
        goalColor || 'bg-pink-500' // Fallback to pink if no goal color
      )}
    >
      {event.title}
    </div>
  );
}