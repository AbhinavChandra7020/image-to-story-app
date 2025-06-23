import { SaveFileType } from "@/app/_types/fileTypes";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { normalizeParagraphs } from "@/app/_utils/paragraphFormatter"; 

// save files as txt
export function saveAsTxt({ title, storyText }: SaveFileType) {
  const plainText = `${title}\n\n${storyText}`;
  const blob = new Blob([plainText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// save files as docx
export async function saveAsDocx({ title, storyText }: SaveFileType) {
  const formatted = normalizeParagraphs(storyText);

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 32 })],
            spacing: { after: 300 },
          }),
          ...formatted.split("\n\n").map((para) =>
            new Paragraph({
              children: [new TextRun({ text: para, size: 24 })],
              spacing: { after: 200 },
            })
          ),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title.replace(/\s+/g, "_")}.docx`);
}

// save files as pdf
export function saveAsPdf({ title, storyText }: SaveFileType) {
  const formatted = normalizeParagraphs(storyText);

  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const maxLineWidth = pageWidth - margin * 2;
  const lineHeight = 20;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, margin, 50);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  let y = 80;
  const lines = doc.splitTextToSize(formatted, maxLineWidth);

  lines.forEach((line: string) => {
    if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}
