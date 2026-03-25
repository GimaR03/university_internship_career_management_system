import { jsPDF } from 'jspdf';

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN_X = 14;
const MARGIN_TOP = 16;
const LINE_HEIGHT = 6;

const addPageIfNeeded = (doc, y, extraSpace = 0) => {
  if (y + extraSpace <= PAGE_HEIGHT - MARGIN_TOP) {
    return y;
  }

  doc.addPage();
  return MARGIN_TOP;
};

const writeWrappedText = (doc, text, x, y, maxWidth, options = {}) => {
  const lines = doc.splitTextToSize(String(text ?? '-'), maxWidth);
  const nextY = addPageIfNeeded(doc, y, lines.length * LINE_HEIGHT + 2);

  doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
  doc.setFontSize(options.fontSize || 10);
  doc.text(lines, x, nextY);

  return nextY + lines.length * LINE_HEIGHT;
};

export const downloadFilteredPdfReport = ({
  fileName,
  title,
  subtitle,
  filters = {},
  columns = [],
  rows = [],
}) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MARGIN_TOP;

  doc.setFillColor(99, 102, 241);
  doc.roundedRect(MARGIN_X, y, PAGE_WIDTH - MARGIN_X * 2, 18, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(title, MARGIN_X + 6, y + 11);
  y += 26;

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, MARGIN_X, y);
  y += 7;

  if (subtitle) {
    y = writeWrappedText(doc, subtitle, MARGIN_X, y, PAGE_WIDTH - MARGIN_X * 2, { fontSize: 10 });
    y += 2;
  }

  const activeFilters = Object.entries(filters).filter(([, value]) => value && value !== 'All');
  if (activeFilters.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Applied Filters', MARGIN_X, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    activeFilters.forEach(([key, value]) => {
      y = addPageIfNeeded(doc, y, 8);
      doc.text(`${key}: ${value}`, MARGIN_X, y);
      y += 6;
    });
    y += 2;
  }

  doc.setDrawColor(199, 210, 254);
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(MARGIN_X, y, PAGE_WIDTH - MARGIN_X * 2, 10, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(49, 46, 129);
  doc.text(`Total Rows: ${rows.length}`, MARGIN_X + 4, y + 6.5);
  y += 16;

  doc.setTextColor(15, 23, 42);
  rows.forEach((row, index) => {
    y = addPageIfNeeded(doc, y, 16);

    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(MARGIN_X, y, PAGE_WIDTH - MARGIN_X * 2, 8, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Record ${index + 1}`, MARGIN_X + 4, y + 5.5);
    y += 11;

    columns.forEach((column) => {
      const label = column.label || column.key;
      const value = row[column.key];
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`${label}:`, MARGIN_X, y);
      y = writeWrappedText(doc, value, MARGIN_X + 34, y, PAGE_WIDTH - MARGIN_X * 2 - 34, { fontSize: 10 });
      y += 2;
    });

    y += 3;
  });

  doc.save(fileName);
};
