import { getSession } from "@auth0/nextjs-auth0";

import NewSettingPage from "@components/Settings/NewSettingPage";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { verifySubscription } from "../../utils/verifySubscription";

interface IProps {
  isActive: boolean;
}

const SettingPage = ({ isActive }: IProps) => {
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

      <NewSettingPage isActive={isActive} />
    </>
  );
};

export default SettingPage;

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
