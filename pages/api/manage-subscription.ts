import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-08-01",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { customerId }: { customerId: string } = req.body;

  try {
    const configuration = await stripe.billingPortal.configurations.create({
      features: {
        customer_update: {
          allowed_updates: ["email"],
          enabled: true,
        },
        invoice_history: { enabled: false },
        payment_method_update: { enabled: true },
        subscription_cancel: {
          enabled: true,
          cancellation_reason: {
            enabled: true,
            options: [
              "customer_service",
              "low_quality",
              "missing_features",
              "too_expensive",
              "unused",
              "too_complex",
              "switched_service",
              "other",
            ],
          },
          mode: "at_period_end",
        },
        subscription_update: {
          enabled: true,
          products: [
            {
              prices: [
                `${process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_YEARLY}`,
                `${process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_MONTHLY}`,
              ],
              product: `${process.env.STRIPE_PRODUCT}`,
            },
          ],
          // products:
          //   process.env.NODE_ENV === "development"
          //     ? [
          //         {
          //           prices: [
          //             "price_1MLskyIsmwTLhytXi9RQ6B5T",
          //             "price_1MLskyIsmwTLhytX35tyXNmE",
          //           ],
          //           product: "prod_N64uFUfd54ZRkm",
          //         },
          //       ]
          //     : [
          //         {
          //           prices: [
          //             "price_1MLsg8IsmwTLhytXSOcMyHK0",
          //             "price_1MLsjbIsmwTLhytXg3GUvn7p",
          //           ],
          //           product: "prod_N64p2v9nJXcTFY",
          //         },
          //       ],
          default_allowed_updates: ["price"],
        },
      },
      business_profile: {
        headline: "AI Query",
        privacy_policy_url: "https://aiquery.co/privacy-policy",
        terms_of_service_url: "https://aiquery.co/terms-of-use",
      },
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.headers.origin}/dashboard`,
      configuration: configuration.id,
    });


    res.json(session.url);
  } catch (error) {
    res.json({ error });
  }
}
