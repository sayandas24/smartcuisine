"use client";
import { z } from "zod";
import {
  updateNameSchema,
  updatePasswordSchema,
} from "@/schemas/updateProfileSchema";
import UpdateDetails from "@/components/user/profile/UpdateDetails";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function UserProfileLayout() {
  const { data: session } = useSession();
  const [isNameSubmit, setIsNameSubmit] = useState(false);
  const [isPasswordSubmit, setIsPasswordSubmit] = useState(false);
  const searchParams = useSearchParams();

  // Check for error parameter to display toast
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'unauthorized_admin_access') {
      toast.error("You don't have permission to access the admin area");
    }
  }, [searchParams]);

  // Update password
  const onPasswordSubmit = async (
    values: z.infer<typeof updatePasswordSchema>
  ) => {
    setIsPasswordSubmit(true);
    try {
      await axios.post("/api/user/update", {
        uid: session?.user?._id,
        password: values.newPassword,
        accessToken: session?.user?.accessToken,
        email: session?.user?.email,
        username: session?.user?.username,
      });
      toast.success("Password updated successfully");
      setIsPasswordSubmit(false);
    } catch (error) {
      setIsPasswordSubmit(false);
      toast.error("Unable to update password");
    }
  };
  // Update Name
  const onNameSubmit = async (values: z.infer<typeof updateNameSchema>) => {
    setIsNameSubmit(true);
    try {
      await axios
        .post("/api/user/update", {
          username: values.username,
          name: values.name,
          phone_number: values?.phone_number,
          uid: session?.user?._id,
          accessToken: session?.user?.accessToken,
        })
        .then(() => {
          toast.success("User details updated successfully");
          setIsNameSubmit(false);
        })
        .catch((err) => {
          toast.error(err);
          console.log(err.message);
          setIsNameSubmit(false);
        });
    } catch (error) {
      toast.error("Unable to update user");
      throw new Error("Unable to update user");
    }
  };
  // Update Profile picture
  const onProfilePictureUpload = async (values: string, uid: string) => {
    try {
      const response = await axios.post("https://files.expressme.in/upload", {
        fileName: "image.png",
        fileData: values,
      });

      if (response.status == 201) {
        const downloadLink = response.data?.downloadLink;

        const updateResponse = await axios.post("/api/user/update", {
          uid: session?.user?._id,
          profile_pic: downloadLink,
          accessToken: session?.user?.accessToken,
        });

        if (updateResponse.status === 200) {
          toast.success("Profile picture uploaded successfully");
          return { status: 200, message: downloadLink };
        } else {
          toast.error("Failed to upload profile picture");
          return { status: updateResponse.status, message: "Failed to upload" };
        }
      } else {
        toast.error("Failed to upload profile picture");
        return { status: response.status, message: "Failed to upload" };
      }
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("An error occurred while uploading");
      return { status: 500, message: "An error occurred" };
    }
  };

  return (
    <main>
      <UpdateDetails
        onPasswordSubmit={async (values) => {
          const result = await onPasswordSubmit(values);
          return { status: 200 };
        }}
        onNameSubmit={async (values) => {
          await onNameSubmit(values);
          return { status: 200 };
        }} 
        onProfilePictureUpload={onProfilePictureUpload}
        isNameSubmit={isNameSubmit}
        isPasswordSubmit={isPasswordSubmit}
      />
    </main>
  );
}
