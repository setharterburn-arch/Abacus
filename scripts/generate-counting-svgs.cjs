/**
 * Generate SVG illustrations for counting questions
 * Creates simple, colorful counting visuals for K-2
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'public/curriculum-images/generated';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// SVG Templates
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
const SHAPES = {
    circle: (x, y, size, color) => `<circle cx="${x}" cy="${y}" r="${size/2}" fill="${color}" stroke="#333" stroke-width="2"/>`,
    square: (x, y, size, color) => `<rect x="${x-size/2}" y="${y-size/2}" width="${size}" height="${size}" fill="${color}" stroke="#333" stroke-width="2" rx="4"/>`,
    star: (x, y, size, color) => {
        const points = [];
        for (let i = 0; i < 5; i++) {
            const outerAngle = (i * 72 - 90) * Math.PI / 180;
            const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
            points.push(`${x + size/2 * Math.cos(outerAngle)},${y + size/2 * Math.sin(outerAngle)}`);
            points.push(`${x + size/4 * Math.cos(innerAngle)},${y + size/4 * Math.sin(innerAngle)}`);
        }
        return `<polygon points="${points.join(' ')}" fill="${color}" stroke="#333" stroke-width="2"/>`;
    },
    apple: (x, y, size, color) => `<ellipse cx="${x}" cy="${y}" rx="${size/2}" ry="${size/2.2}" fill="${color}" stroke="#333" stroke-width="2"/><path d="M ${x} ${y-size/2.2} Q ${x+size/4} ${y-size/1.5} ${x+size/3} ${y-size/1.2}" stroke="#2E7D32" stroke-width="3" fill="none"/>`,
    balloon: (x, y, size, color) => `<ellipse cx="${x}" cy="${y}" rx="${size/2.5}" ry="${size/2}" fill="${color}" stroke="#333" stroke-width="2"/><path d="M ${x} ${y+size/2} L ${x} ${y+size}" stroke="#333" stroke-width="2"/>`,
    heart: (x, y, size, color) => `<path d="M ${x} ${y+size/3} C ${x-size/2} ${y-size/3} ${x-size/2} ${y-size/2} ${x} ${y-size/4} C ${x+size/2} ${y-size/2} ${x+size/2} ${y-size/3} ${x} ${y+size/3}" fill="${color}" stroke="#333" stroke-width="2"/>`
};

function generateCountingSVG(count, shapeName = 'circle', gridCols = 5) {
    const shape = SHAPES[shapeName] || SHAPES.circle;
    const itemSize = 40;
    const padding = 20;
    const spacing = 15;
    
    const cols = Math.min(count, gridCols);
    const rows = Math.ceil(count / gridCols);
    
    const width = padding * 2 + cols * itemSize + (cols - 1) * spacing;
    const height = padding * 2 + rows * itemSize + (rows - 1) * spacing;
    
    let items = '';
    for (let i = 0; i < count; i++) {
        const col = i % gridCols;
        const row = Math.floor(i / gridCols);
        const x = padding + col * (itemSize + spacing) + itemSize / 2;
        const y = padding + row * (itemSize + spacing) + itemSize / 2;
        const color = COLORS[i % COLORS.length];
        items += shape(x, y, itemSize, color);
    }
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  ${items}
</svg>`;
}

function generateComparisonSVG(leftCount, rightCount, shapeName = 'circle') {
    const shape = SHAPES[shapeName] || SHAPES.circle;
    const itemSize = 35;
    const padding = 20;
    const spacing = 10;
    const groupSpacing = 60;
    
    const maxCount = Math.max(leftCount, rightCount);
    const cols = Math.min(maxCount, 4);
    const rows = Math.ceil(maxCount / 4);
    
    const groupWidth = padding + cols * itemSize + (cols - 1) * spacing + padding;
    const width = groupWidth * 2 + groupSpacing;
    const height = padding * 2 + rows * itemSize + (rows - 1) * spacing + 40;
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <text x="${groupWidth/2}" y="${height - 15}" text-anchor="middle" font-family="Arial" font-size="14" fill="#666">Group A</text>
  <text x="${groupWidth + groupSpacing + groupWidth/2}" y="${height - 15}" text-anchor="middle" font-family="Arial" font-size="14" fill="#666">Group B</text>
  <line x1="${groupWidth + groupSpacing/2}" y1="20" x2="${groupWidth + groupSpacing/2}" y2="${height - 35}" stroke="#DDD" stroke-width="2" stroke-dasharray="5,5"/>`;
    
    // Left group
    for (let i = 0; i < leftCount; i++) {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = padding + col * (itemSize + spacing) + itemSize / 2;
        const y = padding + row * (itemSize + spacing) + itemSize / 2;
        svg += shape(x, y, itemSize, '#4ECDC4');
    }
    
    // Right group
    for (let i = 0; i < rightCount; i++) {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = groupWidth + groupSpacing + padding + col * (itemSize + spacing) + itemSize / 2;
        const y = padding + row * (itemSize + spacing) + itemSize / 2;
        svg += shape(x, y, itemSize, '#FF6B6B');
    }
    
    svg += '</svg>';
    return svg;
}

// Generate counting SVGs for common numbers
const generated = [];

// Single counting images (1-20)
['circle', 'star', 'apple', 'heart', 'square'].forEach(shapeName => {
    for (let n = 1; n <= 15; n++) {
        const filename = `count-${n}-${shapeName}.svg`;
        const svg = generateCountingSVG(n, shapeName);
        fs.writeFileSync(path.join(OUTPUT_DIR, filename), svg);
        generated.push(filename);
    }
});

// Comparison images
for (let a = 1; a <= 8; a++) {
    for (let b = 1; b <= 8; b++) {
        if (a === b) continue; // Skip equal
        const filename = `compare-${a}-vs-${b}.svg`;
        const svg = generateComparisonSVG(a, b);
        fs.writeFileSync(path.join(OUTPUT_DIR, filename), svg);
        generated.push(filename);
    }
}

console.log(`Generated ${generated.length} SVG files in ${OUTPUT_DIR}`);

// Now update curriculum to reference these images
const curriculum = JSON.parse(fs.readFileSync('src/data/curriculum.json', 'utf8'));

let imagesAdded = 0;

curriculum.forEach(set => {
    if (set.grade_level > 2) return;
    if (!set.questions) return;
    
    set.questions.forEach(q => {
        if (q.image) return; // Already has image
        
        const text = (q.question || '').toLowerCase();
        
        // Counting questions
        const countMatch = text.match(/count.*?(\d+)|how many.*?(\d+)|(\d+).*?(shown|picture)/);
        if (countMatch) {
            const num = parseInt(countMatch[1] || countMatch[2] || countMatch[3]);
            if (num >= 1 && num <= 15) {
                const shapes = ['circle', 'star', 'apple', 'heart', 'square'];
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                q.image = `/curriculum-images/generated/count-${num}-${shape}.svg`;
                imagesAdded++;
            }
        }
        
        // Comparison questions
        if (text.includes('compare') || text.includes('bigger') || text.includes('smaller') || text.includes('which group')) {
            const nums = text.match(/\d+/g);
            if (nums && nums.length >= 2) {
                const a = parseInt(nums[0]);
                const b = parseInt(nums[1]);
                if (a >= 1 && a <= 8 && b >= 1 && b <= 8 && a !== b) {
                    q.image = `/curriculum-images/generated/compare-${a}-vs-${b}.svg`;
                    imagesAdded++;
                }
            }
        }
    });
});

fs.writeFileSync('src/data/curriculum.json', JSON.stringify(curriculum, null, 2));
console.log(`Added image references to ${imagesAdded} questions`);
