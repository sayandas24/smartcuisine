import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { useEffect, useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Percent, Tag, DollarSign } from "lucide-react";
 

interface DiscountBoxProps {
  form: any;
  id: string;
  hasDiscount?: number;
}

export default function DiscountBox({
  form,
  id,
  hasDiscount,
}: DiscountBoxProps) {
  const [checked, setChecked] = useState(false);
  const checkboxId = useId();

  useEffect(() => {
    if (hasDiscount! > 0) {
      setChecked(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return (
    <div className="space-y-3 ">
      <Label className="text-sm font-medium">Discount Options</Label>
      <div className="flex flex-col gap-4 p-4 border rounded-md bg-background shadow-sm min-h-[13rem]">
        <div className="flex items-center space-x-3">
          <div className="flex h-5 w-5 items-center justify-center">
            <Checkbox
              id={checkboxId}
              checked={checked}
              onCheckedChange={(value) => {
                setChecked(value === true);
                if (!value) {
                  form.setValue(id, 0);
                }
              }}
              className="border-btnColor text-btnColor"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor={checkboxId}
              className="text-sm font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Tag className="h-4 w-4 text-btnColor" />
              Apply discount to this item
            </Label>
            <p className="text-xs text-muted-foreground">
              Add a percentage discount to increase sales
            </p>
          </div>
        </div>

        {checked ? (
          <div className="pt-2 space-y-4">
            <FormField
              control={form.control}
              name={id}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <div className="relative w-28">
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        <Percent className="h-3.5 w-3.5" />
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          className="pl-8 h-9 border-input focus:border-btnColor focus:ring-btnColor"
                          value={field.value || 0}
                          min={0}
                          max={100}
                          onChange={(e) => {
                            if (!checked) {
                              field.onChange(0);
                              return;
                            }
                            const value = e.target.value;
                            const numValue = value === "" ? 0 : Number(value);
                            field.onChange(Math.min(100, numValue));
                          }}
                        />
                      </FormControl>
                    </div>
                    {field.value > 0 && (
                      <span className="bg-green-100 text-green-800 border border-green-300 px-2 py-1 text-sm font-medium rounded-md">
                        {field.value}% off
                      </span>
                    )}
                  </div>
                  {field.value > 0 && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
                      <div className="flex items-center gap-2 text-green-800">
                        <DollarSign className="h-4 w-4" />
                        <p className="text-sm font-medium">Discount Applied</p>
                      </div>
                      <p className="text-xs text-green-700 mt-1">
                        This item will be shown with a {field.value}% discount
                        on the menu
                      </p>
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-4 text-muted-foreground">
              <p className="text-sm">No discount applied</p>
              <p className="text-xs mt-1">
                Check the box above to add a discount
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
