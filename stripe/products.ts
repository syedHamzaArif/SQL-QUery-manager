export const pricing = [
  {
    title: "Pro Monthly",
    price: "$10",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1MLskyIsmwTLhytXi9RQ6B5T"
        : "price_1MLsg8IsmwTLhytXSOcMyHK0",
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
  {
    title: "Pro Yearly",
    price: "$100",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1MLskyIsmwTLhytX35tyXNmE"
        : "price_1MLsjbIsmwTLhytXg3GUvn7p",
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
