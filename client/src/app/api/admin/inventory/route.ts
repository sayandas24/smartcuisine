import axiosInstance from "@/lib/axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const {
      name,
      description,
      categoryId,
      img,
      isVeg,
      costPrice,
      discount,
      quantity,
      status,
      preparationTime,
      accessToken,
    } = await request.json(); 

    await axiosInstance
      .post(
        `/admin/inventory`,
        {
          name,
          description,
          category_id: categoryId,
          img,
          is_veg: isVeg,
          cost_price: costPrice,
          discount,
          quantity,
          status,
          preparation_time: preparationTime,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => {
        return NextResponse.json({
          status: 200,
          message: "Item added successfully",
        });
      })
      .catch((err) => {
        console.log("error in add category", err);
        return NextResponse.json({
          status: 500,
          message: "Error adding food item",
        });
      });
    return NextResponse.json({
      status: 200,
      message: "Item added successfully",
    });
  } catch (error) {
    console.error("Error adding inventory item:", error);
    return NextResponse.json({
      status: 500,
      message: "Error adding food item",
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const {
      id,
      name,
      description,
      categoryId,
      img,
      isVeg,
      costPrice,
      discount,
      quantity,
      status,
      preparationTime,
      accessToken,
    } = await request.json(); 

    const newStatus = typeof status === 'string' && status.includes(' ') ? status.split(' ').join('_') : status;
    await axiosInstance
      .patch(
        `/admin/inventory`,
        {
          id,
          name,
          description,
          category_id: categoryId,
          img,
          is_veg: isVeg,
          cost_price: costPrice,
          discount,
          quantity,
          status: newStatus,
          preparation_time: preparationTime,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => {
        return NextResponse.json({
          status: 200,
          message: "Item updated successfully",
        });
      })
      .catch((err) => {
        console.log("error in add category", err);
        return NextResponse.json({
          status: 500,
          message: "Error updating food item",
        });
      });

    return NextResponse.json({
      status: 200,
      message: "Item updated successfully",
    });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json({
      status: 500,
      message: "Error updating food item",
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, accessToken } = await request.json();

    await axiosInstance
      .delete(`/admin/inventory`, {
        data: { id },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        return NextResponse.json({
          status: 200,
          message: "Item deleted successfully",
        });
      })
      .catch((err) => {
        console.log("error in delete category", err);
        return NextResponse.json({
          status: 500,
          message: "Error deleting food item",
        });
      });

    return NextResponse.json({
      status: 200,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json({
      status: 500,
      message: "Error deleting food item",
    });
  }
}
