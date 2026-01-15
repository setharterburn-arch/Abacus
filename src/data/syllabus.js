export const SYLLABUS = {
    "K": [
        { id: "k-w1", title: "Week 1: Learning Numbers 1-5", description: "Count objects up to 5.", type: "visual_counting", range: 5 },
        { id: "k-w2", title: "Week 2: Learning Numbers 6-10", description: "Count objects up to 10.", type: "visual_counting", range: 10 },
        { id: "k-w3", title: "Week 3: Identifying Shapes", description: "Learn circles, squares, and triangles.", type: "visual_shapes" },
        { id: "k-w4", title: "Week 4: Simple Addition", description: "Adding numbers up to 5 with pictures.", type: "visual_addition", range: 5 },
        { id: "k-w5", title: "Week 5: Comparing Sizes", description: "Which one is bigger?", type: "visual_comparison" },
    ],
    "1": [
        { id: "1-w1", title: "Week 1: Counting to 20", description: "Practice counting objects up to 20.", type: "visual_counting", range: 20 },
        { id: "1-w2", title: "Week 2: Addition to 10", description: "Adding two numbers to make 10.", type: "visual_addition", range: 10 },
        { id: "1-w3", title: "Week 3: Subtraction from 10", description: "Taking away items.", type: "visual_subtraction", range: 10 },
        { id: "1-w4", title: "Week 4: Word Problems (Addition)", description: "Simple math stories.", type: "ai_story_addition", range: 10 },
        { id: "1-w5", title: "Week 5: Geometry: Sides & Corners", description: "Counting sides of shapes.", type: "visual_shapes_sides" },
    ],
    "2": [
        { id: "2-w1", title: "Week 1: Place Value (Tens/Ones)", description: "Understanding tens and ones.", type: "place_value_100" },
        { id: "2-w2", title: "Week 2: Addition to 100", description: "Adding bigger numbers.", type: "math_basic", op: "+", range: 100 },
        { id: "2-w3", title: "Week 3: Subtraction to 100", description: "Subtracting bigger numbers.", type: "math_basic", op: "-", range: 100 },
        { id: "2-w4", title: "Week 4: Money (Coins)", description: "Counting cents.", type: "visual_money" },
    ],
    "3": [
        { id: "3-w1", title: "Week 1: Intro to Multiplication", description: "Groups of things.", type: "visual_multiplication", range: 10 },
        { id: "3-w2", title: "Week 2: Multiplication Facts (2s, 5s, 10s)", description: "Skip counting.", type: "math_basic", op: "*", factors: [2, 5, 10] },
        { id: "3-w3", title: "Week 3: Intro to Division", description: "Sharing equally.", type: "visual_division", range: 20 },
    ],
    "4": [
        { id: "4-w1", title: "Week 1: Multi-digit Multiplication", description: "Larger numbers.", type: "math_basic", op: "*", range: 100 },
        { id: "4-w2", title: "Week 2: Factors and Multiples", description: "Finding factors.", type: "math_factors" },
    ],
    "5": [
        { id: "5-w1", title: "Week 1: Decimals", description: "Understanding 0.1 and 0.01.", type: "math_decimals" },
        { id: "5-w2", title: "Week 2: Fractions", description: "Adding fractions.", type: "math_fractions" },
    ],
    "6": [
        { id: "6-w1", title: "Week 1: Ratios", description: "Comparing quantities.", type: "math_ratios" },
        { id: "6-w2", title: "Week 2: Pre-Algebra", description: "Solving for x.", type: "math_algebra" },
    ]
};
