function startTone() {
	Tone.start().then(() => { 
        console.log("audio is ready"); 
        playSequence();
    });
}


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
});

function playSequence() {
    synth.toDestination();

    // plan a sequence
    const sequence = new Tone.Sequence((time, note) => {
        synth.triggerAttackRelease(note, 0.1, time);
        // subdivisions are given as subarrays
    }, ["C4", ["E4", "D4", "E4"], "G4", ["A4", "G4"]])
    sequence.start(0);
    Tone.getTransport().start();
}



// OPTIONAL EFFECTS: To use one- put synth.connect() or player.connect() on one of these
// BIT CRUSHER
const crusher = new Tone.BitCrusher(8).toDestination(); // https://en.wikipedia.org/wiki/Bitcrusher

// CHEBYSHEV
let cheby = new Tone.Chebyshev(50).toDestination(); // http://music.columbia.edu/cmc/musicandcomputers/chapter4/04_06.php

// DISTORTION 
let distort = new Tone.Distortion(0.8).toDestination(); // https://en.wikipedia.org/wiki/Distortion_(music

// FEEDBACKDELAY
const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination();

// PHASER
const phaser = new Tone.Phaser({
    frequency: 15,
    octaves: 5,
    baseFrequency: 1000
}).toDestination();

// FREEVERB
const freeverb = new Tone.Freeverb().toDestination();
freeverb.dampening = 1000;

// JCREVERB
const reverb = new Tone.JCReverb(0.4).toDestination();

// PINGPONG DELAY
const pingPong = new Tone.PingPongDelay("4n", 0.2).toDestination();

// FREQ SHIFT
const shift = new Tone.FrequencyShifter(42).toDestination();

// AUTO WAH
const autoWah = new Tone.AutoWah(50, 6, -30).toDestination();
autoWah.Q.value = 6; // Q value influences the effect of the wah - default is 2

// AUTO PANNER
const autoPanner = new Tone.AutoPanner("4n").toDestination().start(); // create an autopanner and start its LFO

// TREMOLO
const tremolo = new Tone.Tremolo(9, 0.75).toDestination().start(); // create a tremolo and start it's LFO


// --- HTML CONTROLS -- //

// ---- CONTROL EFFECT: BIT CRUSHER ----- //
const crusherToggle = document.getElementById("crusher-toggle");
crusherToggle.addEventListener("click", () => {
    if (crusherToggle.classList.contains("active")) {
        // stop using it
        synth.disconnect();
        crusherToggle.classList.remove("active");
    } else {
        // use it 
        synth.connect(crusher);
        crusherToggle.classList.add("active");
    }
});

const crusherControl = document.getElementById("crusher-control");
crusherControl.addEventListener("input", () => {
    crusher.bits.value = parseFloat(crusherControl.value); // how many bits
    document.getElementById("crusher-result").innerText = crusherControl.value;
});

// ---- CONTROL EFFECT: CHEBY ----- //
const chebyToggle = document.getElementById("cheby-toggle");
chebyToggle.addEventListener("click", () => {
    if (chebyToggle.classList.contains("active")) {
        // stop using it
        synth.disconnect();
        chebyToggle.classList.remove("active");
    } else {
        // use it 
        synth.connect(cheby);
        chebyToggle.classList.add("active");
    }
});

const chebyControl = document.getElementById("cheby-control");
chebyControl.addEventListener("input", () => {
    new Tone.Chebyshev(parseFloat(chebyControl.value)).toDestination(); // http://music.columbia.edu/cmc/musicandcomputers/chapter4/04_06.php
    document.getElementById("cheby-result").innerText = chebyControl.value;
});

// ---- CONTROL EFFECT: DISTORTION ----- //
const distortToggle = document.getElementById("distort-toggle");
distortToggle.addEventListener("click", () => {
    if (distortToggle.classList.contains("active")) {
        // stop using it
        synth.disconnect();
        distortToggle.classList.remove("active");
    } else {
        // use it 
        synth.connect(distort);
        distortToggle.classList.add("active");
    }
});

const distortControl = document.getElementById("distort-control");
distortControl.addEventListener("input", () => {
    distort = new Tone.Distortion(parseFloat(distortControl.value)).toDestination();
    document.getElementById("distort-result").innerText = distortControl.value;
});

// ---- CONTROL EFFECT: FEEDBACKDELAY ----- //
const feedbackDelayToggle = document.getElementById("feedbackDelay-toggle");
feedbackDelayToggle.addEventListener("click", () => {
    if (feedbackDelayToggle.classList.contains("active")) {
        // stop using it
        synth.disconnect();
        feedbackDelayToggle.classList.remove("active");
    } else {
        // use it 
        synth.connect(feedbackDelay);
        feedbackDelayToggle.classList.add("active");
    }
});

const delayControl = document.getElementById("delay-control");
delayControl.addEventListener("input", () => {
    feedbackDelay.delayTime.value = delayControl.value;
    document.getElementById("delay-result").innerText = delayControl.value;
});
const feedbackControl = document.getElementById("feedback-control");
feedbackControl.addEventListener("input", () => {
    feedbackDelay.feedback.value = feedbackControl.value;
    document.getElementById("feedback-result").innerText = feedbackControl.value;
});

