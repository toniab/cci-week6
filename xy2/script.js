			
			
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

const player = new Tone.Player({
    url: "https://tonejs.github.io/audio/loop/FWDL.mp3",
    loop: true,
    loopStart: 0,
    loopEnd: 1,
}).toDestination();


// Map values between a range
function map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// HTML elements
const pad = document.getElementById('xy-pad');
const dot = document.getElementById('dot');

// Handle mouse events
pad.addEventListener('mousemove', (e) => {
    const rect = pad.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const y = clamp(e.clientY - rect.top, 0, rect.height);

    // Update dot position
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;

    player.loopEnd = map(x, 0, rect.width, 0.3, 1.5);
    player.playbackRate = map(y, 0, rect.height, 0.5, 2);
});

// Play sound on mouse click
pad.addEventListener('mousedown', () => {
    player.start(); 
    dot.classList.add("active");
});

// Stop sound on mouse release
pad.addEventListener('mouseup', () => {
    player.pause(); 
    dot.classList.remove("active");
});

