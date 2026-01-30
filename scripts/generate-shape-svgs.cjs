/**
 * Generate SVG illustrations for shape identification questions
 * Creates visual representations of 2D and 3D shapes
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'public/curriculum-images/generated/shapes';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const COLORS = {
    red: '#FF6B6B',
    blue: '#45B7D1',
    green: '#96CEB4',
    yellow: '#FFEAA7',
    purple: '#DDA0DD',
    orange: '#F39C12',
    pink: '#FFB6C1',
    teal: '#4ECDC4'
};

// Shape generators
function generateCircle(size = 100, color = COLORS.blue) {
    const padding = 20;
    const svgSize = size + padding * 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <circle cx="${svgSize/2}" cy="${svgSize/2}" r="${size/2}" fill="${color}" stroke="#333" stroke-width="3"/>
</svg>`;
}

function generateSquare(size = 100, color = COLORS.red) {
    const padding = 20;
    const svgSize = size + padding * 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <rect x="${padding}" y="${padding}" width="${size}" height="${size}" fill="${color}" stroke="#333" stroke-width="3" rx="4"/>
</svg>`;
}

function generateRectangle(width = 140, height = 80, color = COLORS.green) {
    const padding = 20;
    const svgWidth = width + padding * 2;
    const svgHeight = height + padding * 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <rect x="${padding}" y="${padding}" width="${width}" height="${height}" fill="${color}" stroke="#333" stroke-width="3" rx="4"/>
</svg>`;
}

function generateTriangle(size = 100, color = COLORS.yellow) {
    const padding = 20;
    const svgSize = size + padding * 2;
    const centerX = svgSize / 2;
    const points = [
        [centerX, padding],
        [padding, svgSize - padding],
        [svgSize - padding, svgSize - padding]
    ];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <polygon points="${points.map(p => p.join(',')).join(' ')}" fill="${color}" stroke="#333" stroke-width="3"/>
</svg>`;
}

function generateOval(width = 120, height = 80, color = COLORS.purple) {
    const padding = 20;
    const svgWidth = width + padding * 2;
    const svgHeight = height + padding * 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <ellipse cx="${svgWidth/2}" cy="${svgHeight/2}" rx="${width/2}" ry="${height/2}" fill="${color}" stroke="#333" stroke-width="3"/>
</svg>`;
}

function generatePentagon(size = 100, color = COLORS.orange) {
    const padding = 20;
    const svgSize = size + padding * 2;
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;
    const r = size / 2;
    const points = [];
    for (let i = 0; i < 5; i++) {
        const angle = (i * 72 - 90) * Math.PI / 180;
        points.push([centerX + r * Math.cos(angle), centerY + r * Math.sin(angle)]);
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <polygon points="${points.map(p => p.join(',')).join(' ')}" fill="${color}" stroke="#333" stroke-width="3"/>
</svg>`;
}

function generateHexagon(size = 100, color = COLORS.teal) {
    const padding = 20;
    const svgSize = size + padding * 2;
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;
    const r = size / 2;
    const points = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 90) * Math.PI / 180;
        points.push([centerX + r * Math.cos(angle), centerY + r * Math.sin(angle)]);
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <polygon points="${points.map(p => p.join(',')).join(' ')}" fill="${color}" stroke="#333" stroke-width="3"/>
</svg>`;
}

function generateOctagon(size = 100, color = COLORS.pink) {
    const padding = 20;
    const svgSize = size + padding * 2;
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;
    const r = size / 2;
    const points = [];
    for (let i = 0; i < 8; i++) {
        const angle = (i * 45 - 22.5) * Math.PI / 180;
        points.push([centerX + r * Math.cos(angle), centerY + r * Math.sin(angle)]);
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <polygon points="${points.map(p => p.join(',')).join(' ')}" fill="${color}" stroke="#333" stroke-width="3"/>
</svg>`;
}

function generateDiamond(size = 100, color = COLORS.blue) {
    const padding = 20;
    const svgSize = size + padding * 2;
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;
    const points = [
        [centerX, padding],
        [svgSize - padding, centerY],
        [centerX, svgSize - padding],
        [padding, centerY]
    ];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <polygon points="${points.map(p => p.join(',')).join(' ')}" fill="${color}" stroke="#333" stroke-width="3"/>
</svg>`;
}

function generateStar(size = 100, color = COLORS.yellow) {
    const padding = 20;
    const svgSize = size + padding * 2;
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;
    const outerR = size / 2;
    const innerR = size / 4;
    const points = [];
    for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 72 - 90) * Math.PI / 180;
        const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
        points.push([centerX + outerR * Math.cos(outerAngle), centerY + outerR * Math.sin(outerAngle)]);
        points.push([centerX + innerR * Math.cos(innerAngle), centerY + innerR * Math.sin(innerAngle)]);
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <polygon points="${points.map(p => p.join(',')).join(' ')}" fill="${color}" stroke="#333" stroke-width="3"/>
</svg>`;
}

function generateHeart(size = 100, color = COLORS.red) {
    const padding = 20;
    const svgSize = size + padding * 2;
    const cx = svgSize / 2;
    const cy = svgSize / 2;
    const s = size / 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <path d="M ${cx} ${cy+s*0.7} C ${cx-s} ${cy} ${cx-s} ${cy-s*0.6} ${cx} ${cy-s*0.2} C ${cx+s} ${cy-s*0.6} ${cx+s} ${cy} ${cx} ${cy+s*0.7}" fill="${color}" stroke="#333" stroke-width="3"/>
</svg>`;
}

// 3D shapes (isometric style)
function generateCube(size = 100, color = COLORS.blue) {
    const padding = 30;
    const svgSize = size + padding * 2.5;
    const w = size * 0.5;
    const h = size * 0.4;
    const cx = svgSize / 2;
    const cy = svgSize / 2;
    
    // Calculate lighter/darker shades
    const darkerColor = color.replace(/[0-9A-F]{2}$/i, m => {
        const val = Math.max(0, parseInt(m, 16) - 40);
        return val.toString(16).padStart(2, '0');
    });
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <!-- Left face -->
  <polygon points="${cx},${cy+h} ${cx-w},${cy} ${cx-w},${cy-h} ${cx},${cy}" fill="${darkerColor}" stroke="#333" stroke-width="2"/>
  <!-- Right face -->
  <polygon points="${cx},${cy+h} ${cx+w},${cy} ${cx+w},${cy-h} ${cx},${cy}" fill="${darkerColor}" stroke="#333" stroke-width="2"/>
  <!-- Top face -->
  <polygon points="${cx},${cy-h*2} ${cx-w},${cy-h} ${cx},${cy} ${cx+w},${cy-h}" fill="${color}" stroke="#333" stroke-width="2"/>
</svg>`;
}

function generateCylinder(width = 80, height = 100, color = COLORS.green) {
    const padding = 20;
    const svgWidth = width + padding * 2;
    const svgHeight = height + padding * 2;
    const cx = svgWidth / 2;
    const ry = width / 4;
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <!-- Body -->
  <rect x="${padding}" y="${padding + ry}" width="${width}" height="${height - ry*2}" fill="${color}" stroke="none"/>
  <ellipse cx="${cx}" cy="${svgHeight - padding - ry}" rx="${width/2}" ry="${ry}" fill="${color}" stroke="#333" stroke-width="2"/>
  <path d="M ${padding} ${padding + ry} L ${padding} ${svgHeight - padding - ry}" stroke="#333" stroke-width="2"/>
  <path d="M ${svgWidth - padding} ${padding + ry} L ${svgWidth - padding} ${svgHeight - padding - ry}" stroke="#333" stroke-width="2"/>
  <!-- Top ellipse -->
  <ellipse cx="${cx}" cy="${padding + ry}" rx="${width/2}" ry="${ry}" fill="${color}" stroke="#333" stroke-width="2"/>
</svg>`;
}

function generateCone(size = 100, color = COLORS.orange) {
    const padding = 20;
    const svgSize = size + padding * 2;
    const cx = svgSize / 2;
    const baseY = svgSize - padding - size * 0.15;
    const topY = padding + size * 0.1;
    const rx = size * 0.4;
    const ry = size * 0.15;
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <!-- Cone body -->
  <polygon points="${cx},${topY} ${cx-rx},${baseY} ${cx+rx},${baseY}" fill="${color}" stroke="#333" stroke-width="2"/>
  <!-- Base ellipse -->
  <ellipse cx="${cx}" cy="${baseY}" rx="${rx}" ry="${ry}" fill="${color}" stroke="#333" stroke-width="2"/>
</svg>`;
}

function generateSphere(size = 100, color = COLORS.purple) {
    const padding = 20;
    const svgSize = size + padding * 2;
    const cx = svgSize / 2;
    const cy = svgSize / 2;
    const r = size / 2;
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <defs>
    <radialGradient id="sphere-grad" cx="30%" cy="30%">
      <stop offset="0%" stop-color="white"/>
      <stop offset="100%" stop-color="${color}"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#sphere-grad)" stroke="#333" stroke-width="2"/>
</svg>`;
}

function generatePyramid(size = 100, color = COLORS.yellow) {
    const padding = 20;
    const svgSize = size + padding * 2;
    const cx = svgSize / 2;
    const baseY = svgSize - padding;
    const topY = padding;
    const w = size * 0.4;
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  <!-- Front face -->
  <polygon points="${cx},${topY} ${cx-w},${baseY} ${cx+w},${baseY}" fill="${color}" stroke="#333" stroke-width="2"/>
  <!-- Side edge -->
  <line x1="${cx}" y1="${topY}" x2="${cx+w*0.8}" y2="${baseY-size*0.1}" stroke="#333" stroke-width="2"/>
  <!-- Base edge -->
  <line x1="${cx-w}" y1="${baseY}" x2="${cx+w*0.8}" y2="${baseY-size*0.1}" stroke="#333" stroke-width="2" stroke-dasharray="4,4"/>
</svg>`;
}

// Generate all shapes
const shapes = {
    // 2D shapes
    circle: generateCircle(),
    square: generateSquare(),
    rectangle: generateRectangle(),
    triangle: generateTriangle(),
    oval: generateOval(),
    pentagon: generatePentagon(),
    hexagon: generateHexagon(),
    octagon: generateOctagon(),
    diamond: generateDiamond(),
    rhombus: generateDiamond(100, COLORS.purple),
    star: generateStar(),
    heart: generateHeart(),
    // 3D shapes
    cube: generateCube(),
    cylinder: generateCylinder(),
    cone: generateCone(),
    sphere: generateSphere(),
    pyramid: generatePyramid()
};

// Save shapes
let generated = 0;
Object.entries(shapes).forEach(([name, svg]) => {
    const filename = `${name}.svg`;
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), svg);
    generated++;
});

// Generate shape grids (multiple shapes together for identification)
function generateShapeGrid(shapesToShow, gridCols = 3) {
    const itemSize = 80;
    const padding = 20;
    const spacing = 15;
    
    const cols = Math.min(shapesToShow.length, gridCols);
    const rows = Math.ceil(shapesToShow.length / gridCols);
    
    const width = padding * 2 + cols * itemSize + (cols - 1) * spacing;
    const height = padding * 2 + rows * itemSize + (rows - 1) * spacing;
    
    let items = '';
    const shapeGenerators = {
        circle: (x, y, s, c) => `<circle cx="${x}" cy="${y}" r="${s/2}" fill="${c}" stroke="#333" stroke-width="2"/>`,
        square: (x, y, s, c) => `<rect x="${x-s/2}" y="${y-s/2}" width="${s}" height="${s}" fill="${c}" stroke="#333" stroke-width="2"/>`,
        triangle: (x, y, s, c) => `<polygon points="${x},${y-s/2} ${x-s/2},${y+s/2} ${x+s/2},${y+s/2}" fill="${c}" stroke="#333" stroke-width="2"/>`,
        rectangle: (x, y, s, c) => `<rect x="${x-s/2}" y="${y-s/3}" width="${s}" height="${s*0.6}" fill="${c}" stroke="#333" stroke-width="2"/>`
    };
    
    shapesToShow.forEach((shape, i) => {
        const col = i % gridCols;
        const row = Math.floor(i / gridCols);
        const x = padding + col * (itemSize + spacing) + itemSize / 2;
        const y = padding + row * (itemSize + spacing) + itemSize / 2;
        const color = Object.values(COLORS)[i % Object.values(COLORS).length];
        
        if (shapeGenerators[shape]) {
            items += shapeGenerators[shape](x, y, itemSize * 0.7, color);
        }
    });
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#F8F9FA" rx="12"/>
  ${items}
</svg>`;
}

// Generate some common grids
const grids = {
    'find-circle': generateShapeGrid(['square', 'circle', 'triangle', 'rectangle']),
    'find-square': generateShapeGrid(['circle', 'square', 'triangle', 'circle']),
    'find-triangle': generateShapeGrid(['square', 'circle', 'triangle', 'rectangle']),
    'all-shapes': generateShapeGrid(['circle', 'square', 'triangle', 'rectangle', 'circle', 'square'])
};

Object.entries(grids).forEach(([name, svg]) => {
    fs.writeFileSync(path.join(OUTPUT_DIR, `grid-${name}.svg`), svg);
    generated++;
});

console.log(`Generated ${generated} shape SVG files in ${OUTPUT_DIR}`);

// Update curriculum with shape images
const curriculum = JSON.parse(fs.readFileSync('src/data/curriculum.json', 'utf8'));

let imagesAdded = 0;

const shapeKeywords = {
    'circle': 'circle',
    'square': 'square',
    'triangle': 'triangle',
    'rectangle': 'rectangle',
    'oval': 'oval',
    'pentagon': 'pentagon',
    'hexagon': 'hexagon',
    'octagon': 'octagon',
    'diamond': 'diamond',
    'rhombus': 'rhombus',
    'star': 'star',
    'heart': 'heart',
    'cube': 'cube',
    'cylinder': 'cylinder',
    'cone': 'cone',
    'sphere': 'sphere',
    'pyramid': 'pyramid'
};

curriculum.forEach(set => {
    if (!set.questions) return;
    if (!set.topic?.toLowerCase().includes('shape') && !set.topic?.toLowerCase().includes('geometry')) return;
    
    set.questions.forEach(q => {
        if (q.image) return;
        
        const text = (q.question || '').toLowerCase();
        
        // Find matching shape
        for (const [keyword, shapeName] of Object.entries(shapeKeywords)) {
            if (text.includes(keyword)) {
                q.image = `/curriculum-images/generated/shapes/${shapeName}.svg`;
                imagesAdded++;
                break;
            }
        }
        
        // "Find the" or "identify" questions get a grid
        if (!q.image && (text.includes('find') || text.includes('identify') || text.includes('which'))) {
            if (text.includes('circle')) {
                q.image = '/curriculum-images/generated/shapes/grid-find-circle.svg';
                imagesAdded++;
            } else if (text.includes('square')) {
                q.image = '/curriculum-images/generated/shapes/grid-find-square.svg';
                imagesAdded++;
            } else if (text.includes('triangle')) {
                q.image = '/curriculum-images/generated/shapes/grid-find-triangle.svg';
                imagesAdded++;
            }
        }
    });
});

fs.writeFileSync('src/data/curriculum.json', JSON.stringify(curriculum, null, 2));
console.log(`Added image references to ${imagesAdded} shape questions`);
