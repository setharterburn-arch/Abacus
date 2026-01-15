import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export const createWorksheetPDF = async (topic, gradeLevel, problems) => {
    // Generate QR payload
    const keyData = problems.map(p => p.answer);
    const qrPayload = JSON.stringify({ t: topic, g: gradeLevel, k: keyData }); // Keep payload small
    let qrDataUrl = null;

    try {
        qrDataUrl = await QRCode.toDataURL(qrPayload);
    } catch (e) {
        console.warn("QR Gen failed", e);
    }

    const doc = new jsPDF();

    // Fonts & Styling
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Abacus Math Worksheet", 105, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Topic: ${topic.toUpperCase()} (Grade ${gradeLevel})`, 20, 35);
    doc.text(`Date: ________________`, 140, 35);
    doc.text(`Name: ________________`, 140, 45);

    // Grid Layout
    doc.setFontSize(16);
    let y = 60;
    let x = 20;

    problems.forEach((p, index) => {
        const text = `${index + 1})   ${p.num1} ${p.operator} ${p.num2} = ______`;
        doc.text(text, x, y);

        // 2 Columns
        if ((index + 1) % 2 === 0) {
            x = 20;
            y += 20;
        } else {
            x = 110;
        }

        // New page if full
        if (y > 240) {
            doc.addPage();
            y = 40;
            x = 20;
        }
    });

    // Footer
    const footerY = 250;
    if (qrDataUrl) {
        doc.addImage(qrDataUrl, 'PNG', 170, footerY - 10, 25, 25);
    }

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Scan for Answer Key", 182, footerY + 20, { align: "center" });
    doc.text("Powered by Abacus Homeschool", 105, 280, { align: "center" });

    return doc;
};
