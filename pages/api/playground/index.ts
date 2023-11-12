import { getSession } from "@auth0/nextjs-auth0";
import { uuidv4 } from "@firebase/util";
import { doc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebase/firebase";
import openai from "../../../openai/openai";
import { possibleIntents } from "../../../utils/types";
import { verifySubscription } from "../../../utils/verifySubscription";
import {
  calculateRemainingTokens,
  getTokens,
} from "../../../utils/tokenization";
import { logger } from "../../../utils/logger";

const OPENAI_MAX_TOKENS = 4096;

const generatePrompt = (
  query: string,
  intent: string,
  tablePrompt?: string
) => {
  switch (intent) {
    case "explain":
      return `${
        tablePrompt ? tablePrompt + "\n" : ""
      }Query: ${query}\nTask: Explain the above query in human readable format in English step by step in numbered points.\n`;
    case "optimize":
      return `${
        tablePrompt ? tablePrompt + "\n" : ""
      }Query: ${query}\nTask: Optimize the above query to run faster. Return only SQL code.\n`;
    case "index":
      return `${
        tablePrompt ? tablePrompt + "\n" : ""
      }Query: ${query}\nTask: Generate the indexes based on above query. Return only SQL code.\n`;
    case "create":
    case "update":
    case "delete":
    case "select":
      return `${
        tablePrompt ? tablePrompt + "\n" : ""
      }Query: ${query}\nTask: Generate a SQL query based on above prompt and SQL table schema\n`;
    // case "create":
    //   return `${
    //     tablePrompt ? tablePrompt + "\n" : ""
    //   }Query: ${query}\nTask: Generate a CREATE query based on above prompt\n`;
    // case "update":
    //   return `${
    //     tablePrompt ? tablePrompt + "\n" : ""
    //   }Query: ${query}\nTask: Generate an UPDATE query based on above prompt\n`;
    // case "delete":
    //   return `${
    //     tablePrompt ? tablePrompt + "\n" : ""
    //   }Query: ${query}\nTask: Generate a DELETE query based on above prompt\n`;
    // case "select":
    //   return `${
    //     tablePrompt ? tablePrompt + "\n" : ""
    //   }Query: ${query}\nTask: Generate a SELECT query based on above prompt\n`;
    default:
      return `${
        tablePrompt ? tablePrompt + "\n" : ""
      }Query: ${query}\nTask: Explain the above query in human readable format in English step by step\n`;
  }
};

const generateDocRef = (userId: string, id: string, intent: string) => {
  switch (intent) {
    case "explain":
      return doc(db, "users", userId, "explain", id);
    case "index":
    case "optimize":
    case "create":
    case "update":
    case "delete":
    case "select":
      return doc(db, "users", userId, "query", id);
    default:
      return doc(db, "users", userId, "explain", id);
  }
};

const generateTablePrompt = (tables: any) => {
  let baseText = "These are SQL tables and their attributes in JSON format\n";
  const tableData = tables.map((table: any) => ({
    name: table.name,
    columns: table.columns,
  }));
  baseText += JSON.stringify(tableData);
  return baseText;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const session = getSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  const id = session?.user.sub;
  const isActive = verifySubscription(id);
  if (!isActive)
    return res.status(403).json({
      message: "Please upgrade your subscription to use this feature",
    });
  const { query, intent, dbid, tables } = req.body;
  if (!query)
    return res
      .status(400)
      .json({ message: "Please provide query in request body" });
  if (!intent)
    return res
      .status(400)
      .json({ message: "Please provide intent in request body" });
  if (!possibleIntents.includes(intent))
    return res.status(400).json({ message: "Please provide a valid intent" });

  const tablePrompt = tables && generateTablePrompt(tables);
  const prompt = generatePrompt(query, intent, tablePrompt);
  const tokens = getTokens(prompt);
  const promptTokens = tokens.text.length;
  const remainingTokens = calculateRemainingTokens(
    OPENAI_MAX_TOKENS,
    promptTokens
  );
  if (remainingTokens < 300) {
    return res
      .status(400)
      .json({
        message:
          "Prompt or database is too large to process. Please try again with a smaller prompt or database",
      });
  }
  try {
    const data = await openai.createCompletion({
      model: "text-davinci-003",
      // prompt: generatePrompt(query, intent, tablePrompt),
      prompt,
      temperature: 0,
      max_tokens: remainingTokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["```"],
      user: id,
    });
    const docId = uuidv4();
    const docRef = generateDocRef(id, docId, intent);
    const response = data.data.choices[0].text;
    const now = new Date();
    const docData = JSON.stringify({
      prompt: query,
      response,
      createdAt: now,
      dbid,
      operation: intent,
      id: docId,
    });
    await setDoc(docRef, JSON.parse(docData));
    return res.status(200).json({ id: docId, response, createdAt: now });
  } catch (error: any) {
    logger("error", error.response.data);
    if (error.response.status === 400) {
      if (error.response.data.error.type === "invalid_request_error")
        return res.status(400).json({
          message:
            "Prompt or database is too large to process. Please try again with a smaller prompt or database",
        });
      return res.status(400).json({
        message: "Something went wrong with OpenAI, please try again later.",
      });
    }
    return res.status(500).json(error);
  }
};

export default handler;
