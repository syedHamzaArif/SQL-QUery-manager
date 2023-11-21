import OptimizeQueries from "@components/OptimizeQueries/OptimizeQueries";
import { NextSeo } from "next-seo";
import React from "react";
import { getSession } from "@auth0/nextjs-auth0";

import QueryExplain from "@components/QueryExplain/QueryExplain";
import { GetServerSidePropsContext } from "next";

import { verifySubscription } from "../../utils/verifySubscription";
import CreateIndex from "@components/CreateIndexe/CreateIndex";
import Pricing from "@components/Pricing";

interface IProps {
  isActive: boolean;
}

const IndexCreate = ({ isActive }: IProps) => {
  return (
    <>
      <NextSeo
        title="Dashboard | SQL Query Manager"
        description="SQL Query Manager helps you generate complex SQL queries in seconds. Use simple English prompts to generate SQL queries. SQL Query Manager uses state of the art GPT-3 AI model to give you the best results."
        canonical="https://aiquery.co"
        openGraph={{
          url: "https://aiquery.co",
          title: "Dashboard | SQL Query Manager",
          description:
            "SQL Query Manager helps you generate complex SQL queries in seconds. Use simple English prompts to generate SQL queries. SQL Query Manager uses state of the art GPT-3 AI model to give you the best results.",
          images: [{ url: "https://aiquery.co/dashboard-hero.png" }],
          siteName: "SQL Query Manager",
        }}
        twitter={{
          handle: "@HelloAIQuery",
          cardType: "summary_large_image",
        }}
      />

      {isActive ? <CreateIndex /> : <Pricing />}
    </>
  );
};

export default IndexCreate;

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
