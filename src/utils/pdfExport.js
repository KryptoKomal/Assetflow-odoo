import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToPDF(title, rows) {
    if (!rows.length) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 14, 15);

    const headers = [Object.keys(rows[0])];
    const data = rows.map((r) => Object.values(r));

    autoTable(doc, {
        head: headers,
        body: data,
        startY: 22,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}
