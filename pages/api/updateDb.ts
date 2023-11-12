import { getSession } from "@auth0/nextjs-auth0";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase/firebase";
import { verifySubscription } from "../../utils/verifySubscription";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== "PUT")
        return res.status(405).json({ message: "Only PUT requests are accepted" });
    const session = getSession(req, res);
    if (!session) return res.status(401).json({ message: "Unauthorized" });
    const id = session?.user.sub;
    const isActive = verifySubscription(id);
    if(!isActive) return res.status(401).json({ message: "Unauthorized" });
    try {
        
        const { dbId, name, type } = req.body
        if (!dbId) return res.status(400).json({ message: "Please provide dbId in request body" });

        const isExists = await isNameExists(id, dbId, name)
        if (isExists)
            return res.status(400).json({ duplicate: true, message: `A database already exists with the name '${name}'`})

        const DBRef = doc(db, "users", id, "database", dbId)

        const updateFields = {
            name: "",
            type: ""
        }

        if (name) updateFields.name = name
        if (type) updateFields.type = type

        await updateDoc(DBRef, updateFields)

        return res.status(200).json({status: "true"});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Oops, something went wrong, please try again" });
    }
};

const isNameExists = async (uid: string, dbId: string, dbName: string) => {
    const databaseRef = collection(db, "users", uid, "database")
    const databaseSnapshot = query(databaseRef, where("name", "==", dbName))
    const databases = await getDocs(databaseSnapshot)
    let isExists = false
    databases.docs.map((database) => {
      if (database.data().id !== dbId && database.data().name === dbName) isExists = true
    })
    return isExists
  }

export default handler;