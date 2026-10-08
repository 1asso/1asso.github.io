---
layout: doc
title: Privacy
description: "How the Tiny Bit Studio website and its apps, Kozeni, Lark and Michi, handle your data: no accounts, no analytics, ads or tracking, and nothing collected by us."
permalink: /privacy/
updated: 2026-10-08
---
{% comment %}
  One privacy policy for the website and all three apps. App Store Connect links to
  /privacy/#kozeni, /privacy/#lark and /privacy/#michi, and Michi's You page links to
  /privacy/#michi, so keep the ids set below ({: #website .display}, {: #kozeni .display},
  {: #lark .display} and {: #michi .display}) as they are. When anything here changes, change the
  text and the updated: date above.
  A margin label is a short line with {: .margin} under it. Written as a heading ("### iCloud"),
  it also names that part of the page for screen readers, so the labels inside a section are
  headings; the "Privacy" line beside each section's title is a label only.
{% endcomment %}
In short
{: .margin}

This page covers this website and our three apps, Kozeni, Lark and Michi. We don’t collect your data. None of them needs an account, and none has analytics, ads or tracking of our own. What you keep in the apps stays on your device and in your own iCloud, apart from the trips you share in Michi, which go to the people you invite, and what Lark and Michi send to the services they use, such as YouTube and Apple Maps. Nothing that identifies you reaches us unless you write to us.

Each has its own section below: [this website](#website), [Kozeni](#kozeni), [Lark](#lark) and [Michi](#michi).

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

If iCloud is on for Kozeni, your entries, categories, recurring items and budgets sync between your devices through Apple’s CloudKit, in your iCloud account’s private database. Entries in Recently deleted sync too, until they’re removed. Your settings, the widget’s summary and the saved highlights stay on each device, and Kozeni Pro doesn’t sync through iCloud at all: each device asks the App Store (see Kozeni Pro). Kozeni has no sync switch of its own: it follows iCloud, which you can turn off for Kozeni in the Settings app, under your name&nbsp;→ iCloud. [Apple’s privacy policy](https://www.apple.com/legal/privacy/en-ww/) covers iCloud.

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

### Kozeni Pro
{: .margin}

Kozeni Pro, in Settings&nbsp;→ Support, is one purchase through Apple’s App Store, not a subscription. It unlocks the extra Theme colors. Apple handles the payment, and we never see your payment details. Kozeni asks the App Store whether your Apple Account has Kozeni Pro, bought on any of your devices or shared with you through Family Sharing, and keeps only the answer: on your device, and in the storage it shares with the widget, so the widget can use the colors Pro unlocks. It keeps no receipt, amount or date.

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
- **Everything.** Settings&nbsp;→ Reset&nbsp;→ Erase all data deletes every entry (Recently deleted included), category, recurring item and budget, and the saved highlights. It offers to export first. With iCloud on, the deletion syncs, so it all goes from your other devices and from iCloud too. Your settings and Kozeni Pro stay, and the widget’s summary is replaced the next time you return to Kozeni.
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

There’s no account, no server of ours, and no analytics, ads or tracking. Lark transcribes, translates and explains on your device. Data leaves the device only for the services you use through Lark, listed below, and for your own iCloud.

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

Media files, transcripts, card stills, recordings, explanations, settings, recent searches and the weekly count of AI transcripts never sync. Lark has no switch for this; without an iCloud account, it works on the device alone.

### Lark Pro
{: .margin}

Lark Pro, in You&nbsp;→ Support, is one purchase through Apple’s App Store, not a subscription. It takes the limit off AI transcripts and unlocks every accent color. Apple handles the payment, and we never see your payment details. Lark asks the App Store whether your Apple Account has Lark Pro, bought on any of your devices or shared with you through Family Sharing, and keeps only the answer, on your device. It keeps no receipt, amount or date.

Without Lark Pro, Lark makes three AI transcripts a week. To count them, it keeps a note of each AI transcript you ask for (the material’s ID and the time) and the earliest and latest times your device’s clock has shown, on your device only.

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

Lark contains no analytics, crash reporting, advertising or tracking code, and no third-party libraries. It doesn’t use the advertising identifier or ask to track you. It writes a few notes to the device’s own system log, such as a material’s title when its transcript is done, and doesn’t collect them. If you’ve turned on Share With App Developers, in the Settings app under Privacy & Security&nbsp;→ Analytics & Improvements, Apple may give us anonymous crash reports and aggregated statistics about how Lark is used. Those come from Apple, under Apple’s privacy policy, not from anything in Lark.

### Children
{: .margin}

Lark collects no data from anyone, children included. YouTube and the other services you use through it have policies of their own.

---

Privacy
{: .margin}

## Michi
{: #michi .display}

### In short
{: .margin}

There’s no account, no server of ours, and no analytics, ads or tracking. Your trips are kept on your device and in your own iCloud, and go to no one but the people you invite to them. Everything else Michi sends goes to Apple: to Apple Maps, for places, maps and routes, and, when you plan with Michi, to Apple Intelligence, which may run on Apple’s Private Cloud Compute.

### You
{: .margin}

The paths below start on Michi’s You page: tap the person button at the top of the album, beside New Trip. A trip’s own options are in its brochure, under Trip Options, the … button.

### On your device
{: .margin}

Michi keeps your trips in its own storage on your device: each trip’s title, dates and ink (its stamp’s color); its stops, with each one’s name, town, place on the map, day, how long you’ll spend there, how you get there, notes and when you visited it; and its photos. For a shared trip, it also keeps who’s on it (see Sharing) and whether you can make changes. Where you’ve moved your stamps in the album, and whether the full map shows satellite imagery, are kept on the device too. Michi has no networking code of its own; it goes online only through Apple’s iCloud, Apple Maps, Apple Intelligence and App Store, as described below. Backups of your device include all of this, apart from photos iCloud already has, which Michi downloads again if they’re missing.

### iCloud
{: .margin}

When your device is signed in to iCloud, Michi syncs your trips, their stops and their photos between your devices through Apple’s CloudKit, in your iCloud account’s private database. It keeps what they hold in CloudKit’s encrypted fields, and photos as files CloudKit encrypts. Where your stamps sit in the album, the satellite setting and conversations with Michi stay on each device, and Michi Pro doesn’t sync through iCloud at all: each device asks the App Store (see Michi Pro). Michi shows no notifications; iCloud wakes it silently when a trip changes on another device, so it can fetch the change.

Michi has no sync switch of its own: it follows iCloud, which you can turn off for Michi in the Settings app, under your name&nbsp;→ iCloud. Without iCloud, Michi works on the device alone, and syncs what you made there once you sign in. Signing out of iCloud, or switching to another account, removes every trip and photo from the device, with the maps, routes and places kept for them; what iCloud has comes back when you sign in again, and anything it hadn’t received yet is lost. [Apple’s privacy policy](https://www.apple.com/legal/privacy/en-ww/) covers iCloud.

### Sharing
{: .margin}

Invite, in the brochure of a trip you made, shares it through iCloud with the people you choose, by whichever app you send the invitation with, such as Messages or Mail. Only the people you invite can join: Michi never offers a link that anyone can open. You choose whether they can make changes or only view the trip. The share iCloud keeps, and the invitation, can’t be encrypted, so Michi never puts the trip’s title there: both say “A trip on Michi”, with Michi’s icon.

Everyone on a trip sees all of it: its title, dates, stops, notes and photos, whoever added them, and who’s on it, by the names iCloud gives or, where it gives none, by email address or phone number. Anyone who can make changes can add stops and photos, and change or delete any of them. A shared trip is kept in the iCloud of its owner, the person who made it, and counts toward their iCloud storage. Travelers, in the brochure, opens Apple’s sharing sheet, where the owner can invite or remove people and stop sharing, and the others can leave. If you leave a trip, or are removed from it, what you added stays on it.

### Apple Maps
{: .margin}

Michi finds places, draws maps and works out routes with Apple Maps, through Apple’s MapKit. It never uses your location, and never asks for it. [Apple’s privacy policy](https://www.apple.com/legal/privacy/en-ww/) applies to what Apple Maps receives.

- **Add Stop.** What you type is sent to Apple Maps as you type it, with the area your trip’s stops are in, so places near them come first. Picking a result looks it up, and Michi keeps the place’s name, town and place on the map.
- **Planning.** When you plan with Michi, it searches Apple Maps for the places, towns and destinations the model names, and for what the model looks for, such as “ramen”, mostly in the area of the trip’s stops or its destination.
- **Maps.** A brochure’s map, the full map and each stamp’s print show Apple’s map of where the trip’s stops are, loaded from Apple Maps. Stamps’ prints are kept on your device.
- **Routes.** When you open a brochure, its full map or a stop, Michi asks Apple Maps for the route, or the travel time, from each stop to the next: where the two stops are and how you get there, without their names. Michi keeps routes on your device and asks for them again after 60&nbsp;days, or 14 for travel times. A leg’s route goes once no trip has that leg.
- **Passport.** When you open You or the passport, Michi asks Apple Maps which country and city each stop is in, from where the stop is and nothing else. The answers are kept on your device until no stop is there.

### Apple Intelligence
{: .margin}

Plan with Michi, in New Trip, and Ask Michi, in Add Stop, plan with Apple Intelligence, and only when you send them a message. On iOS 27, Michi asks Apple’s Private Cloud Compute first and, whenever it can’t answer, Apple’s on-device model; on iOS 26, it uses the on-device model alone. Private Cloud Compute runs Apple’s models on Apple’s servers, and Apple says what it’s sent is used only to answer, never stored, and can’t be seen by anyone, Apple included. The planner says when your messages may go there. For each message, the model is given:

- your message, and the last three exchanges before it
- the trip’s title and dates, or what you’ve filled in of New Trip
- each stop’s name, town and day, how long you’ll spend there and how you get there, and the first line of its notes, up to 110&nbsp;characters, whoever wrote them
- the names and towns of the places Apple Maps finds for it, and the language to answer in

It isn’t given where the stops are on the map, the trip’s photos, who’s on it, anything from your other trips, or your location. Conversations and drafts are kept in memory only, and are gone once you close the planner. Nothing Michi drafts is saved until you tap Create Trip or Apply Changes; after that, its stops and notes are saved, and sync, like any you add yourself.

### Photos
{: .margin}

Add Photos, on a stop you’ve visited, opens the system’s photo picker. Michi can’t see your photo library: it gets only the photos you pick, which the picker may first download from iCloud Photos. It keeps a copy of each at full size, without its location, camera details or other metadata, apart from the date it was taken, which it uses to sort them and, for a stop’s first photo, as the day you visited. The copies sync through iCloud, and on a shared trip go to everyone on it.

Save All Photos, in Trip Options, adds every photo of the trip that’s on your device to your photo library, other travelers’ included, without their location or camera details. It asks only to add to your library, never to see it. The share button in the photo viewer shares one photo, and Share as Image, in Trip Options, makes one picture of the brochure, with each stop, the first line of its notes and its photos, but not who’s on the trip; where they go is up to you. Anyone on a trip can use all three, even if they can only view it.

### Passport
{: .margin}

The passport, at the top of You, is worked out on your device from your trips each time you open it, and isn’t stored or synced. Its countries and cities are Apple Maps’ (see Apple Maps), and the name on it is yours as iCloud gives it on a shared trip. While it’s open, Michi reads the device’s tilt for the hologram, unless Reduce Motion is on, and keeps nothing of it.

### Michi Pro
{: .margin}

Michi Pro, in You&nbsp;→ Support, is one purchase through Apple’s App Store, not a subscription. It unlocks every ink, and Michi on every trip. Apple handles the payment, and we never see your payment details. Michi asks the App Store whether your Apple Account has Michi Pro, bought on any of your devices or shared with you through Family Sharing, and keeps only the answer, on your device. It keeps no receipt, amount or date.

Without Michi Pro, Michi is free on three trips: the first three a plan or changes from Michi are saved to. To count them, it keeps those trips’ IDs on your device only, even once a trip is deleted.

### Feedback
{: .margin}

You&nbsp;→ Support&nbsp;→ Send Feedback opens a draft email to {{ site.support_email }} in your mail app, with the subject “Michi feedback”. Below the space for your message, under “Info”, it fills in Michi’s version, your system’s name and version, and your device’s model identifier, such as iPhone17,1. It adds nothing else. You can change any of it, and nothing is sent unless you send it. We use your message only to reply and to fix what you report, and we don’t share it.

### Other apps
{: .margin}

Open in Maps, on a stop, hands the stop’s name and place to the Maps app, and the links to this website, at the foot of You, open in your browser. What happens there is up to that app and its policy.

### Deleting
{: .margin}

- **A photo.** Delete Photo, when you touch and hold a photo or in the viewer, deletes it from your devices and from iCloud, and, on a shared trip, for everyone on it.
- **A stop.** Deleting a stop deletes its photos with it, for everyone on a shared trip.
- **A trip.** Delete Trip, in Trip Options or the stamp’s menu, deletes the trip, its stops and its photos from your devices and from iCloud, and for everyone you’ve shared it with. It can’t be undone. On a trip someone else shared with you, Leave Trip takes it off your devices instead, and what you added stays on it.
- **The app.** Deleting Michi deletes what it keeps on that device. Backups of your device keep a copy until they’re replaced or deleted.
- **iCloud.** Your trips stay in iCloud, and on your other devices, until you delete them in Michi. You can also delete Michi’s data from iCloud storage in the Settings app, which deletes the trips you made for everyone you’ve shared them with too.

Photos you’ve saved to your library, and pictures you’ve shared, stay where they went. There’s no Recently deleted, and nothing expires on its own: Michi keeps your trips until you delete them.

### Analytics
{: .margin}

Michi contains no analytics, crash reporting, advertising or tracking code, and no third-party libraries. It doesn’t use the advertising identifier or ask to track you. It writes notes about what failed to the device’s own system log, never what you wrote or planned, and doesn’t collect them. If you’ve turned on Share With App Developers, in the Settings app under Privacy & Security&nbsp;→ Analytics & Improvements, Apple may give us anonymous crash reports and aggregated statistics about how Michi is used. Those come from Apple, under Apple’s privacy policy, not from anything in Michi.

### Children
{: .margin}

Michi collects no data from anyone, children included.

---

## Changes to this policy
{: #changes}

If what this website or any of the apps does with your data changes, we’ll update this page and the date at the top.

## Contact
{: #contact}

Write to [{{ site.email }}](mailto:{{ site.email }}) with any question about privacy, or about this page.

## Credits
{: #credits}

Lark’s App Store screenshots show stills from these videos, and lines of the first one’s narration, transcribed and translated by Lark. All three are licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).

- [里海ー北海道知床半島](https://www.youtube.com/watch?v=0uEZ1OdLhC4) by UN University
- [田舎暮らしvlog｜雨の日の夜をお菓子作りして過ごす｜プリン｜パエリアディナー](https://www.youtube.com/watch?v=7UObm37dc_4) by nekoniwa
- [ALBALATE DEL ARZOBISPO \| Pueblos con encanto a vista de dron](https://www.youtube.com/watch?v=fgS2YxBWT5c) by La COMARCA TV

Their creators aren’t connected with Tiny Bit Studio and don’t endorse Lark.
