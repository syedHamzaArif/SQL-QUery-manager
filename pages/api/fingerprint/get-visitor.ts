import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebase/firebase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { visitorId } = req.body;

  if(!visitorId) return res.status(400).json({ error: 'No visitorId provided' });

  const collectionRef = collection(db, "visitors");
  const docRef = doc(collectionRef, visitorId);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return res.status(200).json({ visitor: docSnap.data() });
    }
    await setDoc(docRef, {
      credits: 3,
    });
    return res.status(200).json({ visitor: { credits: 3 } });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default handler;
