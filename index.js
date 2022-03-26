const { Transform } = require('stream');
const portAudio = require('naudiodon');

const inpName = 'Scarlett Solo USB';
const outName = 'VB-Cable';

// Find devices
const devices = portAudio.getDevices();
const inp = devices.find(d => d.name === inpName);
if (!inp) {
    console.error('Could not find input device', inpName);
    process.exit(1);
}
const out = devices.find(d => d.name === outName);
if (!out) {
    console.error('Could not find output device', outName);
    process.exit(1);
}

// Define constants
const format = portAudio.SampleFormat16Bit;
const formatBytes = format / 8;
const channels = Math.min(inp.maxInputChannels, out.maxOutputChannels);
const rate = Math.min(inp.defaultSampleRate, out.defaultSampleRate);

// Create the input
const ai = new portAudio.AudioIO({
    inOptions: {
        channelCount: channels,
        sampleFormat: format,
        sampleRate: rate,
        deviceId: inp.id,
        closeOnError: false,
    },
});

// Create the output
const ao = new portAudio.AudioIO({
    outOptions: {
        channelCount: channels,
        sampleFormat: format,
        sampleRate: rate,
        deviceId: out.id,
        closeOnError: false,
    },
});

// Duplicate first channel to all other channels
const at = new Transform({
    transform: (chunk, encoding, callback) => {
        // For each set of channels
        for (let i = 0; i < chunk.length; i += formatBytes * channels) {
            // For each channel
            for (let j = 0; j < channels; j++) {
                // For the bytes of the first channel
                for (let k = 0; k < formatBytes; k++) {
                    // Copy the bytes to the other channels
                    chunk[i + j * formatBytes + k] = chunk[i + k];
                }
            }
        }
        callback(null, chunk);
    },
});

// Go!
ai.pipe(at).pipe(ao);
ai.once('data', () => ao.start());
ai.start();
