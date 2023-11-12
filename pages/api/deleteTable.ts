import { getSession } from "@auth0/nextjs-auth0";
import { deleteDoc, doc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase/firebase";
import { verifySubscription } from "../../utils/verifySubscription";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const session = getSession(req, res);
    if (!session) return res.status(401).json({ message: "Unauthorized" });
    const id = session?.user.sub;
    const isActive = verifySubscription(id);
    if (!isActive)
      return res
        .status(403)
        .json({
          message: "Please upgrade your subscription to use this feature",
        });
    const { tableId, uid } = req.body;
    try {
      deleteDoc(doc(db, "users", uid, "table", tableId)).then(() => {
        return res.status(200).json({ success: `Deleted ${tableId}` });
      });
    } catch (error) {
      return res.status(400).json({ error });
    }
  } else
    return res.status(400).json({ error: "Only POST request are allowed" });
}
