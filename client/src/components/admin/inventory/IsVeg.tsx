import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useId } from "react";
import { Leaf, Drumstick } from "lucide-react";

interface IsVegProps {
  form: any;
  name: any;
  label?: string;
}

export default function IsVeg({ form, name, label }: IsVegProps) {
  const vegId = useId();
  const nonVegId = useId();
  
  return (
    <FormItem className="w-full space-y-2">
      {label && <FormLabel className="text-sm font-medium">{label}</FormLabel>}
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                value={field.value === 1 ? "1" : "0"}
                onValueChange={(value) => {
                  // Convert string value to number (0 or 1)
                  field.onChange(value === "1" ? 1 : 0);
                }}
                className="flex space-x-4"
              >
                <div className="flex items-center p-2 border rounded-md hover:bg-green-50 transition-all cursor-pointer space-x-2 bg-background shadow-sm">
                  <RadioGroupItem value="1" id={vegId} className="border-green-600" />
                  <Label htmlFor={vegId} className="flex items-center gap-1 text-green-700 cursor-pointer font-medium">
                    <Leaf className="h-4 w-4 text-green-600" />
                    Veg
                  </Label>
                </div>
                <div className="flex items-center p-2 border rounded-md hover:bg-red-50 transition-all cursor-pointer space-x-2 bg-background shadow-sm">
                  <RadioGroupItem value="0" id={nonVegId} className="border-red-600" />
                  <Label htmlFor={nonVegId} className="flex items-center gap-1 text-red-700 cursor-pointer font-medium">
                    <Drumstick className="h-4 w-4 text-red-600" />
                    Non-veg
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </FormItem>
  );
}
