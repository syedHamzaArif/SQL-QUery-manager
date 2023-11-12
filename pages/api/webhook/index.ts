import Stripe from "stripe";
import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string,
  {} as Stripe.StripeConfig
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let event;

    try {
      const rawBody = await buffer(req);
      const signature: string | Buffer | string[] = req.headers[
        "stripe-signature"
      ] as string | Buffer | string[];

      event = stripe.webhooks.constructEvent(
        rawBody.toString(),
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );

      // Successfully constructed event

      // Handle event type (add business logic here)
      // if (event.type === "checkout.session.completed") {
      // } else {
      //   console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
      // }

      // Return a response to acknowledge receipt of the event.
      res.json({ received: true });
    } catch (err: any) {
      console.log(`❌ Error message: ${err}`);
      res.status(400).json({ message: `Webhook Error: ${err}` });
      return;
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
  }
}
