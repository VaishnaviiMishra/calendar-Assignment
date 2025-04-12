"use client";

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useGoalTaskStore } from "@/lib/store";
import dayjs from "dayjs";

export default function MyCalendars() {
  const [activeTab, setActiveTab] = useState<'calendars' | 'goal' | 'tasks'>('calendars');
  const { 
    goal, 
    tasks, 
    selectedGoal, 
    selectGoal,
    toggleGoal,
    toggleTask 
  } = useGoalTaskStore();
  
  const filteredTasks = selectedGoal 
    ? tasks.filter(t => t.goal === selectedGoal)
    : tasks;

  return (
    <div className="w-full">
      <div className="flex border-b border-rose-200 mb-2">
        <button
          onClick={() => setActiveTab('calendars')}
          className={cn(
            "px-4 py-2 text-sm font-medium",
            activeTab === 'calendars' ? "text-rose-600 border-b-2 border-rose-600" : "text-rose-400"
          )}
        >
          My Calendars
        </button>
        <button
          onClick={() => setActiveTab('goal')}
          className={cn(
            "px-4 py-2 text-sm font-medium",
            activeTab === 'goal' ? "text-rose-600 border-b-2 border-rose-600" : "text-rose-400"
          )}
        >
          My Goals
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={cn(
            "px-4 py-2 text-sm font-medium",
            activeTab === 'tasks' ? "text-rose-600 border-b-2 border-rose-600" : "text-rose-400"
          )}
        >
          My Tasks
        </button>
      </div>

      {activeTab === 'calendars' && <CalendarsSection />}
      {activeTab === 'goal' && <GoalsSection />}
      {activeTab === 'tasks' && <TasksSection />}
    </div>
  );
}

const CalendarsSection = () => {
  const [calendars, setCalendars] = useState([
    { id: "cal1", title: "Work", color: "bg-rose-500", visible: true },
    { id: "cal2", title: "Personal", color: "bg-fuchsia-500", visible: true },
    { id: "cal3", title: "Fitness", color: "bg-pink-400", visible: true },
  ]);

  const toggleCalendar = (id: string) => {
    setCalendars(calendars.map(cal => 
      cal.id === id ? { ...cal, visible: !cal.visible } : cal
    ));
  };

  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="calendars" className="border-b-0">
        <AccordionContent className="grid gap-3 px-0 pb-0 pt-2">
          {calendars.map((cal) => (
            <div className="flex items-center space-x-3" key={cal.id}>
              <input
                type="checkbox"
                id={cal.id}
                checked={cal.visible}
                onChange={() => toggleCalendar(cal.id)}
                className={cn(
                  "h-4 w-4 rounded-sm border-rose-300 text-rose-500 focus:ring-rose-300",
                  cal.color.replace("bg-", "accent-")
                )}
              />
              <div className="flex items-center gap-2">
                <span className={cn("h-3 w-3 rounded-full", cal.color)}></span>
                <label
                  htmlFor={cal.id}
                  className={cn(
                    "text-sm font-medium",
                    cal.visible ? "text-rose-700" : "text-rose-400 line-through"
                  )}
                >
                  {cal.title}
                </label>
              </div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const GoalsSection = () => {
  const { goal, selectedGoal, selectGoal, toggleGoal } = useGoalTaskStore();

  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="goal" className="border-b-0">
        <AccordionContent className="grid gap-3 px-0 pb-0 pt-2">
          {goal.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoal(goal.id)}
                  className="h-4 w-4 rounded-sm border-rose-300 text-rose-500 focus:ring-rose-300"
                />
                <button
                  onClick={() => selectGoal(selectedGoal === goal.id ? null : goal.id)}
                  className={cn(
                    "flex-1 text-left text-sm font-medium",
                    goal.completed ? "text-rose-400 line-through" : "text-rose-700",
                    selectedGoal === goal.id ? "font-bold" : ""
                  )}
                >
                  <span className={cn("mr-2 inline-block h-3 w-3 rounded-full", goal.color)}></span>
                  {goal.title}
                </button>
              </div>
              {selectedGoal === goal.id && (
                <div className="ml-7 space-y-2 border-l-2 border-rose-200 pl-3">
                  {/* Tasks for this goal would appear here */}
                </div>
              )}
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const TasksSection = () => {
  const { tasks, selectedGoal, toggleTask } = useGoalTaskStore();
  
  const filteredTasks = selectedGoal 
    ? tasks.filter(t => t.goal === selectedGoal)
    : tasks;

  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="tasks" className="border-b-0">
        <AccordionContent className="grid gap-3 px-0 pb-0 pt-2">
          {filteredTasks.map((task) => (
            <div className="flex items-center space-x-3" key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="h-4 w-4 rounded-sm border-rose-300 text-rose-500 focus:ring-rose-300"
              />
              <label className={cn(
                "text-sm font-medium",
                task.completed ? "text-rose-400 line-through" : "text-rose-700"
              )}>
                {task.title} ({dayjs(task.date).format('MMM D')})
              </label>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};