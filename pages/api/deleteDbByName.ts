import { getSession } from "@auth0/nextjs-auth0";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase/firebase";
import { verifySubscription } from "../../utils/verifySubscription";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { uid, dbName } = req.body;

    const session = getSession(req, res);
    if(!session) return res.status(401).json({ message: 'Unauthorized' });
    const id = session?.user.sub;
    const isActive = verifySubscription(id);
    if(!isActive) return res.status(403).json({ message: "Please upgrade your subscription to use this feature" });

    if(dbName === "Demo") return res.status(400).json({ message: "You cannot delete demo databse "});

    const batch = writeBatch(db);

    const colRef = collection(db, "users", uid, "database");
    const q = query(colRef, where("name", "==", dbName));
    const dbs = await getDocs(q);

    if (dbs.docs.length === 0) {
      return res.status(200).json({ success: "Database doesn't exist" });
    }
    const dbId = dbs.docs[0].id;

    const dbRef = doc(db, "users", uid, "database", dbId);

    const tableRef = collection(db, "users", uid, "table");
    const qTable = query(tableRef, where("dbid", "==", dbId));
    const tables = await getDocs(qTable);
    tables.forEach(async (table) => {
      const tableId = table.id;
      const tableDocRef = doc(db, "users", uid, "table", tableId);
      batch.delete(tableDocRef);
    });
    batch.delete(dbRef);
    await batch.commit();
    return res.status(200).json({ success: true, dbId, message: "Database deleted successfully" });
  } else return res.status(400).json({ error: "Only POST requests are allowed" });
}
