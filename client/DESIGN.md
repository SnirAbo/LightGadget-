# LightGadget — Design System (MUI + React Native)

> **Goal:** Make LightGadget look and feel like a real, professional electronics/smart-home store (KSP / Apple Store / Ivory) with one consistent visual language across the Web app (React + **MUI**) and Mobile (React Native + Paper).
>
> **This file is the single source of truth for visual design.** Every UI change must follow the tokens and rules here. Do not improvise colors, spacing, or fonts — derive everything from this system.
>
> **MUI-first (web):** Implement the system through a **central MUI theme** (`createTheme`) and reference theme values via the `sx` prop and `theme.palette` / `theme.typography` / `theme.spacing`. Do **not** hardcode hex values in components once the theme exists — use `sx={{ color: 'primary.main' }}`, `bgcolor: 'background.default'`, etc. **Always use `sx`, never the `style` prop.**
>
> **Mobile:** see section 10. Same tokens, different implementation.
---

## 1. Design Direction — "Modern Clean Tech Retail"

**Concept:** Modern, clean, airy. Lots of white, clear typography, the product is the hero. Orange (`#FF6B00`) is the brand color — used **sparingly** for actions and prices, never as a large background fill. Everything should feel fast, trustworthy, and easy to buy from — like a real store where people spend money.

**Guiding principles:**
- **Whitespace is a feature.** Generous spacing, never cramped. Prefer fewer elements with more air.
- **Product-first.** Large, clean product images on white. The card serves the image, not the reverse.
- **Clear hierarchy.** Each screen has one most-important thing (usually price + buy button). Make it the most prominent.
- **Color = meaning, not decoration.** Orange only for CTAs and prices. Grey for secondary text. Green/red only for status.
- **Absolute consistency.** The same button looks identical on every screen. Same spacing. Same radius.
- **One bold thing.** The Bolt Slash (section 2) is the only decorative flourish in the entire product. Everything else stays quiet.

---

## 2. Signature Element — "The Bolt Slash" ⚡

The LightGadget logo is a **KA monogram cut by a yellow lightning bolt**. That diagonal cut is the brand's one memorable gesture — so it becomes the one memorable gesture in the UI.

**The device:** a short bar, skewed to **-15°**, filled with a **yellow → orange gradient**. It reads as a bolt fragment without being literal.

```css
/* the canonical slash */
width: 4px;
height: 20px;
transform: skewX(-15deg);
background: linear-gradient(180deg, #FFD60A 0%, #FF6B00 100%);
border-radius: 2px;
```

### It appears in exactly three places. Nowhere else.

**1. Before every section title** — replaces generic underlines/eyebrows.
```jsx
<Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
  <Box sx={{
    width: '4px', height: '24px', flexShrink: 0,
    transform: 'skewX(-15deg)', borderRadius: '2px',
    background: 'linear-gradient(180deg, #FFD60A 0%, #FF6B00 100%)',
  }} />
  <Typography variant="h2">מוצרים חדשים</Typography>
</Stack>
```

**2. Under the active nav item** — a 3px slash, not a flat underline.
```jsx
// active nav item gets:
sx={{
  position: 'relative',
  '&::after': {
    content: '""', position: 'absolute', bottom: -6, insetInline: 0, height: '3px',
    transform: 'skewX(-15deg)', borderRadius: '2px',
    background: 'linear-gradient(90deg, #FFD60A 0%, #FF6B00 100%)',
  },
}}
```

**3. Hover sweep on the primary CTA** — a single diagonal light pass, 400ms, once.
```jsx
// on <Button variant="contained">
sx={{
  position: 'relative', overflow: 'hidden',
  '&::before': {
    content: '""', position: 'absolute', top: 0, left: '-60%',
    width: '40%', height: '100%',
    transform: 'skewX(-15deg)',
    background: 'linear-gradient(90deg, transparent, rgba(255,214,10,.45), transparent)',
    transition: 'left .4s ease',
  },
  '&:hover::before': { left: '120%' },
  '@media (prefers-reduced-motion: reduce)': {
    '&::before': { display: 'none' },
  },
}}
```

