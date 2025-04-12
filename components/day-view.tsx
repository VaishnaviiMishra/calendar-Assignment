import { useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { getHours, isCurrentDay } from "@/lib/getTime";
import { EventRenderer } from "./event-renderer";


export default function DayView() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { openPopover, events } = useEventStore();
  const { userSelectedDate, setDate } = useDateStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const isToday =
    userSelectedDate.format("DD-MM-YY") === dayjs().format("DD-MM-YY");

    return (
      <div className="rounded-xl border border-rose-100 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[auto_auto_1fr] items-center bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3">
          
          <div className="flex w-16 flex-col items-center">
            <div className={cn("text-xs font-medium", isToday ? "text-rose-600" : "text-rose-800")}>
              {userSelectedDate.format("ddd")}
            </div>
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-2xl transition-all",
                isToday 
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-200" 
                  : "text-rose-900 hover:bg-rose-100"
              )}
            >
              {userSelectedDate.format("DD")}
            </div>
          </div>
          <div className="pl-4 text-lg font-medium text-rose-900">
            {userSelectedDate.format("MMMM YYYY")}
          </div>
        </div>
    
        {/* Time Grid */}
        <ScrollArea className="h-[70vh]">
          <div className="grid grid-cols-[auto_1fr] p-4">
            {/* Time Column */}
            <div className="w-16 border-r border-rose-100">
              {getHours.map((hour, index) => (
                <div key={index} className="relative h-16">
                  <div className="absolute -top-2 right-1 text-xs text-rose-500 font-medium">
                    {hour.format("h A")}
                  </div>
                </div>
              ))}
            </div>
    
            {/* Day Time Slots */}
            <div className="relative">
              {getHours.map((hour, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative flex h-16 cursor-pointer flex-col items-center gap-y-2 border-b border-rose-50",
                    "transition-all hover:bg-rose-50/50 hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)]"
                  )}
                  onClick={() => {
                    setDate(userSelectedDate.hour(hour.hour()));
                    openPopover();
                  }}
                >
                  <EventRenderer
                    events={events}
                    date={userSelectedDate.hour(hour.hour())}
                    view="day"
                  />
                </div>
              ))}
    
              {/* Current time indicator */}
              {isCurrentDay(userSelectedDate) && (
                <div
                  className="absolute left-0 right-0 h-1 bg-rose-500 z-10"
                  style={{
                    top: `calc(${(currentTime.hour() + currentTime.minute()/60) / 24 * 100}%)`,
                  }}
                >
                  <div className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-rose-500"></div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
}
