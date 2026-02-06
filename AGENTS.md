# AGENTS.md - Presentation Generation Workflow

## Overview

This project uses a two-agent workflow for creating professional PowerPoint presentations. Both agents leverage the `frontend-design` skill and apply Apple/Figma design principles alongside modern design best practices.

---

## Agent 1: Presentation Designer

**Role:** Design and generate PowerPoint presentations

**Skill:** `frontend-design`

### Responsibilities

1. **Brand Research**
   - Analyze client brand guidelines (colors, typography, visual language)
   - Extract primary/secondary colors, accent colors, and neutral palette
   - Identify typography choices and their hierarchy
   - Document spacing, radius, and shadow conventions

2. **Theme System Creation**
   - Define a comprehensive color system with semantic naming
   - Create typography presets (hero, h1-h4, body, caption, metrics)
   - Establish spacing scale and border radius tokens
   - Design shadow presets for depth and elevation

3. **Layout Architecture**
   - Use proper 16:9 slide dimensions (10" x 5.625")
   - Implement a 12-column grid system for alignment
   - Define safe margins and content areas
   - Create reusable card grid helpers

4. **Presentation Design**
   - Create multiple distinct design variations (5+ recommended)
   - Each design should have a unique visual identity:
     - Dark mode / Executive
     - Light mode / Swiss-clean
     - Data-forward / Dashboard
     - Editorial / Magazine
     - Warm / Professional
   - Ensure content hierarchy and visual balance

### Design Principles (Apple/Figma Inspired)

```
VISUAL HIERARCHY
- One focal point per slide
- Clear information hierarchy
- Generous whitespace (40%+ of slide)

TYPOGRAPHY
- Maximum 2 font families
- Clear size contrast (1.5x minimum between levels)
- Consistent alignment (left-aligned body text)

COLOR
- Limited palette (1 accent + 3-4 neutrals)
- Sufficient contrast (4.5:1 minimum for text)
- Purposeful use of accent color

SPACING
- Consistent spacing scale (8px base unit)
- Optical alignment over mathematical
- Group related elements

SHADOWS & DEPTH
- Subtle, diffuse shadows
- Consistent light source (top-left)
- Use sparingly for hierarchy
```

### Output

- Multiple `.pptx` files in `output/` directory
- Each presentation: 5-6 slides covering problem, solution, features, metrics, CTA

---

## Agent 2: Design Critic

**Role:** Ruthlessly evaluate presentation quality against modern web design standards

**Skill:** `frontend-design`

**Mindset:** The critic must think like a senior design lead at Apple, Figma, or Linear. A presentation that "renders correctly" is NOT a pass. The bar is: **"Would this win a design award? Would a designer be proud to show this in their portfolio?"**

### Two-Level Critique System

#### Level 1: Rendering Verification (Basic - Must Pass)
Quick check that content renders correctly:
```
[ ] No text overflow or awkward wrapping
[ ] Content within safe margins
[ ] No overlapping elements
[ ] Fonts render correctly
```

#### Level 2: Design Excellence (Critical - The Real Test)
Evaluate against frontend-design skill and Apple/Figma standards:

```
TYPOGRAPHY (Weight: Critical)
[ ] FAIL if using generic fonts (Arial, Inter, Roboto, Segoe UI, system fonts)
[ ] FAIL if typography lacks character or distinctiveness
[ ] Must have clear hierarchy with 1.5x+ size contrast between levels
[ ] Display font should be memorable and intentional
[ ] Body font should complement, not match, display font

BACKGROUNDS & ATMOSPHERE (Weight: Critical)
[ ] FAIL if flat, solid color backgrounds throughout
[ ] Must have depth: gradients, textures, patterns, or layered elements
[ ] Consider: gradient meshes, noise textures, geometric patterns
[ ] Consider: layered transparencies, subtle grain overlays
[ ] Background should create atmosphere, not just be a color

SPATIAL COMPOSITION (Weight: High)
[ ] FAIL if all layouts are predictable grids
[ ] Look for: asymmetry, overlap, diagonal flow, grid-breaking elements
[ ] Unexpected layouts create visual interest
[ ] Generous negative space OR controlled density (intentional choice)
[ ] Elements should have visual rhythm and flow

SHADOWS & DEPTH (Weight: High)
[ ] FAIL if cards/elements have no elevation
[ ] Shadows should be subtle and diffuse (not harsh drop shadows)
[ ] Consistent light source (typically top-left)
[ ] Depth should reinforce visual hierarchy
[ ] Consider: layered elements, overlapping shapes, z-depth

COLOR USAGE (Weight: High)
[ ] Dominant color with sharp accents (not timid, evenly-distributed)
[ ] Accent color used purposefully (not everywhere)
[ ] Sufficient contrast (4.5:1 minimum for text)
[ ] Color creates mood and atmosphere

VISUAL MEMORABILITY (Weight: Critical)
[ ] What's the ONE thing someone will remember about this slide?
[ ] Does each slide have a clear focal point?
[ ] Is there any element that's genuinely surprising or delightful?
[ ] Would this stand out in a portfolio review?

ANTI-PATTERNS TO REJECT (Automatic Fail)
[ ] Generic "corporate PowerPoint" aesthetic
[ ] Safe, predictable, forgettable design
[ ] Looks like default template with brand colors applied
[ ] Could have been made by any AI without design training
[ ] No distinctive point-of-view or creative direction
```

