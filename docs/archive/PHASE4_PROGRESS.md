# Phase 4: Critical Fixes — Progress Report

**Started:** November 2025  
**Status:** In Progress

---

## ✅ Completed Tasks

### 4.2 Newsletter Form — EmailJS Integration ✅ **COMPLETE**

**What Was Done:**
- Replaced Mailchimp with EmailJS (free alternative: 200 emails/month)
- Updated `scripts/main.js` with EmailJS implementation
- Added EmailJS SDK script to all 12 HTML pages
- Created comprehensive setup guide (`EMAILJS_SETUP_GUIDE.md`)

**Files Modified:**
- `scripts/main.js` (lines 636-786) - Complete EmailJS integration
- All 12 HTML files - Added EmailJS SDK script tag

**Next Steps:**
1. Follow `EMAILJS_SETUP_GUIDE.md` to configure EmailJS account
2. Update `EMAILJS_CONFIG` in `scripts/main.js` with your credentials
3. Test form submission

**Status:** ✅ Code complete, awaiting configuration

---

## 🔄 In Progress

### 4.1 Event Registration Modal — Testing Required

**Current Status:**
- Modal HTML structure exists and looks correct
- JavaScript initialization code is present
- Button event handlers are properly set up
- CSS styling appears correct

**What to Test:**
1. Open `events.html` in browser
2. Click any "Jetzt anmelden" button
3. Verify modal opens
4. Test form submission
5. Check browser console for errors

**Potential Issues to Check:**
- Modal CSS visibility (`.is-open` class)
- JavaScript initialization timing
- Button selector matching
- Event propagation

**Files to Review:**
- `events.html` (modal structure, button attributes)
- `scripts/main.js` (lines 436-563)
- `styles.css` (modal styles, lines 2212+)

**Status:** ⏳ Ready for browser testing

---

## ⏳ Pending Tasks

### 4.3 Dark Mode Contrast Issues

**Issues Identified:**
1. Card titles blend into dark background until hover
2. Basics section cards have low opacity (hard to read labels)
3. Journey section text insufficient contrast
4. Recipe page descriptions may have contrast issues

**Files to Modify:**
- `styles.css` - Dark mode overrides for:
  - `.title` in dark mode
  - `.infographic-item` dark mode styles
  - `.timeline-item` dark mode styles
  - Recipe page dark mode styles

**Estimated Time:** 3-4 hours

---

### 4.4 Recipe Calculator Consistency

**Current State:**
- ✅ French Press has calculator
- ❌ 8 other recipe pages missing calculator

**Pages Needing Calculator:**
- AeroPress
- Chemex
- V60
- Drip
- Kalita Wave
- Origami Dripper
- Cold Brew (may need different ratio)
- Home Espresso (may need different approach)

**Files to Modify:**
- All 8 remaining recipe pages
- Copy calculator HTML from `french-press.html`
- Update `data-ratio` and `data-servings` for each method

**Estimated Time:** 2-3 hours

---

## Testing Checklist

### Newsletter Form
- [ ] EmailJS account created
- [ ] Service ID configured
- [ ] Template ID configured
- [ ] Public Key configured
- [ ] Test form submission
- [ ] Verify email received
- [ ] Test error handling
- [ ] Test success message display

### Event Registration Modal
- [ ] Modal opens on button click
- [ ] Form fields are accessible
- [ ] Focus trapping works
- [ ] ESC key closes modal
- [ ] Overlay click closes modal
- [ ] Form validation works
- [ ] Success/error messages display
- [ ] Works in dark mode

### Dark Mode Contrast
- [ ] Card titles visible in dark mode
- [ ] Basics section readable
- [ ] Journey section readable
- [ ] Recipe pages readable
- [ ] WCAG AA compliance (4.5:1 contrast)
- [ ] Test with accessibility tools

### Recipe Calculators
- [ ] All 9 pages have calculator
- [ ] Calculators work correctly
- [ ] Ratios are correct for each method
- [ ] Dark mode styling works
- [ ] Responsive on mobile

---

## Next Session Priorities

1. **Test event modal** in browser and fix any issues
2. **Fix dark mode contrast** issues systematically
3. **Add recipe calculators** to remaining pages
4. **Run accessibility audit** (WCAG compliance)

---

**Last Updated:** November 2025

