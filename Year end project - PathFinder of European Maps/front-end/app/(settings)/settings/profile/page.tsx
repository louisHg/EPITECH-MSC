"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDeviceType from "@/hooks/use-device-type";
import Image from "next/image";

interface SettingsProfileProps {}

const SettingsProfile: React.FC<SettingsProfileProps> = () => {
  const deviceType = useDeviceType();
  const profileImgUrl = "/images/Global/default_profile.png";
  return (
    <>
      <div className="w-full h-60 bg-gradient-to-tr from-blue-200 to-gray-100 "></div>
      <div className="flex md:flex-row flex-col w-full justify-between items-center  px-0 md:px-10 mb-5">
        <div className="flex">
          {deviceType === "mobile" ? (
            <Image
              height={80}
              width={80}
              src={profileImgUrl}
              alt="default profile picture"
              className="rounded-full mt-[-30px] border h-[100%] w-[50%]"
            />
          ) : (
            <Image
              src={profileImgUrl}
              height={180}
              width={180}
              alt="default profile picture"
              className="rounded-full mt-[-60px] border"
            />
          )}

          <div className="flex flex-col gap-6 ml-3 md:ml-10 md:w-auto w-[50%] py-6">
            <h2 className="text-3xl font-semibold">Profile</h2>
            <p className="font-light text-sm opacity-50">
              Update your photo and personnal details
            </p>
          </div>
        </div>

        <div className="flex gap-3 md:mt-0 mt-3">
          <Button className="bg-white hover:bg-gray-100 text-black border ">
            Cancel
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-400 dark:text-white ">
            Save
          </Button>
        </div>
      </div>
      <hr />
      <div className="w-full flex gap-24 items-center my-5">
        <label htmlFor="username" className="text-sm">
          Username
        </label>
        <Input type="username" placeholder="Username..." className="max-w-xs" />
      </div>
      <hr />
      <div className="py-3 w-full flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-sm">Your photo</p>
          <p className="text-sm opacity-50 font-light">
            This will be displayed on your profile.
          </p>
        </div>
        <Image
          src={profileImgUrl}
          height={80}
          width={80}
          alt="default profile picture"
          className="rounded-full border"
        />
        <div className="flex gap-3">
          <Button className="bg-white hover:bg-gray-100 text-black border ">
            Delete
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-400 dark:text-white ">
            Update
          </Button>
        </div>
      </div>
    </>
  );
};

export default SettingsProfile;
