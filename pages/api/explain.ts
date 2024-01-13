import { doc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase/firebase";
import openai from "../../openai/openai";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "@auth0/nextjs-auth0";
import { verifySubscription } from "../../utils/verifySubscription";

const generatePrompt = (code: string) =>
  `${code}\n--Explain the above query in human readable format in English step by step.\n1.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are accepted" });
  }
  const session = getSession(req, res);
  if(!session) return res.status(401).json({ message: 'Unauthorized' });
  const id = session?.user.sub;
  const isActive = verifySubscription(id);
  if(!isActive) return res.status(403).json({ message: "Please upgrade your subscription to use this feature" });
  try {
    const { uid, code } = req.body;
    if ( !code ) return res.status(400).json({ message: "Please provide code in request body" })

    const data = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: generatePrompt(code),
      temperature: 0,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["```"],
      user: uid,
    });

    const id = uuidv4();
    const text = `1.${data.data.choices[0].text}`;
    const documentRef = uid
      ? doc(db, "users", uid, "explain", id)
      : doc(db, "explainSQL", id);

    await setDoc(documentRef, { code, text });

    return res.status(200).json({ id, text });
  } catch (err) {
    return res.status(500).json(err);
  }
}