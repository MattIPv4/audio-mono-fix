# Audio Mono Fix

Fixing left-channel only inputs, duplicating to all channels.

## Why?

The Scarlett Solo audio interface on macOS declares itself as a single two-channel device, with the
first channel being the XLR input and the second channel being the Jack input.

This means that if you're using an XLR mic, your audio is only present in the left channel, because
it's a single two-channel device rather than two separate mono devices.

So, this script takes the audio input from the Scarlett Solo, duplicates the data from the first
channel to all other channels, and then sends it on to an output device.

This makes use of a [virtual audio cable](https://vb-audio.com/Cable/) as the output device, which
can then be used as the microphone input for applications (Google Meet, Discord, etc.).

## Installation

Make sure that you have PortAudio installed:

```bash
brew install portaudio
```

Install the dependencies for this script:

```bash
npm ci
```

(Update the script as needed with different device names etc.)

Then, start the script:

```bash
node index.js
```
