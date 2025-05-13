			
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
    sampler.triggerAttackRelease(eventData.target.getAttribute("note"), "4n");
}