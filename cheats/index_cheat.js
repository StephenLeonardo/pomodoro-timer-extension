let workTime = 0;
let breakTime = 0;

const statusDisplay = document.getElementById('status');
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const workMinutesInput = document.getElementById('work-minutes');
const workSecondsInput = document.getElementById('work-seconds');
const breakMinutesInput = document.getElementById('break-minutes');
const breakSecondsInput = document.getElementById('break-seconds');

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

function startTimer() {
    //   if (timer) clearInterval(timer); // Clear any existing timer
    //   isRunning = true;

    workTime = parseInt(workMinutesInput.value) * 60 + parseInt(workSecondsInput.value);
    breakTime = parseInt(breakMinutesInput.value) * 60 + parseInt(breakSecondsInput.value);

    chrome.runtime.sendMessage({
        action: 'start',
        workTime: workTime,
        restTime: breakTime
    });
}

function resetTimer() {
    chrome.runtime.sendMessage({
        action: 'reset'
    });
    statusDisplay.textContent = "";
    timeDisplay.textContent = "";
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateTime') {
        statusDisplay.textContent = message.isWorkState ? "WORKING" : "RESTING";

        const minutes = Math.floor(message.timeLeft / 60);
        const seconds = message.timeLeft % 60;
        timeDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } else if (message.action === 'showAlert') {
        alert(message.message);
        chrome.runtime.sendMessage({
            action: 'alertClosed',
            workTime: workTime,
            restTime: breakTime
        });
    }
});