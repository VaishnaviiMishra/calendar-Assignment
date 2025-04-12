'use client'

import React, { useRef, useEffect } from 'react'
import dayjs from 'dayjs'
import { Button } from "@/components/ui/button"
import { IoCloseSharp } from "react-icons/io5"
import { CalendarEventType } from '@/lib/store'
import { useGoalTaskStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface EventSummaryPopoverProps {
  isOpen: boolean
  onClose: () => void
  event: CalendarEventType
}

export function EventSummaryPopover({ isOpen, onClose, event }: EventSummaryPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const { goal } = useGoalTaskStore()

  // Find the associated goal if event has a goal reference
  const associatedGoal = event.goal ? goal.find(g => g.id === event.goal) : null

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        ref={popoverRef}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Event Summary</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <IoCloseSharp className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {/* Event Details Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Event Details</h3>
            <p><strong>Title:</strong> {event.title}</p>
            <p><strong>Date:</strong> {dayjs(event.date).format("dddd, MMMM D, YYYY h:mm A")}</p>
            {event.description && (
              <p><strong>Description:</strong> {event.description}</p>
            )}
          </div>

          {/* Goal Section */}
          {associatedGoal && (
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Linked Goal</h3>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "h-3 w-3 rounded-full",
                  associatedGoal.color,
                  associatedGoal.completed ? "opacity-50" : ""
                )}></span>
                <p className={cn(
                  "font-medium",
                  associatedGoal.completed ? "text-gray-400 line-through" : "text-gray-700"
                )}>
                  {associatedGoal.title}
                </p>
                {associatedGoal.completed && (
                  <span className="ml-2 text-xs text-green-600">Completed</span>
                )}
              </div>
            </div>
          )}

          {/* Add more sections here as needed */}
        </div>
      </div>
    </div>
  )
}