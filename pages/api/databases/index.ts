import { getSession } from "@auth0/nextjs-auth0";
import { collection, getDocs } from "firebase/firestore";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { db } from "../../../firebase/firebase";
import { verifySubscription } from "../../../utils/verifySubscription";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
  
    return res
      .status(405) // Method Not Allowed
      .json({ message: "Only GET requests are entertained" });

  // Check if the user has a valid subscription. Call validateSubscription() -> if true, proceed further. If not, return error.

  const session = getSession(req, res);
  if(!session) return res.status(401).json({ message: 'Unauthorized' });
  const id = session?.user.sub;
  const isActive = verifySubscription(id);
  if(!isActive) return res.status(403).json({ message: "Please upgrade your subscription to use this feature" });

  try {
    const databaseRef = collection(db, "users", id, "database");
    const databases = await getDocs(databaseRef);
    const data = databases.docs.map((database) => ({
      id: database.id,
      ...database.data(),
    }));
    
    
    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Oops, something went wrong, please try again" });
  }
};

export default handler;
