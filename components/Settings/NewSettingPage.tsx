import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import lightMode from "../../public/newpictures/light_mode.svg";
import { setDarkModeTheme } from "../../redux/reducers/darkModeSlice";
import { RootState } from "../../redux/store";
import CreateProfile from "./CreateProfile";
import SubscriptionPlan from "./SubscriptionPlan";
import { ErrorToast } from "@components/Toasts";

interface IProps {
  isActive: boolean;
}

const NewSettingPage = ({ isActive }: IProps) => {
  const [tabs, setTabs] = useState("Profile");
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const dispatch = useDispatch();
  const { user } = useUser();
  const router = useRouter();

  const newTheme = useSelector(
    (state: RootState) => state.persistedReducer.darkmode.theme
  );

  const handleTheme = () => {
    dispatch(setDarkModeTheme(newTheme === "light" ? "dark" : "light"));
  };

  const handleTabs = () => {
    switch (tabs) {
      case "Profile":
        return <CreateProfile />;
      case "Subscription":
        return <SubscriptionPlan isActive={isActive} />;
    }
  };

  const handleDeleteAccount = async () => {
    if (email !== confirmEmail) return alert("Emails do not match");
    if (email !== user?.email) return alert("Invalid email provided");
    try {
      const axiosConfig = {
        url: "/api/me/delete",
        method: "delete",
      };
      await axios(axiosConfig);
      router.push("/api/auth/logout");
      setOpenModal(false);
    } catch (error) {
      ErrorToast("Oops, something went wrong, please try again");
    }
  };

  return (
    <>
      <div className="w-[98%] min-h-[13vh] text-xl font-semibold	p-4 rounded-lg mt-3  flex justify-between items-center bg-white dark:bg-[#2D2D2D]">
        <div className="flex items-center">
          <FiSettings className="text-[21px] mr-3" />

          <span>Settings</span>
        </div>

        <div className="flex items-center">
          {newTheme === "light" ? (
            <Image
              className=""
              src={lightMode}
              alt="Picture of the author"
              width={24}
              height={24}
              onClick={handleTheme}
            />
          ) : (
            <span className="material-icons text-3xl" onClick={handleTheme}>
              dark_mode
            </span>
          )}
        </div>
      </div>
      <div className="min-h-[80vh] bg-white mt-[2vh] w-[98%] ">
        <div className=" w-[100%] pb-10 bg-white dark:bg-[#2D2D2D] mt-5 rounded-lg px-5 py-4 ">
          <div className="w-full flex justify-between items-center px-5">
            <div className="tabs tabs-boxed bg-[#E8F2FF] dark:bg-[#2D2D2D] h-[70px] xl:w-[33%] w-[50%] justify-center rounded-lg items-center dark:border dark:border-[#E8F2FF] ">
              <p
                onClick={() => setTabs("Profile")}
                className={`tab ${
                  tabs == "Profile" && "activeTab"
                } font-[400] text-[18px] rounded-lg w-[30%] h-[50px] font dark:text-white`}
              >
                Profile
              </p>
              <p
                onClick={() => setTabs("Subscription")}
                className={`tab ${
                  tabs == "Subscription" && "activeTab"
                }  font-[400] text-[18px] rounded-lg xl:w-[63%] w-[68%] h-[50px] dark:text-white`}
              >
                Subscription Plan
              </p>
            </div>
            {tabs == "Profile" && (
              <button
                onClick={() => setOpenModal(true)}
                className="uppercase w-[150px] h-10 border border-[#FC0000] rounded-lg text-[#FC0000] bg-[#ffe6e6] hover:border-[#FC0000] hover:bg-white hover:text-[#FC0000]"
              >
                Delete Account
              </button>
            )}

            {/* Delete account modal */}
            <div className={`modal ${openModal ? "modal-open" : ""}`}>
              <div className="modal-box relative">
                <h3 className="text-[20px] font-[600] text-[#2D2D2D] dark:text-white">
                  Enter your Email to delete account
                </h3>
                <div className="flex gap-2 mt-3">
                  <div className="w-[48%]">
                    <p className="text-[#2D2D2D] dark:text-white font-[400] text-[16px] mb-1">
                      Email
                    </p>
                    <input
                      className=" bg-white p-3 rounded-xl border border-[#004CF7] text-[#2D2D2D] dark:bg-[#2D2D2D] dark:text-[#E2E2E2] dark:border-white w-full h-10"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-[48%]">
                    <p className="text-[#2D2D2D] dark:text-white font-[400] text-[16px] mb-1">
                      Confirm Email
                    </p>
                    <input
                      className=" bg-white p-3 rounded-xl border border-[#004CF7] text-[#2D2D2D] dark:bg-[#2D2D2D] dark:text-[#E2E2E2] dark:border-white w-full h-10"
                      placeholder="john@example.com"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="text-[15px] tracking-wide rounded-lg px-4 pt-3 pb-3 border border-[#004CF7] dark:border-white dark:text-white mr-3 font-normal hover:bg-red-700 hover:text-white hover:border-red-700 uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="uppercase w-[160px] h-[40px] ml-2 btn btn-square bg-gradient-to-r from-[#0177e1] to-[#004cf7] border-none hover:from-[#004cf7]  hover:to-[#085da9] dark:text-white"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 mt-10">{handleTabs()}</div>
        </div>
      </div>
    </>
  );
};

export default NewSettingPage;
