# Editing the WITS Lab site

The site is plain static HTML with no build step. GitHub Pages serves the files
as they are. Folders starting with `_` (like this one) are not published.

Every page repeats the same `<head>`, header and footer. If you change the
navigation or footer, update it in every `index.html` and in `404.html`.
Mark the current page in the navigation with `aria-current="page"`.

Placeholders use the class `is-open`, which renders them as greyed-out italic
"suggestions". Delete a placeholder once real content replaces it.

## News: `news/index.html` (and the latest three on the home page)

Newest first, inside `<ul class="entries">`:

```html
<li class="entry">
  <span class="entry-meta"><time datetime="2027-01-31">31 January 2027</time></span>
  <span class="entry-title"><a href="https://example.com">Headline</a></span>
  <p class="entry-text">Optional one-sentence summary.</p>
</li>
```

## Press: `press/index.html`

```html
<li class="entry">
  <span class="entry-meta">Outlet name · <time datetime="2027-01-31">Jan 2027</time></span>
  <span class="entry-title"><a href="https://example.com">Article headline</a></span>
</li>
```

## Blog: `blog/post-slug/index.html`

1. Copy `_templates/blog-post.html` to `blog/post-slug/index.html`.
2. Fill in the title, description, canonical URL, date and body.
3. Add an entry to `blog/index.html` (same markup as news).
4. Add an item to `blog/feed.xml`, newest first:

```xml
<item>
  <title>Post title</title>
  <link>https://witslab.org/blog/post-slug/</link>
  <guid>https://witslab.org/blog/post-slug/</guid>
  <pubDate>Sun, 31 Jan 2027 09:00:00 +0000</pubDate>
  <description>One-sentence summary.</description>
</item>
```

5. Add the post URL to `sitemap.xml`.

## Experiments: `experiments/index.html`

Prototypes are hosted elsewhere; this page links out to them.

```html
<li class="card">
  <span class="card-kicker">Live prototype</span>
  <h3 class="card-title">Experiment name</h3>
  <p class="card-text">What it is and what it explores.</p>
  <ul class="card-links">
    <li><a href="https://example.com">Try it</a></li>
    <li><a href="https://example.com">Download</a></li>
    <li><a href="https://github.com/example">Source</a></li>
  </ul>
</li>
```

## Partners: `partners/index.html`

Put logo files in `assets/img/partners/` (SVG preferred).

```html
<li class="partner">
  <span class="partner-logo"><img src="/assets/img/partners/name.svg" alt=""></span>
  <span class="partner-name"><a href="https://example.com">Partner name</a></span>
</li>
```

## Careers: `careers/index.html`

```html
<li class="entry">
  <span class="entry-meta">Closes <time datetime="2027-03-01">1 March 2027</time></span>
  <span class="entry-title"><a href="https://example.com">Postdoctoral researcher in …</a></span>
  <p class="entry-text">One-sentence summary of the role.</p>
</li>
```

## People: `people/index.html` and `people/firstname-lastname/index.html`

Each person has a card on the People page and their own profile page.

1. Copy `_templates/person.html` to `people/firstname-lastname/index.html`.
   Fill in the title, description, canonical URL, role, institution, links,
   bio and highlighted work. Delete the `noindex` line and the
   "Sample profile" flag.
2. Add a card to the right group on `people/index.html`, replacing an
   `is-open` placeholder:

```html
<li class="person">
  <img class="portrait" src="/assets/img/people/firstname-lastname.jpg" width="240" height="240" alt="" loading="lazy" decoding="async">
  <span class="person-text">
    <a class="person-name" href="/people/firstname-lastname/">Firstname Lastname</a>
    <span class="person-affiliation">Their lab or institution</span>
  </span>
</li>
```

3. Add the profile URL to `sitemap.xml`.

Portraits go in `assets/img/people/`: a square 240 × 240 px JPEG for the
card and a square 640 × 640 px JPEG for the profile page.

`people/ada-example/` is a dummy profile showing the layout. Delete it, its
card, and `assets/img/people/ada-example.svg` once real profiles exist.

## Social links: footer of every page

Replace each `<span class="soon">LinkedIn</span>` with
`<a href="https://…">LinkedIn</a>`, then delete the "Social profiles coming
soon" note.

## Contact email

The address is obfuscated against spam harvesters. The visible fallback is the
`data-contact` span in each footer; the encoded address is in
`assets/js/contact.js`. Never write the plain address anywhere in the HTML.
