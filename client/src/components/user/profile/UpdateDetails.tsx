"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import {
  updateNameSchema,
  updatePasswordSchema,
} from "@/schemas/updateProfileSchema";
import ProfileImage from "./ProfileImage";
import UpdatePassword from "./UpdatePassword";
import UpdateName from "./UpdateName";
import { useSession } from "next-auth/react";
import { getUser } from "@/helpers/getUser";
import { Flame, Headset } from "lucide-react";
import ProfileHeader from "./ProfileHeader";

interface UpdateDetailsProps {
  onPasswordSubmit: (
    values: z.infer<typeof updatePasswordSchema>
  ) => Promise<{ status: number }>;
  onNameSubmit: (value: z.infer<typeof updateNameSchema>) => void;
  isNameSubmit: any;
  isPasswordSubmit: any;
  onProfilePictureUpload: any;
}

export default function UpdateDetails({
  onPasswordSubmit,
  onNameSubmit,
  onProfilePictureUpload,
  isNameSubmit,
  isPasswordSubmit,
}: UpdateDetailsProps) {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (session?.user?.accessToken) {
      getUser(session.user.accessToken)
        .then((data) => {
          setUserData(data.user);
        })
        .catch((err) => console.error(err));
    }
  }, [session]);

  return (
    <main>
      <ProfileHeader/>

      <div className="flex flex-col p-5 max-w-[50rem] mx-auto max-[500px]:p-3">
        <div className="my-5"></div>
        <div className="flex-1">
          <div className="">
            {/* Account Management */}
            <div className="lg:col-span-1">
              {/* Profile img */}
              <ProfileImage
                userData={userData}
                onProfilePictureUpload={onProfilePictureUpload}
              />
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <UpdateName
                  onNameSubmit={onNameSubmit}
                  userData={userData}
                  isNameSubmit={isNameSubmit}
                />
                <UpdatePassword
                  onPasswordSubmit={async (values) => {
                    await onPasswordSubmit(values);
                    return { status: 200 }; // Ensure a Promise<{ status: number }> is returned
                  }}
                  isPasswordSubmit={isPasswordSubmit}
                />
                {/*  */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
