const NOTE_COLORS = [
    "#f44336", "#e91e63", "#9c27b0", "#3f51b5", "#03a9f4", "#009688",
    "#4caf50", "#cddc39", "#ffeb3b", "#ff9800", "#795548", "#607d8b",
    "#8bc34a", "#00bcd4", "#ff5722", "#673ab7"
];

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const MIDI_START = 0, MIDI_END = 127;

// --- Create keys for 128 notes from C-1 (0) to G9 (127) ---
function createKeyboard() {
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = '';
    for (let midi = MIDI_START; midi <= MIDI_END; midi++) {
        const octave = Math.floor((midi / 12)) - 1;
        const name = NOTE_NAMES[midi % 12];
        const keyDiv = document.createElement("div");
        keyDiv.className = "key " + (name.includes("#") ? "black" : "white");
        keyDiv.dataset.midi = midi;
        keyDiv.title = `${name}${octave} (MIDI ${midi})`;
        keyDiv.innerHTML = `<span>${name}${octave}</span>`;
        keyDiv.style.left = `${(midi-MIDI_START)*16}px`;

        // Black keys are overlayed, so position absolutely
        if (name.includes("#")) {
            keyDiv.style.position = "absolute";
            keyDiv.style.left = `${((midi-MIDI_START)*16)-5}px`;
            keyDiv.style.zIndex = 2;
        }

        keyboard.appendChild(keyDiv);
    }
}
createKeyboard();

function getKeyElement(midi) {
    return document.querySelector(`.key[data-midi="${midi}"]`);
}

function showTrackLegend(trackColors) {
    const legend = document.getElementById("tracksLegend");
    legend.innerHTML = "";
    trackColors.forEach((color, idx) => {
        const item = document.createElement("div");
        item.className = "track-item";
        item.innerHTML = `<span class="track-color" style="background:${color}"></span>Track ${idx + 1}`;
        legend.appendChild(item);
    });
}

// ---- MIDI playback logic ----
let midiData = null;
let tracksNotes = [];
let playing = false;
let scheduledNotes = [];
let synth = null;
let startTime = 0;
let pauseTime = 0;
let seekOffset = 0;
let duration = 0;
let timerId = null;
let trackColors = [];

function resetPlayback() {
    playing = false;
    scheduledNotes.forEach(ev => clearTimeout(ev));
    scheduledNotes = [];
    if (synth) synth.releaseAll();
    document.querySelectorAll('.key').forEach(k => k.classList.remove('active'));
    document.getElementById('seekBar').value = 0;
    document.getElementById('currentTime').innerText = "00:00";
}

function formatTime(t) {
    const m = Math.floor(t/60);
    const s = Math.floor(t%60);
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

// --- Simple Polyphonic Synth using Web Audio API ---
class PolySynth {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.gain = this.ctx.createGain();
        this.gain.gain.value = 0.2;
        this.gain.connect(this.ctx.destination);
        this.nodes = {};
    }
    noteFreq(midi) {
        return 440 * Math.pow(2, (midi-69)/12);
    }
    triggerAttack(midi, velocity, color) {
        if (this.nodes[midi]) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = this.noteFreq(midi);
        const noteGain = this.ctx.createGain();
        noteGain.gain.value = velocity * 0.6 + 0.15;
        // Color = filter
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1200 + (midi-36)*20;
        osc.connect(filter).connect(noteGain).connect(this.gain);
        osc.start();
        this.nodes[midi] = {osc, noteGain, filter};
        // Visual
        const key = getKeyElement(midi);
        if (key) key.classList.add("active");
    }
    triggerRelease(midi) {
        const node = this.nodes[midi];
        if (node) {
            node.noteGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.07);
            setTimeout(()=>{
                node.osc.stop();
                node.osc.disconnect();
                node.noteGain.disconnect();
                node.filter.disconnect();
            }, 90);
            delete this.nodes[midi];
        }
        // Visual
        const key = getKeyElement(midi);
        if (key) key.classList.remove("active");
    }
    releaseAll() {
        Object.keys(this.nodes).forEach(midi => this.triggerRelease(Number(midi)));
    }
}