### Hard rules for the slash
- **Never more than one slash visible per viewport region.** It marks; it does not pattern.
- **Never as a background, border, divider between cards, or loading animation.**
- **Yellow (`#FFD60A`) exists ONLY inside the slash gradient.** It is not a UI color. No yellow buttons, no yellow text, no yellow chips.
- If a screen feels like it needs a fourth slash — it doesn't. Remove one.

> **Why this and not more:** the store's job is to sell electronics, not to perform. The slash gives the brand a fingerprint at zero cost to clarity. Everything else stays white, calm, and fast.

---

## 3. MUI Theme — Central Configuration

Create a single theme file (e.g. `src/theme.js`) and wrap the app in `<ThemeProvider theme={theme}>` + `<CssBaseline />`. All tokens below map to this theme.

```js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl', // toggled with language; see section 8
  palette: {
    mode: 'light',
    primary:   { main: '#FF6B00', dark: '#E05A00', light: '#FFF3EB', contrastText: '#FFFFFF' },
    success:   { main: '#22C55E', light: '#DCFCE7' },
    error:     { main: '#EF4444', light: '#FEE2E2' },
    warning:   { main: '#F59E0B', light: '#FEF3C7' },
    info:      { main: '#3B82F6', light: '#DBEAFE' },
    background: { default: '#FFFFFF', paper: '#F8F9FA' },
    text:      { primary: '#1A1A1A', secondary: '#6B7280', disabled: '#9CA3AF' },
    divider:   '#E5E7EB',
  },
  shape: { borderRadius: 12 }, // default card radius
  typography: {
    fontFamily: `'Heebo', 'Rubik', system-ui, sans-serif`,
    h1: { fontSize: '2rem',    fontWeight: 700, lineHeight: 1.2 },  // 32px
    h2: { fontSize: '1.5rem',  fontWeight: 700, lineHeight: 1.3 },  // 24px
    h3: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },  // 20px
    body1: { fontSize: '1rem',    fontWeight: 400, lineHeight: 1.6 }, // 16px
    body2: { fontSize: '0.875rem',fontWeight: 400, lineHeight: 1.5 }, // 14px
    button: { textTransform: 'none', fontWeight: 600 },              // no ALL-CAPS
    caption: { fontSize: '0.75rem', fontWeight: 500 },               // 12px
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 24, paddingBlock: 12 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          transition: 'transform .2s, box-shadow .2s',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '&:hover': { transform: 'none' },
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
    },
  },
});

export default theme;
```

> **Font:** load Heebo from Google Fonts (`<link>` in `index.html` or `@fontsource/heebo`). Heebo reads far better in Hebrew than MUI's default Roboto. Fallback: Rubik → system-ui.

> **Note on `accent` (`#FFD60A`):** deliberately **not** in the palette. Keeping it out of the theme prevents anyone from reaching for it as a UI color. It lives only in the slash gradients above.

---

## 4. Color Tokens (reference)

Use via the theme (`sx={{ color: 'primary.main' }}`), not raw hex.

| Token | Hex | Theme path | Use |
|-------|-----|-----------|-----|
| Primary | `#FF6B00` | `primary.main` | CTAs, prices, active elements |
| Primary hover | `#E05A00` | `primary.dark` | button hover |
| Primary light | `#FFF3EB` | `primary.light` | subtle highlight background |
| **Bolt yellow** | `#FFD60A` | *(none — literal)* | **Bolt Slash gradient only** |
| Background | `#FFFFFF` | `background.default` | main page background |
| Surface | `#F8F9FA` | `background.paper` | cards, sections |
| Border | `#E5E7EB` | `divider` | borders, separators |
| Text primary | `#1A1A1A` | `text.primary` | main text |
| Text secondary | `#6B7280` | `text.secondary` | secondary text |
| Text muted | `#9CA3AF` | `text.disabled` | placeholders |
| Success | `#22C55E` | `success.main` | in stock, delivered |
| Error | `#EF4444` | `error.main` | out of stock, delete |
| Warning | `#F59E0B` | `warning.main` | pending |
| Info | `#3B82F6` | `info.main` | shipped / info |

