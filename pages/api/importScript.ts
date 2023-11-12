import { getSession } from "@auth0/nextjs-auth0";
import { collection, doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase/firebase";
import { Table } from "../../utils/types";
import { verifySubscription } from "../../utils/verifySubscription";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" }); 
    const session = getSession(req, res);
    if(!session) res.status(401).json({ message: "Unauthorized" });
    const id = session?.user.sub;
    const isActive = verifySubscription(id);
    if(!isActive) return res.status(401).json({ message: "Unauthorized" }); 
    const { tables, uid } = req.body;
    if(!uid) return res.status(400).json({ message: "No uid provided" });
    if(!tables) return res.status(400).json({ message: "No tables provided" });
    try {
        const batch = writeBatch(db);
        tables.forEach((table: Table) => {
            delete table.inEdit;
            const tableRef = collection(db, "users", uid, "table");
            const newTableRef = doc(tableRef, table.id);
            batch.set(newTableRef, {...table, createdAt: serverTimestamp()});
        })
        await batch.commit();
        return res.status(200).json({ message: "Tables imported successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}