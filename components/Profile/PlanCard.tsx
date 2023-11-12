import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Tick from "../../public/tick.png";
import Image from "next/future/image";

interface IProps {
  data: {
    planName: string;
    startDate: number;
    endDate: number;
    status: string;
  };
}

const PlanCard = ({ data }: IProps) => {
  // const dt = +new Date(myPlans.startDate);
  // const Startdate = moment(dt).format("MM/DD/YYYY");

  // const dtt = +new Date(myPlans.endDate);
  // const Enddate = moment(dtt).format("MM/DD/YYYY");

  const planType = data?.planName;
  // const planType = "Pro Monthly";

  const planFeatures = [
    "Unlimited SQL Query Generation",
    "Unlimited SQL Explanations",
    "Unlimited Database Schema",
    "Unlimited Save and Share SQL Queries",
    "Unlimited SQL Query History",
    `${
      planType == "Pro Yearly"
        ? "Faster AI Response Speed"
        : "Standard AI Response Speed"
    }`,
    `${
      planType == "Pro Yearly"
        ? "Priority Access to New Features"
        : "Standard Access to New Features"
    }`,
    `${planType == "Pro Yearly" ? "Priority Support" : "Regular Support"}`,
    "Cancel Anytime",
  ];

  return (
    <>
      <div className="my-5">
        <div className=" bg-white dark:bg-[#2D2D2D] w-[393px] h-[616px] border border-[#004CF7] dark:border-white flex flex-col items-center rounded-lg">
          <div className="w-[140px] h-8 bg-gradient-to-r from-[#0177e1] to-[#004cf7]  rounded-2xl flex items-center justify-center mt-8">
            <p className="text-white text-[16px] font-[600] text-center">
              Current Plan
            </p>
          </div>
          <div className="flex flex-col items-center mt-2">
            <p className="text-[24px] font-[600] text-[#2D2D2D] dark:text-white">
              Pro
            </p>
            {planType == "Pro Yearly" ? (
              <p className="font-[800] text-[46px] -mt-1">
                $100<span className="text-[15px] font-[400]">/year</span>
              </p>
            ) : (
              <p className="font-[800] text-[46px] -mt-1">
                $10<span className="text-[15px] font-[400]">/month</span>
              </p>
            )}
          </div>
          <div>
            {planFeatures.map((plan: string, index: number) => (
              <div key={index} className="flex items-center mt-4">
                <Image src={Tick} alt="tick" className="" />
                <p className="ml-2 text-[16px] font-[400] text-[#7E7E7E]">
                  {plan}
                </p>
              </div>
            ))}
          </div>
          <button className="bg-gradient-to-r from-[#0177e1] to-[#004cf7] uppercase text-white w-[77%] h-12 rounded-md mt-5">
            Change plan
          </button>
        </div>
      </div>
    </>
  );
};

export default PlanCard;
