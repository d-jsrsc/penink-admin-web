// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // console.log("story", req.query.id, req.method, req.headers);
  const method = req.method?.toUpperCase();
  if (method === "PUT") {
    const apiRes = await axios.put(
      `${process.env.API_SERVER}/api/user/admin/checkstory`,
      {
        id: req.query.id,
        ...req.body,
      },
      {
        headers: {
          cookie: req.headers.cookie || "",
        },
      }
    );
    res.status(200).json(apiRes.data);
    return;
  }
  if (method === "GET") {
    const apiRes = await axios.get(
      `${process.env.API_SERVER}/api/user/admin/checkstory?id=${req.query.id}`,
      {
        headers: {
          cookie: req.headers.cookie || "",
        },
      }
    );
    res.status(200).json(apiRes.data);
    return;
  }

  res.status(404).end("404");
}
