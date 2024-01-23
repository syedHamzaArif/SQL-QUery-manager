import { getSession } from "@auth0/nextjs-auth0";
import Pricing from "@components/Pricing";

import QueryExplain from "@components/QueryExplain/QueryExplain";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { verifySubscription } from "../../utils/verifySubscription";

interface IProps {
  isActive: boolean;
}

const Explain = ({ isActive }: IProps) => {
  return (
    <>



      {!isActive ? <QueryExplain /> : <Pricing />}
    </>
  );
};

export default Explain;

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
