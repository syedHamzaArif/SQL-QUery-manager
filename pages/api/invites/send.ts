import { getSession } from "@auth0/nextjs-auth0";
import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { verifySubscription } from "../../../utils/verifySubscription";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const session = getSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  const id = session?.user.sub;
  const isActive = verifySubscription(id);
  if (!isActive) return res.status(401).json({ message: "Unauthorized" });
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const invitingUser = session?.user.email;
  const axiosConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PLUNK_API_SECRET}`,
    },
    data: {
      email: email,
      event: "invitation",
      data: {
        "inviting-user": invitingUser,
      },
    },
    url: "https://api.useplunk.com/v1",
  };
  try {
    await axios(axiosConfig);
    return res.status(200).json({ message: "Success" });
  } catch (error: any) {
    console.error(error);
    return res.status(error.response.status).json({ error: error.response.data });
  }
};

export default handler;
