import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const headers = new Headers();
    const { query, page } = req.query;
    const url = `https://movie-database-alternative.p.rapidapi.com/?s=${query}&r=json&page=${page}`;

    headers.append("X-RapidAPI-Key", process.env.RAPID_API_KEY ?? "");
    headers.append(
      "X-RapidAPI-Host",
      "movie-database-alternative.p.rapidapi.com"
    );

    const response = await fetch(url, {
      method: "GET",
      headers,
    });
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error:
        "An error occurred while trying to fetch from `src/pages/api/movies.ts`.",
    });
  }
}
