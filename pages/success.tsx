import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { NextSeo } from "next-seo";

const Success = () => {
  const {
    query: { session_id },
  } = useRouter();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      if (session_id) {
        setLoading(true);
        const session = await axios.get(`/api/checkout_sessions/${session_id}`);
        if (session.data) {
          setSuccess(true);
          await setDoc(
            doc(
              db,
              "users",
              session.data.client_reference_id,
              "account",
              "stripe"
            ),
            {
              stripeCustomerId: session.data.customer,
              stripeSubscriptionId: session.data.subscription,
            }
          );

          await fetch("https://api.useplunk.com/v1", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.PLUNK_API_SECRET}`,
            },
            body: JSON.stringify({
              event: "subscription-success",
              email: session.data.customer_details.email,
            }),
          });
        } else {
          setError(true);
        }

        setLoading(false);
      }
    };

    fetchSession();
  }, [session_id]);

  return (

    <>
      <NextSeo
        title="SQL Query Manager | Generate SQL Queries with AI in Seconds"
        description="SQL Query Manager helps you generate complex SQL queries in seconds. Use simple English prompts to generate SQL queries. SQL Query Manager uses state of the art GPT-3 AI model to give you the best results."
        canonical="https://aiquery.co"
        openGraph={{
          url: "https://aiquery.co",
          title: "SQL Query Manager | Generate SQL Queries with AI in Seconds",
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





      <div className="container xl:max-w-screen-xl mx-auto py-12 px-6 text-center">
        {error && (
          <div className="p-2 rounded-md bg-rose-100 text-rose-500 max-w-md mx-auto">
            <p className="text-lg">Sorry, something went wrong!</p>
          </div>
        )}
        {loading && (
          <div className="p-2 rounded-md bg-base-200 max-w-md mx-auto">
            <p className="text-lg animate-pulse">Loading...</p>
          </div>
        )}

        {success && !loading && (
          <div className="flex items-center justify-center h-screen">
            <div>
              <div className="flex flex-col items-center space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-green-600 w-28 h-28"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h1 className="text-4xl font-bold">Thank You!</h1>
                <p>Congratulations! You now have UNLIMITED access to SQL Query Manager.</p>
                <Link href={"/dashboard"}>
                  <a className="btn btn-success">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16l-4-4m0 0l4-4m-4 4h18"
                      />
                    </svg>
                    <span className="text-sm font-medium">Dashboard</span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Success;
