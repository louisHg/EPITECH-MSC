"use client";

import Image from "next/image";
import { useMemo } from "react";
import dynamic from "next/dynamic";

const ContactSection: React.FC = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );
  return (
    <div className="flex flex-col min-h-[300px] w-full px-[10%] gap-10 mb-16">
      <div className="flex flex-col gap-5 h-fit">
        <h3 className="font-semibold text-4xl">Get in touch</h3>
        <p className="font-light opacity-50 text-xl">
          Our friendly team would love to hear from you.
        </p>
      </div>

      <div className="flex w-full h-full gap-10">
        <div className="flex flex-col gap-10">
          <div className="flex gap-3">
            <Image
              loading="lazy"
              src="/images/Global/email_icon.svg"
              alt="email icon"
              className="self-start"
              width={50}
              height={50}
            />

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-lg">Email</h4>
              <p className="text-opacity-50 font-light">
                Our friendly team is here to help.
              </p>
              <p className="text-blue-700 font-semibold">
                contact@trackfinder.tech
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Image
              loading="lazy"
              src="/images/Global/pin_icon.svg"
              alt="email icon"
              className="self-start"
              width={50}
              height={50}
            />
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-lg">Office</h4>
              <p className="text-opacity-50 font-light">
                Come say hello at our office HQ.
              </p>
              <p className="text-blue-700 font-semibold">
                101 Rue de l&#39;Hôpital Militaire 59800 Lille
              </p>
            </div>
          </div>
        </div>

        <div className="w-full h-[300px] hidden md:block">
          <Map position={[48.870457, 2.342755]} zoom={16} points={[]} />
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
