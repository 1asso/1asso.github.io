---
layout: doc
title: Privacy
description: "How the Tiny Bit Studio website and its apps, Kozeni and Lark, handle your data: no accounts, no analytics, ads or tracking, and nothing collected by us."
permalink: /privacy/
updated: 2026-09-30
---
{% comment %}
  One privacy policy for the website and both apps. App Store Connect links to /privacy/#kozeni
  and /privacy/#lark, so keep the ids set below ({: #website .display}, {: #kozeni .display} and
  {: #lark .display}) as they are. When anything here changes, change the text and the updated:
  date above.
  A margin label is a short line with {: .margin} under it. Written as a heading ("### iCloud"),
  it also names that part of the page for screen readers, so the labels inside a section are
  headings; the "Privacy" line beside each section's title is a label only.
{% endcomment %}
In short
{: .margin}

This page covers this website and our two apps, Kozeni and Lark. We don’t collect your data. None of them needs an account, and none has analytics, ads or tracking of our own. What you keep in the apps stays on your device and in your own iCloud, apart from what Lark sends to the services you use through it, such as YouTube. Nothing that identifies you reaches us unless you write to us.

Each has its own section below: [this website](#website), [Kozeni](#kozeni) and [Lark](#lark).

---

Privacy
{: .margin}

## This website
{: #website .display}

### In short
{: .margin}

We collect nothing through this website. It sets no cookies and has no analytics, ads or tracking. Everything a page loads, fonts and images included, comes from this site, so your browser contacts no one else.

### GitHub
{: .margin}

The site is a set of static pages hosted by GitHub Pages. GitHub [logs and stores visitors’ IP addresses](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#data-collection) for security, whether or not they’re signed in to GitHub. The [GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) covers that.

### Email
{: .margin}

If you write to us, at [{{ site.email }}](mailto:{{ site.email }}) or from one of the apps, we use your message and your address to reply, and to fix what you report. We don’t share them, and we don’t add you to any list. We keep them only as long as we need them for that, and we’ll delete them, with your address, whenever you ask.

### Links
{: .margin}

Links to the App Store and other sites take you to services with privacy policies of their own.

---

Privacy
{: .margin}

## Kozeni
{: #kozeni .display}

### In short
{: .margin}

Kozeni collects no data. What you enter stays on your device and, if you use iCloud, in your own private iCloud database, where we can’t see it. There’s no account, no server of ours, and no analytics, ads or tracking.

### Settings
{: .margin}

The paths below start in Kozeni’s Settings. On iPhone, tap the four‑squares button at the bottom of the screen, then Settings; on iPad, Settings is in the sidebar.

### On your device
{: .margin}

Kozeni keeps your entries (amount, expense or income, category, note, date and how it repeats), categories, recurring items and budgets in a database on your device, along with your settings and the highlights Insights has picked. For the Home Screen widget, it writes a short summary to storage it shares only with the widget: your totals for the week, month and year, and your latest entries with their notes and amounts. The widget makes no network requests. Kozeni has no networking code of its own; it goes online only through Apple’s iCloud and App Store, as described below.

### iCloud
{: .margin}

If iCloud is on for Kozeni, your entries, categories, recurring items and budgets sync between your devices through Apple’s CloudKit, in your iCloud account’s private database. Entries in Recently deleted sync too, until they’re removed. Your settings, the widget’s summary and the saved highlights stay on each device, and the tip unlock syncs separately (see Tips). Kozeni has no sync switch of its own: it follows iCloud, which you can turn off for Kozeni in the Settings app, under your name&nbsp;→ iCloud. [Apple’s privacy policy](https://www.apple.com/legal/privacy/en-ww/) covers iCloud.

### Shortcuts
{: .margin}

Kozeni can log Apple Pay purchases for you through a shortcut. Settings&nbsp;→ Preferences&nbsp;→ Shortcuts&nbsp;→ Add automation opens a ready-made shortcut from iCloud; you add it, then turn it on in the Shortcuts app, and iOS asks your permission the first time it runs. Each time, the shortcut hands Kozeni a note (the merchant’s name, for example), an amount, a date, whether it’s an expense or income, and, optionally, a category name. Kozeni saves them as an entry, which syncs like any other. It never reads Wallet or your cards itself; it gets only what the shortcut passes in.

### Apple Intelligence
{: .margin}

Where Apple Intelligence is available and turned on, Kozeni uses Apple’s on-device model in two places. It makes no network request for either, and the results stay on your device.

- **Highlights.** Kozeni writes the Insights highlights itself, from the period’s figures. The model is given those lines, which can include amounts, percentages, category names, weekdays or months, and the note of the period’s largest expense or income, cut to 40&nbsp;characters. It only chooses which lines to show. Without Apple Intelligence, Kozeni shows its top-ranked lines instead. Settings&nbsp;→ Reset&nbsp;→ Reset AI analysis clears the saved ones.
- **Categories for logged purchases.** When the shortcut passes no category name, Kozeni looks for an earlier entry with the same note, then for your default category. If it finds neither, the model is given the entry’s type, amount and note, the names of your categories of that type, and up to eight of your recent notes with the categories you gave them. It answers with one of your categories, or none. This happens only while Smart category is on and no default category is set, both in Settings&nbsp;→ Preferences&nbsp;→ Shortcuts.

### Notifications
{: .margin}

If you turn them on in Settings&nbsp;→ Preferences&nbsp;→ Notifications, Kozeni schedules its reminders on your device: a daily reminder to log, and a reminder when a recurring item is due, which shows the item’s note or category, its amount and how often it repeats. Nothing is sent from a server. Reminders appear wherever your notification settings allow, such as the Lock Screen.

### Tips
{: .margin}

The tip jar, in Settings&nbsp;→ Support, offers three tips through Apple’s App Store. Apple handles the payment, and we never see your payment details. Kozeni stores only the fact that you’ve tipped, on your device and in your iCloud key-value storage, so the extra Theme colors a tip unlocks follow you to your other devices. It keeps no receipt, amount or date.

### Ratings
{: .margin}

After your first ten entries or three days, whichever comes first, Kozeni asks iOS a single time to show Apple’s rating prompt. It isn’t told what you choose.

### Feedback
{: .margin}

Settings&nbsp;→ Support&nbsp;→ Feedback opens a draft email to {{ site.support_email }} in your mail app, with the subject “Kozeni feedback”. Below the space for your message, under “Info”, it fills in Kozeni’s version and build, your system’s name and version (iOS or iPadOS), and your device’s model identifier, such as iPhone17,1. It adds nothing else. You can change any of it, and nothing is sent unless you send it. We use your message only to reply and to fix what you report, and we don’t share it.

### Export and import
{: .margin}

Settings&nbsp;→ Backup&nbsp;→ Export data makes three CSV files, of your entries, categories and budgets, and hands them to the share sheet; where they go next is up to you. They leave out Recently deleted, your settings and the saved highlights. Kozeni writes them to its temporary folder on your device, where they stay until iOS clears it. Import data reads one CSV file that you pick and adds its rows to Kozeni. Kozeni can’t open any file you haven’t picked.

### Deleting
{: .margin}

- **An entry.** Deleting an entry moves it to Settings&nbsp;→ Library&nbsp;→ Recently deleted, where you can swipe left on it to restore it within seven days. After that, it’s removed for good the next time Kozeni opens. The bin button at the top right clears everything there at once.
- **Everything.** Settings&nbsp;→ Reset&nbsp;→ Erase all data deletes every entry (Recently deleted included), category, recurring item and budget, and the saved highlights. It offers to export first. With iCloud on, the deletion syncs, so it all goes from your other devices and from iCloud too. Your settings and the tip unlock stay, and the widget’s summary is replaced the next time you return to Kozeni.
- **The app.** Deleting Kozeni deletes its data from that device. Backups of your device keep a copy until they’re replaced or deleted.
- **iCloud.** Your data stays in iCloud, and on your other devices, until you delete it there. To remove it everywhere, use Erase all data before you delete the app. You can also delete Kozeni’s iCloud data from iCloud storage in the Settings app.

Apart from Recently deleted, nothing expires on its own: Kozeni keeps your data until you delete it.

### Analytics
{: .margin}

Kozeni contains no analytics, crash reporting, advertising or tracking code, and no third-party libraries. It doesn’t use the advertising identifier or ask to track you. If you’ve turned on Share With App Developers, in the Settings app under Privacy & Security&nbsp;→ Analytics & Improvements, Apple may give us anonymous crash reports and aggregated statistics about how Kozeni is used. Those come from Apple, under Apple’s privacy policy, not from anything in Kozeni.

### Children
{: .margin}

Kozeni collects no data from anyone, children included.

---

Privacy
{: .margin}

## Lark
{: #lark .display}

### In short
{: .margin}

Lark is in development and isn’t on the App Store yet, so this section describes the version we’re preparing for release. There’s no account, no server of ours, and no analytics, ads or tracking. Lark transcribes, translates and explains on your device. Data leaves the device only for the services you use through Lark, listed below, and for your own iCloud.

### Going online
{: .margin}

Apart from syncing with your iCloud, and loading the artwork of what’s on screen, Lark goes online only to do something you’ve asked of it. Below is every place it connects to, and what it sends. Each request also carries your IP address, as any request does, and the service that receives it handles it under its own policy. Lark sets and reads no cookies of its own; as in any app, iOS keeps the ones a server sets and sends them back to that server.

### Podcast search
{: .margin}

When you search, Lark sends what you’ve typed to Apple’s podcast directory (the iTunes Search API), shortly after you stop typing or when you press Search. Opening a show sends the show’s ID, to list its episodes. Artwork, in results and on your library’s cards, loads from the addresses the directory returns whenever it’s shown. [Apple’s privacy policy](https://www.apple.com/legal/privacy/en-ww/) applies. Your last ten searches are kept on your device until you clear them.

### Podcasts
{: .margin}

Episodes stream from their publishers’ servers, often by way of services that count downloads for the publisher. When you make an AI transcript of an episode, Lark downloads the whole episode from the same address and keeps it on your device, so the transcript matches what you hear. When it makes a transcript of an episode whose language is set to Automatic, it also reads the start of the podcast’s feed to find out the language. Publishers, and the services they use, see these requests as they would from any podcast app.

### YouTube
{: .margin}

YouTube is Google’s, and [Google’s privacy policy](https://policies.google.com/privacy) applies to everything YouTube receives through Lark.

- **Adding a video.** Lark sends the video’s link to YouTube for its title, channel and thumbnail, and the thumbnail loads from YouTube whenever its card is shown.
- **Captions and audio.** When Lark fetches a video’s captions (by default, as soon as you add it) or makes an AI transcript of it, it asks YouTube for the video’s caption tracks and audio streams, then downloads the captions in the material’s language, or the audio. Lark’s part of each request is the video’s ID, with a fixed language (English), region (US) and time zone in place of yours, and nothing about your device; iOS adds its usual headers, as it does for any app. Downloaded audio is deleted as soon as the transcript is done, or if it fails or you cancel it.
- **Playing.** Videos play in YouTube’s own embedded player, inside Lark. It runs YouTube’s scripts, which can store cookies and similar data on your device and collect information as YouTube’s player does anywhere. That data is stored on your device, and Lark never reads it.

### Speech models
{: .margin}

The first time you make an AI transcript in a language, Lark asks iOS for Apple’s speech model for that language, and iOS downloads it from Apple.

### iCloud
{: .margin}

When your device is signed in to iCloud, Lark syncs a small record between your devices through iCloud key-value storage, in your own iCloud account. For each card, it holds:

- its ID, title and author
- its kind and source: a YouTube video ID, a podcast episode’s address, or a note that the file is on one device only
- its language, level and length
- how many sentences it has and how many you’ve practiced, where you left off, how long you’ve practiced it and whether it’s done
- when you added it, last practiced it and last changed it
- the addresses of its artwork (if it’s online), source page and podcast feed

It also holds the days you practiced and when you last reset them, and the ID and date of each material you delete, kept for 180&nbsp;days so it’s deleted on your other devices too. Files you import don’t sync, but their cards’ titles and authors do. A video from Files is titled with its file name; an audio file takes its title and artist (or album) from its own tags, or its file name if it has none. A renamed card syncs under its new name.

Media files, transcripts, card stills, recordings, explanations, settings and recent searches never sync. Lark has no switch for this; without an iCloud account, it works on the device alone.

### Tips
{: .margin}

The tip jar, in You&nbsp;→ Support, offers three tips through Apple’s App Store. Apple handles the payment, and we never see your payment details. A tip unlocks nothing, and Lark stores nothing about it.

### Feedback
{: .margin}

You&nbsp;→ Support&nbsp;→ Send Feedback opens a draft email to {{ site.support_email }} in your mail app, with the subject “Lark feedback”. Below the space for your message, under “Info”, it fills in Lark’s version and build, your system’s name and version, and your device’s model identifier, such as iPhone17,1. It adds nothing else. You can change any of it, and nothing is sent unless you send it. We use your message only to reply and to fix what you report, and we don’t share it.

### Other apps
{: .margin}

“Open in YouTube”, “Open in Podcasts” and “Open source page” hand the link to that app, or to Safari. What happens there is up to that app and its policy.

### Microphone
{: .margin}

Lark uses the microphone only if you turn on Record Attempts, which is off by default, and it asks your permission the first time. It records only during your turn: one file per sentence, replaced each time you try again, in Lark’s temporary folder. Each recording plays back once, after your turn. All of them are deleted when the drill ends, and they’re never uploaded or synced. If you don’t allow the microphone, drills work without recording. If Lark is stopped in the middle of a drill, its recordings are left in the temporary folder until iOS clears it.

### On your device
{: .margin}

Apple’s Speech framework makes the AI transcripts. Apple’s Translation framework makes the translations, using only languages already on your device. Apple’s on-device model writes the explanations. Language detection runs on the device too. Lark makes no network request of its own for any of them. To explain a sentence, the model is given the sentence, its translation (when there is one), the names of the language you’re studying and of your own language, and your device’s locale. When it has to write the meaning itself, it also gets the lines before and after. Explanations are kept in memory only, until Lark quits.

### Storage
{: .margin}

Lark keeps your library on your device: each material’s details and transcripts, your progress, the files you import from Photos or Files (copied in), the podcast episodes it downloads for transcripts, and card stills, including an audio file’s own cover art. Your settings, practice days and recent searches are kept there too, and so is whatever YouTube’s player stores. Temporary audio made while transcribing is deleted when Lark is done with it. Lark doesn’t keep its files out of your device’s backups, so a backup to iCloud or a computer includes them.

Lark can’t see your photo library or your files. It gets only the item you pick, through the system’s picker, which may first download it from iCloud Photos.

### Deleting
{: .margin}

- **A material.** Deleting one removes its card, its transcript, your progress in it, and the file it played from, unless another material uses the same file. The deletion syncs, so it goes from your other devices too. Marking a material Done deletes nothing.
- **Your practice record.** You&nbsp;→ Reset Practice Record forgets every day you’ve practiced, on this device and your other devices. Your library and progress stay.
- **Leftover files.** You&nbsp;→ Storage&nbsp;→ Clear Out Unused Files deletes files no material uses, such as a canceled transcript’s audio.
- **Recent searches.** Clear, on the search page, removes them.
- **The app.** Deleting Lark deletes everything it keeps on the device, including YouTube’s player data. Backups of your device keep a copy until they’re replaced or deleted.
- **iCloud.** Lark doesn’t erase what it has synced to iCloud key-value storage, so that may stay in your iCloud account after you delete the app. To leave as little as possible there, delete your materials and reset your practice record first: then only the IDs and dates of what you deleted, and the date of the reset, remain.

### Analytics
{: .margin}

Lark contains no analytics, crash reporting, advertising or tracking code, and no third-party libraries. It doesn’t use the advertising identifier or ask to track you. It writes a few notes to the device’s own system log, such as a material’s title when its transcript is done, and doesn’t collect them. Once Lark is on the App Store, Apple may give us anonymous crash reports and aggregated statistics about how it’s used, under Apple’s privacy policy. That happens only if you’ve turned on Share With App Developers, in the Settings app under Privacy & Security&nbsp;→ Analytics & Improvements.

### Children
{: .margin}

Lark collects no data from anyone, children included. YouTube and the other services you use through it have policies of their own.

---

## Changes to this policy
{: #changes}

If what this website or either app does with your data changes, we’ll update this page and the date at the top. Before Lark is released, we’ll check its section against the version that ships.

## Contact
{: #contact}

Write to [{{ site.email }}](mailto:{{ site.email }}) with any question about privacy, or about this page.
