"use client";

import React, { useState, useEffect, useLayoutEffect } from "react";
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
  Pencil,
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
import { fetchCategory } from "@/helpers/fetchCategory";
import { z } from "zod";
import DeleteItem from "./DeleteItem";

export default function EditItem({ category, onSuccess, formSubmitted }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [base64, setBase64] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const { data: session, update } = useSession();
  const [allCategories, setAllCategories] = useState([]);
 
  const defaultValues = {
    name: category.name || "",
    description: category.description || "",
    category_id: category.category_id || "",
    img: category.img || "",
    is_veg: category.is_veg || "",
    cost_price: category.cost_price || "",
    discount: category.discount || "",
    quantity: category.quantity || "",
    status: category.status || "",
    preparation_time: category.preparation_time || "",
  };

  // Set up react-hook-form with zod validation
  const form = useForm<z.infer<typeof inventorySchema>>({
    resolver: zodResolver(inventorySchema),
    defaultValues,
    mode: "onBlur",
  });

  // Combined effect for initialization and dialog open/close handling
  useEffect(() => {
    // On component mount or when category changes - do initial setup
    if (category?.img) {
      form.setValue("img", "valid-image-marker");
      form.clearErrors("img");
    }

    // Reset form when dialog opens
    if (dialogOpen) {
      // Reset with proper values and make sure image is marked valid
      form.reset({
        name: category.name,
        description: category.description,
        category_id: category.category_id,
        img: category.img ? "valid-image-marker" : "",
        is_veg: category.is_veg,
        cost_price: category.cost_price,
        discount: category.discount,
        quantity: category.quantity,
        status: category.status,
        preparation_time: category.preparation_time,
      });

      setBase64("");
      setImageError(null);
    }
  }, [category, dialogOpen, form]);

  const refreshCategories = async () => {
    if (session?.user?.accessToken) {
      try {
        const data = await fetchCategory();
        setAllCategories(data.categories);
      } catch (err) {
        console.log("error in fetching category", err);
      }
    }
  };

  useEffect(() => {
    refreshCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.accessToken]);

  // console.log(defaultValues, "defaultValues");
  // Reset form when category changes
  useEffect(() => {
    form.reset({
      name: category.name,
      description: category.description,
      category_id: category.category_id,
      img: category.img,
      is_veg: category.is_veg,
      cost_price: category.cost_price,
      discount: category.discount,
      quantity: category.quantity,
      status: category.status,
      preparation_time: category.preparation_time,
    });
  }, [category, form]);

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

  // Function to validate availability status
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
    console.log("Validating image:", {
      formImg: form.getValues().img,
      categoryImg: category?.img,
      hasExistingImg: !!category?.img,
      base64: !!base64,
    });

    // If an existing image is present, it's always valid
    if (category && category.img) {
      return true;
    }

    // Otherwise check if a new image has been uploaded
    if (!form.getValues().img) {
      toast.error("Food image is required");
      form.setError("img", {
        type: "required",
        message: "Food image is required",
      });
      setImageError("Food image is required");
      return false;
    }
    return true;
  }; 

  // Handle image upload
  const onImageUpload = async (values: unknown) => {
    try {
      // Handle VALID_IMAGE marker from AddImage component
      if (values === "VALID_IMAGE") {
        // Set the form field with a valid value
        form.setValue("img", "valid-image-marker");
        form.clearErrors("img");
        setImageError(null);
        return;
      }

      // Handle boolean value (true means use existing image)
      if (typeof values === "boolean" && values === true) {
        // Set a dummy value that will pass validation
        form.setValue("img", "existing-image");
        form.clearErrors("img");
        setImageError(null);
        return;
      }

      // Handle string values (base64 or special values)
      if (typeof values === "string") {
        // Special case for existing image
        if (values === "KEEP_EXISTING" || values === "existing_image") {
          // Just keep using the existing image URL
          form.setValue("img", "existing-image");
          form.clearErrors("img");
          setImageError(null);
          return;
        }

        // Normal case for new image upload
        setBase64(values);
        form.setValue("img", values);
        form.clearErrors("img");
        setImageError(null);
      }
      // Handle null (image removed)
      else if (values === null) {
        // If it's a required field and we're clearing the image
        if (!category?.img) {
          form.setValue("img", "");
          setImageError("Food image is required");
        } else {
          // Keep the existing image
          form.setValue("img", "existing-image");
          setImageError(null);
        }
      }
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("An error occurred while uploading");
    }
  };

  // Update handleSubmitClick to ensure form is valid
  const handleSubmitClick = () => {
    // If we have an existing image, make sure the form considers it valid
    if (category?.img) {
      form.setValue("img", "existing-image-valid");
      form.clearErrors("img");
    }
  };

  // Create custom onSubmit function that validates all fields
  const customOnSubmit = (data: any) => {
    // Validate all required fields except image when we have an existing image
    const isCategoryValid = validateCategory();
    const isStatusValid = validateStatus();
    // Skip image validation only when we have an existing image
    const isImageValid = category?.img ? true : validateImage();

    if (!isCategoryValid || !isStatusValid || !isImageValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Now proceed with submission
    submitForm(data);
  };

  // Separate the submission logic
  const submitForm = async (data: any) => {
    setIsLoading(true);

    try {
      let imageUrl = category?.img; // Default to existing image URL

      // Only upload new image if base64 has value (a new image was selected)
      if (base64) {
        const response = await axios.post("https://files.expressme.in/upload", {
          fileName: "image.png",
          fileData: base64,
        });

        if (response.status === 201) {
          imageUrl = response.data?.downloadLink;
        }
      } else {
        console.log("Using existing image:", imageUrl);
      }

      // Prepare API request
      const apiRequest = {
        id: category?.id,
        name: data.name,
        description: data.description,
        categoryId: data.category_id,
        img: imageUrl,
        isVeg: data.is_veg,
        costPrice: data.cost_price,
        discount: data.discount,
        quantity: data.quantity,
        status: data.status,
        preparationTime: data.preparation_time,
        accessToken: session?.user?.accessToken,
      };

      const response = await axios.patch(`/api/admin/inventory`, apiRequest);

      // Refetch session data after successful update
      await update();

      toast.success("Food item updated successfully!");
      setDialogOpen(false);
      form.reset();
      setBase64("");
      setImageError(null);
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update food item");
    } finally {
      setIsLoading(false);
    }
  };

  // Get image field state for validation
  const imgFieldState = form.getFieldState("img");
  const hasImgError =
    (imgFieldState.invalid && imgFieldState.isDirty) || !!imageError;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button
          // variant="outline"
          className="border border-btnColor text-btnColor hover:text-btnColor hover:bg-[#c771003a] font-medium transition-all px-2 !py-1 rounded-xl text-xs flex items-center gap-1 h-fit"
          onClick={() => setDialogOpen(true)}
        >
          <Pencil className="!h-3 !w-3" />
          Edit
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-[55rem] max-h-[50rem] overflow-auto p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(customOnSubmit)}
            className="relative"
          >
            <DialogHeader className="mb-4 p-4">
              <DialogTitle className="text-xl flex items-center gap-2">
                <Clipboard className="h-5 w-5 text-btnColor" />
                Edit food
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Fill in the details for your new food item. All fields marked
                with * are required.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6  p-4">
              <Card className="border shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-2 text-btnColor font-medium">
                    <ListFilter className="h-4 w-4" />
                    Basic Information
                  </div>

                  {/* mark: Category */}
                  <SelectCategory
                    allCategories={allCategories}
                    category_id={category?.category_id}
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
              {/* mark Pricing & Quantity */}
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
                  {/* mark Estimated Preparation Time */}
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
              {/* mark category status */}
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
                      defaultSelect={category?.status}
                    />
                  </div>
                </CardContent>
              </Card>
              {/* mark Item Media & Pricing, discount */}
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
                      <AddImage
                        OldImage={category?.img}
                        onImageUpload={onImageUpload}
                        required={true}
                      />
                    </div>
                    <DiscountBox form={form} id="discount" hasDiscount={category?.discount} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* mark delete item, save item */}
            <DialogFooter
              className="mt-6s h-[5rem] px-4 flex rounded-t-xl items-center bg-[#ffffffcb] sticky bottom-0 left-0 w-full"
              style={{ boxShadow: "20px 10px 24px #c4c4c4" }}
            >
              <div className="mr-auto">
                <DeleteItem
                  itemId={category?.id}
                  categoryId={category?.category_id}
                  accessToken={session?.user?.accessToken}
                  onSuccess={onSuccess}
                />
              </div>
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
