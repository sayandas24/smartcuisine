import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export const useInventoryItems = (categoryId?: string) => {
  const [items, setItems] = useState<any[]>([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllItems = async () => {
    try {
      const response = await axiosInstance.get("/inventory");
      if (response.data && response.data.inventory) {
        setAllItems(response.data.inventory);
      } else {
        setAllItems([]);
      }
    } catch (err) {
      console.error("Error fetching all items:", err);
    }
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchData = async () => {
    if (!categoryId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/inventory?category_id=${categoryId}`
      );

      if (response.data && response.data.inventory) {
        setItems(response.data.inventory);
      } else {
        setItems([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load inventory items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  return { items, loading, error, refetch: fetchData, allItems, fetchAllItems };
};
