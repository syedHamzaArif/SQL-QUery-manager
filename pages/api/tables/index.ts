import { getSession } from "@auth0/nextjs-auth0";
import { collection, getDocs, query, where, orderBy, startAt, startAfter, endAt, limit } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebase/firebase";
import { Table } from "../../../utils/types";
import { verifySubscription } from "../../../utils/verifySubscription";

type ParamType = {
  [key: string]: any
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method !== "GET")
    return res.status(405).json({ message: "Only GET requests are accepted" });

    const session = getSession(req, res);
    if(!session) return res.status(401).json({ message: 'Unauthorized' });
    const id = session?.user.sub;
    const isActive = verifySubscription(id);
    if(!isActive) return res.status(403).json({ message: "Please upgrade your subscription to use this feature" });

  const { dbId, page }: ParamType = req.query
  if (!dbId) return res.status(400).json({ message: "Please provide dbId in request query" });
  const lastIndex = (page * 5)-1;

  try {
    let data: Table[] = [];

    const tableRef = collection(db, "users", id, "table")
    const tableSnapshot = query(tableRef, where("dbid", "==", dbId), orderBy("index", 'asc'), startAfter(lastIndex), limit(5))
    const tables = await getDocs(tableSnapshot)
    console.log(tables.docs.length)
    tables.docs.forEach(doc => {
        data.push(
            {
                id: doc.data().id,
                dbid: doc.data().dbid,
                index: doc.data().index,
                name: doc.data().name,
                columns: doc.data().columns,
                createdAt: doc.data().createdAt
            }
        )
    });
    return res.status(200).json({ status: true, tables: data });

  } catch (error) {
    console.error(error);
    return res.status(500).json({error, message: "Oops, something went wrong, please try again" });
  }
};

export default handler;