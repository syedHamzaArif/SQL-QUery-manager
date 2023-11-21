import axios from "axios";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import {
  setCustomerId,
  setIsActive,
  setSubscriptionId,
} from "../redux/reducers/accountSlice";
import { UserDashboard } from "@components/Dashboard";
import { DB } from "../utils/types";
import { useDispatch, useSelector } from "react-redux";
import { setAllDb, setCurrent } from "../redux/reducers/databaseSlice";
import { RootState } from "../redux/store";
import { AiOutlineArrowUp } from "react-icons/ai";

const HOC: FC<any> = ({ children }: any) => {
  const {
    pathname,
    asPath,
    route,
    query: { session_id },
    push,
  } = useRouter();
  const r = useRouter();
  const dispatch = useDispatch();
  const { user, isLoading, error } = useUser();
  const { current } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const refCurrent = useRef<any>({});

  refCurrent.current = current;
  const setUserData = (res: any) => {
    if (
      !refCurrent.current ||
      (refCurrent.current &&
        (res.data.all as DB[]).findIndex(
          (d) => d.id === refCurrent.current.id
        ) === -1)
    ) {
      if (!current)
        dispatch(setCurrent(res.data.all[0].id));
    }
  };
  useEffect(() => {
    if (isLoading) {
      setIsLoadingData(true);
    }

    if (user && !session_id) {
      setIsLoadingData(true);
      axios
        .post(`/api/data`, { id: user.sub, email: user.email })
        .then((res) => {
          dispatch(setAllDb(res.data.all as DB[]));
          dispatch(setCustomerId(res.data.stripeCustomerId));
          dispatch(setSubscriptionId(res.data.stripeSubscriptionId));
          dispatch(setIsActive(true));
          setTimeout(() => {
            setUserData(res);
          }, 2000);
          return;
          // if (
          //   !refCurrent.current ||
          //   (refCurrent.current &&
          //     (res.data.all as DB[]).findIndex(
          //       (d) => d.id === refCurrent.current.id
          //     ) === -1)
          // ) {
          //   dispatch(setCurrent(res.data.all[0].id));
          // }
        })
        .catch((err) => "");

      setIsLoadingData(false);
    }
  }, [isLoading, user, session_id, push]);



  return (
    <>
      <NextSeo
        title="Dashboard | SQL Query Manager"
        description="SQL Query Manager helps you generate complex SQL queries in seconds. Use simple English prompts to generate SQL queries. SQL Query uses state of the art GPT-3 AI model to give you the best results."
        canonical="https://aiquery.co"
        openGraph={{
          url: "https://aiquery.co",
          title: "Dashboard | SQL Query Manager",
          description:
            "SQL Query helps you generate complex SQL queries in seconds. Use simple English prompts to generate SQL queries. SQL Query uses state of the art GPT-3 AI model to give you the best results.",
          images: [{ url: "https://aiquery.co/dashboard-hero.png" }],
          siteName: "SQL Query Manager",
        }}
        twitter={{
          handle: "@HelloAIQuery",
          cardType: "summary_large_image",
        }}
      />
      <main className="m-auto bg-[#F6F6F6] text-[#004CF7]  dark:bg-[#1c1c1c] dark:text-[#FFFFFF]">
        {/* <main className="m-auto bg-[#CFCFCF]"> */}

        {!user && !isLoading && <></>}
        {isLoading && (
          <>
            <div className="w-screen h-screen flex justify-center items-center">
              <div role="status">
                <svg
                  className="inline mr-2 w-10 h-10 animate-spin fill-success"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </>
        )}
        {user && (
          <UserDashboard user={user} isLoading={isLoadingData}>
            {children}
          </UserDashboard>
        )}
        {!user && !isLoading && (
          <div className="h-screen w-screen flex items-center justify-center">
            <button
              className="btn btn-error"
              onClick={() => push("/api/auth/login")}
            >
              Login to Access Dashboard
            </button>
          </div>
        )}

      </main>

    </>
  );
};

export default HOC;
