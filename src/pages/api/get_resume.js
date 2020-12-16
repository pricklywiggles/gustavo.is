import path from "path";
import fs from "fs";

export default async (req, res) => {
  let filePath = path.resolve(".", "public", "gustavo_gallegos_resume.pdf");
  console.log(filePath);
  const fileBuffer = fs.readFileSync(filePath);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=gustavo_gallegos_resume.pdf"
  );
  res.send(fileBuffer);
};
