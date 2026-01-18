# Bulk Curriculum Generator

## Quick Start

Generate 100+ curriculum sets in one command:

```bash
python3 generate-bulk-curriculum.py
```

This will:
- Generate 100 curriculum sets (K-6) in ~60 seconds
- Include hints and explanations for every question
- Follow age-appropriateness rules
- Save to `generated-curriculum-bulk-100.json`

## Merge into Main Curriculum

```bash
./merge-curriculum.sh generated-curriculum-bulk-100.json
```

## What It Generates

**Distribution:**
- Kindergarten: 15 sets
- Grade 1: 20 sets
- Grade 2: 20 sets
- Grade 3: 15 sets
- Grade 4: 15 sets
- Grade 5: 10 sets
- Grade 6: 5 sets

**Total:** 100 sets × 10 questions = 1,000 questions

**Topics Covered:**
- K: Counting, Shapes, Patterns
- 1: Addition, Subtraction, Time, Money
- 2: Place Value, 2-digit Operations, Data
- 3: Multiplication, Division, Fractions
- 4: Multi-digit Operations, Decimals
- 5: Fraction/Decimal Operations, Volume
- 6: Ratios, Percentages, Algebra Basics

## Advantages

✅ **Single API Call** - No rate limiting issues
✅ **Consistent Quality** - All generated together with same context
✅ **Age-Appropriate** - Built-in validation rules
✅ **Complete** - Every question has hints + explanations
✅ **Fast** - 100 sets in ~60 seconds vs 20+ minutes with batch generator

## Customization

Edit `generate-bulk-curriculum.py` to:
- Change number of sets per grade
- Add/remove topics
- Adjust difficulty distribution
- Modify question count per set
