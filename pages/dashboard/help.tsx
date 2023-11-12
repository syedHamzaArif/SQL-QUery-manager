import HelpTab from "@components/Help/HelpTab";
import { NextSeo } from "next-seo";

const HelpPage = () => {
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

      <HelpTab />
    </>
  );
};

export default HelpPage;