### Critique Process

1. **First Pass - Rendering Check**
   - Convert PPTX to PNG
   - Verify all content renders without technical issues
   - Fix any rendering bugs before design critique

2. **Second Pass - Design Excellence Audit**
   For EACH slide, answer these questions honestly:
   
   ```
   1. TYPOGRAPHY: Is this font choice distinctive and intentional?
      - Generic system font = FAIL
      - Interesting display font with complementary body = PASS
   
   2. BACKGROUND: Does this create atmosphere and depth?
      - Flat solid color = FAIL
      - Gradient/texture/pattern/layered = PASS
   
   3. COMPOSITION: Is this layout unexpected or interesting?
      - Predictable centered/grid layout = FAIL
      - Asymmetry/overlap/diagonal/grid-breaking = PASS
   
   4. DEPTH: Do elements have proper elevation?
      - Flat cards with no shadow = FAIL
      - Subtle shadows with consistent light = PASS
   
   5. MEMORABILITY: What makes this unforgettable?
      - Nothing stands out = FAIL
      - Clear "hero moment" or surprising element = PASS
   ```

3. **Issue Documentation**
   For each issue found, document:
   - Slide number and element
   - Which design principle is violated
   - Severity: CRITICAL (blocks approval) / HIGH / MEDIUM
   - Specific fix with concrete values (colors, coordinates, fonts)

4. **Iteration Loop**
   - Report ALL issues to Designer agent
   - Designer must address CRITICAL and HIGH issues
   - Re-verify after regeneration
   - Only approve when design is genuinely excellent

### Verification Workflow

```bash
# 1. Generate presentations
npm run generate

# 2. Convert to PDF
cd output
for pptx in *.pptx; do
  libreoffice --headless --convert-to pdf --outdir previews "$pptx"
done

# 3. Convert to PNG for review
cd previews
for pdf in *.pdf; do
  pdftoppm -png -r 150 "$pdf" "${pdf%.pdf}"
done

# 4. Review each PNG slide against Level 1 + Level 2 criteria
# Use mcp_read to visually inspect images
```

### Quality Standards

**PASS Criteria (ALL must be true):**
- Level 1: All rendering checks pass
- Level 2 Typography: Distinctive, characterful fonts (not generic)
- Level 2 Background: Atmosphere and depth (not flat)
- Level 2 Composition: Interesting layouts (not predictable)
- Level 2 Shadows: Proper elevation hierarchy
- Level 2 Memorability: Each slide has a "hero moment"
- Overall: Looks like it was designed by a senior designer, not generated

**FAIL Criteria (ANY triggers rejection):**
- Any Level 1 rendering issue
- Generic/system fonts throughout
- Flat solid backgrounds with no atmosphere
- All predictable grid layouts
- No shadows or depth on cards/elements
- Nothing memorable or distinctive
- Looks like "corporate PowerPoint" or "AI slop"

### Example Critique

**Slide 1 Analysis:**
```
TYPOGRAPHY: FAIL
- Using Segoe UI (system font) - generic, no character
- Fix: Use distinctive display font like Clash Display, Cabinet Grotesk, 
  or Satoshi for headlines

BACKGROUND: FAIL  
- Flat #1a1816 solid color - no atmosphere
- Fix: Add subtle radial gradient from center, or noise texture overlay,
  or geometric pattern at 5% opacity

COMPOSITION: FAIL
- Predictable centered layout with accent line
- Fix: Try asymmetric placement, overlapping elements, or diagonal flow

SHADOWS: N/A (title slide)

MEMORABILITY: FAIL
- Nothing distinctive - looks like any dark corporate template
- Fix: Add a bold geometric shape, gradient accent, or unexpected 
  typography treatment

VERDICT: REJECT - Redesign required
```

