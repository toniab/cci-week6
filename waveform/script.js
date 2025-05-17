const buttonStart = document.getElementById("start-button");

function startTone() {
    buttonStart.disabled = "true";
	Tone.start().then(() => { 
        console.log("audio is ready"); 
        buttonStart.style.display = "none";
        renderWaveform();
    }).catch((error) => { 
        console.log("audio not ready"); 
        buttonStart.disabled = "false"; 
    });
}

// CREATE SYNTH
const synth = new Tone.Synth({
    oscillator: {
        type: "amtriangle",
        harmonicity: 0.5,
        modulationType: "sine",
    },
    envelope: {
        attackCurve: "exponential",
        attack: 0.05,
        decay: 0.2,
        sustain: 0.2,
        release: 1.5,
    },
    portamento: 0.05,
}).toDestination();

// SPECIFY THE NOTES YOU WANT AVAILABLE FOR PEOPLE TO PLAY
let notes = ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"];
// KEYBOARD PRESS INPUT
let keyboardkeys = ["a","s","d","f","g","h","j","k"];
document.body.addEventListener("keydown", (eventData) => {
    if (eventData.repeat) return;
    console.log('Keydown - key:', eventData.key, 'code:', eventData.code);
    const indexOfKey = keyboardkeys.indexOf(eventData.key);
    if (indexOfKey > -1) {
        synth.triggerAttack(notes[indexOfKey]); 
    }
});
document.body.addEventListener("keyup", (eventData)=> {
    console.log('Keydown - key:', eventData.key, 'code:', eventData.code);
     const indexOfKey = keyboardkeys.indexOf(eventData.key);
    if (indexOfKey > -1) {
        synth.triggerRelease(); 
    }   
});

// Meter analysis the volume level in decibals
const toneMeter = new Tone.Meter();
Tone.Destination.connect(toneMeter);

// FFT gives 
const toneFFT = new Tone.FFT();
Tone.Destination.connect(toneFFT);

// 
const toneWaveform = new Tone.Waveform();
Tone.Destination.connect(toneWaveform);

// Function to render waveform in JS using Tone.Draw  
// that gets called of each scheduled tone event.
// ** IF USING P5.JS YOU CAN SKIP THIS AND DIRECTLY REFERENCE 
// ** THE VALUES INSIDE OF P5.JS DRAW() FUNCTION
function renderWaveform() {
    function draw() {
        Tone.Draw.schedule(() => {
            const meter = toneMeter.getValue();
            if (meter > -20) { 
            console.log("meter: " + meter);    
            const waveform = toneWaveform.getValue(); // Get the waveform data
            console.log(waveform); 
            const fft = toneFFT.getValue();
            console.log(fft); 
            }
            requestAnimationFrame(draw); // Schedule the next frame
        });
    }

    draw(); // Kick off the first frame
}
