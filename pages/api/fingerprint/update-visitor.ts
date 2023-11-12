import { collection, doc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebase/firebase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { visitorId, credits } = req.body;
  if (!visitorId)
    return res.status(400).json({ error: "No visitorId provided" });
  if (!credits && credits !== 0) return res.status(400).json({ error: "No credits provided" });
  try {
    const collectionRef = collection(db, "visitors");
    const docRef = doc(collectionRef, visitorId);
    await updateDoc(docRef, {
      credits: credits,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export default handler;
