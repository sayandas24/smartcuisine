"use client";
import React, { useState, useRef, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Check, AlertTriangle, PackageOpen, AlertCircle, ChevronDown } from "lucide-react";

interface ItemAvailabilityProps {
  form: any;
  name: string;
  label?: string;
  defaultSelect?: string;
}

export default function ItemAvailability({defaultSelect, form, name, label }: ItemAvailabilityProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Check if the field has validation errors
  const fieldState = form.getFieldState(name);
  const hasError = fieldState.invalid ;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to determine button/trigger classes
  const getButtonClasses = (hasError: boolean, isFocused: boolean, value: string | undefined) => {
    let baseClasses = "flex h-10 w-full rounded-md border pl-10 py-2 pr-9 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-white text-left";
    
    // Add error-specific classes
    if (hasError) {
      baseClasses += " border-red-500 focus:border-red-500 focus:ring-red-500";
    } else if (isFocused) {
      baseClasses += " border-btnColor ring-2 ring-btnColor/20";
    } else {
      baseClasses += " border-input focus:border-btnColor focus:ring-btnColor";
    }
    
    // Status-specific border colors
    if (value === "Available") {
      baseClasses += " border-green-200";
    } else if (value === "Out of Stock") {
      baseClasses += " border-red-200";
    } else if (value === "Low Stock") {
      baseClasses += " border-yellow-200";
    }
    
    // Add placeholder text color and font weight
    if (!value) {
      baseClasses += " text-gray-500";
    } else {
      baseClasses += " font-medium";
    }
    
    return baseClasses;
  };

  // Function to get text color based on status
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "Available":
        return "text-green-600";
      case "Out of Stock":
        return "text-red-600";
      case "Low Stock":
        return "text-yellow-600";
      default:
        return "text-black";
    }
  };

  // Status options
  const statusOptions = [
    { value: "Available", label: "Available", icon: <Check className="h-4 w-4" />, color: "text-green-600" },
    { value: "Out of Stock", label: "Out of Stock", icon: <AlertTriangle className="h-4 w-4" />, color: "text-red-600" },
    { value: "Low Stock", label: "Low Stock", icon: <AlertTriangle className="h-4 w-4" />, color: "text-yellow-600" }
  ];

  useEffect(() => {
     if (form && defaultSelect) {
       form.setValue(name, defaultSelect);
      
     }
  }, [form, name, defaultSelect]);
  

  return (
    <FormItem className="w-full space-y-2">
      {label && (
        <FormLabel className="text-sm font-medium flex items-center gap-1">
          {label}
          {hasError && <AlertCircle className="h-3 w-3 text-red-500" />}
        </FormLabel>
      )}
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <div className="relative" ref={dropdownRef}>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <PackageOpen className="h-4 w-4" />
            </div>
            
            {/* Custom select button */}
            {/*  eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
            <button
              type="button"
              className={getButtonClasses(hasError, isFocused || isOpen, field.value)}
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
              <span className={field.value ? getStatusTextColor(field.value) : ""}>
                {field.value || "Select item status"}
              </span>
            </button>
            
            {/* Status indicator icon on the right */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              {field.value ? (
                <div className="flex items-center gap-1">
                  {field.value === "Available" && (
                    <div className="text-green-600">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  {field.value === "Out of Stock" && (
                    <div className="text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                  )}
                  {field.value === "Low Stock" && (
                    <div className="text-yellow-600">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ) : (
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isOpen ? "text-btnColor rotate-180" : "text-gray-500"
                  }`} 
                />
              )}
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
                        <span className={`font-medium ${option.color}`}>{option.label}</span>
                        {field.value === option.value && (
                          <div className={option.color}>
                            {option.icon}
                          </div>
                        )}
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
              <option value="" disabled>Select item status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      />
      <FormMessage className="text-xs font-medium" />
    </FormItem>
  );
}