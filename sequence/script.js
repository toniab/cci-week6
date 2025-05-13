			
const buttonStart = document.getElementById("startButton");

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

let keys = ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"];
keys.forEach((key) => {
    let button = document.createElement("button");
    button.classList.add("key");
    button.setAttribute("note", key);
    button.innerHTML = key;
    button.addEventListener("click", onKeyPressed);
    //button.addEventListener("mouseDown", onKeyDown);
    //button.addEventListener("mouseUp", onKeyUp);
    //button.addEventListener("mouseLeave", onKeyUp);
    document.getElementById("content").appendChild(button);
});

function onKeyPressed(eventData) {
    //if (Tone.context.state != "running") { startTone(); return; } 
    let octave = 3;
    synth.triggerAttackRelease(eventData.target.getAttribute("note") + octave.toString(), "4n");
}

/*
function onKeyDown(eventData) {
    synth.triggerAttack(eventData.target.getAttribute("note"));
}

function onKeyUp(eventData) {
    synth.triggerRelease();
}
*/