// Assume Tone.js is already imported
const synth = new Tone.Synth().toDestination();

const buttonStart = document.getElementById("start");
const buttonPause = document.getElementById("pause");
const buttonPlay = document.getElementById("play");
const buttonNote = document.getElementById("note");

function startTone() {
    buttonStart.disabled = "true";
	Tone.start().then(() => { 
        console.log("audio is ready"); 
        startBackingLoop();
        buttonStart.style.display = "none";
        buttonPlay.style.display = "none";
        buttonPause.style.display = "block";
        buttonNote.style.display = "block";
    }).catch((error) => { 
        console.log("audio not ready"); 
        buttonStart.disabled = "false"; 
    });
}

function pauseTransport() {
    Tone.getTransport().stop();
    buttonPlay.style.display = "block";
    buttonPause.style.display = "none";
}

function playTransport() {
    Tone.getTransport().start();
    buttonPlay.style.display = "none";
    buttonPause.style.display = "block";
}

function startBackingLoop() {
    // monophonic
    const synthBass = new Tone.Synth().toDestination();
    // sample accurate time
    const loopA = new Tone.Loop((time) => {
	    synthBass.triggerAttackRelease("C2", "8n", time);
    }, "4n").start(0);

    Tone.getTransport().bpm.value = 120; // Set the BPM
    Tone.getTransport().start();
}

// Function to quantize button press to nearest 8th note
function quantizeAndPlay() {
    synth.triggerAttackRelease("C4", "8n", "@8n");
}