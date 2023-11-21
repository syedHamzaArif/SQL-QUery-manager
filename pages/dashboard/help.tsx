import HelpTab from "@components/Help/HelpTab";
import { NextSeo } from "next-seo";

const HelpPage = () => {
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

      <HelpTab />
    </>
  );
};

export default HelpPage;
