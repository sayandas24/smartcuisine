import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import axiosInstance from "@/lib/axios";
import { Order, GroupedOrder } from "@/types/Order";
import { convertToIST } from "@/utils/dateUtils";
import { enhanceOrdersWithCustomerDetails, enhanceOrdersWithFoodDetails } from "@/services/orderService";
import { groupOrdersByDateAndCustomer } from "@/utils/orderUtils";

export default function UseFetchOrders(accessToken: string | undefined) {
  // const [allOrders, setAllOrders] = useState<Order[]>([]); 
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
  const [allGroupedOrders, setAllGroupedOrders] = useState<GroupedOrder[]>([]);
  const [status, setStatus] = useState<string | null>("Connecting...");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState({
    stage: "idle",
    current: 0,
    total: 0
  });

  // Cache socket connection
  const [socket, setSocket] = useState<any>(null);
  
  // Process orders with error handling and progressive loading
  const processOrders = useCallback(async (ordersData: any[]) => {
    if (!ordersData.length) {
      setStatus("No orders received");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Add IST times to all orders (fast local operation)
      setLoadingProgress({ stage: "formatting", current: 0, total: ordersData.length });
      const ordersWithIST = ordersData.map((order: any) => ({
        ...order,
        ordered_on_ist: convertToIST(order.ordered_on),
        created_at_ist: convertToIST(order.created_at),
        updated_at_ist: convertToIST(order.updated_at)
      }));
      
      // Set all orders
      // setAllOrders(ordersWithIST);
      
      // Group ALL orders by date, time, and customer ID (not just pending)
      const allOrdersGrouped = groupOrdersByDateAndCustomer(ordersWithIST);
      setAllGroupedOrders(allOrdersGrouped);
      
      // Extract strictly pending orders with case-insensitive comparison
      // This is important - we need to use exactly the string "pending"
      const strictlyPendingOrders = ordersWithIST.filter(
        order => order.order_status && order.order_status.toLowerCase() === "pending"
      );
      
      
      // Set pending orders
      setPendingOrders(strictlyPendingOrders);
      
      // Group pending orders by date, time and customer ID
      const initialGrouped = groupOrdersByDateAndCustomer(strictlyPendingOrders);
      setGroupedOrders(initialGrouped);
      
      setStatus("Loading details...");
      setLoadingProgress({ stage: "enhancing", current: 1, total: 2 });
      
      try {
        // Process customer details first
        const customerEnhancedOrders = await enhanceOrdersWithCustomerDetails(ordersWithIST, accessToken || '');
        
        // Update state with customer info before proceeding to food details
        const initialCombined = ordersWithIST.map(order => {
          const customerInfo = customerEnhancedOrders.find(o => o.id === order.id)?.customer;
          return {
            ...order,
            customer: customerInfo
          };
        });
        
        // setAllOrders(initialCombined);
        
        // Then process food details with more careful error handling
        try {
          const itemEnhancedOrders = await enhanceOrdersWithFoodDetails(ordersWithIST, accessToken || '');
          
          // Combine the results
          const combinedOrders = ordersWithIST.map(order => {
            const customerInfo = customerEnhancedOrders.find(o => o.id === order.id)?.customer;
            const foodInfo = itemEnhancedOrders.find(o => o.id === order.id)?.foodDetails;
            
            return {
              ...order,
              customer: customerInfo,
              foodDetails: foodInfo
            };
          });
          
          // Update all state at once
          // setAllOrders(combinedOrders);
          
          // Group ALL enhanced orders first
          const allEnhancedGrouped = groupOrdersByDateAndCustomer(combinedOrders);
          setAllGroupedOrders(allEnhancedGrouped);
          
          // Extract strictly pending orders again with enhanced data - strict equality check for status
          const pendingEnhancedOrders = combinedOrders.filter(
            order => order.order_status && order.order_status.toLowerCase() === "pending"
          );
          
          setPendingOrders(pendingEnhancedOrders);
          
          // Group enhanced pending orders by date, time, and customer
          const groupedEnhanced = groupOrdersByDateAndCustomer(pendingEnhancedOrders);
          setGroupedOrders(groupedEnhanced);
          
          setStatus("All order data loaded successfully ✅");
        } catch (foodError) {
          console.error("Error loading food details:", foodError);
          setStatus("Orders loaded with partial details (some food details missing)");
          setError("Some food details could not be loaded");
          
          // Still update the orders with what we have (customer info at least)
          const partialGrouped = groupOrdersByDateAndCustomer(initialCombined);
          setAllGroupedOrders(partialGrouped);
          
          const pendingPartial = initialCombined.filter(
            order => order.order_status && order.order_status.toLowerCase() === "pending"
          );
          setPendingOrders(pendingPartial);
          setGroupedOrders(groupOrdersByDateAndCustomer(pendingPartial));
        }
      } catch (customerError) {
        console.error("Error loading customer details:", customerError);
        setError("Failed to load customer details");
        setStatus("Orders loaded with minimal details (customer info missing)");
        
        // Still update orders with the basic info we have
        const basicGrouped = groupOrdersByDateAndCustomer(ordersWithIST);
        setAllGroupedOrders(basicGrouped);
        
        const pendingBasic = ordersWithIST.filter(
          order => order.order_status && order.order_status.toLowerCase() === "pending"
        );
        setPendingOrders(pendingBasic);
        setGroupedOrders(groupOrdersByDateAndCustomer(pendingBasic));
      }
      
      setLoadingProgress({ stage: "complete", current: 2, total: 2 }); 
    } catch (error) {
      console.error("Error processing orders:", error);
      setError("Failed to process order data");
      setStatus("Error: Failed to process orders");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  // Setup socket connection
  useEffect(() => {
    if (!accessToken) {
      setStatus("Waiting for authentication...");
      return;
    }

    if (!socket) {
      setStatus("Connecting to server...");
    
      const newSocket = io("wss://rapi.expressme.in", {
        auth: {
          token: accessToken,
        },
        // Improved socket connection parameters
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 30000,
        // Add transport options to improve connection stability
        transports: ['websocket', 'polling'],
        // Enable auto connect
        autoConnect: true,
      });
      
      setSocket(newSocket);
    }
    
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [accessToken, socket]);
  
  // Setup socket event handlers
  useEffect(() => {
    if (!socket) return;
    
    const handleConnect = () => {
      setStatus("Connected to server ✅");
      socket.emit("all_orders");
      
      // Set up a regular refresh timer to ensure data freshness
      const refreshTimer = setInterval(() => {
        if (socket.connected) {
          socket.emit("all_orders");
        }
      }, 60000); // Refresh every minute
      
      return () => clearInterval(refreshTimer);
    };
    
    const handleAllOrders = async (data: any) => {
      if (data && data.orders) {
        await processOrders(data.orders);
      } else {
        console.error("Invalid data format received:", data);
        setStatus("Error: Invalid data format received");
        setError("Received invalid order data format");
      }
    };
    
    const handleConnectError = (err: any) => {
      console.error("Socket connection error:", err.message);
      setStatus(`Connection error: ${err.message}`);
      setError(`Socket connection error: ${err.message}`);
      
      // Try to reconnect after a short delay
      setTimeout(() => {
        if (socket && !socket.connected) {
          socket.connect();
        }
      }, 3000);
    };
    
    const handleDisconnect = (reason: string) => {
      setStatus(`Disconnected from server: ${reason} ❌`);
      
      // Try to reconnect if disconnected due to transport error
      if (reason === 'transport error' || reason === 'ping timeout') {
        setTimeout(() => {
          if (socket && !socket.connected) {
            socket.connect();
          }
        }, 2000);
      }
    };
    
    const handleError = (err: any) => {
      console.error("Socket error:", err);
      setStatus(`Socket error: ${err}`);
      setError(`Socket error: ${err}`);
    };
    
    // Add event listeners
    socket.on("connect", handleConnect);
    socket.on("all_orders", handleAllOrders);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on("error", handleError);
    
    // Remove event listeners on cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("all_orders", handleAllOrders);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.off("error", handleError);
    };
  }, [socket, processOrders]);

  // Manual refresh function
  const refreshOrders = useCallback(() => {
    if (socket?.connected) {
      setStatus("Refreshing orders...");
      socket.emit("all_orders");
    } else {
      setError("Cannot refresh: not connected to server");
    }
  }, [socket]);

  return { 
    // allOrders, 
    pendingOrders, 
    groupedOrders,
    allGroupedOrders,
    status, 
    isLoading, 
    error,
    loadingProgress,
    refreshOrders
  };
} 