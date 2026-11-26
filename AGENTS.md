# Agent notes

Context that isn't obvious from the code. Content how-tos: `_templates/README.md`.

## Decisions (made with the owner)

- **Plain static HTML, no build step**, by choice ("migrate later"). Header, nav and footer are duplicated in every page, `404.html` and `_templates/*.html`; edit all of them together.
- **Name**: "Work, Intelligence, and Thought Science" (commas required); "WITS" in prose. The lockup artwork in `logo/` predates the commas, so don't use it. The header uses `plain.svg` plus a real-text descriptor.
- `logo/` is the designer's handoff (see `logo/IDENTITY-HANDOFF.md`). Treat it as read-only source.
- **Tone**: the lab is not a personal site. Avoid director-centric copy, and keep author names off the research list.
- **Texture (final, signed off)**: warm paper, a static grain behind the content (`assets/img/texture/grain.svg`), the fan hero, and cursor-rule dividers. It evolved from variant 9 in `_explorations/texture/`, whose `gen_svgs.py` generates `fans.svg`. The owner rejected animated grain and cursor effects as distracting and CPU-heavy.
- **Home typing demo**: phrases must keep the W-I-T-S initials and make sense as a whole. The pause button was removed at the owner's request, despite WCAG 2.2.2.
- The owner dislikes excess vertical whitespace.

## Constraints

- A CSP `<meta>` on every page allows `'self'` only: no inline scripts or styles, no `data:` URIs, no third-party assets. The footer promises no cookies or tracking.
- Never write the contact email in plain text. It's encoded in `assets/js/contact.js`, with CSS decoys in the footer.
- `--slate` (#77838e) fails AA for small text. Use `--slate-text` for small text.
- Placeholders use `.is-open`, styled as greyed-out "unaccepted suggestions".

## Open items

- `people/ada-example/` is a dummy profile (noindex); remove it once real profiles exist.

## Tooling

- Preview with `python3 -m http.server 8765` from the repo root. It doesn't serve `404.html`; GitHub Pages does.
- For reliable full-page screenshots, use headless Edge: `"/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" --headless=new --window-size=1280,1000 --screenshot=out.png URL`. It has a minimum width of about 500px.
