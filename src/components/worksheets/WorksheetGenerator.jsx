import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

const WorksheetGenerator = () => {
    const [topic, setTopic] = useState('addition');
    const [gradeLevel, setGradeLevel] = useState(1);
    const [problemCount, setProblemCount] = useState(10);
    const [batchSize, setBatchSize] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Difficulty Logic based on Grade
    const generateProblems = () => {
        const problems = [];
        for (let i = 0; i < problemCount; i++) {
            let num1, num2, operator, answer;

            // Grade-based Complexity
            if (topic === 'addition') {
                operator = '+';
                if (gradeLevel <= 0) { // K: 1-5
                    num1 = Math.floor(Math.random() * 5) + 1;
                    num2 = Math.floor(Math.random() * 5) + 1;
                } else if (gradeLevel === 1) { // G1: 1-20
                    num1 = Math.floor(Math.random() * 10) + 1;
                    num2 = Math.floor(Math.random() * 10) + 1;
                } else if (gradeLevel === 2) { // G2: 10-100
                    num1 = Math.floor(Math.random() * 50) + 10;
                    num2 = Math.floor(Math.random() * 40) + 1;
                } else { // G3+: 100-1000
                    num1 = Math.floor(Math.random() * 500) + 100;
                    num2 = Math.floor(Math.random() * 500) + 100;
                }
                answer = num1 + num2;

            } else if (topic === 'subtraction') {
                operator = '-';
                if (gradeLevel <= 1) { // Small numbers, positive result
                    num1 = Math.floor(Math.random() * 10) + 5;
                    num2 = Math.floor(Math.random() * num1);
                } else { // Larger numbers
                    num1 = Math.floor(Math.random() * 100) + 20;
                    num2 = Math.floor(Math.random() * 100);
                }
                answer = num1 - num2;

            } else if (topic === 'multiplication') {
                operator = '×';
                if (gradeLevel <= 2) { // 1-5 facts
                    num1 = Math.floor(Math.random() * 5) + 1;
                    num2 = Math.floor(Math.random() * 5) + 1;
                } else if (gradeLevel === 3) { // 1-12 facts
                    num1 = Math.floor(Math.random() * 12) + 1;
                    num2 = Math.floor(Math.random() * 10) + 1;
                } else { // Multi-digit
                    num1 = Math.floor(Math.random() * 20) + 5;
                    num2 = Math.floor(Math.random() * 10) + 2;
                }
                answer = num1 * num2;
            }

            problems.push({ num1, num2, operator, answer });
        }
        return problems;
    };

    const createPDF = async (problems, batchIndex = 0) => {
        const keyData = problems.map(p => p.answer);
        const qrPayload = JSON.stringify({ t: topic, g: gradeLevel, k: keyData });
        const qrDataUrl = await QRCode.toDataURL(qrPayload);

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

        // Grid
        doc.setFontSize(16);
        let y = 60;
        let x = 20;

        problems.forEach((p, index) => {
            const text = `${index + 1})   ${p.num1} ${p.operator} ${p.num2} = ______`;
            doc.text(text, x, y);
            if ((index + 1) % 2 === 0) {
                x = 20;
                y += 20;
            } else {
                x = 110;
            }
        });

        // Footer
        const footerY = 250;
        doc.addImage(qrDataUrl, 'PNG', 170, footerY - 10, 25, 25);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Scan for Answer Key", 182, footerY + 20, { align: "center" });
        doc.text("Powered by Abacus Homeschool", 105, 280, { align: "center" });

        return doc;
    };

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            for (let i = 0; i < batchSize; i++) {
                const problems = generateProblems();
                const doc = await createPDF(problems, i);
                const fileName = `worksheet-${topic}-G${gradeLevel}-${i + 1}.pdf`;
                doc.save(fileName);
            }
        } catch (e) {
            console.error(e);
            alert("Error generating PDF");
        }
        setIsGenerating(false);
    };

    const handleSaveToLib = async () => {
        setIsSaving(true);
        // Mock Save Functionality for now since full Supabase integration requires context
        // Ideally: await supabase.from('worksheets').insert({...})
        setTimeout(() => {
            alert(`Saved ${batchSize} worksheet(s) to the Library! (Simulated)`);
            setIsSaving(false);
        }, 1000);
    };

    return (
        <div style={{ padding: '2rem', background: 'white', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🖨️ <span style={{ background: 'linear-gradient(to right, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Magic Generator</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Topic Selection */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Topic</label>
                    <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '1rem' }}
                    >
                        <option value="addition">➕ Addition</option>
                        <option value="subtraction">➖ Subtraction</option>
                        <option value="multiplication">✖️ Multiplication</option>
                    </select>
                </div>

                {/* Grade Level Selection (Smart Difficulty) */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Student Grade</label>
                    <select
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(parseInt(e.target.value))}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '1rem' }}
                    >
                        <option value="0">Kindergarten (0-5)</option>
                        <option value="1">1st Grade (0-20)</option>
                        <option value="2">2nd Grade (Double Digits)</option>
                        <option value="3">3rd Grade (Hundreds / Facts)</option>
                        <option value="4">4th Grade (Advanced)</option>
                        <option value="5">5th Grade (Expert)</option>
                    </select>
                </div>

                {/* Batch Size */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Number of Worksheets</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[1, 5, 10].map(num => (
                            <button
                                key={num}
                                onClick={() => setBatchSize(num)}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    border: batchSize === num ? '2px solid #2563eb' : '1px solid #d1d5db',
                                    background: batchSize === num ? '#eff6ff' : 'white',
                                    color: batchSize === num ? '#1d4ed8' : '#374151',
                                    fontWeight: batchSize === num ? 'bold' : 'normal',
                                    cursor: 'pointer'
                                }}
                            >
                                {num}x
                            </button>
                        ))}
                    </div>
                </div>

                {/* Problem Count */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Problems per Page</label>
                    <select
                        value={problemCount}
                        onChange={(e) => setProblemCount(parseInt(e.target.value))}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                    >
                        <option value="10">10 Problems (Quick)</option>
                        <option value="20">20 Problems (Standard)</option>
                    </select>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                    onClick={handleDownload}
                    disabled={isGenerating || isSaving}
                    className="btn btn-primary"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', height: '50px', fontSize: '1.1rem' }}
                >
                    {isGenerating ? 'Generating...' : `📥 Download PDF (${batchSize})`}
                </button>

                <button
                    onClick={handleSaveToLib}
                    disabled={isGenerating || isSaving}
                    style={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', height: '50px', fontSize: '1.1rem',
                        background: 'white', border: '2px solid #3b82f6', color: '#3b82f6', borderRadius: '8px', cursor: 'pointer'
                    }}
                >
                    {isSaving ? 'Saving...' : '💾 Save to Library'}
                </button>
            </div>

            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#6b7280', textAlign: 'center' }}>
                Generated worksheets are unique every time. Batch generation creates {batchSize} distinct PDF files.
            </p>
        </div>
    );
};

export default WorksheetGenerator;
