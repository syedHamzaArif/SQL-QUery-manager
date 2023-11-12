import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string,
  {} as Stripe.StripeConfig
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id;
  

  try {
    if (!(id as string).startsWith("cs_")) {
      throw Error("Incorrect CheckoutSession ID.");
    }
    const checkout_session = await stripe.checkout.sessions.retrieve(
      id as string
    );

    
    res.status(200).json(checkout_session);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
