"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Form, 
  FormField, 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/schemas/categorySchema";
import FormFieldEasy from "./FormFieldEasy";
import AddImage from "./AddImage";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AddCategory({ onAddSuccess }: any) {
  const { data: session } = useSession();
  const [base64, setBase64] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // Set up react-hook-form with zod validation
  const form = useForm({
    resolver: zodResolver(categorySchema), 
    defaultValues: {
      name: "",
      description: "",
    },
  }); 
  // Handle form submission
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // IMage upload
      const response = await axios.post("https://files.expressme.in/upload", {
        fileName: "image.png",
        fileData:  base64,
      }); 

      if (response.status == 201) {
        const downloadLink = response.data?.downloadLink; 

        await axios
          .post(`/api/admin/category`, {
            name: data.name,
            description: data.description,
            img: downloadLink,
            accessToken: session?.user?.accessToken,
          })
          .then((res) => { 
            toast.success("Category added successfully!");
            setIsOpen(false);
            form.reset();
            setBase64(""); 
            onAddSuccess(); 
          })
          .catch((err) => {
            console.log("error in add category0", err);
            toast.error("Error adding category. Please try again.");
          });
      } else {
        toast.error("Failed to upload category image try again!");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  const onImageUpload = async (values: string) => {
    try {
      setBase64(values);
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("An error occurred while uploading");
      return { status: 500, message: "An error occurred" };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="">
        <Button
          variant="outline"
          className="border border-btnColor text-btnColor hover:text-btnColor hover:bg-[#c771003a]"
          onClick={() => setIsOpen(true)}
        >
          Add Category
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=""
          >
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>
                Make changes to your category here. Click save when you are
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="items-center gap-4">
                <FormFieldEasy
                  form={form}
                  name="name"
                  placeholder="Enter name"
                />
              </div>
              <div className="items-center gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormFieldEasy
                      form={form}
                      name="description"
                      placeholder="Enter description"
                    />
                  )}
                />
              </div>
              <div>
                <AddImage
                  // OldImage={null}
                  onImageUpload={onImageUpload} required={true}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                variant="outline"
                className="border border-btnColor text-btnColor hover:text-btnColor hover:bg-[#c771003a]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
