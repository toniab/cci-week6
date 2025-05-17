			
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

// ADD EFFECT TO SYNTH
synth.disconnect(); // remove synth from speaker
let bitCrushEffect = new Tone.BitCrusher({
	"bits": 2,
    "wet": 0.5
}).toDestination();
synth.connect(bitCrushEffect); // connect synth to effect

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
        // BUT IF SYNTH IS A POLYSYNTH, 
        // you can do .triggerRelease(notes[indexofKey])
    }   
});

// BUTTON CLICK INPUT
notes.forEach((note) => {
    let button = document.createElement("button");
    button.classList.add("key");
    button.setAttribute("note", note);
    button.innerHTML = note;
    //button.addEventListener("click", onButtonClicked);
    button.addEventListener("mousedown", onKeyboardDown);
    button.addEventListener("mouseup", onKeyboardUp);
    button.addEventListener("mouseleave", onKeyboardUp);
    document.getElementById("content").appendChild(button);
});


function onButtonClicked(eventData) {
    synth.triggerAttackRelease(eventData.target.getAttribute("note"), "4n");
}

function onKeyboardDown(eventData) {
    synth.triggerAttack(eventData.target.getAttribute("note"));
}

function onKeyboardUp() { // Monophonic synths can only play one note at a time.
    synth.triggerRelease();
}
