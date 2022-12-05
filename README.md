![](src/assets/deezer.svg)
# Deezer+
Alternative Deezer Web Player with extra features

![Website](https://img.shields.io/website?down_color=red&down_message=offline&up_color=success&up_message=online&url=https%3A%2F%2Fdeezer.buzl.uk)
![GitHub](https://img.shields.io/github/license/kaangiray26/deezer-plus?color=blue)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/kaangiray26/deezer-plus)

Check out at https://deezer.buzl.uk

## Features
- Group Session (Listen together with a friend)
- Do everything you can do with Deezer
- Right click menu on everything
- Easier and more quick access
- Better queue operations
- Sharing via Google
- Last.fm `Now Scrobbling` support
- Keyboard shortcuts
- Responsive design for the mobile devices
- Can be installed as a Progressive Web App (PWA)

## Keyboard Shortcuts
- Press the `H` button to display the keyboard shortcuts.

## Troubleshooting
- I can't play full songs on a desktop browser.

  If you are using Firefox, the `Enhanced Tracking Protection` feature of the browser might interfere how the Deezer SDK works. To prevent this you can add an exception for the website. Go to the website `https://deezer.buzl.uk` and then find the `shield` icon on the left side of the address bar. Then just click on the switch and the website will be added to the exceptions. This should fix the problem and you don't need to turn off your adblockers.
  
- I can't play full songs on a mobile browser.

  This is a known issue due to the Deezer's restrictions on the userAgent parameter. There isn't a solution for this issue yet and the Deezer team is checking on it right now. However, if you can change your userAgent on your mobile browser, you can listen to full songs without any issues. Just set the parameter to `Firefox/107.0`.
