# tinybit.studio

The website of Tiny Bit Studio. It has three pages:

| Page | Address | File |
|---|---|---|
| Home: the first screen, a room for each app with something from the app to try, then the Studio with Contact | https://tinybit.studio/ | `index.html` |
| Privacy: the website, then a part for each app | https://tinybit.studio/privacy/ | `privacy.md` |
| Not found: shown for any address that doesn't exist | (any unknown address) | `404.html` |

There are no separate app pages and no support page. Each app's details live in its room on the home page
(`/#kozeni`, `/#lark`, `/#michi`) and in its part of the privacy page. Support is the email address on the home
page's last screen (Contact), which the Contact link in every page's header points to.

The site's 12-column grid is drawn on every page, in hairlines. The home page goes a screen at a time, and each
screen arrives as columns of its ground, each carrying its strip of the screen's big type (see "How the pages
move" below).

It's a plain [Jekyll](https://jekyllrb.com) site. GitHub Pages builds it from the `main` branch
(root folder) on every push. There's no workflow or build step of your own.

## Change the title, description or email addresses

They're the first four settings in `_config.yml`:

```yaml
title: Tiny Bit Studio
description: >-
  Tiny Bit Studio makes apps for Apple platforms. Every sheet, figure and haptic in them is a decision, not a default.
email: hello@tinybit.studio
support_email: support@tinybit.studio
```

- `title` is the studio's name in the header, the footer and every page title.
- `description` is what search results and link previews show. Keep it under 160 characters. The home page's
  first screen says the same in its own line under the tagline, which is in `index.html` (`g-lede`): change both.
- `email` is used for every contact link on the site, so changing it here changes all of them. The home page's
  last screen also sets it as a poster, sized from the measured widths of hello@tinybit.studio's lines (`--mail-w`
  in `grid.css`). With another address, measure it again before you publish, or it runs over the words beside it.
- `support_email` is where the apps' in-app Feedback emails go. The privacy page names it; change it here if the apps change.

