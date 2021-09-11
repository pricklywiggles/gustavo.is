import path from 'path';
import fs from 'fs';

export default async (req, res) => {
  let filePath = path.resolve('.', 'public', 'sitemap.xml');
  const fileBuffer = fs.readFileSync(filePath);

  res.setHeader('Content-Type', 'application/xml');

  res.end(fileBuffer);
};
