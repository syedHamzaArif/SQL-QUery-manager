import { NextSeo } from "next-seo";
import Image from "next/future/image";
import React from "react";
import mobileviewimg from "../../public/newpictures/mobileviewimg.png";

const MobileViewScreen = () => {
  return (
    <>





      <div className="savebtn h-[100vh] flex flex-col justify-center items-center">
        <Image src={mobileviewimg} alt="mobileview" width={500} />
        <p className="text-white text-[20px] mt-5 w-[50%] text-center">
          For a better experience, please open the dashboard from your laptop/desktop with an optimal screen resolution.
        </p>
      </div>
    </>
  );
};

export default MobileViewScreen;
