import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

async function extractPdfText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(text);
  }

  return pages.join("\n\n").trim();
}

function readTextFile(file: File): Promise<string> {
  return file.text();
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64 ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export interface ExtractedDocument {
  text?: string;
  imageBase64?: string;
  mimeType: string;
  fileName: string;
  pageCount?: number;
}

export async function extractDocumentContent(file: File): Promise<ExtractedDocument> {
  const mimeType = file.type || (file.name.endsWith(".txt") ? "text/plain" : "application/octet-stream");

  if (mimeType === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    const text = await extractPdfText(file);
    if (text.length < 50) {
      throw new Error(
        "Could not extract enough text from this PDF. Try a clearer scan or upload as an image.",
      );
    }
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buffer }).promise;
    return { text, mimeType: "application/pdf", fileName: file.name, pageCount: pdf.numPages };
  }

  if (mimeType === "text/plain" || file.name.endsWith(".txt")) {
    const text = await readTextFile(file);
    return { text, mimeType: "text/plain", fileName: file.name };
  }

  if (mimeType.startsWith("image/")) {
    const imageBase64 = await fileToBase64(file);
    return { imageBase64, mimeType, fileName: file.name };
  }

  throw new Error("Unsupported file type.");
}
