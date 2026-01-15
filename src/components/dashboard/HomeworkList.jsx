import React from 'react';
import HomeworkCard from './HomeworkCard';

const HomeworkList = ({ problems, onSolve }) => {
    if (!problems || problems.length === 0) return null;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
        }}>
            {problems.map(p => (
                <HomeworkCard key={p.id} problem={p} onSolve={onSolve} />
            ))}
        </div>
    );
};

export default HomeworkList;
