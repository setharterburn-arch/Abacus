import React, { useState } from 'react';
import worksheetsData from '../data/worksheets.json';

const Worksheets = () => {
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWorksheet, setSelectedWorksheet] = useState(null);

    // Filter worksheets
    const filteredWorksheets = worksheetsData.filter(ws => {
        const matchesGrade = selectedGrade === 'all' || ws.grade_level === parseInt(selectedGrade);
        const matchesSearch = ws.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ws.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ws.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGrade && matchesSearch;
    });

    const handlePrint = (worksheet) => {
        const printWindow = window.open(worksheet.worksheet, '_blank');
        printWindow.onload = () => {
            printWindow.print();
        };
    };

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1200px' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ margin: '0 0 0.5rem 0' }}>📄 Printable Worksheets</h1>
                <p style={{ color: 'gray', margin: 0 }}>Browse and print math worksheets for your students</p>
            </header>

            {selectedWorksheet ? (
                <div>
                    <button className="btn btn-secondary" onClick={() => setSelectedWorksheet(null)} style={{ marginBottom: '1rem' }}>
                        ← Back to Worksheets
                    </button>

                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ margin: '0 0 0.5rem 0' }}>{selectedWorksheet.title}</h3>
                                <p style={{ color: 'gray', margin: 0 }}>{selectedWorksheet.description}</p>
                            </div>
                            <button className="btn btn-primary" onClick={() => handlePrint(selectedWorksheet)}>
                                🖨️ Print
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <span className="badge" style={{ background: '#e3f2fd', color: '#1565c0' }}>
                                Grade {selectedWorksheet.grade_level === 0 ? 'K' : selectedWorksheet.grade_level}
                            </span>
                            <span className="badge" style={{ background: '#f3e5f5', color: '#7b1fa2' }}>
                                {selectedWorksheet.topic}
                            </span>
                        </div>

                        <div style={{ border: '2px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                            <img
                                src={selectedWorksheet.worksheet}
                                alt={selectedWorksheet.title}
                                style={{ width: '100%', display: 'block' }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Grade Level</label>
                            <select
                                className="input"
                                value={selectedGrade}
                                onChange={(e) => setSelectedGrade(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                <option value="all">All Grades</option>
                                <option value="0">Kindergarten</option>
                                <option value="1">Grade 1</option>
                                <option value="2">Grade 2</option>
                                <option value="3">Grade 3</option>
                                <option value="4">Grade 4</option>
                                <option value="5">Grade 5</option>
                            </select>
                        </div>
                        <div style={{ flex: '2', minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Search</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Search by topic or title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>

                    {/* Results */}
                    <p style={{ marginBottom: '1.5rem', color: 'gray' }}>
                        Showing {filteredWorksheets.length} worksheet{filteredWorksheets.length !== 1 ? 's' : ''}
                    </p>

                    {filteredWorksheets.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'gray' }}>
                            <p>No worksheets match your filters.</p>
                            <button className="btn btn-secondary" onClick={() => { setSelectedGrade('all'); setSearchQuery(''); }} style={{ marginTop: '1rem' }}>
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {filteredWorksheets.map(ws => (
                                <div
                                    key={ws.id}
                                    className="card"
                                    style={{
                                        cursor: 'pointer',
                                        border: '1px solid #eee',
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                    onClick={() => setSelectedWorksheet(ws)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {/* Thumbnail */}
                                    <div style={{
                                        border: '1px solid #eee',
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        marginBottom: '1rem',
                                        background: '#f9f9f9'
                                    }}>
                                        <img
                                            src={ws.worksheet}
                                            alt={ws.title}
                                            style={{ width: '100%', display: 'block' }}
                                        />
                                    </div>

                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{ws.title}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'gray', margin: '0 0 1rem 0' }}>
                                        {ws.description}
                                    </p>

                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <span className="badge" style={{ background: '#e3f2fd', color: '#1565c0', fontSize: '0.75rem' }}>
                                                Grade {ws.grade_level === 0 ? 'K' : ws.grade_level}
                                            </span>
                                            <span className="badge" style={{ background: '#f3e5f5', color: '#7b1fa2', fontSize: '0.75rem' }}>
                                                {ws.topic}
                                            </span>
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePrint(ws);
                                            }}
                                        >
                                            🖨️ Print
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Worksheets;
