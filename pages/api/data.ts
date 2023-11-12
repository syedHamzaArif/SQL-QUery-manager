import axios from "axios";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { db } from "../../firebase/firebase";
import { DB, Query, Table } from "../../utils/types";

interface q extends Query {
  dbid: string;
}

const demo = { id: "demo-db", name: "Demo", type: "PostgreSQL" };
const demoTables = [
  {
    id: "demo-customers-table",
    dbid: "demo-db",
    index: 0,
    name: "Customers",
    columns: [
      { name: "customer_id", type: "int" },
      { name: "first_name", type: "varchar(100)" },
      { name: "last_name", type: "varchar(100)" },
      { name: "age", type: "int" },
      { name: "country", type: "varchar(100)" },
    ],
  },
  {
    id: "demo-orders-table",
    dbid: "demo-db",
    index: 1,
    name: "Orders",
    columns: [
      { name: "order_id", type: "int" },
      { name: "item", type: "varchar(100)" },
      { name: "amount", type: "int" },
      { name: "customer_id", type: "int" },
    ],
  },
  {
    id: "demo-shippings-table",
    dbid: "demo-db",
    index: 2,
    name: "Shippings",
    columns: [
      { name: "shipping_id", type: "int" },
      { name: "status", type: "int" },
      { name: "customer_id", type: "int" },
    ],
  },
];

const demoQuery = [
  {
    id: "demo-read-query",
    createdAt: "",
    dbid: "demo-db",
    operation: "Read",
    isCorrect: true,
    prompt: "Which is the most ordered item by customers in USA?",
    response:
      "SELECT item, COUNT(item) AS count FROM Customers JOIN Orders ON Customers.customer_id = Orders.customer_id WHERE country = 'USA' GROUP BY item ORDER BY count DESC LIMIT 1",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, email } = req.body;
  let databases: any[] = [];

  try {
    const dbRef = query(collection(db, `users/${id}/database`));
    const accountRef = doc(db, "users", id, "account", "stripe");

    const dbSnap = await getDocs(dbRef);
    if (!dbSnap.empty) {
      const accountSnap = await getDoc(accountRef);

      // dbSnap.forEach((doc) => databases.push(doc.data() as DB));
      const tableRef = collection(db, `users/${id}/table`);
      const promises = dbSnap.docs.map(async (doc) => {
        const countQuery = query(tableRef, where("dbid", "==", doc.id));
        const snapshot = await getCountFromServer(countQuery);
        const count = snapshot.data().count;
        databases.push({
          ...doc.data(),
          tables: count,
          id: doc.id,
        });
      });

      await Promise.all(promises);

      const all = databases.map((database) => {
        return {
          ...database,
        };
      });

      const subscriptionId = accountSnap.data()?.stripeSubscriptionId;
      let isActive = false;
      if (subscriptionId) {
        // @ts-ignore
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: "2022-08-01",
        });

        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        isActive =
          subscription.status === "active" ||
          subscription.status === "trialing";
      }

      return res.status(200).json({
        all,
        ...accountSnap.data(),
        isActive,
      });
    } else {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `Bearer ${process.env.PLUNK_API_SECRET}`,
        },
        data: JSON.stringify({
          event: "welcome",
          email,
        }),
        url: "https://api.useplunk.com/v1",
      };

      const dbRef = doc(db, "users", id, "database", demo.id);
      const customerRef = doc(db, "users", id, "table", demoTables[0].id);
      const orderRef = doc(db, "users", id, "table", demoTables[1].id);
      const shippingRef = doc(db, "users", id, "table", demoTables[2].id);
      const queryRef = doc(db, "users", id, "query", demoQuery[0].id);

      await setDoc(dbRef, demo);
      await setDoc(customerRef, demoTables[0]);
      await setDoc(orderRef, demoTables[1]);
      await setDoc(shippingRef, demoTables[2]);
      await setDoc(queryRef, demoQuery[0]);

      // send Welcome email;
      await axios(options);

      res.status(200).json({
        ...demo,
        tables: demoTables,
        queries: demoQuery,
      });
    }
  } catch (error) {
    return res.status(400).json({ message: "Error fetching data", error });
  }
}
