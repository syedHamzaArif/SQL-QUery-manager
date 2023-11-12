import { getSession } from "@auth0/nextjs-auth0";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { db } from "../../../firebase/firebase";
import { verifySubscription } from "../../../utils/verifySubscription";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed!" });

  const session = getSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  const id = session?.user.sub;
  const isActive = verifySubscription(id);
  if (!isActive) return res.status(403).json({ message: "Unauthorized" });

  const { table } = req.body;
  if (!table) return res.status(400).json({ message: "Tables not found." });

  const tableRef = doc(db, "users", id, "table", table.id);
  try {
    await setDoc(tableRef, { ...table, updatedAt: new Date() });
    return res.status(200).json({ message: "Document updated successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Oops, something went wrong, please try again" });
  }
}
