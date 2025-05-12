import axiosInstance from "@/lib/axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, description, img, accessToken } = body;

  try {
    await axiosInstance
      .post(
        "/category",
        {
          name,
          description,
          img,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .catch((err) => {
        console.log(err, "error while adding category");
      });

    return NextResponse.json(
      { message: "Category added successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload category" },
      { status: 500 }
    );
  }
}
export async function PATCH(req: Request) {
  const body = await req.json();
  const { name, description, img, categoryId, accessToken } = body;
  console.log(name, description, img, accessToken, "body");
  try {
    await axiosInstance
      .patch(
        "/category",
        { name, description, img, id: categoryId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => {
        console.log("successfully updated category", res);
      })
      .catch((err) => {
        console.log(err, "error while updating category");
      });
    return NextResponse.json(
      { message: "Category updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "error while updating category");
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  const body = await req.json();
  console.log(body, "body************");
  try {
    await axiosInstance.delete(`/category`, {
      data: {
        id: body.categoryId,
      },
      headers: { Authorization: `Bearer ${body.accessToken}` },
    });
  } catch (error) {
    console.log("Error while deleting category");
    return NextResponse.json(
      { message: "Error while deleting category" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Category deleted successfully" },
    { status: 200 }
  );
}
