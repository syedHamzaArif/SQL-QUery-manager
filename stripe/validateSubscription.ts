import Stripe from "stripe";

export const validateSubscription = async (subscriptionId: string) => {
  const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
    apiVersion: "2022-08-01",
  });
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const isActive =
    subscription.status === "active" || subscription.status === "trialing";
  return isActive;
};
