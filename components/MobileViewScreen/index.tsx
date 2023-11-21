import { NextSeo } from "next-seo";
import Image from "next/future/image";
import React from "react";
import mobileviewimg from "../../public/newpictures/mobileviewimg.png";

const MobileViewScreen = () => {
  return (
    <>
      <NextSeo
        title="Dashboard | SQL Query Manager"
        description="SQL Query Manager helps you generate complex SQL queries in seconds. Use simple English prompts to generate SQL queries. SQL Query Manager uses state of the art GPT-3 AI model to give you the best results."
        canonical="https://aiquery.co"
        openGraph={{
          url: "https://aiquery.co",
          title: "Dashboard | SQL Query Manager",
          description:
            "SQL Query Manager helps you generate complex SQL queries in seconds. Use simple English prompts to generate SQL queries. SQL Query Manager uses state of the art GPT-3 AI model to give you the best results.",
          images: [{ url: "https://aiquery.co/dashboard-hero.png" }],
          siteName: "SQL Query Manager",
        }}
        twitter={{
          handle: "@HelloAIQuery",
          cardType: "summary_large_image",
        }}
      />




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
