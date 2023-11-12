import { getSession } from "@auth0/nextjs-auth0";

import QueryInput from "@components/Query/QueryInput";
import QueryList from "@components/Query/QueryList";
import RightPanel from "@components/Query/RightPanel";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { verifySubscription } from "../../utils/verifySubscription";
import { AiOutlineArrowUp, AiOutlineHistory } from "react-icons/ai";
import QueryHeader from "@components/Query/QueryHeader";
import { QueryType, queryTypes } from "../../utils/types";
import React, { RefObject, useRef, useState } from "react";
import Pricing from "@components/Pricing";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
interface IProps {
  isActive: boolean;
}

const QueryPlayground = ({ isActive }: IProps) => {
  const [intent, setIntent] = React.useState(queryTypes[0].value);
  const [showQueries, setShowQueries] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(false);
  const [page, setPage] = useState(0);

  const { queriesData } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );

  const handleSelectChange = (e: any) => {
    setIntent(e.target.value);
  };

  const handleHistory = () => {
    setShowQueries(!showQueries);
    setCurrentQuery(false);
  };

  const divRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const scrollToTop = (): void => {
    divRef?.current?.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <NextSeo
        title="Dashboard | AI Query"
        description="AI Query helps you generate complex SQL queries in seconds. Use simple English prompts to generate SQL queries. AI Query uses state of the art GPT-3 AI model to give you the best results."
        canonical="https://aiquery.co"
        openGraph={{
          url: "https://aiquery.co",
          title: "Dashboard | AI Query",
          description:
            "AI Query helps you generate complex SQL queries in seconds. Use simple English prompts to generate SQL queries. AI Query uses state of the art GPT-3 AI model to give you the best results.",
          images: [{ url: "https://aiquery.co/dashboard-hero.png" }],
          siteName: "AI Query",
        }}
        twitter={{
          handle: "@HelloAIQuery",
          cardType: "summary_large_image",
        }}
      />

      {isActive ? (
        <>
          <div className="mb-5">
            <QueryHeader setPage={setPage} />
          </div>

          <div className="flex h-[86vh] w-[97.5%] ">
            <div className="w-full  pb-10 p-2 flex flex-col bg-white dark:bg-[#2D2D2D]  rounded-lg mr-6 ">
              <div className=" px-4">
                <div className="icon with text history flex justify-between py-2 items-center ">
                  <select
                    className="select select-bordered bg-[#E8F2FF] dark:bg-[#2D2D2D] text-[#004CF7] dark:text-white border border-[#004CF7] dark:border-white"
                    value={intent}
                    onChange={handleSelectChange}
                    required
                  >
                    {queryTypes.map((queryType: QueryType, index: number) => (
                      <option value={queryType.value} key={index}>
                        {queryType.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center">
                    <AiOutlineHistory className="mr-1 -scale-x-100" />
                    <p
                      className="text-[#004CF7] dark:text-white text-[15px] font-semibold cursor-pointer"
                      onClick={handleHistory}
                    >
                      History
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 p-2 w-[100%] left-4 lg:left-0 lg:sticky lg:bottom-0 lg:w-full">
                <QueryInput
                  intent={intent}
                  setShowQueries={setShowQueries}
                  setCurrentQuery={setCurrentQuery}
                />
              </div>

              <div
                className="mb-4 mt-0 pt-0 scrollbar-thin scrollbar-thumb-base-200 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                ref={divRef}
              >
                <QueryList
                  showQueries={showQueries}
                  currentQuery={currentQuery}
                />
              </div>

              {showQueries && queriesData.length >= 2 && (
                <div className="relative">
                  <button
                    className="absolute right-5 bottom-5 bg-gradient-to-r from-[#0177e1] to-[#004cf7] border-none hover:from-[#004cf7]  hover:to-[#085da9] p-3 rounded-full text-white font-bold text-[20px]"
                    type="button"
                    onClick={() => scrollToTop()}
                  >
                    <AiOutlineArrowUp />
                  </button>
                </div>
              )}
            </div>
            <div className="h-full ">
              <RightPanel setPage={setPage} page={page} />
            </div>
          </div>
        </>
      ) : (
        <Pricing />
      )}
    </>
  );
};

export default QueryPlayground;

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = getSession(req, res);
  if (!session)
    return {
      props: {
        isActive: false,
      },
    };
  const id = session?.user.sub;
  const isActive = await verifySubscription(id);
  return {
    props: {
      isActive,
    },
  };
};
