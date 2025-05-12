"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ListFilter, AlertCircle, ChevronDown, Check } from "lucide-react";

interface SelectCategoryProps {
  allCategories: any[];
  form: any;
  name: string;
  label?: string;
  category_id?: string;
}

export default function SelectCategory({
  category_id,
  allCategories,
  form,
  name,
  label,
}: SelectCategoryProps) {
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

  // Set initial value if category_id prop is provided
  useEffect(() => {
    if (category_id && form) {
      form.setValue(name, category_id.toString());
    }
  }, [category_id, form, name]);

  const getButtonClasses = (
    hasError: boolean,
    isFocused: boolean,
    hasValue: boolean
  ) => {
    let baseClasses =
      "flex h-10 w-full rounded-md border pl-10 py-2 pr-9 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-white text-black text-left";

    // Add error-specific classes
    if (hasError) {
      baseClasses += " border-red-500 focus:border-red-500 focus:ring-red-500";
    } else if (isFocused) {
      baseClasses += " border-btnColor ring-2 ring-btnColor/20";
    } else {
      baseClasses += " border-input focus:border-btnColor focus:ring-btnColor";
    }

    // Add placeholder text color class
    if (!hasValue) {
      baseClasses += " text-gray-500";
    }

    // Add font weight class for selected value
    if (hasValue) {
      baseClasses += " font-medium";
    }

    return baseClasses;
  };

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
              <ListFilter className="h-4 w-4" />
            </div>

            {/* Custom select button */}
            {/*  eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
            <button
              type="button"
              className={getButtonClasses(
                hasError,
                isFocused || isOpen,
                Boolean(field.value)
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
              {field.value
                ? allCategories.find((cat) => cat.id.toString() === field.value)
                    ?.name
                : "Select a category"}
            </button>

            {/* Dropdown indicator */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              {field.value ? (
                <div className="text-green-600">
                  <Check className="h-4 w-4" />
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
                  {allCategories.length > 0 ? (
                    allCategories.map((category) => (
                      <li
                        key={category.id}
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-200 ${
                          field.value === category.id.toString()
                            ? "bg-gray-50 font-medium"
                            : ""
                        }`}
                        onClick={() => {
                          field.onChange(category.id.toString());
                          setIsOpen(false);
                        }}
                        role="option"
                        aria-selected={field.value === category.id.toString()}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-black">{category.name}</span>
                          {field.value === category.id.toString() && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-500">
                      No categories available
                    </li>
                  )}
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
                Select a category
              </option>
              {allCategories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
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
