			
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


// the player
const player = new Tone.Player({
    url: "https://tonejs.github.io/audio/loop/FWDL.mp3",
    loop: true,
    loopStart: 0,
    loopEnd: 1,
}).toDestination();


// Volume Control
const volumeControl = document.getElementById("volume");
volumeControl.addEventListener("input", () => {
    player.volume.value = parseFloat(volumeControl.value); // Volume in dB
});

// Loop Start Control
const loopStartControl = document.getElementById("loopStart");
loopStartControl.addEventListener("input", () => {
    player.loopStart = parseFloat(loopStartControl.value); // Loop start in seconds
});

// Loop End Control
const loopEndControl = document.getElementById("loopEnd");
loopEndControl.addEventListener("input", () => {
    player.loopEnd = parseFloat(loopEndControl.value); // Loop end in seconds
});

// Reverse Playback
const reverseControl = document.getElementById("reverse");
reverseControl.addEventListener("change", () => {
    player.reverse = reverseControl.checked;
});

// Playback Rate Control
const playbackRateControl = document.getElementById("playbackRate");
playbackRateControl.addEventListener("input", () => {
    player.playbackRate = parseFloat(playbackRateControl.value); // Playback rate multiplier
});

// Play/Pause Button
const playButton = document.getElementById("playButton");
playButton.addEventListener("click", () => {
    if (player.state === "started") {
        player.stop();
        playButton.textContent = "Play";
    } else {
        player.start();
        playButton.textContent = "Pause";
    }
});


