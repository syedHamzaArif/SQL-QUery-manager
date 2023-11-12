import Link from "next/link";
import { RefObject, useRef, useState } from "react";
import { UserProfile } from "@auth0/nextjs-auth0";
import LeftPanel from "./LeftPanel";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRouter } from "next/dist/client/router";
import { AiOutlineArrowUp } from "react-icons/ai";

type Props = {
  user: UserProfile;
  isLoading: boolean;
  children: any;
};

const UserDashboard = ({ children, user, isLoading }: Props) => {
  const isActive = useSelector(
    (state: RootState) => state.persistedReducer.accounts.isActive
  );
  const [tab, setTab] = useState(0);
  const router = useRouter();
  // const divRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  // const scrollToTop = (): void => {
  //   divRef?.current?.scroll({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // };

  return (
    <>
      {/* {creditBalance && creditBalance === 0 && (
        <div className="h-8 bg-error text-error-content text-center">
          <a className="font-semibold cursor-pointer" onClick={() => setTab(3)}>
            0 Credits left. Buy more credits now!
          </a>
        </div>
      )} */}
      <section className="flex gap-8">
        <div className="">
          <LeftPanel user={user} tab={tab} setTab={setTab} />
        </div>

        <div className="btm-nav z-40 h-16 lg:hidden  bg-white dark:bg-[#2D2D2D]">
          <div
            onClick={() => router.push("/dashboard")}
            className={
              router.pathname == "/dashboard"
                ? "active px-4 py-3 flex cursor-pointer"
                : " px-4 py-3 flex cursor-pointer"
            }
          >
            <div>
              <span className="material-icons">code</span>
            </div>
          </div>

          <div
            onClick={() => router.push("/dashboard/explain")}
            className={
              router.pathname == "/dashboard/explain"
                ? "active px-4 py-3 flex cursor-pointer"
                : " px-4 py-3 flex cursor-pointer"
            }
          >
            <div>
              <span className="material-icons">smart_toy</span>
            </div>
          </div>

          <div
            onClick={() => router.push("/dashboard/settings")}
            className={
              router.pathname == "/dashboard/settings"
                ? "active px-4 py-3 flex cursor-pointer"
                : " px-4 py-3 flex cursor-pointer"
            }
          >
            <div>
              <span className="material-icons">settings</span>
            </div>
          </div>
          <div
            onClick={() => router.push("/dashboard/help")}
            className={
              router.pathname == "/dashboard/help"
                ? "active px-4 py-3 flex cursor-pointer"
                : " px-4 py-3 flex cursor-pointer"
            }
          >
            <div>
              <span className="material-icons">help</span>
            </div>
          </div>
          <div
            onClick={() => router.push("/dashboard/profile")}
            className={
              router.pathname == "/dashboard/profile"
                ? "active px-4 py-3 flex cursor-pointer"
                : " px-4 py-3 flex cursor-pointer"
            }
          >
            <div>
              <span className="material-icons">account_circle</span>
            </div>
          </div>

          <div
            onClick={() => router.push("/dashboard/optimize-queries")}
            className={
              router.pathname == "/dashboard/optimize-queries"
                ? "active px-4 py-3 flex cursor-pointer "
                : " px-4 py-3 flex cursor-pointer"
            }
          >
            <span className="material-icons pr-3 ">query_stats</span>
            <span className="w-32 ">
              <div>Optimize Queries</div>
            </span>
          </div>
          <div
            onClick={() => router.push("/dashboard/create-index")}
            className={
              router.pathname == "/dashboard/create-index"
                ? "active px-4 py-3 flex cursor-pointer "
                : " px-4 py-3 flex cursor-pointer"
            }
          >
            <span className="material-icons pr-3 ">list</span>
            <span className="w-32 ">
              <div>Create Index</div>
            </span>
          </div>

          {user && (
            <>
              <button className="w-[14%]">
                <Link href={"/"}>
                  <a className={"rounded-none"}>
                    <span className="material-icons">home</span>
                  </a>
                </Link>
              </button>
              <button className="w-[14%]">
                <a className={"rounded-none"} href={"/api/auth/logout"}>
                  <span className="material-icons">logout</span>
                </a>
              </button>
            </>
          )}
        </div>

        {!isLoading && isActive !== null ? (
          <div
            className="flex flex-col justify-start h-[100vh] w-full scrollbar-thin scrollbar-thumb-base-200 overflow-y-scroll overflow-x-hidden scrollbar-thumb-rounded-full scrollbar-track-rounded-full px-8 pb-20 lg:pb-0 lg:px-0"
            // ref={divRef}
          >
            {children}
          </div>
        ) : (
          <div role="status" className="max-w-sm animate-pulse">
            <div className="h-4 bg-base-200 rounded-full w-96 my-4"></div>
            <div className="h-3 bg-base-200 rounded-full max-w-[360px] my-2.5"></div>
            <div className="h-3 bg-base-200 rounded-full my-2.5"></div>
            <div className="h-2 bg-base-200 rounded-full max-w-[330px] my-2.5"></div>
            <div className="h-3 bg-base-200 rounded-full max-w-[300px] my-2.5"></div>
            <div className="h-3 bg-base-200 rounded-full max-w-[360px]"></div>
            <div className="h-4 bg-base-200 rounded-full w-96 my-4"></div>
            <div className="h-3 bg-base-200 rounded-full max-w-[360px] my-2.5"></div>
            <div className="h-3 bg-base-200 rounded-full my-2.5"></div>
            <div className="h-2 bg-base-200 rounded-full max-w-[330px] my-2.5"></div>
            <div className="h-3 bg-base-200 rounded-full max-w-[300px] my-2.5"></div>
            <div className="h-3 bg-base-200 rounded-full max-w-[360px]"></div>
            <div className="h-4 bg-base-200 rounded-full w-96 my-4"></div>
            <div className="h-3 bg-base-200 rounded-full max-w-[360px] mb-2.5"></div>
            <div className="h-3 bg-base-200 rounded-full mb-2.5"></div>
            <div className="h-2 bg-base-200 rounded-full max-w-[330px] mb-2.5"></div>
            <div className="h-3 bg-base-200 rounded-full max-w-[300px] mb-2.5"></div>
            <div className="h-3 bg-base-200 rounded-full max-w-[360px]"></div>
            <div className="h-3 bg-base-200 rounded-full mb-2.5"></div>
            <div className="h-2 bg-base-200 rounded-full max-w-[330px] mb-2.5"></div>
            <div className="h-3 bg-base-200 rounded-full max-w-[300px] mb-2.5"></div>
            <div className="h-3 bg-base-200 rounded-full max-w-[360px]"></div>
            <div className="h-3 bg-base-200 rounded-full mb-2.5"></div>
            <div className="h-2 bg-base-200 rounded-full max-w-[330px] mb-2.5"></div>
            <div className="h-3 bg-base-200 rounded-full max-w-[300px] mb-2.5"></div>
            <div className="h-3 bg-base-200 rounded-full max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        
      </section>
    </>
  );
};

export default UserDashboard;
