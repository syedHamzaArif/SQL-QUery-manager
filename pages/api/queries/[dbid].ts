import { getSession } from '@auth0/nextjs-auth0';
import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { NextApiResponse, NextApiRequest } from "next";
import { db } from "../../../firebase/firebase";
import { verifySubscription } from '../../../utils/verifySubscription';
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const dbid = req.query.dbid;
  
  const session = getSession(req, res);
  if(!session) return res.status(401).json({ message: 'Unauthorized' });
  const id = session?.user.sub;
  const isActive = verifySubscription(id);
  if(!isActive) return res.status(403).json({ message: "Please upgrade your subscription to use this feature" });

  try {

    const queryRef = collection(db, "users", id, "query");
    const q = query(queryRef, where("dbid", "==", dbid), orderBy("createdAt", "desc") , limit(3));
    const response = await getDocs(q);

    const queries = response.docs.map((qry) => ({ ...qry.data(), id: qry.id }));
    return res.status(200).json({ queries, id });

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Oops, something went wrong, please try again" });
  }
};

export default handler;

