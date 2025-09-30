// let studentId = document.getElementById("inputid");
const input = document.getElementById("inputid");
const suggestions = document.getElementById("suggestions");
let resultName = document.getElementById("nxtname");
let resultid = document.getElementById("nxtid");
let resultsection = document.getElementById("nxtsection");
let resulthall = document.getElementById("nxthall");
let resultmentor = document.getElementById("nxtmentor");
let resultsucesscoach = document.getElementById("nxtsuccesscoach");

let niatNames = [];
let niatIds = [];
fetch('https://script.google.com/macros/s/AKfycbz-RzAY-ULjUyFtrNUO6u80PBAxfix-Z9dRr5ZLwIagei-tTY7SVuNj2ll5hQKOXt6m5w/exec')
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        const students = json.data;
        niatNames = students.map(student => student["Name of the student"]);
        niatIds = students.map(student => student["NIAT ID"]);
        input.addEventListener("input", () => {
            const value = input.value.toLowerCase();
            suggestions.innerHTML = "";

            if (value) {
                const filtered = niatNames.filter(id => id.toLowerCase().includes(value));
                filtered.forEach(id => {
                    const div = document.createElement("div");
                    div.classList.add("suggestion");
                    div.textContent = id;
                    div.onclick = () => {
                        input.value = id;
                        c1();
                        suggestions.innerHTML = "";
                    };
                    suggestions.appendChild(div);
                });
            }
            if (value) {
                const filtered = niatIds.filter(id => id.toLowerCase().includes(value));
                filtered.forEach(id => {
                    const div = document.createElement("div");
                    div.classList.add("suggestion");
                    div.textContent = id;
                    div.onclick = () => {
                        input.value = id;
                        c1();
                        suggestions.innerHTML = "";
                    };
                    suggestions.appendChild(div);
                });
            }
        });

    });


function c1() {
    const loading = document.getElementById("loading");
    const resultCard = document.querySelector(".result-card");
    const loadingText = document.getElementById("loading-text");

    // Show loader and hide result card
    loading.classList.remove("hidden");
    loadingText.classList.remove("hidden");
    resultCard.style.display = "none";
    const navStar = document.getElementById("nav-star");
    fetch('https://script.google.com/macros/s/AKfycbz-RzAY-ULjUyFtrNUO6u80PBAxfix-Z9dRr5ZLwIagei-tTY7SVuNj2ll5hQKOXt6m5w/exec')
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            const students = json.data;
            suggestions.innerHTML = "";
            const matchedStudent = students.find(s => s["Name of the student"] === input.value || s["NIAT ID"] === input.value);
            loading.classList.add("hidden");
            loadingText.classList.add("hidden");
            resultCard.style.display = "block";
            if (matchedStudent) {
                resultName.textContent = matchedStudent["Name of the student"];
                resultid.textContent = matchedStudent["NIAT ID"];
                resultsection.textContent = matchedStudent["New Section"];
                resulthall.textContent = matchedStudent["Hall No. "];
                resultmentor.textContent = matchedStudent["Mentor"];
                resultsucesscoach.textContent = matchedStudent["Success Coach"];
                const section = matchedStudent["New Section"];
                if (["IB-1", "IB-2", "IB-3", "IB-4", "IB-5"].includes(section)) {
                    navStar.classList.remove("hidden");
                } else {
                    navStar.classList.add("hidden");
                }
            } else {
                navStar.classList.add("hidden");
                alert("🚫 Please check your input.");
            }
        })
        .catch(function(error) {
            loading.classList.add("hidden");
            loadingText.classList.add("hidden");
            resultCard.style.display = "block";
            alert("⚠️ Error fetching data.");
            console.error(error);
        });
}
input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        c1();
    }
});


const timerDisplay = document.getElementById("time-spent");
let seconds = 0;
let timerInterval = null;

// Helper to get today's date as a string (YYYY-MM-DD)
function getTodayKey() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

// Load time from localStorage if it's from today
const todayKey = getTodayKey();
const storedData = JSON.parse(localStorage.getItem("dailyTime")) || {};
if (storedData.date === todayKey) {
    seconds = storedData.seconds || 0;
} else {
    localStorage.setItem("dailyTime", JSON.stringify({
        date: todayKey,
        seconds: 0
    }));
}

function updateTimerDisplay() {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            seconds++;
            updateTimerDisplay();
            localStorage.setItem("dailyTime", JSON.stringify({
                date: todayKey,
                seconds
            }));
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// Start the timer
updateTimerDisplay();
startTimer();

// Pause/resume on tab visibility
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopTimer();
    } else {
        startTimer();
    }
});