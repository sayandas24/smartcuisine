import CustomizedSteppers from "@/components/restaurant/orders/OrderStepper";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Form } from "@/components/ui/form";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import OrderedItemStatus from "./OrderedItemStatus";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axios"; 
import {   Loader2, Trash,  ClipboardEdit, RefreshCcw } from "lucide-react";

// todo add a input field for changing the prep time

interface OrderedItemEditProps {
  state: string;
  setIsOpen: (open: boolean) => void;
  orderId: string | number;
  functionToRefetchOrders: () => void;
}

export default function OrderedItemEdit({
  state,
  setIsOpen,
  orderId,
  functionToRefetchOrders,
}: OrderedItemEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, update } = useSession();
  const accessToken = session?.user?.accessToken;
  // const { refreshOrders } = UseFetchOrders(accessToken);

  const formSchema = z.object({
    status: z.string().min(1),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: state || "Processing",
    },
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    await update();
    e.preventDefault();
    const formData = form.getValues();

    if (!accessToken) {
      toast.error("You must be logged in to update orders");
      return;
    }

    setIsSubmitting(true);

    try {
      // This is a placeholder for the actual API call to update the order status
      // Replace with your actual API endpoint
      const response = await axiosInstance.patch(
        `/admin/orders`,
        {
          id: orderId,
          order_status: formData.status,
          payment_status: "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status) {
        functionToRefetchOrders();
        // refreshOrders();
        toast.success(`Order status updated to ${formData.status}`);
        // Close the dialog
        setIsOpen(false);
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!accessToken) {
      toast.error("You must be logged in to delete orders");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    setIsSubmitting(true);
    console.log("Deleting order:", orderId);
    try {
      // Placeholder for the actual API call to delete the order
      const response = await axiosInstance.delete(`/admin/orders`, {
        data: { id: orderId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.status) {
        toast.success("Order deleted successfully");
        // Close the dialog
        setIsOpen(false);

        // Optional: Refresh orders data
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to determine the active step based on status
  const getActiveStep = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return 2;
      case "completed":
        return 3;
      case "cancelled":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit}>
        <DialogContent
          className="max-w-[45rem] bg-white shadow-lg rounded-lg border-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-10">
            <CustomizedSteppers
              activeStep={getActiveStep(form.getValues().status)}
              status={form.getValues().status}
            />
          </div>
          <div className="flex gap-10 items-center">
            <DialogHeader className="w-[23rem] flex gap-2 items-center px-5">
              
              <DialogTitle className="text-xl font-bold">Change Order Status</DialogTitle>
              <OrderedItemStatus
                form={form}
                name="status"
                defaultSelect={state}
              />
            </DialogHeader>
            <DialogDescription className="flex items-center gap-2">
              <ClipboardEdit className="h-4 w-4 text-gray-500" />
              Make changes to order status. Click update to save your changes.
            </DialogDescription>
          </div>

          <DialogFooter className="flex !justify-between flex-row mt-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border border-red-500 text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300"
                    onClick={handleDeleteOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        Deleting... <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      </>
                    ) : (
                      <>
                        Delete Order <Trash className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Permanently remove this order</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border border-btnColor text-btnColor hover:text-white hover:bg-btnColor transition-colors duration-300"
                    onClick={handleFormSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        Updating... <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      </>
                    ) : (
                      <>
                        Update Status <RefreshCcw className="h-4 w-4 ml-2 animate-spin-slow" />
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save changes to order status</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogFooter>
        </DialogContent>
      </form>
    </Form>
  );
}
