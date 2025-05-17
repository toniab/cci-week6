			
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

if ("requestMIDIAccess" in navigator) {
    console.log("Web MIDI API is supported!");
    navigator.requestMIDIAccess().then((midiAccess) => {
    for (let input of midiAccess.inputs.values()) {
        input.onmidimessage = handleMIDIMessage;
    }
});
} else {
    console.log("Web MIDI API is not supported in this browser. Use a chrome based browser.");
}

function handleMIDIMessage(message) {
    const [status, note, velocity] = message.data;
    console.log(`Status: ${status}, Note: ${note}, Velocity: ${velocity}`);
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
}).toDestination();
synth.disconnect();

let bitCrushEffect = new Tone.BitCrusher({
	"bits": 2,
    "wet": 0.5
}).toDestination();
synth.connect(bitCrushEffect);

let notes = ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"];
notes.forEach((key) => {
    let button = document.createElement("button");
    button.classList.add("key");
    button.setAttribute("note", key);
    button.innerHTML = key;
    //button.addEventListener("click", onKeyPressed);
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
