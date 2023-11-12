import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import { useRouter } from "next/router";
import * as React from "react";
import { useSelector } from "react-redux";
import { Url } from "url";
import { RootState } from "../redux/store";
import getStripe from "../stripe/getStripe";
import { ErrorToast } from "./Toasts";

interface IPlanCardProps {
  title: string;
  price: string;
  benefits: string[];
  isAnnual: boolean;
  name: string;
  priceId: any;
}

const PlanCard: React.FunctionComponent<IPlanCardProps> = ({
  title,
  price,
  benefits,
  isAnnual,
  name,
  priceId,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const customerId = useSelector(
    (state: RootState) => state.persistedReducer.accounts.stripeCustomerId
  );

  const isActive = useSelector(
    (state: RootState) => state.persistedReducer.accounts.isActive
  );

  const stripeCustomerId = useSelector(
    (state: RootState) => state.persistedReducer.accounts.stripeCustomerId
  );

  const handleManageSubscription: React.DOMAttributes<HTMLFormElement>["onSubmit"] =
    async (e) => {
      e.preventDefault();
      const res = await axios.post(`/api/manage-subscription`, { customerId });
      router.push(res.data as Url);
    };

  

  const redirectToCheckout = async (price: string) => {
    try {
      // Create Stripe checkout
      const {
        data: { id },
      } = await axios.post("/api/checkout_sessions", {
        price,
        uid: user?.sub,
        email: user?.email,
        customer: stripeCustomerId,
      });

      // Redirect to checkout
      const stripe = await getStripe();
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (error) {
      ErrorToast("An error occurred while redirecting to checkout");
    }
  };

  return (
    <>
      <div
        className={`my-10 flex flex-col justify-between p-6 mx-auto max-w-md text-center bg-transparent rounded-[20px] xl:p-8 ${"border-[1px] border-[#007CDE]"}`}
      >
        {isAnnual && (
          <button className="relative -top-12 btn bg-gradient-to-r from-[#0177e1] to-[#004cf7] border-none rounded-[20px] m-auto text-white font-roboto font-[500]">
            Most Popular
          </button>
        )}

        <h3
          className={`mb-2 mt-0 pt-0 text-[21px] text-textPrimary font-[600]  font-roboto`}
        >
          {title}
        </h3>
        <p className=" text-[28px] text-[#7E7E7E] font-[500] font-ibm dark:text-white">
          {name && name}
        </p>
        <div className="flex justify-center items-baseline my-2">
          <span className="mr-2 text-[35px] text-textPrimary font-[700] font-ibm">
            {price}
          </span>
          <span className="text-[20px] text-textPrimary font-[400] font-roboto">
            {isAnnual ? "/year" : "/month"}
          </span>
        </div>
        <ul role="list" className="mb-8 space-y-4 text-left">
          {benefits.map((b, j) => {
            const words = b.split(" ");
            const firstWord = words[0];
            const restOfWords = words.slice(1).join(" ");

            return (
              <li className="flex items-center space-x-3" key={j}>
                <span className="material-icons text-[#007CDE] dark:text-white">
                  done
                </span>
                <span className="font-400 font-roboto text-black dark:text-white">
                  <span
                    className={
                      firstWord === "Faster" || firstWord === "Priority"
                        ? "text-[#004CF7] dark:text-white"
                        : "text-[#7E7E7E] dark:text-white"
                    }
                  >
                    {firstWord}&nbsp;
                  </span>
                  {restOfWords}
                </span>
              </li>
            );
          })}
        </ul>

        {isActive ? (
          <form onSubmit={handleManageSubscription}>
            <button
              className=" uppercase
               btn bg-gradient-to-r from-[#0177e1] to-[#004cf7] hover:from-[#004cf7]  hover:to-[#085da9] border-none rounded-[20px] w-[70%] m-auto text-white font-roboto font-[600]"
              type="submit"
            >
              Manage billing
            </button>
          </form>
        ) : (
          <button
            onClick={() => redirectToCheckout(priceId)}
            className=" uppercase
          btn bg-gradient-to-r from-[#0177e1] to-[#004cf7] hover:from-[#004cf7]  hover:to-[#085da9] border-none rounded-[20px] w-[70%] m-auto text-white font-roboto font-[600]"
            type="submit"
          >
            Upgrade to Pro
          </button>
        )}
      </div>
    </>
  );
};

export default PlanCard;
