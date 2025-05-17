			
const buttonStart = document.getElementById("start-button");

function startTone() {
    buttonStart.disabled = "true";
	Tone.start().then(() => { 
        console.log("audio is ready"); 
        buttonStart.style.display = "none";
        Tone.Transport.start();
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

const sequence = new Tone.Sequence((time, note) => {
    synth.triggerAttackRelease(note, 0.1, time);
    
    // Draw.schedule takes a callback and a time to invoke the callback
    Tone.Draw.schedule(() => {
        // the callback synced to the animation frame at the given time
        const noteElement = document.querySelector("#"+note);
        noteElement.classList.add("active");
        setTimeout(() => {
            noteElement.classList.remove("active");
        }, 100);
    }, time);
}, ["C4", "E4", "G4", "B4", "D5"])
sequence.start(0);





