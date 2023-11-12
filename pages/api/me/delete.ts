import { getSession } from "@auth0/nextjs-auth0";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebase/firebase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Method not allowed" });
  const session = getSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  const id = session?.user.sub;
  try {
    const docRef = doc(db, "users", id, "account", "stripe");
    const document = (await getDoc(docRef)).data();
    const delDocRef = doc(db, "deleted-users", id);
    await setDoc(delDocRef, {...document, email: session?.user.email});
    const accountRef = doc(db, "users", id);
    await deleteDoc(accountRef);
    return res.status(200).json({ message: "Success" });    
} catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Oops, something went wrong, please try again" });
  }
};

export default handler;
