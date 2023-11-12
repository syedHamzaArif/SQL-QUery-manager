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


      {isActive ? <QueryExplain /> : <Pricing />}
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
