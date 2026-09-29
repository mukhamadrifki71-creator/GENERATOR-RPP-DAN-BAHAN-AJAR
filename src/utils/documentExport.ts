import { marked } from 'marked';
import { SignatoryConfig } from '../types';

/**
 * Configure marked options
 */
marked.setOptions({
  gfm: true,
  breaks: true,
});

export function parseMarkdownToHtml(markdown: string): string {
  try {
    return marked.parse(markdown) as string;
  } catch (err) {
    console.error('Error parsing markdown:', err);
    return markdown;
  }
}

/**
 * Splits the generated markdown into Bagian 1 (RPP) and Bagian 2 (Bahan Ajar)
 * and individual components
 */
export interface SplitDocumentSections {
  raw: string;
  rppMarkdown: string;
  bahanAjarMarkdown: string;
  summaryMateri: string;
  scenarioCerita: string;
  lkpd: string;
  kartuInkuiri: string;
  kemitraan: string;
}

export function splitGeneratedContent(markdown: string): SplitDocumentSections {
  const parts = markdown.split(/## BAGIAN 2: PAKET MATERI & BAHAN AJAR LENGKAP|# BAGIAN 2: PAKET MATERI & BAHAN AJAR LENGKAP/i);

  const rppMarkdown = parts[0] || '';
  const bahanAjarMarkdown = parts.length > 1 ? '## BAGIAN 2: PAKET MATERI & BAHAN AJAR LENGKAP\n' + parts[1] : '';

  // Extract individual sections of Bahan Ajar if present
  let summaryMateri = '';
  let scenarioCerita = '';
  let lkpd = '';
  let kartuInkuiri = '';
  let kemitraan = '';

  if (parts[1]) {
    const raw = parts[1];
    
    // Find boundaries using regex matching section numbers
    const idx1 = raw.search(/### 1\./i);
    const idx2 = raw.search(/### 2\./i);
    const idx3 = raw.search(/### 3\./i);
    const idx4 = raw.search(/### 4\./i);
    const idx5 = raw.search(/### 5\./i);

    if (idx1 !== -1) {
      const end1 = idx2 !== -1 ? idx2 : raw.length;
      summaryMateri = raw.slice(idx1, end1).trim();
    }
    if (idx2 !== -1) {
      const end2 = idx3 !== -1 ? idx3 : raw.length;
      scenarioCerita = raw.slice(idx2, end2).trim();
    }
    if (idx3 !== -1) {
      const end3 = idx4 !== -1 ? idx4 : raw.length;
      lkpd = raw.slice(idx3, end3).trim();
    }
    if (idx4 !== -1) {
      const end4 = idx5 !== -1 ? idx5 : raw.length;
      kartuInkuiri = raw.slice(idx4, end4).trim();
    }
    if (idx5 !== -1) {
      kemitraan = raw.slice(idx5).trim();
    }
  }

  return {
    raw: markdown,
    rppMarkdown: rppMarkdown.trim(),
    bahanAjarMarkdown: bahanAjarMarkdown.trim(),
    summaryMateri,
    scenarioCerita,
    lkpd,
    kartuInkuiri,
    kemitraan,
  };
}

/**
 * Downloads generated content as an MS Word .doc file
 */
export function exportToWordDoc(
  title: string,
  markdown: string,
  signatoryConfig?: SignatoryConfig
) {
  const htmlContent = marked.parse(markdown);

  const signatoryHtml = signatoryConfig
    ? `
      <div style="margin-top: 48px; page-break-inside: avoid;">
        <table style="width: 100%; border: none; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; text-align: center; border: none; vertical-align: top;">
              <p style="margin: 0; font-size: 11pt; color: #475569;">Mengetahui,</p>
              <p style="margin: 4px 0 0 0; font-size: 11pt; font-weight: bold;">Kepala ${signatoryConfig.schoolName || 'Sekolah Dasar'}</p>
              <div style="height: 70px;"></div>
              <p style="margin: 0; font-size: 11pt; font-weight: bold; text-decoration: underline; text-transform: uppercase;">${signatoryConfig.principalName || '..............................................'}</p>
              <p style="margin: 2px 0 0 0; font-size: 10pt; color: #475569;">NIP. ${signatoryConfig.principalNip || '.....................................'}</p>
            </td>
            <td style="width: 50%; text-align: center; border: none; vertical-align: top;">
              <p style="margin: 0; font-size: 11pt; color: #475569;">${signatoryConfig.cityAndDate || '............................, ..................... 2026'}</p>
              <p style="margin: 4px 0 0 0; font-size: 11pt; font-weight: bold;">Guru Pendidikan Agama Islam & BP</p>
              <div style="height: 70px;"></div>
              <p style="margin: 0; font-size: 11pt; font-weight: bold; text-decoration: underline; text-transform: uppercase;">${signatoryConfig.teacherName || '..............................................'}</p>
              <p style="margin: 2px 0 0 0; font-size: 10pt; color: #475569;">NIP. ${signatoryConfig.teacherNip || '.....................................'}</p>
            </td>
          </tr>
        </table>
      </div>
    `
    : '';

  const fullHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${title}</title>
        <style>
          body {
            font-family: 'Calibri', 'Times New Roman', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #1a202c;
            padding: 20px;
          }
          h1, h2, h3, h4 {
            color: #0f172a;
            font-family: 'Calibri', Arial, sans-serif;
            margin-top: 14pt;
            margin-bottom: 6pt;
          }
          h3 { font-size: 14pt; border-bottom: 2px solid #0f766e; padding-bottom: 4px; color: #0f766e; }
          h4 { font-size: 12pt; color: #0f766e; }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 12pt 0;
          }
          th, td {
            border: 1px solid #cbd5e1;
            padding: 8px;
            text-align: left;
            font-size: 10pt;
          }
          th {
            background-color: #f1f5f9;
            font-weight: bold;
          }
          hr {
            border: 0;
            height: 1px;
            background: #cbd5e1;
            margin: 16pt 0;
          }
          blockquote {
            border-left: 3px solid #0f766e;
            padding-left: 10px;
            color: #475569;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 24px;">
          <p style="font-size: 14pt; font-weight: bold; margin: 0; color: #0f766e;">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI</p>
          <p style="font-size: 12pt; font-weight: bold; margin: 4px 0 0 0;">PUSAT KURIKULUM DAN PEMBELAJARAN</p>
          <p style="font-size: 10pt; color: #64748b; margin: 4px 0 16px 0;">Perencanaan Pembelajaran Mendalam & Paket Bahan Ajar PAI & Budi Pekerti</p>
          <hr/>
        </div>
        ${htmlContent}
        ${signatoryHtml}
      </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + fullHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_')}_RPP_EduCraft.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads content as plain markdown (.md)
 */
export function exportToMarkdownFile(title: string, markdown: string) {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_')}_RPP_EduCraft.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
