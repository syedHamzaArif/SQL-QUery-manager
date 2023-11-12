import { getSession } from "@auth0/nextjs-auth0";
import { deleteDoc, doc, collection, getDocs, query, where } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase/firebase";
import { verifySubscription } from "../../utils/verifySubscription";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
      return res.status(400).json({ error: "Only POST requests are allowed" });
  const session = getSession(req, res);
  if(!session) return res.status(401).json({ message: 'Unauthorized' });
  const id = session?.user.sub;
  const isActive = verifySubscription(id);
  if(!isActive) return res.status(403).json({ message: "Please upgrade your subscription to use this feature" });
  try {
    const { uid, dbid } = req.body;

    // Delete all tables of the database
    await deleteDBTables(uid, dbid)

    // Delete all queries of the database
    await deleteDBQueries(uid, dbid)

    // Delete the database
    const dbRef = doc(db, "users", uid, "database", dbid);
    await deleteDoc(dbRef);

    return res.status(200).json({ success: "Database deleted successfully" });
  } catch (error) {
    return res.status(500).json({error, message: "Something went wrong, please try again." })
  }
}

const deleteDBTables = async (uid: string, dbId: string) => {
  const tableRef = collection(db, "users", uid, "table")
  const tableSnapshot = query(tableRef, where("dbid", "==", dbId))
  const tables = await getDocs(tableSnapshot)
  tables.docs.map(async(table) => {
    await deleteDoc(doc(db, "users", uid, "table", table.data().id))
  })
}

const deleteDBQueries = async (uid: string, dbId: string) => {
  const queryRef = collection(db, "users", uid, "query")
  const querySnapshot = query(queryRef, where("dbid", "==", dbId))
  const queries = await getDocs(querySnapshot)
  queries.docs.map(async(query) => {
    await deleteDoc(doc(db, "users", uid, "query", query.data().id))
  })
}
