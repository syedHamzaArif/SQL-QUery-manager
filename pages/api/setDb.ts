import { getSession } from "@auth0/nextjs-auth0";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase/firebase";
import { verifySubscription } from "../../utils/verifySubscription";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(400).json({ error: "Only POST requests are allowed." });
  const session = getSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  const id = session?.user.sub;
  const isActive = verifySubscription(id);
  if(!isActive) return res.status(401).json({ message: "Unauthorized" });
  const { db: newDb, uid } = req.body;
  try {
    const colRef = collection(db, "users", uid, "database");
    const q = query(colRef, where("name", "==", newDb.name));
    const dbs = await getDocs(q);
    if (dbs.docs.length !== 0) {
      return res.status(400).json({
        error: "Database name already exists.",
        code: "ALREADY EXISTS",
      });
    }
    await setDoc(doc(db, "users", uid, "database", newDb.id), newDb);
    return res.status(200).json(newDb);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
}
