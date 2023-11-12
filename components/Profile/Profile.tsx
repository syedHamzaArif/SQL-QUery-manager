import axios from "axios";
import { useRouter } from "next/router";
import { DOMAttributes, useEffect, useState } from "react";
import { Url } from "url";
import { useUser } from "@auth0/nextjs-auth0";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Pricing from "@components/Pricing";
// import Pricing from "../Pricing/Pricing";

interface IProps {
  isActive: boolean;
}

const Profile = ({ isActive }: IProps) => {
  const router = useRouter();
  const { user } = useUser();

  const [myPlans, setMyPlans] = useState([]);
  const customerId = useSelector(
    (state: RootState) => state.persistedReducer.accounts.stripeCustomerId
  );

  const handleManageSubscription: DOMAttributes<HTMLFormElement>["onSubmit"] =
    async (e) => {
      e.preventDefault();
      const res = await axios.post(`/api/manage-subscription`, { customerId });
      router.push(res.data as Url);
    };



  return (
    <>
      <div className="py-4">
        <h3 className="text-2xl font-semibold">Profile</h3>
        <div className="divider"></div>

        <div className=" max-w-md overflow-hidden md:max-w-2xl">
          <div className="md:flex gap-10 items-center">
            <div className="avatar md:online mt-3">
              <div className="w-24 max-[400px]:w-12 rounded-full">
                <img
                  src={user?.picture as string}
                  alt={user?.email as string}
                />
              </div>
            </div>

            <div className="form-control w-full mt-3">
              <label className="input-group">
                <span className="label-text">Email</span>
                <input
                  type="text"
                  className="input input-bordered w-full max-w-sm"
                  defaultValue={user?.email as string}
                  disabled={true}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div>
          <h3 className="text-2xl font-semibold flex items-center gap-4">
            Billing
            {isActive && (
              <div className="badge badge-success badge-lg">Pro Plan</div>
            )}
          </h3>
          {customerId && (
            <form onSubmit={handleManageSubscription} className="mt-4">
              <button type="submit" className="btn btn-warning">
                Manage billing
              </button>
            </form>
          )}
          {!customerId && <Pricing />}
        </div>
      </div>

     

     
    </>
  );
};

export default Profile;
