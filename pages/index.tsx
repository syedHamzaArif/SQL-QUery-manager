import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import Footer from "@components/Footer/Footer";
import { Navbar } from "@components/Navbar";

import { NextSeo } from "next-seo";
import Pricing from "@components/Pricing";

const Home: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const [value, setValue] = useState<number>(2);
  const [result, setResult] = useState("");

  const featuresRef = useRef(null);
  const pricingRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    if (router.query) {
      const { anchor } = router.query;
      if (anchor === "features") {
        // @ts-ignore
        featuresRef.current.scrollIntoView({ behavior: "smooth" });
      }


      if (anchor === "contact") {
        // @ts-ignore
        contactRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [router.query]);

  const handleCTAClick = useCallback(
    () =>
      user
        ? router.push("/dashboard")
        : router.push("/api/auth/login?screen_hint=signup"),
    [router, user]
  );

  const handelScrollToFeatures = useCallback(
    () =>
      // @ts-ignore
      featuresRef.current.scrollIntoView({ behavior: "smooth" }),
    []
  );

  const handelScrollToPricing = useCallback(
    () =>
      // @ts-ignore
      pricingRef.current.scrollIntoView({ behavior: "smooth" }),
    []
  );

  const handelScrollToContact = useCallback(
    () =>
      // @ts-ignore
      contactRef.current.scrollIntoView({ behavior: "smooth" }),
    []
  );

  const onSubmit = async (event: any) => {
    event.preventDefault();
    setResult("Sending");
    const formData = new FormData(event.target);

    formData.append(
      "access_key",
      process.env.NEXT_PUBLIC_WEB3FORMS_API_KEY as string
    );

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());

    if (res.success) {
      setResult("Success");
    } else {
      setResult("Error");
    }
  };

  return (
    <>


      <main className="h-screen m-auto bg-base-200 scrollbar-thin scrollbar-thumb-base-300 overflow-y-scroll overflow-x-hidden scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
        <Navbar
          handelScrollToContact={handelScrollToContact}
          handelScrollToFeatures={handelScrollToFeatures}
          handelScrollToPricing={handelScrollToPricing}
        />

        {/* HERO */}
        <div className="flex flex-col gap-4 md:flex-row justify-center items-center relative top-8 min-h-[20vh]">
          <a
            href="https://www.producthunt.com/posts/ai-query?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-ai&#0045;query"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=373071&theme=light"
              alt="AI&#0032;Query - Generate&#0032;SQL&#0032;Queries&#0032;with&#0032;AI&#0032;in&#0032;Seconds | Product Hunt"
              style={{ width: "250px", height: "54px" }}
              width="250"
              height="54"
            />
          </a>

          <a
            className="btn btn-success"
            href={"/join"}
            target="_blank"
            rel="noreferrer"
            style={{ width: "250px", height: "54px" }}
          >
            Join Our Slack Community
          </a>
        </div>
        <section className="hero min-h-[50vh] bg-base-200 pb-12">
          <div className="hero-content w-full flex flex-col-reverse lg:flex-row justify-between">
            <div className="max-w-md text-center lg:text-left md:mr-8">
              <h1 className="text-5xl font-bold">
                Generate Error Free SQL in Seconds.
              </h1>
              <p className="py-6 text-lg">
                Use simple English and let AI do the heavy lifting for you. With
                SQL Query Manager anyone can create efficient SQL queries, without even
                knowing a thing about it.
              </p>
              <button className="btn btn-success" onClick={handleCTAClick}>
                Get Started
              </button>
            </div>

            <div className="my-8 lg:my-0 rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/dashboard-hero.png"
                alt="Dashboard Demo"
                width={"100%"}
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <div
          className="w-full bg-base-100 py-20 px-10 grid grid-cols-1 gap-12 md:gap-40 items-center"
          ref={featuresRef}
        >
          <section className="hero">
            <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
              <div className="max-w-md text-center lg:text-left">
                <h1 className="text-5xl font-bold">
                  Define Your Database Schema
                </h1>

                <p className="py-6 text-lg">
                  Easily define your database tables using our intuitive
                  dashboard interface.
                </p>
              </div>

              <div className="shadow-xl rounded-lg overflow-hidden">
                <img
                  src={"/define-schema.png"}
                  alt={"Define Database Schema"}
                  width={700}
                />
              </div>
            </div>
          </section>

          <section className="hero">
            <div className="flex flex-col-reverse lg:flex-row-reverse gap-16 items-center">
              <div className="max-w-md text-center lg:text-left">
                <h1 className="text-5xl font-bold">Generate SQL Queries</h1>

                <p className="py-6 text-lg">
                  Once your database schema is ready, you can easily generate
                  SQL queries with simple text prompts. Let the AI do the work for you.
                </p>
              </div>

              <div className="shadow-xl rounded-lg overflow-hidden">
                <img
                  src={"/write-prompt.png"}
                  alt={"Write Query Prompt"}
                  width={700}
                />
              </div>
            </div>
          </section>

          <button
            className="btn md:w-[30rem] md:text-lg btn-success m-auto"
            onClick={handleCTAClick}
          >
            Get Started
          </button>
        </div>

        {/* SUPPORTED DB */}
        <section className="hero  bg-white dark:bg-[#2D2D2D] py-20 px-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-8">
              Supported Database Engines
            </h2>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="shadow-2xl bg-base-content px-8 py-1 rounded-lg overflow-hidden">
                <Image
                  src={"/postgresql-horizontal.svg"}
                  alt={"PostgreSQL Logo"}
                  height={50}
                  width={175}
                />
              </div>
              <div className="shadow-2xl bg-base-content px-8 py-1 rounded-lg overflow-hidden">
                <Image
                  src={"/mysql-horizontal.svg"}
                  alt={"MySQL Logo"}
                  height={50}
                  width={175}
                />
              </div>
              <div className="shadow-2xl bg-base-content px-8 py-1 rounded-lg overflow-hidden">
                <Image
                  src={"/mariadb-horizontal-blue.svg"}
                  alt={"MariaDB Logo"}
                  height={50}
                  width={175}
                />
              </div>
              <div className="shadow-2xl bg-base-content px-8 py-1 rounded-lg overflow-hidden">
                <Image
                  src={"/sql-server.svg"}
                  alt={"SQL Server Logo"}
                  height={50}
                  width={175}
                />
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="hero bg-base-200 py-20 px-10" ref={pricingRef}>
          <div className="text-center">
            <h2 className="text-5xl font-bold">Simple Pricing</h2>
            <p className="py-6 text-lg">For all types of users.</p>

            <Pricing />
          </div>
        </section>

        {/* CONTACT */}
        <section className="bg-base-100" ref={contactRef}>
          <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center">
              Contact Us
            </h2>
            <p className="mb-8 lg:mb-16 font-light text-center sm:text-xl">
              Got a technical issue? Want to send feedback about a feature? Get
              in touch with us.
            </p>
            <form onSubmit={onSubmit} className="space-y-8">
              <input
                type="hidden"
                name="access_key"
                value={process.env.NEXT_PUBLIC_WEB3FORMS_API_KEY}
              />

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="shadow-sm input input-bordered w-full"
                  placeholder="Your email"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-2 text-sm font-medium"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="input input-bordered w-full"
                  placeholder="What is it about"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="block p-2.5 w-full textarea textarea-bordered"
                  placeholder="Tell us how we can help you"
                  required
                ></textarea>
              </div>

              <div>
                {result === "Sending" && (
                  <progress className="progress progress-warning w-56"></progress>
                )}
                {result === "Success" && (
                  <div className="border border-success p-4 rounded-lg">
                    <p>
                      We will get back to you shortly
                    </p>
                  </div>
                )}
                {result === "Error" && (
                  <div className="border border-error p-4 rounded-lg">
                    <p>Error sending email, please try again</p>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-success">
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <Footer
          handelScrollToContact={handelScrollToContact}
          handelScrollToFeatures={handelScrollToFeatures}
          handelScrollToPricing={handelScrollToPricing}
        />
      </main>
    </>
  );
};

export default Home;