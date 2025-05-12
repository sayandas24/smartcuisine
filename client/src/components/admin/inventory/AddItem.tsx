"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormFieldEasy from "../category/FormFieldEasy";
import AddImage from "../category/AddImage";
import { toast } from "sonner";
import {
  Loader2,
  PlusCircle,
  Clock,
  DollarSign,
  Package,
  Clipboard,
  FileText,
  Save,
  ListFilter,
  Images,
  AlertCircle,
  IndianRupee,
} from "lucide-react";
import { inventorySchema } from "@/schemas/inventorySchema";
import SelectCategory from "./SelectCategory";
import ItemAvailability from "./ItemAvailability";
import { Label } from "@/components/ui/label";
import IsVeg from "./IsVeg";
import DiscountBox from "./DiscountBox";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useSession } from "next-auth/react";
import { z } from "zod";

export default function AddItem({ allCategories, category_id }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [base64, setBase64] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Define initial form values
  const defaultValues = {
    name: "",
    description: "",
    category_id: category_id || "",
    img: "",
    is_veg: 0,
    cost_price: 0,
    discount: 0,
    quantity: 1,
    status: "",
    preparation_time: 0,
  };

  //mark Set up react-hook-form with zod validation
  const form = useForm<z.infer<typeof inventorySchema>>({
    resolver: zodResolver(inventorySchema),
    defaultValues,
    mode: "onBlur",
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      form.reset(defaultValues);
      setBase64("");
      setImageError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  // Function to validate category selection
  const validateCategory = () => {
    if (!form.getValues().category_id) {
      form.setError("category_id", {
        type: "required",
        message: "Category is required",
      });
      return false;
    }
    return true;
  };

  //mark Function to validate availability status
  const validateStatus = () => {
    if (!form.getValues().status) {
      toast.error("Please fill in all required fields");
      form.setError("status", {
        type: "required",
        message: "Status is required",
      });
      return false;
    }
    return true;
  };

  // Function to validate image
  const validateImage = () => {
    if (!form.getValues().img) {
      toast.error("Please fill in all required fields");
      form.setError("img", {
        type: "required",
        message: "Food image is required",
      });
      setImageError("Food image is required");
      return false;
    }
    return true;
  };

  // Function to validate all required fields before submission
  const validateRequiredFields = () => {
    const isCategoryValid = validateCategory();
    const isStatusValid = validateStatus();
    const isImageValid = validateImage();

    return isCategoryValid && isStatusValid && isImageValid;
  };

  // Handle form submission
  const onSubmit = async (data: any) => {
    console.log(data.is_veg, "data.is_veg");

    if (!validateRequiredFields()) {
      setIsLoading(false);
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.post("https://files.expressme.in/upload", {
        fileName: "image.png",
        fileData: base64,
      });
      if (response.status == 201) {
        const downloadLink = response.data?.downloadLink;
        setIsLoading(true);

        // Check if required fields are present

        await axios
          .post(`/api/admin/inventory`, {
            name: data.name,
            description: data.description,
            categoryId: data.category_id,
            img: downloadLink,
            isVeg: data.is_veg,
            costPrice: data.cost_price,
            discount: data.discount,
            quantity: data.quantity,
            status: data.status,
            preparationTime: data.preparation_time,
            accessToken: session?.user?.accessToken,
          })
          .then((res) => {
            toast.success("Food item added successfully!");
            setDialogOpen(false);
            form.reset();
            setBase64("");
            setImageError(null);
          })
          .catch((err) => {
            console.log("error in add category", err);
            toast.error("Error adding food item");
          });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add food item");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image upload
  const onImageUpload = async (values: string | null) => {
    try {
      if (values) {
        setBase64(values);
        form.setValue("img", values);
        form.clearErrors("img");
        setImageError(null);
      } else {
        form.setValue("img", "");
        setImageError("Food image is required");
      }
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("An error occurred while uploading");
    }
  };

  // Handle form validation before submit button click
  const handleSubmitClick = () => {
    // Run validation checks
    validateRequiredFields();
  };

  // Get image field state for validation
  const imgFieldState = form.getFieldState("img");
  const hasImgError =
    (imgFieldState.invalid && imgFieldState.isDirty) || !!imageError;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border border-btnColor text-btnColor hover:text-btnColor hover:bg-[#c771003a] font-medium transition-all"
          onClick={() => setDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Food Item
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[55rem] p-6 max-h-[50rem] overflow-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl flex items-center gap-2">
                <Clipboard className="h-5 w-5 text-btnColor" />
                Add New Food Item
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Fill in the details for your new food item. All fields marked
                with * are required.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <Card className="border shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-2 text-btnColor font-medium">
                    <ListFilter className="h-4 w-4" />
                    Basic Information
                  </div>
                  {/* mark category */}
                  <SelectCategory
                    allCategories={allCategories}
                    category_id={category_id}
                    form={form}
                    name="category_id"
                    label="Food Category *"
                  />

                  <FormFieldEasy
                    form={form}
                    name="name"
                    placeholder="Item name *"
                    icon={
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    }
                  />

                  <FormFieldEasy
                    form={form}
                    name="description"
                    placeholder="Item description *"
                    icon={
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    }
                  />
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-2 text-btnColor font-medium">
                    <DollarSign className="h-4 w-4" />
                    Pricing & Quantity
                  </div>

                  <FormFieldEasy
                    form={form}
                    name="cost_price"
                    placeholder="Cost price (₹) *"
                    type="number"
                    min={0}
                    icon={
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    }
                  />

                  <FormFieldEasy
                    form={form}
                    name="quantity"
                    placeholder="Quantity * (how many items are there?)"
                    type="number"
                    min={1}
                    icon={<Package className="h-4 w-4 text-muted-foreground" />}
                  />

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Estimated Preparation Time (min) *
                    </Label>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <FormFieldEasy
                        form={form}
                        name="preparation_time"
                        type="number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-2 text-btnColor font-medium">
                    <Package className="h-4 w-4" />
                    Item Properties
                  </div>

                  <IsVeg form={form} name="is_veg" label="Item Type *" />

                  <div className="space-y-2">
                    <ItemAvailability
                      form={form}
                      name="status"
                      label="Availability Status *"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4 text-btnColor font-medium">
                    <Images className="h-4 w-4" />
                    Item Media & Pricing
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Label className="text-sm font-medium">
                          Food Image *
                        </Label>
                        {hasImgError && (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                      <AddImage onImageUpload={onImageUpload} required={true} />
                    </div>
                    <DiscountBox form={form} id="discount" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="border-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-btnColor text-white hover:bg-btnColor/90 transition-all"
                disabled={isLoading}
                onClick={handleSubmitClick}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Item
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
