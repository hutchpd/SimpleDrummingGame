const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const drumArea = document.getElementById('drumArea');
const surdoSound = new Audio('surdo.mp3');
const scoreElement = document.getElementById('score');
const bpmSlider = document.getElementById('bpm-slider');
const bpmValueElement = document.getElementById('bpm-value');
const emojiElement = document.getElementById('emoji');
const trackNameElement = document.getElementById('track-name');

const box = {
    x: 0,
    y: canvas.height - 100, // Will adjust this
    width: canvas.width,
    height: 20,
};

let beats = [];
let score = 0;
let bpm = 120;

let switchLine = {
    y: -10,
    speed: 2
};

function padPattern(pattern, length) {
    while (pattern.length < length) {
        pattern.push(0);
    }
    return pattern;
}

const beatTracks = {
    '🌍': {
        name: 'African Swing',
        pattern: [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    '🍿': {
        name: 'Popcorn',
        pattern: [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    },
    '😍': {
        name: 'Desire',
        pattern: [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    },
    '🎊': {
        name: 'Conga',
        pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
    },
    '💃': {
        name: 'Samba Reggae',
        pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    },
    '🤜🏾': {
        name: 'Ragga',
        pattern: [0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1],
    },
    '🐔': {
        name: 'Chicken Tikka Masala Samba',
        pattern: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    },
    '🐫': {
        name: 'Egyptian Reggae',
        pattern: [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    },
    '🎯': {
        name: 'Taruntino',
        pattern: [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
    },
    '3️⃣': {
        name: 'Part 3',
        pattern: [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
    },
    '👦': {
        name: 'FatBoy Slim',
        pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
    },
    '🍸': {
        name: 'Tequila',
        pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
    },
    '🪅': {
        name: 'Funk',
        pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    },
    '🎉': {
        name: 'Sangra',
        pattern: [1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1],
    },
    '🏠': {
        name: 'House',
        pattern: [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    },
    '🐟': {
        name: 'Baracuda',
        pattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    },
    '🛢️': {
        name: 'Samba Tomba',
        pattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1],
    },
    '🐊': {
        name: 'Crocodile',
        pattern: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    },
    '🧫': {
        name: 'Biome',
        pattern: [1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    },
    '🧛‍♀️': {
        name: 'Dracula',
        pattern: [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1],
    },
    '🎩': {
        name: 'Top Hat',
        pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    '🥳': {
        name: 'Samba Funk',
        pattern: [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    }
    // Add more beat tracks here
};

for (let key in beatTracks) {
    beatTracks[key].pattern = padPattern(beatTracks[key].pattern, 32);
}

const trackKeys = Object.keys(beatTracks);

let currentTrack = Object.keys(beatTracks)[0];
let currentBeatIndex = 0;
let lastBeatTime = Date.now();

function createBeat(index) {
    const beatPattern = beatTracks[currentTrack].pattern;
    if (beatPattern[index] === 0) {
        return;
    }

    const beat = {
        x: Math.random() * (canvas.width - 20),
        y: 0,
        width: 10,  // smaller size
        height: 10,  // smaller size
        speed: 4,  // faster speed
    };

    beats.push(beat);
}

function drawBeat(beat) {
    ctx.beginPath();
    ctx.rect(beat.x, beat.y, beat.width, beat.height);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();
}

function drawSwitchLine() {
    ctx.beginPath();
    ctx.moveTo(0, switchLine.y);
    ctx.lineTo(canvas.width, switchLine.y);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function updateSwitchLinePosition() {
    switchLine.y += switchLine.speed;

    if (switchLine.y > canvas.height) {
        switchLine.y = -10;
        switchLine.speed -= 0.01;
    }
}

function updateBeatPosition(beat) {
    beat.y += beat.speed;

    // Increase size and decrease speed as beat falls
    if (beat.y < canvas.height / 2) {
        beat.width += 0.1;
        beat.height += 0.1;
        beat.speed -= 0.01;
    }
}

function checkCollision(beat, box) {
    return (
        beat.x < box.x + box.width &&
        beat.x + beat.width > box.x &&
        beat.y < box.y + box.height &&
        beat.y + beat.height > box.y
    );
}

function playSurdo() {
    surdoSound.currentTime = 0;
    surdoSound.play();

    let hit = false;
    for (const beat of beats) {
        if (checkCollision(beat, box)) {
            hit = true;
            score++;
            beats.splice(beats.indexOf(beat), 1); // remove beat from array
            break;
        }
    }

    // If the drum is hit when there are no beats in the box, reset the score to 0
    if (!hit) {
        score = 0;
    }

    scoreElement.textContent = score;
}

let currentTrackIndex = 0;



function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const beatPattern = beatTracks[currentTrack].pattern;
    const beatInterval = 60 / bpm * 1000; // Convert BPM to milliseconds
    const now = Date.now();

    if (now - lastBeatTime >= beatInterval) {
        createBeat(currentBeatIndex);
        currentBeatIndex++;

        // Always update lastBeatTime
        lastBeatTime = now;

        // Switch to the next track if the current one is finished
        if (currentBeatIndex >= beatPattern.length) {

            switchTrack();
        }
    }
    
    updateSwitchLinePosition();
    for (let i = 0; i < beats.length; i++) {
        drawBeat(beats[i]);
        updateBeatPosition(beats[i]);

        // If a beat reaches the box without being hit, reset the score to 0
        if (beats[i].y >= box.y && beats[i].y < canvas.height) {
            score = 0;
            scoreElement.textContent = score;
        }

        if (beats[i].y > canvas.height) {
            beats.splice(i, 1);
            i--;
        }
    }


    requestAnimationFrame(gameLoop);
}

function updateBpm() {
    bpm = bpmSlider.value;
    bpmValueElement.textContent = bpm;
}

function switchTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % trackKeys.length; // Cycle through tracks
    currentTrack = trackKeys[currentTrackIndex];
    currentBeatIndex = 0; // Reset beat index for new track

    emojiElement.textContent = currentTrack;
    trackNameElement.textContent = beatTracks[currentTrack].name;
    drawSwitchLine();
}

// Event listeners
drumArea.addEventListener('click', playSurdo);
bpmSlider.addEventListener('input', updateBpm);

window.addEventListener('keydown', function (event) {
    if (event.keyCode === 32) {
        event.preventDefault();
        playSurdo();
    }
});

// Initial setup
bpmValueElement.textContent = bpm;
emojiElement.textContent = currentTrack;
trackNameElement.textContent = beatTracks[currentTrack].name;
gameLoop();
