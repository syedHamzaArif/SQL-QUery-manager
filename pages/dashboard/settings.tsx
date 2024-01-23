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
