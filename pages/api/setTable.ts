import { getSession } from "@auth0/nextjs-auth0";
import { doc, setDoc, serverTimestamp, collection, query, getDocs, where } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase/firebase";
import { Table } from "../../utils/types";
import { verifySubscription } from "../../utils/verifySubscription";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Only POST requests are accepted" })
  const session = getSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  const id = session?.user.sub;
  const isActive = verifySubscription(id);
  if(!isActive) return res.status(401).json({ message: "Unauthorized" });
    try {
      const { table, uid } = req.body

      if (!table || !uid) return res.status(400).json({ message: "Please provide table and uid in request body"})

      const isExists = await isNameExists(uid, table?.dbid, table?.id, table?.name)
      if (isExists)
        return res.status(400).json({ duplicate: true, message: `A table already exists with the name '${table?.name}'`})

      const newTable: Table = {
        ...table,
        createdAt: serverTimestamp(),
      }
      await setDoc(doc(db, "users", uid, "table", table?.id || ''), newTable)
      return res.status(200).json(table)
  } catch (error) {
    return res.status(500).json({error, message: "Oops, something went wrong, please try again" })
  }
}

const isNameExists = async (uid: string, dbId: string, tbId: string, tbName: string) => {
  const tableRef = collection(db, "users", uid, "table")
  const tableSnapshot = query(tableRef, where("dbid", "==", dbId),  where("name", "==", tbName))
  const tables = await getDocs(tableSnapshot)
  let isExists = false
  tables.docs.map((table) => {
    if (table.data().id !== tbId && table.data().name === tbName) isExists = true
  })
  return isExists
}