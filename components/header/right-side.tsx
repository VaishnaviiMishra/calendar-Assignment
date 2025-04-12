"use client";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useViewStore } from "@/lib/store";

export default function HeaderRight() {

  const { setView } = useViewStore();

  return (
    <div className="flex items-center gap-4">
      {/* View Selector */}
      <Select onValueChange={(v) => setView(v)} defaultValue="month">
        <SelectTrigger className="w-28 border-rose-200 bg-white text-rose-800 hover:bg-rose-50 focus:ring-1 focus:ring-rose-300 focus:ring-offset-1">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent className="border-rose-100 bg-white shadow-lg">
          <SelectItem 
            value="month" 
            className="text-rose-700 hover:bg-rose-50 focus:bg-rose-50"
          >
            Month
          </SelectItem>
          <SelectItem 
            value="week" 
            className="text-rose-700 hover:bg-rose-50 focus:bg-rose-50"
          >
            Week
          </SelectItem>
          <SelectItem 
            value="day" 
            className="text-rose-700 hover:bg-rose-50 focus:bg-rose-50"
          >
            Day
          </SelectItem>
        </SelectContent>
      </Select>
  
      {/* User Avatar */}
      <div className="relative">
        <Avatar className="h-8 w-8 border border-rose-200 shadow-sm">
          <AvatarImage 
            src="/img/inst2.jpeg" 
            className="object-cover"
          />
          
        </Avatar>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-green-400"></span>
      </div>
    </div>
  )
}
