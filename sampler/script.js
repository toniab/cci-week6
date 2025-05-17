			
const buttonStart = document.getElementById("start-button");

function startTone() {
    buttonStart.disabled = "true";
	Tone.start().then(() => { 
        console.log("audio is ready"); 
        buttonStart.style.display = "none";
        //StartPlayer();
    }).catch((error) => { 
        console.log("audio not ready"); 
        buttonStart.disabled = "false"; 
    });
}

// CREATE SAMPLER
const sampler = new Tone.Sampler({
				urls: {
					C2: "C2.mp3",
					"D#2": "Ds2.mp3",
					"F#2": "Fs2.mp3",
					A2: "A2.mp3",
					C3: "C3.mp3",
					"D#3": "Ds3.mp3",
					"F#3": "Fs3.mp3",
					A3: "A3.mp3"
				}, // you only need to pass minimum one note file and sampler can improvise the rest, but its good to have a few spread across octaves. 
				release: 1,
				baseUrl: "https://tonejs.github.io/audio/salamander/",
			}).toDestination();

// ADD EFFECT TO SAMPLER
sampler.disconnect(); // remove synth from speaker
let bitCrushEffect = new Tone.BitCrusher({
	"bits": 8,
    "wet": 0.5
}).toDestination();
sampler.connect(bitCrushEffect); // connect synth to effect


// SPECIFY THE NOTES YOU WANT AVAILABLE FOR PEOPLE TO PLAY
let notes = ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"];

// BUTTON CLICK INPUT
notes.forEach((note) => {
    let button = document.createElement("button");
    button.classList.add("key");
    button.setAttribute("note", note);
    button.innerHTML = note;
    button.addEventListener("click", (eventData) => {
        sampler.triggerAttackRelease(eventData.target.getAttribute("note"), "4n");
    });
    document.getElementById("content").appendChild(button);
});

// KEYBOARD PRESS INPUT
let keyboardkeys = ["a","s","d","f","g","h","j","k"];
document.body.addEventListener("keydown", (eventData) => {
    if (eventData.repeat) return;
    console.log('Keydown - key:', eventData.key, 'code:', eventData.code);
    const indexOfKey = keyboardkeys.indexOf(eventData.key);
    if (indexOfKey > -1) {
        sampler.triggerAttack(notes[indexOfKey]); 
    }
});
document.body.addEventListener("keyup", (eventData)=> {
    console.log('Keydown - key:', eventData.key, 'code:', eventData.code);
     const indexOfKey = keyboardkeys.indexOf(eventData.key);
    if (indexOfKey > -1) {
        sampler.triggerRelease(notes[indexOfKey]); 
    }   
});