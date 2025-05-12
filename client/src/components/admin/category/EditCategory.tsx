"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/schemas/categorySchema";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { Form, FormField } from "@/components/ui/form";
import FormFieldEasy from "./FormFieldEasy";
import AddImage from "./AddImage";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import DeleteCategory from "./DeleteCategory";

export default function EditCategory({ category, onSuccess, formSubmitted }: any) {
  const { data: session } = useSession();
  const [base64, setBase64] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Initialize form with category values
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      description: category.description,
      img: category.img,  // Add img field to form
    },
  });

  // Initialize form when component mounts
  useEffect(() => {
    if (category?.img) {
      form.setValue("img", "valid-image-marker");
    }
  }, [category, form]);

  // Reset form when category changes
  useEffect(() => {
    form.reset({
      name: category.name,
      description: category.description,
      img: category.img ? "valid-image-marker" : "",  // Set valid marker for existing image
    });
  }, [category, form]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      // Default to existing image
      let imageUrl = category.img;
      
      // Only upload new image if base64 has value (a new image was selected)
      if (base64) {
        const response = await axios.post("https://files.expressme.in/upload", {
          fileName: "image.png",
          fileData: base64,
        });
        
        if (response.status === 200 || response.status === 201) {
          imageUrl = response.data?.downloadLink;
        }
      } 

      // Submit form data with image
      const result = await axios.patch(`/api/admin/category`, {
        name: data.name,
        description: data.description,
        img: imageUrl,
        categoryId: category.id,
        accessToken: session?.user?.accessToken,
      });
      
      
      if (result.status === 200) {
        toast.success("Category updated successfully");
        form.reset();
        setBase64("");
        setImageError(null);
        formSubmitted();
        onSuccess();
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An error occurred while updating the category.");
    } finally {
      setIsLoading(false);
    }
  };

  const onImageUpload = async (values: unknown) => {
    try {
      
      // Handle VALID_IMAGE marker from AddImage component
      if (values === "VALID_IMAGE" || values === true) {
        form.setValue("img", "valid-image-marker");
        setImageError(null);
        return;
      }
      
      // Handle string values (base64)
      if (typeof values === 'string') {
        // Special case for existing image markers
        if (values === "KEEP_EXISTING") {
          form.setValue("img", "valid-image-marker");
          setImageError(null);
          return;
        }
        
        // Normal case for new image upload
        setBase64(values);
        form.setValue("img", values);
        setImageError(null);
      } 
      // Handle null (image removed)
      else if (values === null) {
        setBase64("");
        form.setValue("img", "");
      }
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("An error occurred while uploading");
    }
  };

  return (
    <DialogContent className="max-w-md">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>Edit {category?.name}</DialogTitle>
            <DialogDescription>
              Make changes to your category here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="items-center gap-4">
              <FormFieldEasy form={form} name="name" placeholder="Enter name" />
            </div>
            <div className="items-center gap-4">
              <FormFieldEasy
                form={form}
                name="description"
                placeholder="Enter description"
              />
            </div>
            <div>
              <AddImage
                OldImage={category?.img}
                onImageUpload={onImageUpload}
                required={true}
              />
            </div>
          </div>
          <DialogFooter className="flex !justify-between flex-row ">
           <DeleteCategory formSubmitted={formSubmitted} categoryId={category?.id} accessToken={session?.user?.accessToken} onSuccess={onSuccess}/>
            <Button
              type="submit"
              variant="outline"
              className="border border-btnColor text-btnColor hover:text-btnColor hover:bg-[#c771003a]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
