// 📁 /api/analyze.ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Файл не вдалося обробити' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const character = fields.character as string;
    const content = await fs.readFile(file.filepath, 'utf8');

    const lines = content
      .split('\n')
      .filter(line => line.trim().startsWith(`${character}:`))
      .map(line => line.trim());

    res.status(200).json({ character, lines });
  });
}
