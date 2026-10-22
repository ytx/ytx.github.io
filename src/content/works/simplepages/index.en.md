---
title: simplePages
summary: Small web pages that each run from a single index.html.
---

A collection of small web pages, each of which runs from a single index.html. There is no build step and no external library; settings and data live only in the browser's localStorage, so a page works as soon as you open the file or put it on static hosting.

The pages fall into three groups.

- Kiosk: always-on pages for a landscape screen. A weather forecast (weather), a Google Calendar board (calendar) and a kitchen timer (k_timer).
- Desk: pages you operate beside other work on a PC. A lecture timer (l_timer).
- Phone: pages you add to the home screen and use with a thumb. Meeting-slot proposals (time4u) and a mid-sleep time log (midsleep).

Every page has toolbar icons for dark/light theme, zoom and Japanese/English, and its settings can be exported and imported as JSON to move between devices. The source is on [GitHub](https://github.com/ytx/simplePages) under the MIT license.