**What Excellence Looks Like:**
```
TYPOGRAPHY: PASS
- Clash Display for headlines (geometric, modern, distinctive)
- Satoshi for body (clean, complements display font)
- Clear hierarchy with 2x size contrast

BACKGROUND: PASS
- Dark base with subtle radial gradient (lighter center)
- Noise texture at 3% opacity adds depth
- Geometric accent shapes at edges

COMPOSITION: PASS
- Title positioned at golden ratio, not centered
- Orange accent block overlaps edge of slide
- Asymmetric balance creates tension

MEMORABILITY: PASS
- The overlapping geometric shape is unexpected
- Color gradient on the accent draws the eye
- Typography treatment is bold and confident

VERDICT: APPROVE - Meets design excellence standards
```

---

## Workflow Diagram

```
                    +-------------------+
                    |   User Request    |
                    +-------------------+
                             |
                             v
                    +-------------------+
                    | Brand Research    |
                    | (Designer Agent)  |
                    +-------------------+
                             |
                             v
                    +-------------------+
                    | Theme System      |
                    | Creation          |
                    +-------------------+
                             |
                             v
                    +-------------------+
                    | Generate          |
                    | Presentations     |
                    +-------------------+
                             |
                             v
                    +-------------------+
                    | Visual Review     |
                    | (Critic Agent)    |
                    +-------------------+
                             |
              +--------------+--------------+
              |                             |
              v                             v
      +---------------+             +---------------+
      | Issues Found  |             | Quality Pass  |
      +---------------+             +---------------+
              |                             |
              v                             v
      +---------------+             +---------------+
      | Fix Issues    |             | Deliver       |
      | (Designer)    |             | Final Output  |
      +---------------+             +---------------+
              |
              +-----> (loop back to Visual Review)
```

---

## Modern Design Principles Applied

### 1. Clarity Over Decoration
- Every element serves a purpose
- Remove anything that doesn't communicate
- Embrace negative space

### 2. Systematic Consistency
- Token-based design (colors, typography, spacing)
- Reusable components
- Predictable patterns

### 3. Accessibility First
- Sufficient color contrast
- Readable font sizes (14pt minimum body)
- Clear visual hierarchy

### 4. Motion & Depth (Subtle)
- Shadows suggest elevation
- Consistent light source
- Depth reinforces hierarchy

### 5. Brand Authenticity
- Colors match brand guidelines exactly
- Typography reflects brand personality
- Visual language aligns with brand positioning

---

## File Structure

```
/root/fahrerplanung/
├── AGENTS.md                    # This file
├── package.json
├── tsconfig.json
├── packages/
│   └── react-pptx-extended/     # Extended PPTX generation library
├── src/
│   ├── index.tsx                # Main generator with 5 designs
│   └── theme/
│       ├── index.ts             # Theme exports
│       ├── colors.ts            # Brand color system
│       ├── typography.ts        # Font presets
│       ├── layout.ts            # Grid system & dimensions
│       └── shadows.ts           # Shadow presets
├── output/
│   ├── *.pptx                   # Generated presentations
│   └── previews/
│       ├── *.pdf                # PDF conversions
│       └── *.png                # Slide screenshots
└── skills/
    └── frontend-design/
        └── SKILL.md             # Design skill documentation
```

---

## Usage

### Generate All Presentations
```bash
npm run generate
```

### Full Verification Workflow
```bash
npm run generate && \
cd output && \
for pptx in *.pptx; do libreoffice --headless --convert-to pdf --outdir previews "$pptx" 2>/dev/null; done && \
cd previews && \
for pdf in *.pdf; do pdftoppm -png -r 150 "$pdf" "${pdf%.pdf}"; done
```

### Review Specific Slide
```bash
# View slide 3 of executive-black presentation
mcp_read /root/fahrerplanung/output/previews/01-executive-black-3.png
```

---

## Quality Iteration Example

**Issue Found:**
> Split Composition slide 1: "SOFTWARE" text wrapping to "SOFTWAR" + "E" - orange block too narrow

**Fix Applied:**
```tsx
// Before
<Shape type="rect" style={{ x: 3.5, y: 2.5, w: 6, h: 1.3, ... }} />
<Text style={{ x: 3.7, w: 5.6, ... }}>SOFTWARE</Text>

// After
<Shape type="rect" style={{ x: 2.8, y: 2.5, w: 6.7, h: 1.3, ... }} />
<Text style={{ x: 3, w: 6.3, ... }}>SOFTWARE</Text>
```

**Verification:**
Regenerate, convert to PNG, confirm text fits without wrapping.
