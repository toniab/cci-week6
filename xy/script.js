			
const buttonStart = document.getElementById("start-button");

function startTone() {
    buttonStart.disabled = "true";
	Tone.start().then(() => { 
        console.log("audio is ready"); 
        buttonStart.style.display = "none";
    }).catch((error) => { 
        console.log("audio not ready"); 
        buttonStart.disabled = "false"; 
    });
}

const synth = new Tone.MonoSynth({
  oscillator: { type: "sawtooth" },
  envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1 },
});

const sequence = new Tone.Sequence((time, note) => {
    synth.triggerAttackRelease(note, "2n", time);
}, ["C3", "E3", "G3", "A3", "G3"], "1n");
sequence.start(0);

const synthBass = new Tone.FMSynth({
    "harmonicity":8,
    "modulationIndex": 2,
    "oscillator" : {
        "type": "sine"
    },
    "envelope": {
        "attack": 0.001,
        "decay": 2,
        "sustain": 0.1,
        "release": 2
    },
    "modulation" : {
        "type" : "square"
    },
    "modulationEnvelope" : {
        "attack": 0.002,
        "decay": 0.2,
        "sustain": 0,
        "release": 0.2
    }
}).toDestination();

const loop = new Tone.Loop((time) => {
    synthBass.triggerAttackRelease("G2", "8n", time);
}, "4n").start(0);


const vibrato = new Tone.Vibrato({
  frequency: 5,
  depth: 0.1,
}).toDestination();

synth.connect(vibrato);

// Map values between a range
function map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// HTML elements
const pad = document.getElementById('xy-pad');
const dot = document.getElementById('dot');

// Handle mouse events
pad.addEventListener('mousemove', (e) => {
    const rect = pad.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const y = clamp(e.clientY - rect.top, 0, rect.height);

    // Update dot position
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;

    const vibratoDepth = map(x, 0, rect.width, 0, 0.5);
    const vibratoFrequency = map(x, 0, rect.width, 0.1, 8);
    vibrato.depth.value = vibratoDepth;
    vibrato.frequency.value = vibratoFrequency;

    synthBass.envelope.sustain = map(y, 0, rect.height, 0.01, 1);
    synthBass.modulationEnvelope.sustain = map(y, 0, rect.height, 0, 1);
});

// Play sound on mouse click
pad.addEventListener('mousedown', () => {
    //synth.triggerAttack("C4");
    Tone.getTransport().start(); // restart sequence
    dot.classList.add("active");
});

// Stop sound on mouse release
pad.addEventListener('mouseup', () => {
    //synth.triggerRelease();
    Tone.getTransport().pause(); // end sequence
    dot.classList.remove("active");
});