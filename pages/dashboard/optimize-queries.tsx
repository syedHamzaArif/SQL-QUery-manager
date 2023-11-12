import OptimizeQueries from "@components/OptimizeQueries/OptimizeQueries";
import { NextSeo } from "next-seo";
import React from "react";
import { getSession } from "@auth0/nextjs-auth0";

import QueryExplain from "@components/QueryExplain/QueryExplain";
import { GetServerSidePropsContext } from "next";

import { verifySubscription } from "../../utils/verifySubscription";
import Pricing from "@components/Pricing";

interface IProps {
  isActive: boolean;
}

const OptimizeQuery = ({ isActive }: IProps) => {
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

      {isActive ? <OptimizeQueries /> : <Pricing />}
    </>
  );
};

export default OptimizeQuery;

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
