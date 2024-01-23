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