function schedulePlayback(seek=0) {
    if (!midiData) return;
    synth = synth || new PolySynth();
    resetPlayback();
    playing = true;
    seekOffset = seek;
    startTime = performance.now() - seek*1000;
    let allEvents = [];
    // Collect all notes from all tracks, assign color by track
    tracksNotes = [];
    trackColors = [];
    midiData.tracks.forEach((track, idx) => {
        const color = NOTE_COLORS[idx % NOTE_COLORS.length];
        trackColors.push(color);
        track.notes.forEach(note => {
            allEvents.push({
                ...note,
                track: idx,
                color,
            });
        });
    });
    allEvents.sort((a, b) => a.time - b.time);
    duration = midiData.duration;
    document.getElementById('duration').innerText = formatTime(duration);
    showTrackLegend(trackColors);

    // Draw notes as colored overlays
    document.querySelectorAll('.track-note').forEach(el=>el.remove());
    allEvents.forEach(note => {
        const key = getKeyElement(note.midi);
        if (!key || note.duration < 0.02) return;
        const noteDiv = document.createElement("div");
        noteDiv.className = "track-note";
        noteDiv.style.background = note.color;
        noteDiv.style.height = `${Math.max(2, Math.min(18, note.duration*80))}px`;
        noteDiv.style.bottom = "0";
        // Fade if short
        noteDiv.style.opacity = Math.max(0.5, Math.min(1, note.duration));
        key.appendChild(noteDiv);
    });

    // Schedule playback
    scheduledNotes = [];
    let now = performance.now();
    allEvents.forEach(note => {
        if (note.time < seek) return;
        const delay = (note.time-seek)*1000;
        // Start note
        const ev1 = setTimeout(() => {
            if (!playing) return;
            synth.triggerAttack(note.midi, note.velocity, note.color);
        }, delay);
        // Stop note
        const ev2 = setTimeout(() => {
            if (!playing) return;
            synth.triggerRelease(note.midi);
        }, delay + note.duration*1000);
        scheduledNotes.push(ev1, ev2);
    });

    // Seekbar update
    let lastUpdate = 0;
    function updateSeek() {
        if (!playing) return;
        const t = Math.min(duration, (performance.now()-startTime)/1000);
        document.getElementById('seekBar').value = (t/duration)*100;
        document.getElementById('currentTime').innerText = formatTime(t);
        if (t < duration) {
            timerId = requestAnimationFrame(updateSeek);
        } else {
            stopPlayback();
        }
    }
    timerId = requestAnimationFrame(updateSeek);
}

function stopPlayback() {
    playing = false;
    if (synth) synth.releaseAll();
    scheduledNotes.forEach(ev => clearTimeout(ev));
    scheduledNotes = [];
    cancelAnimationFrame(timerId);
    document.getElementById('seekBar').value = 0;
    document.getElementById('currentTime').innerText = "00:00";
}

function pausePlayback() {
    playing = false;
    pauseTime = (performance.now()-startTime)/1000;
    scheduledNotes.forEach(ev => clearTimeout(ev));
    scheduledNotes = [];
    if (synth) synth.releaseAll();
    cancelAnimationFrame(timerId);
}

function resumePlayback() {
    schedulePlayback(pauseTime);
}

// Controls
document.getElementById('playBtn').onclick = () => {
    if (!midiData) return;
    if (playing) return;
    if (pauseTime) resumePlayback();
    else schedulePlayback(0);
};
document.getElementById('stopBtn').onclick = () => {
    stopPlayback();
    pauseTime = 0;
};
document.getElementById('pauseBtn').onclick = () => {
    if (!playing) return;
    pausePlayback();
};
document.getElementById('seekBar').oninput = function() {
    if (!midiData) return;
    const t = (this.value/100)*duration;
    stopPlayback();
    schedulePlayback(t);
};

document.getElementById('midiFile').onchange = async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const arr = await file.arrayBuffer();
    midiData = await Midi.fromArrayBuffer(arr);
    duration = midiData.duration;
    document.getElementById('duration').innerText = formatTime(duration);
    document.getElementById('seekBar').value = 0;
    document.getElementById('currentTime').innerText = "00:00";
    showTrackLegend(Array(midiData.tracks.length).fill("#888"));
    document.querySelectorAll('.track-note').forEach(el=>el.remove());
    stopPlayback();
    pauseTime = 0;
};
