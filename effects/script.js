function startTone() {
	Tone.start().then(() => { 
        console.log("audio is ready"); 
        playSequence();
    });
}


const synth = new Tone.Synth({
    oscillator: {
        type: "sine",
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



// === OTHER EFFECTS YOU CAN TRY === //

// PHASER
const phaser = new Tone.Phaser({
    frequency: 15,
    octaves: 5,
    baseFrequency: 1000
});
//synth.connect(phaser);
//phaser.toDestination();

// FREEVERB
const freeverb = new Tone.Freeverb();
freeverb.dampening = 1000;
//synth.connect(freeverb);
//freeverb.toDestination();

// JCREVERB
const reverb = new Tone.JCReverb(0.4);
//synth.connect(reverb);
//reverb.toDestination();

// PINGPONG DELAY
const pingPong = new Tone.PingPongDelay("4n", 0.2);
//synth.connect(pingPong);
//pingPong.toDestination();

// FREQ SHIFT
const shift = new Tone.FrequencyShifter(42);
//synth.connect(shift);
//shift.toDestination();

// AUTO WAH
const autoWah = new Tone.AutoWah(50, 6, -30);
autoWah.Q.value = 6; // Q value influences the effect of the wah - default is 2
//synth.connect(autoWah);
//autoWah.toDestination();

// AUTO PANNER
const autoPanner = new Tone.AutoPanner("4n").start(); // create an autopanner and start its LFO
//synth.connect(autoPanner);
//autoPanner.toDestination();

// TREMOLO
const tremolo = new Tone.Tremolo(9, 0.75).start(); // create a tremolo and start it's LFO
//synth.connect(tremolo);
//tremolo.toDestination();

// == THE FOUR EFFECTS IN OUR FRONT END == //

// BIT CRUSHER
let crusher = new Tone.BitCrusher({
	"bits": 8,
    "wet": 0.5
}); // https://en.wikipedia.org/wiki/Bitcrusher
let cheby = new Tone.Chebyshev(50); // http://music.columbia.edu/cmc/musicandcomputers/chapter4/04_06.php
let distort = new Tone.Distortion(0.8); // https://en.wikipedia.org/wiki/Distortion_(music
let feedbackDelay = new Tone.FeedbackDelay("8n", 0.5);


// --- PARALLEL ROUTING ALL EFFECTS -- //

// Fan: synth → effects → destination
// (Other option is chain)
synth.fan(crusher, cheby, distort, feedbackDelay);

// === CREATE GAIN NODES FOR EACH === //
const crusherGain = new Tone.Gain(0);
const chebyGain = new Tone.Gain(0);
const distortGain = new Tone.Gain(0);
const feedbackDelayGain = new Tone.Gain(0);

// === CONNECT EACH EFFECT → ITS GAIN === //
crusher.connect(crusherGain);
cheby.connect(chebyGain);
distort.connect(distortGain);
feedbackDelay.connect(feedbackDelayGain);

// * == * NOTE * == * : In this example the HTML Controls will set it to destination


// --- SAMPLE HTML CONTROLS -- //

// ---- CONTROL EFFECT: BIT CRUSHER ----- //
const crusherToggle = document.getElementById("crusher-toggle");
crusherToggle.addEventListener("click", () => {
    if (crusherToggle.classList.contains("active")) {
        // stop using it
        //crusher.wet.value = 0;
        crusherGain.gain.rampTo(0, 0.1, Tone.now(), () => {
            crusherGain.disconnect(Tone.Destination);
        });
        crusherToggle.classList.remove("active");
    } else {
        // use it 
        //crusher.wet.value = 1;
        crusherGain.toDestination();
        crusherGain.gain.rampTo(1, 0.1, Tone.now());
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
        //cheby.wet.value = 0;
        chebyGain.gain.rampTo(0, 0.1, Tone.now(), () => {
            chebyGain.disconnect(Tone.Destination);
        });
        chebyToggle.classList.remove("active");
    } else {
        // use it 
        //cheby.wet.value = 1;
        chebyGain.toDestination();
        chebyGain.gain.rampTo(1, 0.1, Tone.now());
        chebyToggle.classList.add("active");
    }
});

const chebyControl = document.getElementById("cheby-control");
chebyControl.addEventListener("input", () => {
    cheby.order = parseFloat(chebyControl.value);
    //new Tone.Chebyshev(parseFloat(chebyControl.value)).toDestination(); // http://music.columbia.edu/cmc/musicandcomputers/chapter4/04_06.php
    document.getElementById("cheby-result").innerText = chebyControl.value;
});

// ---- CONTROL EFFECT: DISTORTION ----- //
const distortToggle = document.getElementById("distort-toggle");
distortToggle.addEventListener("click", () => {
    if (distortToggle.classList.contains("active")) {
        // stop using it
        //distort.wet.value = 0;
        distortGain.gain.rampTo(0, 0.1, Tone.now(), () => {
            distortGain.disconnect(Tone.Destination);
        });
        distortToggle.classList.remove("active");
    } else {
        // use it 
        //distort.wet.value = 1;
        distortGain.toDestination();
        distortGain.gain.rampTo(1, 0.1, Tone.now());
        distortToggle.classList.add("active");
    }
});

const distortControl = document.getElementById("distort-control");
distortControl.addEventListener("input", () => {
    distort.distortion = parseFloat(distortControl.value); 
    document.getElementById("distort-result").innerText = distortControl.value;
});

// ---- CONTROL EFFECT: FEEDBACKDELAY ----- //
const feedbackDelayToggle = document.getElementById("feedbackDelay-toggle");
feedbackDelayToggle.addEventListener("click", () => {
    if (feedbackDelayToggle.classList.contains("active")) {
        // stop using it
        //feedbackDelay.wet.value = 0;
        feedbackDelayGain.gain.rampTo(0, 0.1, Tone.now(), () => {
            feedbackDelayGain.disconnect(Tone.Destination);
        });
        feedbackDelayToggle.classList.remove("active");
    } else {
        // use it 
        //feedbackDelay.wet.value = 1;
        feedbackDelayGain.toDestination();
        feedbackDelayGain.gain.rampTo(1, 0.1, Tone.now());
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

