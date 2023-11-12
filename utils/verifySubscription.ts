import { collection, doc, getDoc } from "firebase/firestore";
import Stripe from "stripe";
import { db } from "../firebase/firebase";

export const verifySubscription = async (id: string): Promise<boolean> => {
  try {
    const collectionRef = collection(db, "users", id, "account");
    const docRef = doc(collectionRef, "stripe");
    const subscription_data = await getDoc(docRef);
    if (!subscription_data.exists()) return false;
    const { stripeSubscriptionId } = subscription_data.data();
    const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
      apiVersion: "2022-08-01",
    });
    const subscription = await stripe.subscriptions.retrieve(
      stripeSubscriptionId
    );
    const isActive =
      subscription.status === "active" || subscription.status === "trialing";
    if (isActive) return true;
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
