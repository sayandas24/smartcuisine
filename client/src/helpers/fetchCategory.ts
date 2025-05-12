"use client";
import axiosInstance from "@/lib/axios";

export const fetchCategory = async () => {
  try {
    const response = await axiosInstance.get("/categories");

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};