**Color rules:**
- Page background is always `background.default` (white). Not grey, not colored.
- Cards/sections use `background.paper`.
- Primary button (add to cart / pay / order) = `primary.main`, white text.
- Prices = `primary.main`, bold.
- Never use orange as a large background fill. It accents — it does not fill.
- Yellow is not a UI color. See section 2.

---

## 5. Spacing & Layout

MUI v6+ Grid API: Use <Grid size={{ xs: 6, sm: 4, md: 3 }}>. The item prop and standalone xs/sm/md props are silently ignored — they cause content-based auto-layout instead of a fixed grid.

MUI `spacing` = 8px base. Use `theme.spacing(n)` or shorthand `sx={{ p: 2 }}` (= 16px), `sx={{ mb: 3 }}` (= 24px).

```
p:0.5 → 4px   p:1 → 8px    p:1.5 → 12px
p:2 → 16px    p:3 → 24px   p:4 → 32px
p:6 → 48px    p:8 → 64px
```

**Radius:**
```
8px   → buttons, inputs      (use sx={{ borderRadius: '8px' }})
12px  → cards                (default from theme.shape)
16px  → modals, big sections (use sx={{ borderRadius: '16px' }})
999px → chips, badges
```
> MUI `borderRadius: n` in `sx` multiplies `theme.shape.borderRadius`. To be safe, use explicit string values like `sx={{ borderRadius: '8px' }}`.

**Shadows:**
```
card rest:  0 1px 3px rgba(0,0,0,0.06)
card hover: 0 4px 12px rgba(0,0,0,0.08)
modal:      0 8px 24px rgba(0,0,0,0.12)
```

**Grid (product catalog) — use MUI Grid:**
```jsx
<Grid container spacing={2}>
  <Grid item xs={6} sm={4} md={3}>...</Grid>  // 2 cols mobile, 3 tablet, 4 desktop
</Grid>
```
- Content `maxWidth`: use `<Container maxWidth="lg">` (~1200px), centered.
- Gap between cards: `spacing={2}` (16px).
- Vertical rhythm between page sections: `mb: 6` (48px). Never less.

---

## 6. Component Patterns (MUI)

### Buttons
```
Primary (CTA):    <Button variant="contained" color="primary" fullWidth>
                  → orange bg, white text, radius 8px, weight 600, hover primary.dark
                  → carries the Bolt Slash hover sweep (section 2)
Secondary:        <Button variant="outlined"> → transparent, divider border, text.primary
Danger:           <Button color="error"> (for delete)
Disabled:         disabled prop → opacity 0.5 (e.g. "אזל מהמלאי")
```
- One primary button per screen/card. No two competing orange buttons.
- Every button says exactly what happens: "הוסף לעגלה", "שלח הזמנה", "שמור שינויים". Never "אישור" / "שלח".

### Product Card
```
+---------------------+
|                     |
|   [product image]   |  ← CardMedia, 1:1, objectFit: cover, white bg
|                     |
+---------------------+
| Product name        |  ← Typography h3, text.primary, noWrap + ellipsis
| Category            |  ← body2, text.secondary
| price     [In stock]|  ← price (primary.main, bold) + status Chip
|                     |
| [   Add to cart   ] |  ← Button contained primary, fullWidth
+---------------------+
```
```jsx
<Card>
  <CardMedia component="img" image={pic || placeholder} sx={{ aspectRatio: '1', objectFit: 'cover' }} />
  <CardContent>
    <Typography variant="h3" noWrap>{title}</Typography>
    <Typography variant="body2" color="text.secondary">{category}</Typography>
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ my: 1 }}>
      <Typography sx={{ color: 'primary.main', fontWeight: 700, fontSize: '1.25rem' }}>₪{price}</Typography>
      <Chip label={inStock ? 'במלאי' : 'אזל'} size="small"
            sx={{ bgcolor: inStock ? 'success.light' : 'error.light',
                  color: inStock ? 'success.main' : 'error.main' }} />
    </Stack>
  </CardContent>
  <CardActions sx={{ p: 2, pt: 0 }}>
    <Button variant="contained" color="primary" fullWidth disabled={!inStock}>הוסף לעגלה</Button>
  </CardActions>
</Card>
```
- Card hover (translateY -2px + shadow) is already in the theme override.
- **No slash on the card.** Cards are quiet.
- No image → clean grey placeholder with an icon, **not** a "No Image" text block.

