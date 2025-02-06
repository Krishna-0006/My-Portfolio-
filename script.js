// Elements
const canvas = document.getElementById("scratch");
const context = canvas.getContext("2d");
const valuesContainer = document.getElementById("valuesContainer");
const resultMessage = document.getElementById("resultMessage");

// Possible values for the scratch card
const values = ["$10", "$20", "$50", "$100", "$500"];

// Initialize scratch area
const init = () => {
    const gradientColor = context.createLinearGradient(0, 0, 300, 200);
    gradientColor.addColorStop(0, "#c3a3f1");
    gradientColor.addColorStop(1, "#6414e9");
    context.fillStyle = gradientColor;
    context.fillRect(0, 0, 300, 200);
    randomizeValues();
};

// Generate random values and check for win condition
const randomizeValues = () => {
    const chosenValues = [];
    for (let i = 0; i < 6; i++) {
        const randomValue = values[Math.floor(Math.random() * values.length)];
        chosenValues.push(randomValue);
        const h3 = document.createElement("h3");
        h3.textContent = randomValue;
        valuesContainer.appendChild(h3);
    }
    checkForWin(chosenValues);
};

// Check if there are 3 or more identical values
const checkForWin = (chosenValues) => {
    const counts = {};
    chosenValues.forEach((value) => {
        counts[value] = (counts[value] || 0) + 1;
    });
    for (let value in counts) {
        if (counts[value] >= 3) {
            resultMessage.textContent = `You win! Found 3 or more of ${value}`;
            return;
        }
    }
    resultMessage.textContent = "Better luck next time!";
};

// Canvas scratch functionality
let isDragged = false;
const scratch = (x, y) => {
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(x, y, 12, 0, 2 * Math.PI);
    context.fill();
};

// Get exact x and y position on canvas
const getXY = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.pageX || e.touches[0].pageX) - rect.left;
    const y = (e.pageY || e.touches[0].pageY) - rect.top;
    return { x, y };
};

// Event listeners for scratch functionality
["mousedown", "touchstart"].forEach((event) => {
    canvas.addEventListener(event, (e) => {
        isDragged = true;
        const { x, y } = getXY(e);
        scratch(x, y);
    });
});
["mousemove", "touchmove"].forEach((event) => {
    canvas.addEventListener(event, (e) => {
        if (isDragged) {
            e.preventDefault();
            const { x, y } = getXY(e);
            scratch(x, y);
        }
    });
});
["mouseup", "touchend", "mouseleave"].forEach((event) => {
    canvas.addEventListener(event, () => {
        isDragged = false;
    });
});

window.onload = init;