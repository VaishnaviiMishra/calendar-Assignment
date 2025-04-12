import { getHours, getWeekDays } from "@/lib/getTime";
import { useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { EventRenderer } from "./event-renderer";


export default function WeekView() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { openPopover, events } = useEventStore();

  const { userSelectedDate, setDate } = useDateStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-lg border border-rose-200 bg-white shadow-sm">
      {/* Week Header */}
      <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center bg-rose-50 px-4 py-3 rounded-t-lg border-b border-rose-200">
       
  
        {/* Week Days Header */}
        {getWeekDays(userSelectedDate).map(({ currentDate, today }, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={cn("text-xs font-medium", today ? "text-blue-600" : "text-blue-800")}>
              {currentDate.format("ddd")}
            </div>
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full p-2 text-2xl transition-colors",
                today ? "bg-rose-500 text-white shadow-md" : "text-rose-900 hover:bg-rose-100"
              )}
            >
              {currentDate.format("DD")}
            </div>
          </div>
        ))}
      </div>
  
      {/* Time Grid */}
      <ScrollArea className="h-[70vh]">
        <div className="grid mt-7 grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
          {/* Time Column */}
          <div className="w-16 border-r border-rose-200">
            {getHours.map((hour, index) => (
              <div key={index} className="relative h-16">
                <div className="absolute -top-2 right-1 text-xs text-rose-600">
                  {hour.format("h A")}
                </div>
              </div>
            ))}
          </div>
  
          {/* Week Days Time Slots */}
          {getWeekDays(userSelectedDate).map(
            ({ isCurrentDay, today }, index) => {
              const dayDate = userSelectedDate
                .startOf("week")
                .add(index, "day");
  
              return (
                <div key={index} className="relative border-r border-rose-100">
                  {getHours.map((hour, i) => (
                    <div
                      key={i}
                      className={cn(
                        "relative flex h-16 cursor-pointer flex-col items-center gap-y-2 border-b border-rose-100",
                        "transition-colors hover:bg-rose-50/50"
                      )}
                      onClick={() => {
                        setDate(dayDate.hour(hour.hour()));
                        openPopover();
                      }}
                    >
                      <EventRenderer
                        events={events}
                        date={dayDate.hour(hour.hour())}
                        view="week"
                      />
                    </div>
                  ))}
                  
                  {/* Current time indicator */}
                  {isCurrentDay(dayDate) && today && (
                    <div
                      className="absolute left-0 right-0 h-1 bg-rose-500 z-10"
                      style={{
                        top: `calc(${(currentTime.hour() + currentTime.minute() / 60) / 24 * 100}%)`,
                      }}
                    >
                      <div className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-rose-500"></div>
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
