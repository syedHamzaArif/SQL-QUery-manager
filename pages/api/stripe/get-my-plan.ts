import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import { verifySubscription } from "../../../utils/verifySubscription";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import Stripe from "stripe";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });
  const session = getSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const id = session?.user.sub;
  const collectionRef = collection(db, "users", id, "account");
  const docRef = doc(collectionRef, "stripe");

  try {
    const subscription_data = await getDoc(docRef);
    if (!subscription_data.exists())
      return res.status(401).json({ message: "Unauthorized" });
    const { stripeSubscriptionId } = subscription_data.data();
    const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
      apiVersion: "2022-08-01",
    });
    const subscription: any = await stripe.subscriptions.retrieve(
      stripeSubscriptionId
    );
    const isActive =
      subscription.status === "active" || subscription.status === "trialing";
    if (!isActive) return res.status(401).json({ message: "Unauthorized" });
    if (!subscription.plan)
      return res.status(401).json({ message: "Unauthorized" });
    const result = {
      planName:
        subscription.plan.amount === 1000 ? "Pro Monthly" : "Pro Yearly",
      startDate: subscription.current_period_start,
      endDate: subscription.current_period_end,
      status: subscription.status,
    };
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;
