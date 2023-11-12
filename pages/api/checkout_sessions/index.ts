import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {} as Stripe.StripeConfig
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      price,
      uid,
      customer,
      email,
    }: { price: string; uid: string; customer: string; email: string } =
      req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price,
            quantity: 1,
          },
        ],
        ...(customer ? { customer } : { customer_email: email }),
        client_reference_id: uid,
        allow_promotion_codes: true,
        //subscription_data: {
        //  trial_period_days: 7, // adds 7 days trial period
        //},
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/dashboard`,
      });

      res.status(200).json(session);
      console.log("session===>",session)
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
  }
}