Keep the indentation as it is (two spaces before the description's text).

## Change an app's details

Everything about an app is in `_data/apps.yml`, one entry per app, in the order of the rooms. The
comment at the top of that file explains each field. The ones you're most likely to touch:

- `pitch`: the sentence beside the app's name in its room. Keep it to one short sentence, about as
  long as the others'.
- `gloss`: the line over Kozeni's or Michi's pitch. Delete the line to remove it.
- `store`: the App Store link. With a link, the App Store badge in the app's room links there. With
  the block there but the link left empty, the badge appears without a link; without the block, there's no badge.
- `icon_alt`: what the app's icon shows, read out in place of the icon.

The colors:

- `room` and `room_dark`: the ground its room is painted in, in light and dark mode. Its columns rise in this
  color on the home page, and its part of the privacy page opens on a band of it.
- `room_text`: `light` for white text on that ground, or `dark` for ink. Everything in the room is
  in that ink, the quietest of it at 84% (92% in an ink room at night), so pick a ground that gives that at least
  4.5:1 in both modes: white needs a deep color (Lark's own color gives even full white only 4:1, which is why its
  room is a deeper teal).
- `color` and `color_dark`: the app's own color, in light and dark mode, for its bits on the page's canvas: the
  square bits of its part's lists on the privacy page, and the underline of the privacy page's link to that part
  when it's hovered. Keep at least 3:1 against the page (#F8F9FA in light mode, #121315 in dark), and never use
  them for text. In its own room everything is in the room's ink.

And `exhibit`: the include in `_includes/exhibits/` holding the piece of the app you can try in its
room (Michi's album, Lark's covered sentence, Kozeni's keypad).

`&nbsp;` in a value keeps the words on either side of it together on one line. Leave it in.

When an app comes out, paste its App Store link after `url:` in its `store:` block. Its room then shows a
working badge. (`status` and `status_label` are notes for now: no page shows them.)

## Addresses for App Store Connect

These stay the same.

| App | Privacy Policy URL | Support URL |
|---|---|---|
| Kozeni | https://tinybit.studio/privacy/#kozeni | https://tinybit.studio/#contact |
| Lark | https://tinybit.studio/privacy/#lark | https://tinybit.studio/#contact |
| Michi | https://tinybit.studio/privacy/#michi | https://tinybit.studio/#contact |

Apple asks for a Support URL that reaches a page where someone can get help. The home page's
last screen is that page: it carries the email address and nothing is in the way of it.

If you fill in the optional Marketing URL, use the app's room: https://tinybit.studio/#kozeni.

The part after `#` is the id of a section on that page. The rooms are made from `_data/apps.yml`, so
their ids are the apps' keys there, `kozeni`, `lark` and `michi` (Marketing URLs): keep the keys.
`id="contact"` (the Support URL) is in `index.html`. If you rewrite `privacy.md`, keep the
`#kozeni`, `#lark` and `#michi` ids there (Michi's You page links to `#michi` too).
Otherwise the links in App Store Connect open at the top of the page instead of where they should.

## What's where

```
_config.yml          site settings (edit the first four)
_data/apps.yml       every app, in one place, colors and rooms included
index.html           the home page: the first screen, a room for each app, then the Studio with Contact
privacy.md           /privacy/
404.html             the not-found page
_layouts/            default.html (the frame around every page) and doc.html (the privacy page's layout: its
                     first screen, its parts on bands of their apps' colors, and the end)
_includes/           the building blocks: head.html, header.html and footer.html; grid-runner.html (the home
                     page's running index of the apps) and grid-letters.html (its tagline, a letter at a time);
                     doc-head.html and doc-runner.html (the privacy page's copies of the header, and its running
                     index of the parts); lost-title.html (the not-found page's title); address.html (the email
                     address, its dots drawn as bits), the logo mark, app icons, the App Store badge, the arrow
                     link; and exhibits/, each app's piece to try: michi.html (Michi's album, drawn in
                     album.html), lark.html (covered.html and rhythm.html) and kozeni.html (the keypad)
assets/css/          site.css (the system: grid, type, colors, the header and the footer); grid.css (the home
                     page); doc.css (the privacy page); lost.css (the not-found page); michi.css, lark.css and
                     kozeni.css (the exhibits)
assets/js/           site.js (the shared part, which runs first); grid.js (the home page: its screens and
                     their columns, the keys and the wheel, the arrivals, the lens); doc.js (the privacy page:
                     its header, its running index, its parts' arrivals); lost.js (the not-found page's
                     arrival and lens); album.js, lark.js and kozeni.js (the exhibits)
assets/fonts/        Inter Tight and IBM Plex Mono, self-hosted (OFL.txt is their license)
assets/images/       icons/ (app icons), og/ (the link-preview card), badges/ (App Store), logo/
favicon.*, apple-touch-icon.png, icon-*.png, site.webmanifest, robots.txt
                     if you replace the icons, bump the ?v= on their links in _includes/head.html
CNAME                keeps the site on tinybit.studio. Don't delete it.
Gemfile              for previewing the site on your Mac (GitHub Pages ignores it)
```

App icons are named `assets/images/icons/<app>-light-<size>.webp` and `<app>-dark-<size>.webp`,
in sizes 256, 384, 512 and 768.

Each page brings its own stylesheet and script in its front matter (`styles:` and `scripts:`), and a class for its
`<body>` (`body_class:`): `proto-grid` on the home page, `proto-grid-doc` on the privacy page, `proto-grid-lost`
on the not-found page. Those class names, and the `g-`, `gd-` and `gl-` that begin the classes inside each page,
keep the prefixes they had while the pages were drafts. The files have plain names; the classes were left as they
are because every rule and script refers to them.

## Add an app later

1. **Its details:** add an entry to `_data/apps.yml`. Copy an existing one and change everything.
   Its key, such as `kozeni`, is a short lowercase name used everywhere below. Set
   `url: /#<key>` and `privacy: /privacy/#<key>`, its colors and its room's colors. Its place in the
   file is its room's place on the home page, and its number there (04 for a fourth).
2. **Its icons:** add them to `assets/images/icons/`, named as above. Every room shows its app's icon.
3. **Its privacy part:** add a section to `privacy.md` like the existing ones, between rules (`---`), with the
   app's key as its id (`{: #<key> .display}` under its heading).

Its room on the home page, its entry in the running index over the rooms, its link in the footer, and its band
and its place in the running index on the privacy page come by themselves. Its room is laid out as one of the
first three's, and keeps that one's time, by its place: a fourth app's as Michi's, a fifth's as Lark's, a
sixth's as Kozeni's. A piece of the app to try in its room is optional and needs a developer: an include in
`_includes/exhibits/`, with its own CSS and JS listed in `index.html`'s `styles:` and `scripts:`.

The pages were made for three apps. With a fourth, check its room and the header's running index on a phone
and on a laptop, in light and dark mode, before you publish.

Michi's album is drawn in `_includes/album.html`: five trips' stamps, each an inline SVG in the
trip's ink, with Michi's own proportions. Their coasts come from Natural Earth's public-domain map
data, projected as Michi frames a trip's stops, so a new trip means drawing a new stamp rather
than editing a line.

## How the pages move

The home page is a run of screens: the first (the tagline and the line about the studio), a room for each app, and
the Studio with Contact. It goes a screen at a time, whether by the keys, the wheel, a trackpad or a finger: one
press or swipe, one screen. Each screen after the first arrives as twelve columns of its ground (six on a phone),
each carrying its strip of the screen's big type (a room's name and number, the Studio's motto), so the name is
built a column at a time; each app's columns keep its own time (Michi's struck home left to right like a postmark,
Lark's as a call and its echo, Kozeni's counted in like coins), and the Studio's come down as a curtain. Over the
rooms the header carries a running index, 01 Michi 02 Lark 03 Kozeni. The page opens on the void, the ink with only
the mark lit, for 0.3s, and then the first screen, or the room the address names, strikes up over it. The privacy
page's first screen and the not-found page open the same way; the privacy page's parts arrive as their bands come up
the screen, each in its app's time.

It's all in each page's own files (`grid.css` and `grid.js`, `doc.css` and `doc.js`, `lost.css` and `lost.js`),
whose comments say how each part works and why. The home page's keys and wheel (`grid.js`, "Keys and the
wheel") were tuned against a real trackpad in Safari: change that part only to fix a fault you can reproduce.

Without JavaScript, with Reduce Motion on, in forced colors and on paper, nothing moves: the home page's screens
simply stack, edge to edge, and the other two pages are there whole. On a screen too short for its rooms (a phone
held sideways) the home page's screens stack the same way.

The big type's sizes are measured from Inter Tight: the tagline set to the measure so its square full stop ends
on the right margin, each app's name on whole columns, the address on the last screen. The numbers are in
`grid.css`, with what was measured beside them. If the tagline's words, an app's name, the email address or the
font file change, measure them again, or the type leaves the lines it's set on.

## Preview it on your Mac

You need Ruby and Bundler. Install the gems once, then serve the site:

```sh
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000. It rebuilds whenever you save; reload the page to see the change.
The one exception is `_config.yml`: after changing it, stop the server (Control-C) and start it again.
`bundle exec jekyll build --safe` builds the site into `_site/` the way GitHub Pages does. `_site/`
isn't committed.

macOS's own Ruby is 2.6, and the newest github-pages gem (232, which a fresh `bundle install` picks)
needs Ruby 3. Either install a newer Ruby, or use a Gemfile that pins github-pages to 231, which runs
on 2.6. This Mac has one in `vendor/Gemfile`, its gems installed beside it (`vendor/` isn't
committed): serve with `BUNDLE_GEMFILE=vendor/Gemfile bundle exec jekyll serve`, and put the same
`BUNDLE_GEMFILE=vendor/Gemfile` in front of the build command.

## Publish

Commit and push to `main`. That's the only step: GitHub Pages builds and publishes the site,
usually within a minute or two. Commit every file a change adds or removes, not only the ones it
edits. A file still untracked (`git status` lists it under "Untracked files") isn't pushed: without
an include or a layout, GitHub's build fails and the site stays as it was; without a stylesheet, a
script or an image, the page is published without it. If a change doesn't appear, the repository's
Actions tab shows GitHub's own "pages build and deployment" run and any error it hit.

## Rules the site keeps

The site has its own small design system: one 12-column grid, drawn on every page in hairlines; three text
sizes for reading (display, text, and the mono meta); and no rules or dividers between things: space and the
rooms' grounds do the dividing. Color comes only from the apps: the grounds of their rooms, and their bits on the
page's canvas, never text. The big type breaks the second rule on purpose: the tagline, each room's name and
number, and the Studio's address are set to the grid, as posters.

Everything a page loads comes from this site: the fonts, images, stylesheets and scripts in `assets/`, and the
icons and the manifest at the root, so a visit is never seen by anyone else.

If a page needs something new, it gets its own stylesheet instead of a change to the shared one:
front matter `styles: [name]` loads `assets/css/name.css`, and `scripts: [name]` loads
`assets/js/name.js`.
