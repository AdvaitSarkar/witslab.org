# WITS visual identity · production handoff v2

WITS stands for **Work Intelligence and Thought Science**. Use `WITS` in prose.
The artwork spells `wits`: upright `wi`, then a vertical insertion caret, then
italic `ts` as an unaccepted suggestion. The caret is not a letter. Use the
supplied SVG paths, not typed text, a screenshot, or a CSS approximation.
Paths below are relative to the root of the extracted ZIP.

## Choose the asset

| Placement | File on a white background | Size rule |
|---|---|---|
| Website header, article or already-framed layout | `svg/positive/plain.svg` | Display at 120 CSS px wide or more. No outline or fill. |
| Standalone mark where the text-field metaphor is useful | `svg/positive/field.svg` | At least 120 px wide. The field is part of the artwork, not an interactive control. |
| Name and institutional descriptor | `svg/positive/plain-lockup.svg` or `svg/positive/lockup.svg` | At least 260 px wide. `lockup` has a field; `plain-lockup` does not. |
| Social avatar or compact badge | `svg/positive/avatar.svg` | Use the circular outline at 32 px or larger. A social platform can use `png/positive/avatar-512.png`. |
| Browser tab | `web/favicon.ico` | Contains 16, 32 and 48 px images. The tab mark has no ring. |

Choose by **rendered size and role**, not the file's intrinsic resolution. If a
header cannot accommodate the display minimum, use the compact avatar rather
than shrinking the light mark. Keep at least one wordmark `w` of external clear
space around display marks and lockups. Do not count the field’s interior
padding toward clear space.

## Choose the colourway

- `positive`: use on white or very light, quiet surfaces.
- `reverse`: use the corresponding filename in `svg/reverse/` on dark
  surfaces. The unframed wordmark and unframed lockup are transparent.
- `one-ink`: use the corresponding filename in `svg/one-ink/` for single-ink
  printing on light stock. Italics, not grey, distinguish the suggestion.
- Use `png/` instead of `svg/` only when required. PNG names append the export
  width, for example `png/reverse/plain-lockup-1200.png`. Preserve aspect ratio.

## Construction reference (do not rebuild for normal use)

| Role | Family and style | Positive colour |
|---|---|---|
| Display typed / suggestion | Source Code Pro Light 300 / Light Italic 300 | `#192228` / `#C3C8CD` |
| Compact typed / suggestion | Source Code Pro Semibold 600 / Semibold Italic 600 | `#192228` / `#77838E` |
| Cursor | Separate vertical stroke; heavier in compact art | `#2867E1` |
| Display field | 170 × 64 viewBox; 0.9-unit stroke; 5-unit corner radius | `#B7C1C7` |
| Avatar ring | 128 × 128 viewBox; 2.5-unit stroke | `#82909A` |

Do not add borders, pills, drop shadows, extra rounding or placeholder text.
Never draw a second frame around the field. Use the plain version inside
buttons, panels or existing borders. Do not use the Mist token for body text.
Fonts in `fonts/` are unmodified and covered by the included SIL Open Font
License; the outlined SVGs do not require them to render.

## Implementation example

```html
<a href="/">
  <img src="svg/positive/plain.svg" width="152" height="64"
       alt="WITS — Work Intelligence and Thought Science">
</a>
<link rel="icon" href="web/favicon.ico">
```

Use empty alt text for decorative repetitions when adjacent text already
conveys the identity. For implementation review, compare the rendered result
with `guidelines.pdf`: confirm the correct size master, intact italic suffix,
visible cursor, appropriate background, and no unintended frame.
