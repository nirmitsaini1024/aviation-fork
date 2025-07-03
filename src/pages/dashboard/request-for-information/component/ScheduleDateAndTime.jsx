import { useState, useEffect, useContext } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Check, ArrowLeft, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { RequestInfoContext } from "../context/RequestInfoContext";

export default function ScheduleDateTime() {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFrequency, setSelectedFrequency] = useState("Once");
  const [isFrequencyOpen, setIsFrequencyOpen] = useState(false);
  const { scheduleDate, setScheduleDate } = useContext(RequestInfoContext);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time with leading zeros
  const formatTime = (time) => {
    return time.toString().padStart(2, "0");
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setScheduleDate((prev)=>({
      ...prev,
      date: date
    }))
    if (date) {
      setShowTimeSelection(true);
      console.log(scheduleDate);
    }
  };

  // Handle hour change
  const handleHourChange = (value) => {
    const hour = Number.parseInt(value);
    if (hour >= 0 && hour <= 23) {
      setSelectedHour(hour);
    }
  };

  // Handle minute change
  const handleMinuteChange = (value) => {
    const minute = Number.parseInt(value);
    if (minute >= 0 && minute <= 59) {
      setSelectedMinute(minute);
    }
  };

    const handleFrequencySelect = (frequency) => {
    setSelectedFrequency(frequency);
    setIsFrequencyOpen(false);
  };

  // Go back to date selection
  const goBackToDate = () => {
    setShowTimeSelection(false);
  };

  // Confirm and close
  const confirmSelection = () => {
    setIsOpen(false);
    setShowTimeSelection(false);
    const now = new Date(selectedDate);
    now.setHours(selectedHour, selectedMinute, 0, 0)
    setScheduleDate((prev)=>({
      ...prev,
      time: now,
      repeat: selectedFrequency
    }))
  };

  // Reset when popover closes
  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setShowTimeSelection(false);
    }
  };

  // Get display text for trigger button
  const getDisplayText = () => {
    if (selectedDate) {
      return `${formatDate(selectedDate)} at ${formatTime(
        selectedHour
      )}:${formatTime(selectedMinute)}`;
    }
    return "Select date and time";
  };

  return (
    <div>
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <div className="space-y-2">
                <Label htmlFor="schedule" className="text-sm font-medium text-blue-600">
                  Schedule
                </Label>
                <Button
                  id="schedule"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 bg-white shadow-sm",
                    !selectedDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {getDisplayText()}
                </Button>
              </div>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-0 mr-7" align="start">
            {!showTimeSelection ? (
              // Date Selection View
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="font-medium">Select Date</span>
                </div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </div>
            ) : (
              // Time Selection View
              <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goBackToDate}
                    className="p-1 h-auto"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Select Time</span>
                  </div>
                   <Popover open={isFrequencyOpen} onOpenChange={setIsFrequencyOpen}>
                    <PopoverTrigger asChild>
                      <Menu/>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 p-2 mr-10">
                      <div className="space-y-1">
                        {["Once", "Daily", "Weekly"].map((item) => (
                          <Button
                            key={item}
                            size="sm"
                            variant="default"
                            className={`w-full justify-start text-xs ${selectedFrequency === item && "bg-blue-600"}`}
                            onClick={() => handleFrequencySelect(item)}
                          >
                            {selectedFrequency === item && (
                              <Check className="h-3 w-3 mr-1" />
                            )}
                            {item}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Selected Date Display */}
                <div className="text-center text-sm text-gray-600 bg-gray-50 rounded p-2">
                  {selectedDate && formatDate(selectedDate)}
                </div>

                {/* Time Display */}
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-gray-800 bg-gray-100 rounded-lg p-4">
                    {formatTime(selectedHour)}:{formatTime(selectedMinute)}
                  </div>
                </div>

                {/* Time Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="hour" className="text-xs">
                      Hours
                    </Label>
                    <Input
                      id="hour"
                      type="number"
                      min="0"
                      max="23"
                      value={selectedHour}
                      onChange={(e) => handleHourChange(e.target.value)}
                      className="text-center font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minute" className="text-xs">
                      Minutes
                    </Label>
                    <Input
                      id="minute"
                      type="number"
                      min="0"
                      max="59"
                      value={selectedMinute}
                      onChange={(e) => handleMinuteChange(e.target.value)}
                      className="text-center font-mono"
                    />
                  </div>
                </div>

                {/* Quick Time Buttons */}
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { hour: 9, minute: 0, label: "09:00" },
                    { hour: 12, minute: 0, label: "12:00" },
                    { hour: 15, minute: 30, label: "15:30" },
                    { hour: 18, minute: 0, label: "18:00" },
                  ].map((time) => (
                    <Button
                      key={time.label}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedHour(time.hour);
                        setSelectedMinute(time.minute);
                      }}
                      className="text-xs font-mono h-8"
                    >
                      {time.label}
                    </Button>
                  ))}
                </div>

                <Separator />

                {/* Confirm Button */}
                <Button onClick={confirmSelection} className="w-full bg-blue-600 hover:bg-blue-800">
                  Confirm Selection
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
    </div>
  );
}
