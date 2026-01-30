# Competitive Analysis: Online Math Learning Platforms

**Prepared for:** Abacus Learn (abacuslearn.app)  
**Date:** January 2026  
**Purpose:** Guide product improvement through competitive research

---

## Executive Summary

This analysis covers four major competitors in the online math learning space:
1. **IXL** - The gold standard for skills practice and mastery
2. **Khan Academy** - Leader in video-based instruction with mastery learning
3. **Prodigy Math** - Top gamified math learning platform
4. **SplashLearn** - Visual-first K-5 learning platform

Key takeaways for Abacus Learn:
- Adopt a SmartScore-style mastery system (not percentage-based)
- Implement adaptive question difficulty
- Use visual models extensively for younger grades
- Add light gamification elements without overwhelming the learning
- Structure content by grade → topic → granular skills

---

## 1. IXL - Detailed Analysis

### 1.1 Platform Overview
- **Coverage:** Pre-K through 12th grade + Calculus
- **Total Skills:** 17,000+ across all subjects
- **Question Bank:** Unlimited questions per skill (generated algorithmically)
- **Pricing:** Subscription-based (~$9.95/month per subject, ~$19.95/month family)

### 1.2 Grade Structure & Skill Counts

| Grade | Number of Skills |
|-------|-----------------|
| Junior Kindergarten | 76 |
| Kindergarten | 206 |
| Grade 1 | 254 |
| Grade 2 | 296 |
| Grade 3 | 429 |
| Grade 4 | 391 |
| Grade 5 | 463 |
| Grade 6 | 381 |
| Grade 7 | 355 |
| Grade 8 | 315 |
| Grade 9 | 216 |
| Grade 10 | 306 |
| Grade 11 | 240 |
| Grade 12 | 266 |
| Calculus | 125 |

### 1.3 IXL SmartScore System (Critical Feature)

The SmartScore is IXL's secret weapon - NOT a percentage score. Key characteristics:

**Score Levels:**
- **0-79:** Building understanding
- **80:** Proficiency (recommended stopping point for new topics)
- **90:** Excellence (entering "Challenge Zone")
- **100:** Mastery (truly impressive accomplishment)

**How It Works:**
1. Score goes UP and DOWN based on performance
2. Correct answers increase score, incorrect decrease it
3. At higher scores (90+), progress slows - requires consistent correct streaks
4. Questions adapt in difficulty based on current score
5. Minimum ~28 questions needed to reach 100
6. Must answer ~10 questions correctly IN A ROW in Challenge Zone

