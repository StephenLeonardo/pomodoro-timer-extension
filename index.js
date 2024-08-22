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
    
}

function resetTimer() {

}


// display timer
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
});