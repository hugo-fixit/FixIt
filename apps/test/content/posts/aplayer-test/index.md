---
title: APlayer Test
date: 2025-10-21T11:00:04+08:00
collections:
  - Tests
categories:
  - Shortcodes
tags:
  - APlayer
---

<!--more-->

{{< aplayer fixed=false mini=false autoplay=false theme="#b7daff" loop="all" order="list" preload="auto" volume=0.7 mutex=true lrcType=3 listFolded=false listMaxHeight="" storageName="aplayer-setting" >}}
  {{< audio name="Wavelength1" artist="oldmanyoung1" url="Wavelength.mp3" cover="Wavelength.webp" lrc="Wavelength.lrc" />}}
  {{< audio name="Wavelength2" artist="oldmanyoung2" url="Wavelength.mp3" cover="Wavelength.webp" />}}
{{< /aplayer >}}

{{< aplayer fixed=false mini=false autoplay=false theme="#b7daff" loop="all" order="list" preload="auto" volume=0.7 mutex=true lrcType=1 listFolded=false listMaxHeight="" storageName="aplayer-setting" >}}
  {{< audio name="Wavelength1" artist="oldmanyoung1" url="Wavelength.mp3" cover="Wavelength.webp" />}}
  {{< audio name="Wavelength2" artist="oldmanyoung2" url="Wavelength.mp3" cover="Wavelength.webp" >}}
      [00:00.00]APlayer audio2
      [00:04.01]is
      [00:08.02]amazing
  {{< /audio >}}
{{< /aplayer >}}
