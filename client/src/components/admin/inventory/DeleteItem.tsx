"use client";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import React, { useState, useTransition } from "react";
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
import axios from "axios";
import { toast } from "sonner";
import { useInventoryItems } from "@/hooks/useInventoryItems";

export default function DeleteItem({
  categoryId,
  itemId,
  accessToken,
  onSuccess,
}: any) {
  const [isPending, startTransition] = useTransition();

  
  // TODO: fix delete
  const { items, loading, error, refetch } = useInventoryItems(categoryId);
  
  const handleDelete = async () => {
    try {
      startTransition(async () => {
        await axios
          .delete(`/api/admin/inventory`, {
            data: {
              id: itemId,
              accessToken: accessToken,
            },
          })
          .then(() => {
            onSuccess();
            // refetch();
            toast("Item deleted successfully");
          });
      });
    } catch (error) {
      console.error("Error deleting category", error);
      toast.error("Error deleting category item");
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border border-red-500 text-red-500 hover:text-red-500 bg-[#c7000027] hover:bg-[#c700003b]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[20rem]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              onClick={handleDelete}
              disabled={isPending}
              type="button"
              variant="outline"
              className="border border-red-300 text-red-500 hover:text-red-500 bg-[#c7000027] hover:bg-[#c700003b]"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
