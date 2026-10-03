# tinybit.studio

The website of Tiny Bit Studio. It has three pages:

| Page | Address | File |
|---|---|---|
| Home: the hero, a room for each app, Studio and Contact | https://tinybit.studio/ | `index.html` |
| Privacy: the website, then a section for each app | https://tinybit.studio/privacy/ | `privacy.md` |
| Not found: shown for any address that doesn't exist | (any unknown address) | `404.html` |

There are no separate app pages and no support page. Each app's details live in its room on the home
page (`/#kozeni`, `/#lark`, `/#michi`) and in its section of the privacy page. Support is the email address in
the home page's Contact section, which the Contact link in every page's header points to.

It's a plain [Jekyll](https://jekyllrb.com) site. GitHub Pages builds it from the `master` branch
(root folder) on every push. There's no workflow or build step of your own.

## Change the title, description or email addresses

They're the first four settings in `_config.yml`:

```yaml
title: Tiny Bit Studio
description: >-
  Tiny Bit Studio makes apps for iPhone and iPad: Kozeni, a private spending and budget tracker, and Lark, for speaking practice.
email: hello@tinybit.studio
support_email: support@tinybit.studio
```

- `title` is the studio's name in the header, the footer and every page title.
- `description` is what search results and link previews show. Keep it under 160 characters.
- `email` is used for every contact link on the site, so changing it here changes all of them.
- `support_email` is where the apps' in-app Feedback emails go. The privacy page names it; change it here if the apps change.

Keep the indentation as it is (two spaces before the description's text).

## Change an app's details

Everything about an app is in `_data/apps.yml`, one entry per app. The comment at the top of that
file explains each field. The ones you're most likely to touch:

- `pitch`: the sentences under the app's name on the home page
- `status` and `status_label`: `available` / "On the App Store" (a filled square), or
  `coming` / "Coming soon" or `development` / "In development" (a hollow square)
- `store`: the App Store link. With a link, the App Store badge appears in the app's room. With
  the block there but the link left empty, the badge appears without a link.
- `points`: the four short points in the app's room
- `label`: the museum label beside the app's icon
- `gloss`: the line under Kozeni's or Michi's name. Delete the line to remove it.

`&nbsp;` in a value keeps the last two words together on one line. Leave it in.

Lark is in App Review, so its room says "Coming soon" and shows the badge without a link. When
Lark is out:

1. Paste its App Store link after `url:` in Lark's `store:` block (Kozeni's shows the form).
2. Set `status: available` and `status_label: On the App Store`.

Its room then shows a working badge and the filled square.

## Addresses for App Store Connect

These stay the same.

| App | Privacy Policy URL | Support URL |
|---|---|---|
| Kozeni | https://tinybit.studio/privacy/#kozeni | https://tinybit.studio/#contact |
| Lark | https://tinybit.studio/privacy/#lark | https://tinybit.studio/#contact |

Apple asks for a Support URL that reaches a page where someone can get help. The home page's
Contact section is that page: it carries the email address and nothing is in the way of it.

If you fill in the optional Marketing URL, use the app's room: https://tinybit.studio/#kozeni.

The part after `#` is the id of a section on that page. If you rewrite `privacy.md`, keep the
`#kozeni` and `#lark` ids there; if you rework `index.html`, keep `id="contact"` (the Support URL)
and `id="kozeni"` (the Marketing URL). Otherwise the links in App Store Connect open at the top of
the page instead of where they should.

## What's where

```
_config.yml          site settings (edit the first four)
_data/apps.yml       every app, in one place
_data/workbench.yml  the commit messages under "From the workbench" on the home page
index.html           the home page
privacy.md           /privacy/
404.html             the not-found page
_layouts/            default (the frame around every page) and doc (the privacy page)
_includes/           the building blocks: header, footer, the logo mark, app icons, plinths,
                     museum labels, the App Store badge, and so on
assets/css/site.css  the one stylesheet
assets/js/site.js    small extras only: the spotlights and the covered sentence
assets/fonts/        Inter Tight and IBM Plex Mono, self-hosted (OFL.txt is their license)
assets/images/       icons/ (app icons), og/ (the link-preview card), badges/ (App Store), logo/
favicon.*, apple-touch-icon.png, icon-*.png, site.webmanifest, robots.txt
                     if you replace the icons, bump the ?v= on their links in _includes/head.html
CNAME                keeps the site on tinybit.studio. Don't delete it.
Gemfile              for previewing the site on your Mac (GitHub Pages ignores it)
```

App icons are named `assets/images/icons/<app>-light-<size>.webp` and `<app>-dark-<size>.webp`,
in sizes 96, 192, 256, 384, 512 and 768.

## Add an app later

1. **Its details:** add an entry to `_data/apps.yml`. Copy an existing one and change everything.
   Its key, such as `kozeni`, is a short lowercase name used everywhere below. Set
   `url: /#<key>` and `privacy: /privacy/#<key>`.
2. **Its icons:** add them to `assets/images/icons/`, named as above.
3. **Its color:** in `assets/css/site.css`, add `--<key>: #……;` next to `--kozeni` and `--lark`,
   in both the light block and the dark block. Pick colors with at least 3:1 contrast against the
   page background. In the dark block, also add `--<key>-gel:` (the dark color at about 6%
   opacity, like `--kozeni-gel`), and put `--<key>-gel: transparent;` in the light block. Then add
   `.is-<key> { --app: var(--<key>); --gel: var(--<key>-gel); }` next to `.is-kozeni`.
4. **Its room on the home page:** in `index.html`, copy Kozeni's room, which is the
   `<article class="room room--kozeni is-kozeni" id="kozeni" …>` block. Change `kozeni` to the new
   key everywhere in it, except in `room--kozeni`, which names the room's layout. At the top of
   the file, next to `{%- assign kozeni = site.data.apps.kozeni -%}`, add the same line for the new
   key. Its footer link appears by itself.
5. **Its privacy section:** add a section to `privacy.md` with the app's key as its id, like the
   existing ones.

An app still in development can have a brief room instead: its status, name, gloss (if it has
one) and pitch, and nothing else. It needs only steps 1 and 3, with just `name`, `status`,
`status_label`, `pitch`, `url` and the color notes in `_data/apps.yml`, and an
`<article class="room room--brief is-<key>" …>` block in `index.html` holding a `room__head` div
(status, name, gloss) and a `room__intro` div (pitch), the way Lark's room starts. It gets its
icons, label and points when it has an icon, and its privacy section when it's close to release.
Michi is at that middle stage: a full room, still "In development", with no privacy section yet.

## Preview it on your Mac

You need Ruby and Bundler. Install the gems once, then serve the site:

```sh
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000. It rebuilds whenever you save; reload the page to see the change.
`bundle exec jekyll build --safe` builds the site into `_site/` the way GitHub Pages does. `_site/`
isn't committed.

## Publish

Commit and push to `master`. That's the only step: GitHub Pages builds and publishes the site,
usually within a minute or two. If a change doesn't appear, the repository's Actions tab shows
GitHub's own "pages build and deployment" run and any error it hit.

## Rules the site keeps

The site has its own small design system: one 12-column grid, three text sizes, no rules or
dividers, and color only from the apps. If a page needs something new, it gets its own stylesheet
instead of a change to the shared one: front matter `styles: [name]` loads `assets/css/name.css`.
