# Croquis

Simple web interface for croquis images

## Setup

- Place your images under `public/images` and they wil lbe served in the client UI.
- Configuration for a croquis session is embedded in the client javascript: `public/js/croquis.js`

### Configuration

```js
var config = {
  randomize: true, // Will randomly pick images to show if true, displays in order otherwise.
  models: ["subfolder name"], // Really just a subfolder name under `public/images`. I organized by model.
  sessions: [
    {
      seconds: 30, // How long each image will be shown for
      images: 6, // The number of images to be shown for this session
      delay: 1, // The number of seconds to delay between each new image in the session
      break: 1 * 60, // The time in seconds for a break period between sessions
      track: true, // Caches the visited image files so there are no repeats in subsequent sessions and between page visits
    },
  ],
};
```
