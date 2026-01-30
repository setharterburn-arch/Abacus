# Abacus Learn Website Audit Report
**Date:** 2026-01-30  
**Site:** https://abacuslearn.app  
**Auditor:** Automated Code Review  
**Status:** ✅ All Critical Issues Fixed

---

## Summary

Comprehensive audit of the Abacus Learn homeschool math platform. All critical issues have been resolved.

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 5 | ✅ Fixed |
| 🟡 Medium | 4 | 📋 Documented |
| 🟢 Low | 3 | 📋 Documented |

---

## ✅ Critical Issues (All Fixed)

### 1. Dark Mode in Beta.jsx ✅
**Location:** `src/pages/Beta.jsx`  
**Status:** Fixed - Now uses CSS variables  
- `var(--color-primary)` for headings
- `var(--color-bg-card)` for card backgrounds
- `var(--color-text-muted)` for descriptions
- `var(--color-text)` for titles

---

### 2. Dark Mode in Shop.jsx ✅
**Location:** `src/pages/Shop.jsx`  
**Status:** Fixed - Now uses CSS variables  
- Cards use `var(--color-bg-card)`
- Borders use `var(--color-text)` and `var(--color-secondary)`

---

### 3. Dark Mode in XPBar.jsx ✅
**Location:** `src/components/gamification/XPBar.jsx`  
**Status:** Fixed  
- Background uses `var(--color-bg-card)`
- Progress bar uses `var(--color-bg)`
- Text uses `var(--color-text-muted)`

---

### 4. Dark Mode in AssignmentRunner.jsx ✅
**Location:** `src/components/student/AssignmentRunner.jsx`  
**Status:** Fixed  
- Answer buttons use `var(--color-bg-card)` instead of hardcoded white

---

### 5. Dark Mode in AdaptiveQuizEngine.jsx ✅
**Location:** `src/components/adaptive/AdaptiveQuizEngine.jsx`  
**Status:** Fixed  
- Feedback section uses `var(--color-secondary)` and `var(--color-accent)` with white text

---

## 🟡 Medium Issues (For Future Review)

### 6. Dead Code - Legacy Landing.jsx
**Location:** `src/pages/Landing.jsx`  
**Issue:** This page dispatches `SET_USER` action which doesn't exist in the store reducer. This page appears to be superseded by `LandingPage.jsx`  
**Line:** 42  

```jsx
dispatch({ type: 'SET_USER', payload: user });  // SET_USER is not defined in reducer
```

**Recommendation:** Remove this file or update the reducer if it's still needed

---

### 7. Assignments Query Logic
**Location:** `src/pages/Assignments.jsx`  
**Issue:** Queries assignments by `student_id` but the data model shows assignments are linked to classes, not individual students  
**Line:** 24  

```jsx
.eq('student_id', state.user.id)  // This column may not exist
```

**Note:** The StudentDashboard.jsx uses a different approach (fetching via class enrollments) which appears correct

---

### 8. Fixed: Corrupted Emoji in DemoLessons.jsx ✅
**Location:** `src/pages/DemoLessons.jsx`  
**Status:** Fixed - Replaced corrupted character with 📚 emoji

---

### 9. Navigation Hamburger Button
**Location:** `src/components/common/Navigation.jsx`  
**Note:** Mobile hamburger button styling works via CSS `.mobile-only` class. No action needed.

---

## 🟢 Low Priority Issues

### 10. Inconsistent Avatar Images
**Location:** Multiple components  
**Issue:** Some components use `/abacus_lion.png`, others use `/logo.jpg` for the mascot  

- `AbacusWidget.jsx` header: `/abacus_lion.png`
- `AbacusWidget.jsx` toggle button: `/logo.jpg`
- `LessonAssets.jsx` ProfessorAbacus: `/abacus_lion.png`

**Recommendation:** Standardize on one image across the app

---

### 11. Gradebook Table Mobile UX
**Location:** `src/components/teacher/ClassRoster.jsx`  
**Issue:** Gradebook table uses horizontal scroll on mobile which works but isn't ideal UX  

**Recommendation:** Consider a card-based layout for mobile devices

---

### 12. Unused State Variable
**Location:** `src/pages/AdaptivePractice.jsx`  
**Issue:** `loadingTopics` state is set but never used in render  
**Line:** 17  

```jsx
const [loadingTopics, setLoadingTopics] = useState(true);
```

**Recommendation:** Add loading state display or remove unused variable

---

## Routes Verified

| Route | Status | Notes |
|-------|--------|-------|
| `/` | ✅ Works | Conditional render based on session |
| `/auth` | ✅ Works | Login/Signup functional |
| `/dashboard` | ✅ Works | Routes to teacher/student dashboard |
| `/account` | ✅ Works | My Account page |
| `/practice` | ✅ Works | Adaptive practice |
| `/worksheets` | ✅ Works | Worksheet generator |
| `/diagnostic` | ✅ Works | Placement test |
| `/beta` | ✅ Fixed | Dark mode now working |
| `/beta/*` | ✅ Works | Individual beta lessons |
| `/shop` | ✅ Fixed | Dark mode now working |
| `/admin` | ✅ Works | Admin panel |
| `/feedback` | ✅ Works | Feedback form |
| `/faq` | ✅ Works | FAQ page |
| `/demo` | ✅ Fixed | Emoji corrected |
| `/assignments` | ⚠️ Review | Query logic may need update |
| `/learning-paths` | ✅ Works | Learning paths |

---

## Assets Verified

| Asset | Status | Size |
|-------|--------|------|
| `/logo.jpg` | ✅ Present | 582KB |
| `/abacus_lion.png` | ✅ Present | 495KB |
| `/assets/crystal-vault/` | ✅ Present | - |
| `/worksheets/` | ✅ Present | - |
| `/videos/` | ✅ Present | - |
| `/audio/` | ✅ Present | - |
| `/curriculum-images/` | ✅ Present | - |
| `curriculum.json` | ✅ Present | 3.5MB (900+ sets) |
| `learning_paths.json` | ✅ Present | 9KB |
| `worksheets.json` | ✅ Present | 2.7KB |

---

## Technical Details

### Stack
- **Framework:** React 19.2 with Vite
- **Router:** react-router-dom 7.12
- **Styling:** CSS Variables with custom design system
- **Database:** Supabase
- **AI:** Google Gemini API
- **Animation:** Framer Motion
- **Mobile:** Capacitor (iOS/Android ready)

### Theme System
The app uses CSS custom properties for theming:
- `--color-primary`: Orange (#d97706 light / #fbbf24 dark)
- `--color-secondary`: Green (#059669 light / #34d399 dark)
- `--color-bg`: Background (#fef3c7 light / #292524 dark)
- `--color-bg-card`: Card background (#fffbeb light / #44403c dark)
- `--color-text`: Primary text (#44403c light / #fef3c7 dark)

---

## Files Modified

The following files were updated to fix critical issues:
- ✅ `src/pages/Beta.jsx` - Dark mode support
- ✅ `src/pages/Shop.jsx` - Dark mode support  
- ✅ `src/components/gamification/XPBar.jsx` - Dark mode support
- ✅ `src/components/student/AssignmentRunner.jsx` - Dark mode support
- ✅ `src/components/adaptive/AdaptiveQuizEngine.jsx` - Dark mode support
- ✅ `src/pages/DemoLessons.jsx` - Fixed corrupted emoji

---

*Audit complete. All critical issues resolved.*
