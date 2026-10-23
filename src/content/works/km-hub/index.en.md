---
title: km_hub
summary: A keyboard and mouse switch on a Raspberry Pi, with remapping.
---

Software that turns a Raspberry Pi into a keyboard and mouse hub. Input from the keyboards and mice plugged into the hub is remapped and sent to whichever of several computers is selected. It is the keyboard and mouse half of a KVM switch, configured the way you want it.

The output can be switched by a key, a button on the hub, the settings page in a browser, or MQTT. Key bindings, layers that apply while a key is held, and macros can be set per input device and per output, and Japanese and US layouts are converted so that what is printed on the key caps is what gets typed. Actions on the computer, such as "tile the window left", can be bound to a key by name.

Outputs can be mixed: computers connected through a small microcontroller (RP2040), the hub's own USB port, or another Raspberry Pi over Wi-Fi. Bindings are edited in the browser by clicking a keyboard diagram or pressing the real key. The source is not public; please get in touch if you are interested.
