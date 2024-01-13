import { UserProfile } from "@auth0/nextjs-auth0";
import { ErrorToast, SuccessToast } from "@components/Toasts";
import axios from "axios";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import {
  AiOutlineConsoleSql,
  AiOutlineDatabase,
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { CgCommunity } from "react-icons/cg";
import { FiHelpCircle, FiLogOut, FiSettings } from "react-icons/fi";
import { MdDashboard, MdOutlineRateReview } from "react-icons/md";
import { Circles } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ai_query_dark_blue_icon from "../../public/newpictures/ai_query_dark_blue_icon.svg";
import ai_query_white_icon from "../../public/newpictures/ai_query_white_icon.svg";
import { RootState } from "../../redux/store";

type Props = {
  user: UserProfile;
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
};

const LeftPanel = ({ user, tab, setTab }: Props) => {
  const newTheme = useSelector(
    (state: RootState) => state.persistedReducer.darkmode.theme
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [leftSideBar, setLeftSideBar] = useState(false);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const sendEmail = async (e: any) => {
    e.preventDefault();

    setLoader(true);
    const axiosConfig = {
      url: "/api/invites/send",
      method: "post",
      data: {
        email,
      },
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await axios(axiosConfig);
      setEmail("");
      setShow(false);
      SuccessToast("Invitation Sent");
    } catch (error: any) {
      ErrorToast(error.response.data.error.message);
    } finally {
      setLoader(false);
    }
  };

  const topNavBar = [
    {
      name: "Query Playground",
      activePath: "/dashboard",
      toolTipName: "Query Playground",
      onClick: () => router.push("/dashboard"),
      icon: () => <MdDashboard className="text-[21px] dark:text-white" />,
    },

    {
      name: "Explain SQL",
      toolTipName: "Explain SQL",
      activePath: "/dashboard/explain",
      onClick: () => router.push("/dashboard/explain"),
      icon: () => (
        <AiOutlineConsoleSql className="text-[21px] dark:text-white" />
      ),
    },
    {
      name: "Databases",
      toolTipName: "Databases",
      activePath: "/dashboard/databases",
      onClick: () => router.push("/dashboard/databases"),
      icon: () => <AiOutlineDatabase className="text-[21px] dark:text-white" />,
    },
  ];

  const bottomNavBar = [
    {
      name: "Invite People",
      activePath: "",
      toolTipName: "Invite People",
      onClick: () => setShow(true),
      icon: () => (
        <AiOutlineUserAdd
          className="text-[21px] dark:text-white"
          onClick={() => setShow(true)}
        />
      ),
    },
    {
      name: "Settings",
      toolTipName: "Settings",
      activePath: "/dashboard/settings",
      onClick: () => router.push("/dashboard/settings"),
      icon: () => (
        <FiSettings
          className="text-[21px] dark:text-white"
          onClick={() => router.push("/dashboard/settings")}
        />
      ),
    },
    {
      name: "Logout",
      toolTipName: "Logout",
      activePath: "",
      onClick: () => router.push("/api/auth/logout"),
      icon: () => (
        <FiLogOut
          className="text-[21px] dark:text-white"
          onClick={() => router.push("/api/auth/logout")}
        />
      ),
    },
  ];

  return (
    <div
      className={`drawer  ${leftSideBar ? "w-[302px]" : "w-[82px]"}`}
    >
      <div className="drawer-side h-[95vh]">
        <ul className="menu flex flex-col justify-between h-full bg-[#E8F2FF] dark:bg-[#2D2D2D] px-3">
          <div className=" pt-8">
            <div
              className="mb-4 tooltip before:text-[10px] tooltip-bottom"
            //data-tip="Dashboard"
            >
              {leftSideBar ? (
                <div
                  onClick={() => router.push("/dashboard/")}
                  className={
                    router.pathname == "/dashboard/"
                      ? "active px-1 py-0 flex cursor-pointer"
                      : " px-1 py-0 flex cursor-pointer"
                  }
                >
                  <div className="flex items-center">
                    <Image
                      className=""
                      src={
                        newTheme === "light"
                          ? ai_query_white_icon
                          : ai_query_dark_blue_icon
                      }
                      alt={"Logo"}
                      // height={45}
                      width={50}
                    />

                    <p className="text-[#3b1d17] text-[24px] dark:text-white pl-4 font-semibold">
                      SQL Query Manager
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => router.push("/dashboard/")}
                  className={
                    router.pathname == "/dashboard/"
                      ? "active px-1 py-0 flex cursor-pointer"
                      : " px-1 py-0 flex cursor-pointer"
                  }
                >
                  <div className="flex justify-center  items-center">
                    <Image
                      className=""
                      src={
                        newTheme === "dark"
                          ? ai_query_dark_blue_icon
                          : ai_query_white_icon
                      }
                      alt={"Logo"}
                      width={50}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className=" hover:text-white">
              {topNavBar.map((t, i) =>
                leftSideBar ? (
                  <div
                    key={i}
                    className="hoverBtn text-[#3b1d17] hover:!text-white"
                  >
                    <div
                      onClick={() => t.onClick()}
                      className={
                        router.pathname == t.activePath
                          ? "active my-2  px-4 py-0 flex cursor-pointer hoverBtn "
                          : " px-4 py-0 my-2 flex cursor-pointer hoverBtn "
                      }
                    >
                      <div className="py-2 flex items-center">
                        <span
                          className={`material-icons ${router.pathname == t.activePath
                            ? "text-white dark:text-white text-[21px]"
                            : " dark:text-white text-[21px] "
                            }`}
                        >
                          {t.icon()}
                        </span>

                        <p
                          className={`pl-4 font-semibold ${router.pathname == t.activePath
                            ? "text-white dark:text-white"
                            : " dark:text-white hover:text-white"
                            }`}
                        >
                          {t.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={i}
                    className="hoverBtn text-[#3b1d17] hover:!text-white"
                  >
                    <div key={i}>
                      <div
                        onClick={() => t.onClick()}
                        className={
                          router.pathname == t.activePath
                            ? "active my-2   px-4 py-0 flex cursor-pointer hoverBtn  "
                            : " px-4 py-0 my-2 flex cursor-pointer hoverBtn "
                        }
                      >
                        <div
                          className="hover:text-white flex justify-center w-[100%] py-2 items-center tooltip before:text-[9px] tooltip-bottom"
                          data-tip={t.toolTipName}
                        >
                          <span
                            className={`material-icons ${router.pathname == t.activePath
                              ? "text-white dark:text-white text-[21px]"
                              : " text-[21px] "
                              }`}
                          >
                            {t.icon()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <ToastContainer />

          {/* bottom navigations  */}
          <div className="cursor-pointer">
            {user && (
              <>
                {bottomNavBar.map((nav, i) => {
                  return (
                    <div
                      className="py-2.5 hoverBtn hover:text-white"
                      key={i}
                      onClick={() => nav.onClick()}
                    >
                      {leftSideBar ? (
                        <div
                          onClick={() => nav.onClick()}
                          className={
                            router.pathname == nav.activePath
                              ? "active px-4 py-0 flex cursor-pointer text-white "
                              : " px-4 py-0 flex cursor-pointer"
                          }
                        >
                          <div className="flex items-center">
                            {nav.icon()}

                            <p
                              className={
                                router.pathname == nav.activePath
                                  ? "active pl-4  items-center font-semibold flex cursor-pointer text-white "
                                  : " pl-4 font-semibold flex cursor-pointer"
                              }
                            >
                              {nav.name}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => nav.onClick}
                          className={
                            router.pathname == nav.activePath
                              ? "active px-4 items-center py-[1.5px] flex cursor-pointer text-white tooltip before:text-[10px] tooltip-bottom"
                              : " px-4 py-[1.5px] flex items-center cursor-pointer tooltip before:text-[10px] tooltip-bottom"
                          }
                          data-tip={nav.toolTipName}
                        >
                          {nav.icon()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </ul>
      </div>

      <div className="h-[5vh] items-center p-2 bg-white dark:bg-[#0043A8] flex justify-end">
        {!leftSideBar ? (
          <AiOutlineDoubleRight
            className="text-[21px] text-[#004CF8] dark:text-white cursor-pointer"
            onClick={() => setLeftSideBar(true)}
          />
        ) : (
          <AiOutlineDoubleLeft
            className="text-[21px] text-[#004CF8] dark:text-white cursor-pointer"
            onClick={() => setLeftSideBar(false)}
          />
        )}
      </div>

      <div className={`modal ${show ? "modal-open" : ""}`}>
        <div className="modal-box bg-white dark:bg-[#2D2D2D]">
          <div className="modal-action m-0 ">
            <label
              htmlFor="my-modal"
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setShow(false)}
            >
              <span className="material-icons text-1xl">close</span>
            </label>
          </div>
          <p className="my-3 font-bold text-2xl text-black dark:text-white">
            Invite
          </p>

          <form action="" onSubmit={sendEmail}>
            <div className="flex ">
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                className="input w-full input-bordered bg-white dark:bg-[#2D2D2D]"
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {loader ? (
                <span className="h-[50px] w-[11%] mx-4 btn gradientbtn border-none">
                  <div className=" flex justify-center items-center mb-20 relative top-[7px] left-[0px]">
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
                </span>
              ) : (
                <button
                  type="submit"
                  className={`ml-2 btn btn-square bg-gradient-to-r from-[#e83864] to-[#3b1d17] border-none hover:from-[#3b1d17]  hover:to-[#a8072f] ${loading && "loading"
                    }`}
                >
                  {!loading && (
                    <span className="material-icons text-white ">send</span>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
