"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import dayjs from "dayjs";
import {
  HiOutlineMenuAlt2,
  HiOutlineMenuAlt4,
  HiOutlineUsers,
} from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
import AddTime from "./add-time";
import { createEvent } from "@/app/actions/event-actions";
import { cn } from "@/lib/utils";
import { useGoalTaskStore } from "@/lib/store";

interface EventPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}

export default function EventPopover({
  isOpen,
  onClose,
  date,
}: EventPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [selectedTime, setSelectedTime] = useState("00:00");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();
  const { goal } = useGoalTaskStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    guests: "",
    goal: ""
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handlePopoverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    
    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("date", date);
    formPayload.append("time", selectedTime);
    formPayload.append("goal", formData.goal);
    
    
    startTransition(async () => {
      try {
        const result = await createEvent(formPayload);
        if ("error" in result) {
          setError(result.error);
        } else if (result.success) {
          setSuccess(result.success);
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } catch {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-rose-100/70 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        ref={popoverRef}
        className="w-full max-w-md rounded-lg bg-white shadow-xl border border-rose-200"
        onClick={handlePopoverClick}
      >
        <div className="mb-2 flex items-center justify-between rounded-t-lg bg-rose-50 p-3 border-b border-rose-200">
          <HiOutlineMenuAlt4 className="text-rose-600" />
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={handleClose}
            className="text-rose-600 hover:bg-rose-100/50"
          >
            <IoCloseSharp className="h-5 w-5" />
          </Button>
        </div>
        <form className="space-y-4 p-6" onSubmit={onSubmit}>
          <div>
            <Input
              type="text"
              name="title"
              placeholder="Add title"
              value={formData.title}
              onChange={handleInputChange}
              className="my-4 rounded-none border-0 border-b-2 border-rose-100 text-2xl focus-visible:border-b-2 focus-visible:border-b-rose-400 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-rose-300 text-black"
              required
            />
          </div>

          <div className="flex items-center space-x-3">
            <FiClock className="size-5 text-rose-500" />
            <div className="flex items-center space-x-3 text-sm text-black">
              <p>{dayjs(date).format("dddd, MMMM D")}</p>
              <AddTime onTimeSelect={setSelectedTime} />
              <input type="hidden" name="date" value={date} />
              <input type="hidden" name="time" value={selectedTime} required />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <HiOutlineUsers className="size-5 text-rose-500" />
            <Input
              type="text"
              name="guests"
              placeholder="Add guests"
              value={formData.guests}
              onChange={handleInputChange}
              className={cn(
                "w-full rounded-lg border-0 bg-rose-50 pl-7 placeholder:text-rose-300 text-black",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-300 focus-visible:ring-offset-0",
              )}
            />
          </div>

          <div className="flex items-center space-x-3">
            <HiOutlineMenuAlt2 className="size-5 text-rose-500" />
            <Input
              type="text"
              name="description"
              placeholder="Add description"
              value={formData.description}
              onChange={handleInputChange}
              className={cn(
                "w-full rounded-lg border-0 bg-rose-50 pl-7 placeholder:text-rose-300 text-black",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-300 focus-visible:ring-offset-0",
              )}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-rose-700 mb-1">
              Related Goal
            </label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              className="w-full p-2 rounded-md border border-rose-300 text-rose-700 focus:ring-rose-500 focus:border-rose-500"
            >
              <option value="">None</option>
              {goal.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>

          {error && <p className="mt-2 px-6 text-rose-600">{error}</p>}
          {success && <p className="mt-2 px-6 text-rose-600">Success</p>}
        </form>
      </div>
    </div>
  );
}