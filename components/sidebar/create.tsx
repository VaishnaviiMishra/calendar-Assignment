"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useDateStore } from "@/lib/store";
import { useCallback, useState } from "react";
import Image from "next/image";
import EventPopover from "../event-popover";

export default function Create() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleOpenPopover = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPopoverOpen(true);
  }, []);

  const handleClosePopover = useCallback(() => {
    setIsPopoverOpen(false);
  }, []);

  const { userSelectedDate } = useDateStore();

  return (
    <>
      <Button
  variant="ghost"
  className="w-[150px] justify-start rounded-full py-6 shadow"
  onClick={handleOpenPopover}
>
  <Image
    src="img/addicon.png"
    width={32} 
    alt="Create" 
    className="mr-2 h-8 w-8"
  />
  <span>Create</span>
  <ChevronDown />
</Button>
      {isPopoverOpen && (
        <EventPopover
          isOpen={isPopoverOpen}
          onClose={handleClosePopover}
          date={userSelectedDate.format("YYYY-MM-DD")}
        />
      )}
    </>
  );
}