### Inputs (TextField)
- Theme default: `variant="outlined"`, `size="small"`.
- Focus ring uses `primary.main` automatically (from palette.primary).
- Always give a clear `label`.

### Chips / Badges (status)
```jsx
<Chip label="במלאי" size="small" sx={{ bgcolor: 'success.light', color: 'success.main', fontWeight: 500 }} />
```
| Status | bgcolor | color |
|--------|---------|-------|
| במלאי / נמסר | `success.light` | `success.main` |
| אזל / שגיאה | `error.light` | `error.main` |
| ממתין | `warning.light` | `warning.main` |
| נשלח | `info.light` | `info.main` |

### Navbar (AppBar)
- `<AppBar position="sticky" color="inherit" elevation={0}>` with a bottom `divider` border, white background.
- Logo "LightGadget" on the start side, nav center, cart + account on the end side.
- Active nav item carries the **Bolt Slash** (section 2, use #2).
- Cart icon uses `<Badge badgeContent={itemCount} color="primary">` (orange badge).

---

## 7. Screen Layouts

### 7.1 Home / Catalog

The face of the store. Order top to bottom:

```
+--------------------------------------------------+
| AppBar (sticky, white, divider bottom)           |
+--------------------------------------------------+
|                                                  |
|   HERO — full-width, height 380px desktop /      |
|   240px mobile. White or #F8F9FA bg.             |
|   Left (start): H1 headline + one line of body   |
|                 + one primary CTA                |
|   Right (end):  one large hero product image,    |
|                 cut out, no drop shadow          |
|                                                  |
+--------------------------------------------------+
|  ⚡ קטגוריות            ← section title w/ slash |
|  [ Chip ] [ Chip ] [ Chip ] [ Chip ]             |
|  horizontally scrollable on mobile               |
+--------------------------------------------------+
|  ⚡ המוצרים שלנו        ← section title w/ slash |
|  [card] [card] [card] [card]                     |
|  [card] [card] [card] [card]                     |
+--------------------------------------------------+
| Footer — divider top, text.secondary, small      |
+--------------------------------------------------+
```

**Hero rules:**
- **No gradient background. No carousel. No stock-photo collage.** One image, one headline, one button.
- Headline: `variant="h1"`, `text.primary`. Speaks to the customer, not about the store.
  - ✅ "טכנולוגיה חכמה לבית שלך"  ❌ "ברוכים הבאים ל-LightGadget"
- Subline: `body1`, `text.secondary`, one sentence max.
- CTA: one `contained` button → scrolls to catalog or opens a category.
- Hero image: the product is the hero. Not a lifestyle photo of a smiling family.

### 7.2 Product Page

```
Desktop (md+):                    Mobile (xs):
+----------------+-------------+  +---------------------+
|                | Name  (h1)  |  |                     |
|                | Category    |  |   [image, 1:1]      |
|  [image 1:1]   |             |  |                     |
|                | ₪ price     |  +---------------------+
|                | [In stock]  |  | Name (h2)           |
|                |             |  | Category            |
|                | Description |  | ₪ price  [In stock] |
|                | (body1)     |  | Description         |
|                |             |  +---------------------+
|                | [Add to     |  | [Add to cart] ← sticky
|                |    cart   ] |  |   bottom bar        |
+----------------+-------------+  +---------------------+
```
- `<Grid container spacing={4}>` → image `md={6}`, details `md={6}`.
- Image: `aspectRatio: '1'`, `objectFit: 'contain'`, `bgcolor: 'background.paper'`, `borderRadius: '16px'`.
- Price is the largest non-title element on the page: `fontSize: '2rem'`, `fontWeight: 700`, `primary.main`.
- **Mobile:** the Add-to-cart button is a sticky bottom bar (`position: 'fixed', bottom: 0`), white bg, `divider` top border, `p: 2`. The buy action is never scrolled off screen.
- Below the fold (optional, only if data exists): "מוצרים דומים" — same section title + slash + card row.

### 7.3 Cart

- Line items as rows, not cards: image (64px) · name · qty stepper · line price · remove icon (`error.main`).
- Summary block on the end side (`md`) or below (`xs`): `background.paper`, `borderRadius: '16px'`, `p: 3`.
- Total is `h2` weight 700 in `primary.main`.
- One primary button: "מעבר לתשלום".

### 7.4 Admin

Function over polish. Here — and **only** here — a `<Table>` is correct.
- Orders table: order id · customer · date · total · status `Chip` · action.
- Status change: `<Select size="small">` inline in the row.
- No slash, no hero, no marketing copy. It's a tool.

---

## 8. Loading, Empty & Error States

**These are part of the design, not an afterthought.** Every screen that fetches data must define all three.

### Loading — Skeleton, never a spinner
Skeletons mirror the exact shape of the content that will replace them. No layout shift.

```jsx
// catalog loading: render 8 of these in the same Grid
<Card>
  <Skeleton variant="rectangular" sx={{ aspectRatio: '1' }} />
  <CardContent>
    <Skeleton width="80%" height={28} />
    <Skeleton width="40%" height={20} />
    <Skeleton width="50%" height={28} sx={{ mt: 1 }} />
  </CardContent>
  <CardActions sx={{ p: 2, pt: 0 }}>
    <Skeleton variant="rounded" width="100%" height={44} />
  </CardActions>
</Card>
```
- Spinners (`CircularProgress`) are allowed **only** inside a button during submit (`<Button disabled><CircularProgress size={20} /></Button>`).
- **The Bolt Slash is never used as a loading animation.**

### Empty — an invitation, not a shrug
Centered stack: muted icon (48px, `text.disabled`) → `h3` line → `body2` line → one primary button.

| Screen | Title | Body | Button |
|--------|-------|------|--------|
| Cart | העגלה ריקה | הוסף מוצרים כדי להתחיל | המשך לקנות |
| Orders | אין הזמנות עדיין | ההזמנות שלך יופיעו כאן | לקטלוג |
| Search | לא נמצאו מוצרים | נסה מונח אחר או עיין בקטגוריות | נקה חיפוש |

### Error — say what happened and what to do
- Inline `<Alert severity="error">` inside the content area. Not a modal, not a toast that disappears.
- Copy states the problem and the fix. It does not apologize and it is never vague.
  - ✅ "לא הצלחנו לטעון את המוצרים. בדוק את החיבור ונסה שוב." + [נסה שוב]
  - ❌ "אופס! משהו השתבש 😅"

### Feedback — Snackbar
- Add to cart → `<Snackbar>` "נוסף לעגלה" + action link "לעגלה". 3s.
- Order placed → full confirmation screen, not a snackbar. A purchase deserves a page.
- **Verb consistency:** the button that says "הוסף לעגלה" produces "נוסף לעגלה". Same word, past tense.

---

## 9. RTL / Bilingual (MUI)

- The app supports Hebrew (RTL) and English (LTR) with an existing toggle.
- Set `theme.direction` based on language and wrap with the RTL cache:
  ```js
  import rtlPlugin from 'stylis-plugin-rtl';
  import createCache from '@emotion/cache';
  const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [rtlPlugin] });
  // <CacheProvider value={cacheRtl}><ThemeProvider theme={rtlTheme}>...
  ```
- Also set `document.dir = 'rtl' | 'ltr'` when the language toggles.
- Prefer logical spacing in `sx` (`ms`, `me`, `ps`, `pe`) over `ml/mr/pl/pr` so layouts mirror correctly.
- Directional icons (arrows) flip in RTL.
- Numbers/prices stay LTR inside Hebrew text (does not reverse).
- **The Bolt Slash does NOT mirror.** It keeps `skewX(-15deg)` in both directions — it's a brand mark, not a layout element. Verify it visually after any RTL change.

---

## 10. Mobile (React Native + Paper)

The mobile app mirrors the same tokens. It does **not** get its own palette.

**Theme:** define a Paper theme (`MD3LightTheme` + overrides) in `theme.js`, map:
```
primary          → #FF6B00
onPrimary        → #FFFFFF
background       → #FFFFFF
surface          → #F8F9FA
outline          → #E5E7EB
onSurface        → #1A1A1A
onSurfaceVariant → #6B7280
error            → #EF4444
```
- Font: Heebo via `expo-font`. Same scale as section 3 (32 / 24 / 20 / 16 / 14 / 12).
- Spacing: same 8px base. Radius: 8 buttons / 12 cards / 16 sheets.
- Product card: same anatomy as web (image 1:1 → name → category → price + status → full-width button).
- Loading: skeleton via `react-native-skeleton-placeholder` or animated `Surface` blocks. **Not** `ActivityIndicator` for full screens.

**The Bolt Slash on mobile:** appears **once only** — as the section-title marker. Implement as a `<View>` with `transform: [{ skewX: '-15deg' }]` and `expo-linear-gradient`. No hover exists on mobile, so the CTA sweep does not apply. Do not invent a press animation for it.

**RTL:** use `I18nManager.forceRTL(true)` for Hebrew; use logical props (`marginStart` / `marginEnd`).

---

## 11. Quality Floor (non-negotiable)

Build to this without announcing it:
- **Responsive** down to 360px width. Nothing overflows horizontally.
- **Keyboard focus visible** on every interactive element. Never `outline: none` without a replacement.
- **`prefers-reduced-motion` respected** — card hover lift and the CTA sweep both disable.
- **Touch targets ≥ 44px** on mobile.
- **Images have `alt`** (web) and `accessibilityLabel` (mobile).
- **Color is never the only signal** — "אזל" is a word, not just a red dot.

---

## 12. Anti-patterns (remove these)

- Random background colors (`limegreen`, `lightgrey`) from the old code — remove, replace with theme tokens.
- More than one primary button per screen.
- Raw MUI `<Table>` for product display — use Cards. (Admin is the one exception.)
- "No Image" text — replace with a clean placeholder.
- Inconsistent spacing — everything on the 8px system.
- Heavy shadows / loud gradients.
- The `style` prop — always use `sx`.
- Hardcoded hex in components once the theme exists — reference palette tokens.
- MUI default Roboto for Hebrew — use Heebo.
- **Yellow anywhere except the Bolt Slash gradient.**
- **More than one Bolt Slash per viewport region.** It is a mark, not a texture.
- Full-screen spinners — use Skeletons.
- Emoji in error messages.
- Carousels / auto-rotating hero banners.
- Vague button labels ("שלח", "אישור") — say what happens.

---

## 13. Implementation Order

One step at a time. **Verify each before moving on.**

1. **Theme only.** `theme.js` + ThemeProvider + CssBaseline + Heebo loaded. Nothing else changes. Confirm the app still renders.
2. **Bolt Slash component.** Build a reusable `<SectionTitle>` that renders slash + title. One component, used everywhere.
3. **Navbar** — white, sticky, divider, cart badge, active-item slash.
4. **Product catalog (home)** — hero + categories + grid + **skeleton loading state**.
5. **Product card** — full anatomy per section 6.
6. **Product page** — including the mobile sticky buy bar.
7. **Cart + checkout** — including empty state.
8. **Account + My Orders** — including empty state.
9. **Admin panel** — functional, table-based, no decoration.
10. **Mobile** — mirror tokens (section 10), screen by screen in the same order.

**For every screen:** apply theme tokens · remove old colors · use `sx` (never `style`) · define loading + empty + error · verify RTL · verify at 360px.
