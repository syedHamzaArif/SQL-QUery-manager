export const MonthlyPlan = [
  {
    title: "",
    price: "$10",
    name: "Pro",
    priceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_MONTHLY,
    benefits: [
      "Unlimited SQL Query Generation",
      "Unlimited SQL Explanations",
      "Unlimited Database Schema",
      "Unlimited Save and Share SQL Queries",
      "Unlimited SQL Query History",
      "Standard AI Response Speed",
      "Standard Access to New Features",
      "Regular Support",
      "Cancel Anytime",
    ],
    isAnnual: false,
  },
];

export const AnnualPlan = [
  {
    title: "Get 2 Months Free!",
    name: "Pro",
    price: "$100",
    priceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_YEARLY,
    benefits: [
      "Unlimited SQL Query Generation",
      "Unlimited SQL Explanations",
      "Unlimited Database Schema",
      "Unlimited Save and Share SQL Queries",
      "Unlimited SQL Query History",
      "Faster AI Response Speed",
      "Priority Access to New Features",
      "Priority Support",
      "Cancel Anytime",
    ],

    isAnnual: true,
  },
];
