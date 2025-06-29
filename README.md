# MIDI Player Website

This project is a web-based MIDI player with the following features:
- **128-key piano roll**: Visualizes keys from C-1 to G9.
- **Multicolor tracks**: Each MIDI track is shown in a different color.
- **Audio Synth**: MIDI playback with real audio synthesis (not just visualization).
- **Playback controls**: Play, pause, stop, seek, loop, tempo.

## Tech Stack

- **React** (UI)
- **Tone.js** (Audio synthesis)
- **@tonejs/midi** (MIDI file parsing)
- **TypeScript**

## Features

- Upload/load MIDI files
- See all 128 keys (C-1 to G9) as a piano roll
- Each track rendered with a unique color
- Play, pause, stop, seek, loop, tempo controls

## Start the project

```bash
npm install
npm run dev
# or
yarn install
yarn dev
