import React, { useState, useEffect } from "react";

import { Circles } from "react-loader-spinner";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import { verifySubscription } from "../../utils/verifySubscription";
import Pricing from "@components/Pricing";
import { AnnualPlan, MonthlyPlan } from "../../mock/Pricing";
import PlanCard from "@components/PlanCard";

interface IProps {
  isActive?: boolean;
}

const SubscriptionPlan = ({ isActive }: IProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [myPlans, setMyPlans] = useState<any>([]);

  const myPlan = async () => {
    const config = {
      method: "GET",
      url: "/api/stripe/get-my-plan",
    };
    setIsLoading(true);
    await axios(config)
      .then((response) => {
        setMyPlans(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isLoading) myPlan();
  }, [isLoading]);

  return (
    <div>
      <p className="text-[#2D2D2D] text-[25px] font-[500] dark:text-white">
        Subscription Plan
      </p>
      <div className="border-t border-t-[#3b1d17] dark:border-t-white  mt-2"></div>
      {isActive ? (
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-[600px]">
              <Circles
                height="30"
                width="30"
                color="#1A1E25"
                ariaLabel="circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          ) : (
            // <PlanCard data={myPlans} />
            <>
              {myPlans.planName === 'Pro Monthly' ? MonthlyPlan.map((p: any, i: any) => (
                <PlanCard
                  priceId={p.priceId}
                  key={i}
                  name={p.name}
                  title={p.title}
                  price={p.price}
                  benefits={p.benefits}
                  isAnnual={p.isAnnual}
                />
              )) : AnnualPlan.map((p: any, i: any) => (
                <PlanCard
                  priceId={p.priceId}
                  key={i}
                  name={p.name}
                  title={p.title}
                  price={p.price}
                  benefits={p.benefits}
                  isAnnual={p.isAnnual}
                />
              ))}
            </>
          )}
        </div>
      ) : (
        <Pricing />
      )}
    </div>
  );
};

export default SubscriptionPlan;
