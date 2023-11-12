import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PATCH")
    return res.status(405).json({ message: "Method not allowed" });
  const session = getSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  const { user } = session;
  const { name } = req.body;
  const sessionCookie = req.cookies.appSession;
  if (!name) return res.status(400).json({ message: "Name not provided" });
  const axiosConfig = {
    method: "patch",
    url: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${user.sub}`,
    headers: {
      'Authorization' : `Bearer ${sessionCookie}`,
      'x-correlation-id': `${user.sub}-update-${Date.now()}`,
    },
  };
  try {
    await axios(axiosConfig);
    return res.status(200).json({ message: "User updated" });
  } catch (error: any) {
    console.log(user);
    // console.log(error.response);
    return res.status(500).json({ message: error.response.data.message });
  }
};

export default handler;
