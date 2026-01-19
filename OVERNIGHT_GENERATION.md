# Overnight Content Generation - Quick Start Guide

## 🚀 Run This Before Bed

```bash
cd /Users/setharterburn/.gemini/antigravity/scratch/math-homeschool

# Install dependencies (if needed)
pip install google-generativeai

# Start generation (runs for ~2-3 hours)
python3 scripts/generate_all_content.py
```

## 📊 What It Does

- ✅ Generates **1000 curriculum sets** (12 questions each)
- ✅ Generates **600 learning paths** (100 per grade K-5)
- ✅ Auto-saves every 10 sets / 20 paths
- ✅ Auto-commits and pushes to GitHub
- ✅ Logs all progress to `generation_log.txt`
- ✅ Saves checkpoints to `generation_progress.json`

## ⏱️ Timeline

- **Start:** Immediately
- **Duration:** 2-3 hours
- **Cost:** ~$0.05 (Gemini API)
- **Finish:** While you sleep!

## 📝 Progress Tracking

Watch progress in real-time:
```bash
tail -f generation_log.txt
```

Or check checkpoint:
```bash
cat generation_progress.json
```

## 🛡️ Safety Features

1. **Auto-save every 10 sets** - No data loss
2. **Error handling** - Continues on failures
3. **Rate limiting** - Respects API limits
4. **Validation** - Checks question count
5. **Checkpoints** - Resume if interrupted

## 🌅 When You Wake Up

1. Check `generation_log.txt` for summary
2. Review `src/data/curriculum.json` (1000 sets!)
3. Review `src/data/learning_paths.json` (600 paths!)
4. Changes auto-pushed to GitHub
5. Vercel auto-deploys

## 🚨 If Something Goes Wrong

The script is designed to handle errors gracefully:
- Saves progress before crashing
- Logs all errors
- You can resume by running again
- Skips already-generated content

## 💤 Sleep Well!

The script will:
- ✅ Run completely unattended
- ✅ Save progress automatically
- ✅ Push to GitHub when done
- ✅ Be ready for you in the morning

**Just run the command and go to bed!**
