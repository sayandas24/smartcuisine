import { FormField, FormItem } from "@/components/ui/form";
import {
  Ban,
  Check,
  ChevronDown,
  Clock10,
  CookingPot,
} from "lucide-react"; 
import React, { useEffect, useRef, useState } from "react";

export default function OrderedItemStatus({ defaultSelect, form, name }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if the field has validation errors
  const fieldState = form.getFieldState(name);
  const hasError = fieldState.invalid;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const statusOptions = [
    {
      value: "processing",
      label: "Processing",
      icon: <Clock10 className="h-4 w-4" />,
      color: "text-yellow-600",
      borderColor: "border-yellow-600",
    },
    {
      value: "completed",
      label: "Completed",
      icon: <CookingPot className="h-4 w-4" />,
      color: "text-green-700",
      borderColor: "border-green-700",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      icon: <Ban className="h-4 w-4" />,
      color: "text-red-600",
      borderColor: "border-red-600",
    },
  ];

  // Set default value
  useEffect(() => {
    if (form && defaultSelect) {
      form.setValue(name, defaultSelect.toLowerCase());
    }
  }, [form, name, defaultSelect]);

  // Get status option by value
  const getStatusOption = (value: string) => {
    return statusOptions.find(option => option.value === value.toLowerCase()) || statusOptions[0];
  };

  // Get button classes based on status and state
  const getButtonClasses = (
    hasError: boolean,
    isFocused: boolean,
    value: string | undefined
  ) => {
    let baseClasses =
      "flex h-10 w-full rounded-md border pl-3 py-2 pr-9 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-white text-left";

    // Add error-specific classes
    if (hasError) {
      baseClasses += " border-red-500 focus:border-red-500 focus:ring-red-500";
    } else if (isFocused) {
      baseClasses += " border-btnColor ring-2 ring-btnColor/20";
    } else if (value) {
      const option = getStatusOption(value);
      baseClasses += ` ${option.borderColor}`;
    } else {
      baseClasses += " border-input focus:border-btnColor focus:ring-btnColor";
    }

    // Add placeholder text color and font weight
    if (!value) {
      baseClasses += " text-gray-500";
    } else {
      baseClasses += " font-medium";
    }

    return baseClasses;
  };

  return (
    <FormItem className="w-full space-y-2">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <div className="relative" ref={dropdownRef}>
            {/* Custom select button */}
            {/*  eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
            <button
              type="button"
              className={getButtonClasses(
                hasError,
                isFocused || isOpen,
                field.value
              )}
              onClick={() => {
                setIsOpen(!isOpen);
                setIsFocused(true);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => !isOpen && setIsFocused(false)}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-invalid={hasError}
            >
              {field.value && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className={getStatusOption(field.value).color}>
                      {field.value.charAt(0).toUpperCase() + field.value.slice(1)}
                    </span>
                    <span className={getStatusOption(field.value).color}>
                      {getStatusOption(field.value).icon}
                    </span>
                  </div>
                </div>
              )}
              {!field.value && <span>Select status</span>}
            </button>

            {/* Dropdown toggle icon */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? "text-btnColor rotate-180" : "text-gray-500"
                }`}
              />
            </div>

            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-zinc-100 border shadow-lg max-h-60 overflow-auto">
                <ul className="py-1 text-sm" role="listbox">
                  {statusOptions.map((option) => (
                    <li
                      key={option.value}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-200 ${
                        field.value === option.value ? "bg-gray-50" : ""
                      }`}
                      onClick={() => {
                        field.onChange(option.value);
                        setIsOpen(false);
                      }}
                      role="option"
                      aria-selected={field.value === option.value}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${option.color}`}>
                          {option.label}
                        </span>
                        <div className={option.color}>{option.icon}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hidden select for form submission */}
            <select
              {...field}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            >
              <option value="" disabled>
                Select item status
              </option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label.toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        )}
      />
    </FormItem>
  );
}
