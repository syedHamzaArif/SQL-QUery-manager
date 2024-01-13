import { NextApiRequest, NextApiResponse } from "next";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { DB, Query, Table } from "../../utils/types";
import openai from "../../openai/openai";
import { getSession } from "@auth0/nextjs-auth0";
import { verifySubscription } from "../../utils/verifySubscription";

interface DBWithTable extends DB {
  tables: any;
}

const generatePrompt = (
  input: string,
  operation: string,
  db: Omit<DBWithTable, "queries">
) => {
  return `### ${db.type} tables, with their properties are as follows:
# ${db.tables
    .map((t: any) => {
      return `${t.name}(${t.columns
        .map((c: any) => `${c.name} : ${c.type}`)
        .join(",")})`;
    })
    .join("#\r\n")}
#
### Write a SQL query to answer the following question for the above database:
### ${input}.`;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query,
    uid,
    queryDb,
  }: {
    query: Omit<Query, "response" | "createdAt">;
    uid: string;
    queryDb: Omit<DBWithTable, "queries">;
  } = req.body;
  const session = getSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  const id = session?.user.sub;
  const isActive = verifySubscription(id);
  if (!isActive)
    return res
      .status(403)
      .json({
        message: "Please upgrade your subscription to use this feature",
      });
  try {
    openai
      .createCompletion({
        model: "gpt-3.5-turbo-instruct",
        prompt: generatePrompt(query.prompt, query.operation, queryDb),
        temperature: 0,
        max_tokens: 256,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["#", "```"],
        user: uid,
      })
      .then(async (response) => {
        const q = response.data.choices[0].text ?? "";

        const temp: Query = {
          ...query,
          createdAt: serverTimestamp(),
          response: q,
        };

        const queryRef = doc(db, "users", uid, "query", query.id);

        await setDoc(queryRef, {
          ...temp,
          dbid: queryDb.id,
        });

        return temp;
      })
      .then((t) => {
        return res.status(200).json(t);
      })
      .catch((err) => (''));
  } catch (error) {
    return res.status(500).json(error);
  }
}
