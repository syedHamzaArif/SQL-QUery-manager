
import axios from "axios";
import { useRouter } from "next/router";
import { DOMAttributes } from "react";
import { Url } from "url";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Pricing from "@components/Pricing";

const StartFreeTrial = () => {
  const router = useRouter();
  const isActive = useSelector((state: RootState) => state.persistedReducer.accounts.isActive)
  const customerId = useSelector((state: RootState) => state.persistedReducer.accounts.stripeCustomerId)

  const handleManageSubscription: DOMAttributes<HTMLFormElement>["onSubmit"] =
    async (e) => {
      e.preventDefault();
      const res = await axios.post(`/api/manage-subscription`, { customerId });
      router.push(res.data as Url);
    };

  return (
    <>
      <div className="w-full md:w-3/4 p-4 mt-4 flex flex-col gap-4 rounded-lg shadow shadow-warning bg-warning text-warning-content">
        <p className="font-bold">
          {customerId
            ? "Your free trial has ended. Please subscribe to a plan to keep using AI Query!"
            : "Subscribe to a plan to begin using AI Query!"}
        </p>
        <p>
          Looking forward to seeing you use AI Query to it&apos;s fullest
          potential!
        </p>
      </div>
      {customerId && isActive ? (
        <form onSubmit={handleManageSubscription} className="mt-4">
          <button type="submit" className="btn btn-warning">
            Manage Billing
          </button>
        </form>
      ) : (
        <Pricing />
      )}
    </>
  );
};

export default StartFreeTrial;