**Why It's Brilliant:**
- Encourages persistence, not perfection
- Prevents gaming (can't just guess until done)
- Builds genuine mastery through the Challenge Zone
- Students can always recover from mistakes

### 1.4 Topic/Category Structure (Grade 3 Example)

IXL organizes by Common Core domains:

**3.OA - Operations and Algebraic Thinking**
- A: Represent and solve problems involving multiplication/division
  - Count equal groups
  - Identify multiplication expressions for equal groups
  - Write multiplication sentences for equal groups
  - Relate addition and multiplication for equal groups
  - Multiply by 0 or 1 with equal groups
  - Identify multiplication expressions for arrays
  - Write multiplication sentences for arrays
  - Make arrays to model multiplication
  - Multiply using number lines
  - Write multiplication sentences for number lines

**3.NBT - Number and Operations in Base Ten**
- A.1: Round to nearest 10/100
- A.2: Add/subtract within 1000
- A.3: Multiply by multiples of 10

**3.NF - Number and Operations—Fractions**
- A.1: Understand fractions as parts
- A.2: Fractions on number lines
- A.3: Equivalent fractions and comparison

**3.MD - Measurement and Data**
- A.1: Time to the nearest minute
- A.2: Liquid volumes and masses
- B.3: Picture/bar graphs
- C: Area concepts
- D: Perimeter

**3.G - Geometry**
- A.1: Quadrilateral attributes
- A.2: Partition shapes

### 1.5 Skill Naming Conventions

IXL uses very specific, action-oriented skill names:

**Pattern:** [Action verb] + [Specific concept] + [Context/constraint]

Examples:
- "Multiply 5 by numbers up to 10"
- "Division facts for 2, 3, 4, 5, and 10: true or false?"
- "Add two numbers up to three digits: with regrouping"
- "Compare fractions with like denominators using models"
- "Find the area of rectangles: word problems"
- "Relate multiplication and division for arrays"

**Skill ID System:** Grade-Letter.Number (e.g., "3-N.5", "3-OO.12")

### 1.6 Question Types

Based on IXL documentation and platform analysis:

| Question Type | Description | Subjects |
|--------------|-------------|----------|
| **Multiple Choice** | Standard select answer | All |
| **Text Input** | Type numeric answer | All |
| **Fraction Model** | Divide & shade shapes to show fractions | Math (Gr 3-5) |
| **Drag and Drop** | Move items to correct positions | All |
| **Graphing** | Plot points, draw lines on coordinate planes | Math (Gr 4+) |
| **Number Line** | Place values on number lines | Math (K-8) |
| **Array Builder** | Create arrays to model multiplication | Math (Gr 2-4) |
| **True/False** | Evaluate mathematical statements | All |
| **Sorting** | Categorize items into groups | All |
| **Fill Missing Digits** | Complete partial calculations | Math |
| **Word Problems** | Read and solve contextual problems | All |
| **Select All That Apply** | Choose multiple correct answers | All |

### 1.7 Visual Question Examples

**For K-2:**
- Counting objects with pictures
- Number recognition with visual aids
- Adding/subtracting with pictures
- Shape identification
- Pattern completion

**For 3-5:**
- Fraction bars and area models
- Arrays for multiplication
- Number lines for operations
- Geometry shapes with measurements
- Data displays (bar graphs, picture graphs)

### 1.8 IXL Recommendations for Abacus Learn

1. **Implement SmartScore-style mastery** - Don't use percentage correct
2. **Create granular skills** (not just "Addition" but "Add two 2-digit numbers without regrouping")
3. **Use skill IDs** for tracking and reporting
4. **Include visual models** for every concept in K-5
5. **Add "Challenge Zone"** concept for final mastery push
6. **Skill count target:** 200-400 skills per grade level

---

## 2. Khan Academy - Detailed Analysis

### 2.1 Platform Overview
- **Coverage:** Pre-K through college, plus test prep
- **Content:** 10,000+ videos, 80,000+ exercises
- **Price:** FREE (nonprofit)
- **Differentiator:** Video-first instruction with integrated practice

### 2.2 Mastery System

**Mastery Levels (5 stages):**

| Level | Description | How to Achieve |
|-------|-------------|----------------|
| **Attempted** | Started skill | Answer any question |
| **Familiar** | Basic exposure | Some correct answers |
| **Proficient** | Good understanding | Consistent correct answers |
| **Mastered** | Deep understanding | Time + consistent performance |
| **Review** | Previously mastered, needs refresh | Triggered by time decay |

**Key Mechanisms:**
- Skills decay over time (must review to maintain mastery)
- Unit Tests after each unit
- Course Challenges cover entire course
- Mastery Challenges review previously learned skills (2 questions per skill)

### 2.3 Content Structure

**Hierarchy:**
```
Course (e.g., "3rd Grade Math")
└── Unit (e.g., "Multiplication")
    └── Lesson (e.g., "Multiply by 5")
        ├── Video(s)
        ├── Article(s) 
        ├── Practice Exercises
        └── Quiz
```

**Grade-Level Math Courses:**
- Kindergarten through 8th Grade
- Get Ready courses (prerequisite review)
- Illustrative Mathematics aligned (6th-8th)
- High school: Algebra 1, Geometry, Algebra 2, etc.

### 2.4 Video + Practice Integration

**The "Mastery Learning" approach:**
1. Watch instructional video
2. Read supporting article (optional)
3. Complete practice exercises
4. Take quiz to demonstrate understanding
5. Unit test after completing all lessons
6. Course mastery challenge periodically

**Research findings:**
- Students who do 30-60 min/week see 33% higher growth
- Districts using Khan see students perform 14x better than self-study

### 2.5 Scaffolding Approach

Khan Academy scaffolds learning through:

1. **Prerequisite mapping** - Skills link to required prior knowledge
2. **Hints system** - Step-by-step guidance on demand
3. **Get Ready courses** - Fill gaps before grade-level content
4. **Worked examples** - Videos showing problem-solving process
5. **Multiple representations** - Same concept shown different ways

### 2.6 Khan Academy Recommendations for Abacus Learn

1. **Add video explanations** for key concepts
2. **Implement mastery decay** to encourage review
3. **Create "Get Ready" diagnostic paths** for students with gaps
4. **Build hint systems** that scaffold (don't just give answers)
5. **Unit structure** with clear learning progressions

---

## 3. Prodigy Math - Detailed Analysis

### 3.1 Platform Overview
- **Coverage:** Grades 1-8
- **Users:** 91% parent satisfaction rate
- **Price:** Free (with optional paid membership for extras)
- **Differentiator:** Full RPG game wrapped around math practice

### 3.2 Gamification Elements

**Core Game Mechanics:**
| Element | Description | Engagement Purpose |
|---------|-------------|-------------------|
| **Avatar/Pet System** | 100+ unique pets to rescue and collect | Ownership & collection motivation |
| **Battle System** | Answer math to attack in wizard battles | Makes practice feel like gameplay |
| **Quests** | Daily and seasonal challenges | Regular return visits |
| **World Exploration** | Ever-expanding fantasy world | Discovery & curiosity |
| **Social Features** | Safe multiplayer with friends | Social motivation |
| **Rewards & Items** | Epic items earned through play | Tangible progress indicators |
| **Spells** | Math answers power magical abilities | Direct connection between learning and power |

### 3.3 Adaptive Algorithm

- Questions adapt in real-time based on student performance
- Content aligned to curriculum standards
- Teachers can set "Focus Mode" to target specific skills
- Placement test twice yearly for diagnostic data

### 3.4 Teacher/Parent Tools (Free)

**For Teachers:**
- Assignments
- Reports on student performance
- Learning gap identification
- Curriculum alignment tools
- Focus Mode for targeting skills

**For Parents:**
- Dashboard showing activity
- Monthly progress reports
- Curriculum progress tracking
- Goal setting tools

### 3.5 Prodigy Recommendations for Abacus Learn

1. **Add light gamification** - Don't need full RPG, but:
   - Streaks and badges
   - Level/XP system
   - Collectible rewards
   - Daily challenges
2. **Make practice feel like play** - Reward correct answers visually
3. **Parent/teacher visibility** - Dashboard for monitoring
4. **Safe social features** - Pre-approved messages only

---

## 4. SplashLearn - Detailed Analysis

### 4.1 Platform Overview
- **Coverage:** Preschool through Grade 5 (K-5 focus)
- **Content:** 8,400+ math resources
- **Price:** Freemium model with premium subscription
- **Differentiator:** Visual-first, game-based early learning

### 4.2 Content Types

| Type | Count | Description |
|------|-------|-------------|
| Games | 500+ | Interactive learning games |
| Worksheets | 1000+ | Printable practice sheets |
| Lesson Plans | Full K-5 | Teacher-ready plans |
| Teaching Tools | 10+ | Virtual manipulatives, number lines |
| Math Vocabulary | 2000+ | Definitions with examples |

### 4.3 Topic Organization (Math)

**Main Categories:**
1. **Number Sense** (1,316 resources)
   - Number Recognition (50)
   - Number Tracing (470)
   - Number Sequence (83)
   - Counting (273)
   - Compare Numbers (147)
   - Skip Counting (79)
   - Even/Odd Numbers (27)
   - Place Value (143)

2. **Addition** (1,231 resources)
   - Add with Pictures (180)
   - Addition Properties (37)
   - Addition Strategies (321)
   - 2-Digit Addition (124)
   - 3-Digit Addition (170)
   - 4-Digit Addition (60)

3. **Subtraction** (987 resources)
   - Subtract with Pictures (110)
   - Subtraction Strategies (137)
   - 2-Digit Subtraction (174)
   - 3-Digit Subtraction (173)

4. **Multiplication** (807 resources)
   - Multiplication Strategies (155)
   - Times Tables (265)
   - Multiplication Properties (163)
   - Multi-Digit Multiplication (192)

5. **Division** (442 resources)
   - Division Facts (158)
   - Long Division (125)

6. **Fractions** (635 resources)
   - Fractions Using Models (79)
   - Fractions on Number Line (26)
   - Compare Fractions (64)
   - Equivalent Fractions (70)
   - Fractions Operations (348)

7. **Decimals** (1,845 resources)
8. **Geometry** (294 resources)
9. **Data Handling** (85 resources)
10. **Measurement** (248 resources)
11. **Time** (136 resources)
12. **Money** (144 resources)
13. **Algebra** (163 resources)
14. **Word Problems** (773 resources)

### 4.4 Visual Learning Techniques

**Early Grades (PreK-2):**
- Counting with animated objects
- Touch/drag interactions
- Visual number bonds
- Picture-based addition/subtraction
- Shape identification with colorful images

**Middle Elementary (3-5):**
- Fraction bars and circles
- Area models for multiplication
- Number lines with visual markers
- Base-ten blocks for place value
- Virtual manipulatives

### 4.5 SplashLearn Recommendations for Abacus Learn

1. **Heavy visual emphasis for K-2** - Pictures, animations, objects
2. **Virtual manipulatives** - Digital base-ten blocks, fraction circles
3. **Printable worksheets** - Hybrid digital/physical learning
4. **Topic-based organization** in addition to grade-based
5. **Multiple content types** per skill (game, worksheet, lesson)

---

## 5. Question Type Taxonomy

Based on competitive analysis, here's a comprehensive question type taxonomy:

### 5.1 Input Types

| Type | Description | Best For |
|------|-------------|----------|
| **Multiple Choice (Single)** | Select one correct answer | All concepts, easy to assess |
| **Multiple Choice (Multi)** | Select all correct answers | Classification, properties |
| **Numeric Input** | Type a number | Calculations, basic facts |
| **Fraction Input** | Enter numerator/denominator | Fraction operations |
| **Text Input** | Type word/phrase | Word form numbers |
| **Equation Input** | Write mathematical expressions | Algebra, expressions |

### 5.2 Visual/Interactive Types

| Type | Description | Best For |
|------|-------------|----------|
| **Drag & Drop** | Move items to positions | Sorting, ordering, matching |
| **Fraction Model** | Shade parts of shapes | Fraction concepts |
| **Array Builder** | Create rows/columns | Multiplication concepts |
| **Number Line** | Place/identify points | Number sense, fractions |
| **Graph/Plot** | Mark points on grid | Coordinates, graphing |
| **Drawing** | Sketch shapes, lines | Geometry |
| **Matching** | Connect related items | Equivalence, relationships |
| **Sorting** | Categorize into groups | Classification |
| **Ordering** | Arrange in sequence | Comparison, sequencing |

### 5.3 Word Problem Variations

| Variation | Description |
|-----------|-------------|
| **Basic** | Simple context, direct question |
| **Multi-step** | Requires 2+ operations |
| **Choose operation** | Identify which operation to use |
| **Find missing** | One value unknown in context |
| **Reasonable answer** | Estimate/check reasonableness |
| **Create equation** | Write equation from words |

---

## 6. Category/Label Naming Conventions

### 6.1 Grade Labels
- "Kindergarten" (not "Grade K")
- "Grade 1" through "Grade 12" (not "1st Grade")
- "Pre-K" or "Preschool"

### 6.2 Topic Labels (Recommended)
Follow Common Core domain structure:
- **Counting & Cardinality** (K only)
- **Operations & Algebraic Thinking**
- **Number & Operations in Base Ten**
- **Number & Operations—Fractions**
- **Measurement & Data**
- **Geometry**
- **Ratios & Proportional Relationships** (6+)
- **The Number System** (6+)
- **Expressions & Equations** (6+)
- **Statistics & Probability** (6+)
- **Functions** (8+)

### 6.3 Skill Labels (IXL Pattern)
`[Action] [Concept] [Constraint/Context]`

Examples:
- "Add two 2-digit numbers without regrouping"
- "Multiply by 6: factors up to 10"
- "Compare fractions with like denominators"
- "Identify quadrilaterals by attributes"
- "Solve one-step multiplication word problems"

---

## 7. Engagement Features to Implement

### 7.1 Must-Have Features

| Feature | Priority | Implementation Notes |
|---------|----------|---------------------|
| **SmartScore Mastery** | Critical | Not percentage-based; goes up/down |
| **Adaptive Difficulty** | Critical | Questions adjust to skill level |
| **Immediate Feedback** | Critical | Show correct/incorrect instantly |
| **Step-by-Step Hints** | High | Scaffold, don't give answers |
| **Visual Models** | High | Essential for K-5 |
| **Progress Tracking** | High | Skills mastered, time spent |
| **Awards/Badges** | Medium | Celebrate milestones |
| **Streaks** | Medium | Encourage daily practice |

### 7.2 Nice-to-Have Features

| Feature | Notes |
|---------|-------|
| Video Lessons | Short (3-5 min) concept explanations |
| Printable Worksheets | Hybrid learning |
| Parent Dashboard | Progress visibility |
| Daily Challenges | Encourage return visits |
| Leaderboards | Optional, class-based |
| Avatar Customization | Light personalization |
| Practice Mode vs Test Mode | Different stakes |

### 7.3 Anti-Patterns to Avoid

❌ **Percentage-based scoring** - Encourages rushing, not mastery  
❌ **Fixed question counts** - Doesn't adapt to learner  
❌ **Heavy gamification** - Can distract from learning  
❌ **Immediate answer reveal** - Discourages thinking  
❌ **No recovery from mistakes** - Kills motivation  
❌ **Grade-only organization** - Limits flexibility  

---

## 8. Specific Recommendations for Abacus Learn

### 8.1 Immediate Priorities

1. **Implement SmartScore System**
   - Score 0-100, adaptive
   - Goes up AND down based on performance
   - Challenge Zone at 90+
   - Proficiency at 80
   
2. **Restructure Skill Taxonomy**
   - Follow IXL's granular approach
   - Target 200-400 skills per grade
   - Use action-oriented naming
   
3. **Add Visual Question Types**
   - Fraction models (bars, circles)
   - Number lines
   - Arrays
   - Base-ten block visuals
   - Drag-and-drop interactions

### 8.2 Medium-Term Enhancements

4. **Create Mastery Decay**
   - Skills fade to "Review" after time
   - Encourages ongoing practice
   
5. **Build Hint System**
   - Progressive hints (3 levels)
   - Step-by-step guidance
   - Video hints for complex topics
   
6. **Add Parent/Teacher Dashboard**
   - Real-time progress
   - Skill-level insights
   - Time-on-task metrics

### 8.3 Long-Term Goals

7. **Diagnostic Placement**
   - Initial assessment
   - Personalized learning paths
   - "Get Ready" remediation
   
8. **Light Gamification**
   - Daily streaks
   - Badge collection
   - Level/XP system
   - Weekly challenges
   
9. **Content Expansion**
   - Worksheet generation
   - Video lessons
   - Interactive tools (virtual manipulatives)

---

## 9. Appendix: Sample Skill Lists

### Grade 3 Addition Skills (IXL Pattern)

1. Addition patterns over increasing place values
2. Use number lines to add three-digit numbers
3. Use compensation to add: up to three digits
4. Use expanded form to add three-digit numbers
5. Add two numbers up to three digits: without regrouping
6. Add two numbers up to three digits: with regrouping
7. Add two numbers up to three digits
8. Add two numbers up to three digits: word problems
9. Complete the addition sentence: up to three digits
10. Balance addition equations: up to three digits
11. Addition up to three digits: fill in the missing digits
12. Add three numbers up to three digits each
13. Add three numbers up to three digits each: word problems

### Grade 3 Multiplication Skills (IXL Pattern)

1. Count equal groups
2. Identify multiplication expressions for equal groups
3. Write multiplication sentences for equal groups
4. Relate addition and multiplication for equal groups
5. Multiply by 0 or 1 with equal groups
6. Identify multiplication expressions for arrays
7. Write multiplication sentences for arrays
8. Make arrays to model multiplication
9. Multiply using number lines
10. Write multiplication sentences for number lines
11. Relate addition and multiplication
12. Multiply 0 by numbers up to 10
13. Multiply 1 by numbers up to 10
14. Multiply 2 by numbers up to 10
15. Multiply 3 by numbers up to 10
16. Multiply 4 by numbers up to 10
17. Multiply 5 by numbers up to 10
18. Multiply 6 by numbers up to 10
19. Multiply 7 by numbers up to 10
20. Multiply 8 by numbers up to 10
21. Multiply 9 by numbers up to 10
22. Multiply 10 by numbers up to 10
23. Multiplication facts for 2, 3, 4, 5, and 10
24. Multiplication facts for 2, 3, 4, 5, and 10: true or false?
25. Multiplication facts for 2, 3, 4, 5, and 10: sorting
26. Multiplication facts for 2, 3, 4, 5, and 10: find the missing factor
27. Properties of multiplication
28. Solve using properties of multiplication
29. Distributive property: find the missing factor
30. Multiply using the distributive property

---

## 10. Conclusion

The most successful math learning platforms share common elements:

1. **Mastery-based progression** (not completion-based)
2. **Adaptive difficulty** that meets learners where they are
3. **Visual representations** especially for K-5
4. **Granular skills** with clear naming
5. **Immediate, constructive feedback**
6. **Engagement mechanics** that motivate without distracting

For Abacus Learn, the highest-impact improvement would be implementing a SmartScore-style mastery system with adaptive questions. This single change would align the platform with best practices from IXL (the industry leader) while creating a more effective learning experience than simple percentage-based tracking.

---

*Document prepared through competitive research of IXL, Khan Academy, Prodigy Math, and SplashLearn platforms.*
