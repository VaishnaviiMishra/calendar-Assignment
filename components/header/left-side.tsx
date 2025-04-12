"use client";

import React from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useDateStore, useToggleSideBarStore, useViewStore } from "@/lib/store";
import dayjs from "dayjs";

export default function HeaderLeft() {
  const todaysDate = dayjs();
  const { userSelectedDate, setDate, setMonth, selectedMonthIndex } =
    useDateStore();

  const { setSideBarOpen } = useToggleSideBarStore();

  const { selectedView } = useViewStore();

  const handleTodayClick = () => {
    switch (selectedView) {
      case "month":
        setMonth(dayjs().month());
        break;
      case "week":
        setDate(todaysDate);
        break;
      case "day":
        setDate(todaysDate);
        setMonth(dayjs().month());
        break;
      default:
        break;
    }
  };

  const handlePrevClick = () => {
    switch (selectedView) {
      case "month":
        setMonth(selectedMonthIndex - 1);
        break;
      case "week":
        setDate(userSelectedDate.subtract(1, "week"));
        break;
      case "day":
        setDate(userSelectedDate.subtract(1, "day"));
        break;
      default:
        break;
    }
  };

  const handleNextClick = () => {
    switch (selectedView) {
      case "month":
        setMonth(selectedMonthIndex + 1);
        break;
      case "week":
        setDate(userSelectedDate.add(1, "week"));
        break;
      case "day":
        setDate(userSelectedDate.add(1, "day"));
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      {/* Left Section - Branding and Navigation */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle and Calendar Icon */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="hidden rounded-full p-2 hover:bg-rose-100 lg:flex"
            onClick={() => setSideBarOpen()}
          >
            <Menu className="size-5 text-rose-600" />
          </Button>
          <div className="flex items-center gap-2">
            <Image
              src="/img/calendar.png"
              width={28}
              height={28}
              alt="Calendar icon"
              className="hidden lg:block"
            />
            <h1 className="text-xl font-semibold text-rose-800">Calendar</h1>
          </div>
        </div>
  
        {/* Today Button */}
        <Button 
          variant="outline" 
          onClick={handleTodayClick}
          className="border-rose-300 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
        >
          Today
        </Button>
      </div>
  
      {/* Center Section - Current Month/Year */}
      <h1 className="text-xl font-medium text-rose-900">
        {dayjs(new Date(dayjs().year(), selectedMonthIndex)).format("MMMM YYYY")}
      </h1>
  
      {/* Right Section - Navigation Controls */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevClick}
          className="rounded-full text-rose-600 hover:bg-rose-100"
        >
          <MdKeyboardArrowLeft className="size-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextClick}
          className="rounded-full text-rose-600 hover:bg-rose-100"
        >
          <MdKeyboardArrowRight className="size-6" />
        </Button>
      </div>
    </div>
  );
}
