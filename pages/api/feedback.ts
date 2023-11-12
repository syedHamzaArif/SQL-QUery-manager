import { getSession } from "@auth0/nextjs-auth0";
import { doc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase/firebase";
import { verifySubscription } from "../../utils/verifySubscription";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    uid,
    id,
    isCorrect,
    operation,
  }: {
    uid: string;
    id: string;
    isCorrect: boolean;
    operation: "generate" | "explain";
  } = req.body;

  const session = getSession(req, res);
  if(!session) return res.status(401).json({ message: "Unauthorized" });
  const user_id = session.user.sub;
  const isActive = verifySubscription(user_id);
  if(!isActive) return res.status(401).json({ message: "Unauthorized" });
  try {
    if (operation === "generate") {
      const queryRef = doc(db, "users", uid, "query", id);
      await updateDoc(queryRef, { isCorrect });
    } else {
      const explainRef = doc(db, "users", uid, "explain", id);
      await updateDoc(explainRef, { isCorrect });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(504).json(error);
  }
}
