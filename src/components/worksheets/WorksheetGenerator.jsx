import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

const WorksheetGenerator = () => {
    const [topic, setTopic] = useState('addition');
    const [difficulty, setDifficulty] = useState('easy');
    const [count, setCount] = useState(10);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateProblems = () => {
        const problems = [];
        for (let i = 0; i < count; i++) {
            let num1, num2, operator, answer;

            if (topic === 'addition') {
                operator = '+';
                if (difficulty === 'easy') { // 1-10
                    num1 = Math.floor(Math.random() * 10) + 1;
                    num2 = Math.floor(Math.random() * 10) + 1;
                } else { // 10-50
                    num1 = Math.floor(Math.random() * 40) + 10;
                    num2 = Math.floor(Math.random() * 40) + 10;
                }
                answer = num1 + num2;
            } else if (topic === 'subtraction') {
                operator = '-';
                if (difficulty === 'easy') { // Result > 0
                    num1 = Math.floor(Math.random() * 15) + 5;
                    num2 = Math.floor(Math.random() * num1);
                } else {
                    num1 = Math.floor(Math.random() * 80) + 20;
                    num2 = Math.floor(Math.random() * 50) + 10;
                }
                answer = num1 - num2;
            } else if (topic === 'multiplication') {
                operator = '×';
                if (difficulty === 'easy') { // 1-5
                    num1 = Math.floor(Math.random() * 5) + 1;
                    num2 = Math.floor(Math.random() * 5) + 1;
                } else { // 2-9
                    num1 = Math.floor(Math.random() * 8) + 2;
                    num2 = Math.floor(Math.random() * 9) + 1;
                }
                answer = num1 * num2;
            }

            problems.push({ num1, num2, operator, answer });
        }
        return problems;
    };

    const handleDownload = async () => {
        setIsGenerating(true);
        const problems = generateProblems();

        // Prepare Answer Key Payload
        const keyData = problems.map(p => p.answer);
        const qrPayload = JSON.stringify({ t: topic, d: new Date().toLocaleDateString(), k: keyData });

        // Generate QR Code Data URL
        const qrDataUrl = await QRCode.toDataURL(qrPayload);

        // Create PDF
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text("Abacus Math Worksheet", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.text(`Topic: ${topic.charAt(0).toUpperCase() + topic.slice(1)}`, 20, 35);
        doc.text(`Date: ________________`, 140, 35);
        doc.text(`Name: ________________`, 140, 45);

        // Problems Grid
        doc.setFontSize(16);
        let y = 60;
        let x = 20;

        problems.forEach((p, index) => {
            const text = `${index + 1})   ${p.num1} ${p.operator} ${p.num2} = ______`;
            doc.text(text, x, y);

            // Move cursor
            if ((index + 1) % 2 === 0) {
                x = 20;
                y += 20;
            } else {
                x = 110;
            }
        });

        // Footer & QR Code
        const footerY = 250;
        doc.addImage(qrDataUrl, 'PNG', 160, footerY - 10, 30, 30);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Scan to Grade with Abacus App", 175, footerY + 25, { align: "center" });

        // Branding
        doc.setFontSize(10);
        doc.text("Powered by Abacus Homeschool", 105, 280, { align: "center" });

        // Save
        doc.save(`abacus-worksheet-${topic}.pdf`);
        setIsGenerating(false);
    };

    return (
        <div style={{ padding: '2rem', background: 'white', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#111827' }}>🖨️ Worksheet Generator</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Topic</label>
                    <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                    >
                        <option value="addition">Addition (+)</option>
                        <option value="subtraction">Subtraction (-)</option>
                        <option value="multiplication">Multiplication (×)</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Difficulty</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                    >
                        <option value="easy">Easy (Fundamentals)</option>
                        <option value="hard">Challenge (Big Numbers)</option>
                    </select>
                </div>
            </div>

            <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            >
                {isGenerating ? 'Generating...' : 'Download PDF 📄'}
            </button>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
                Includes QR Answer Key for instant grading.
            </p>
        </div>
    );
};

export default WorksheetGenerator;
