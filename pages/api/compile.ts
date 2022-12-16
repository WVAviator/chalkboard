import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(403).json({ message: 'Method not allowed' });
  }

  console.log(req.body);

  const codeBuffer = Buffer.from(req.body.code).toString('base64');

  const data = {
    language_id: 63,
    source_code: codeBuffer,
  };

  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    params: { base64_encoded: 'true', fields: '*', wait: 'true' },
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    },
    data: JSON.stringify(data),
  };

  try {
    const response = await axios.request(options);

    const stdout = Buffer.from(response.data.stdout, 'base64').toString(
      'utf-8'
    );
    console.dir(stdout);
    res.status(200).send({ stdout, success: true });
  } catch (error) {
    console.log('Error fetching executed code: ', error);
    res.status(500).send({ message: 'Internal server error' });
  }
}
