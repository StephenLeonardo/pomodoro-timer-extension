let timer;
let timeLeft = 1500; // Default 25 minutes in seconds
let isRunning = false;
let prevState = "work";
let isWorkState = true;

const statusDisplay = document.getElementById('status');
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const workMinutesInput = document.getElementById('work-minutes');
const workSecondsInput = document.getElementById('work-seconds');
const breakMinutesInput = document.getElementById('break-minutes');
const breakSecondsInput = document.getElementById('break-seconds');
const modal = document.getElementById('custom-alert');
const modalOkButton = document.getElementById('modal-ok');
const modalText = document.getElementById('modal-text')

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

function startTimer() {
  if (timer) clearInterval(timer); // Clear any existing timer
  isRunning = true;

  const workTime = parseInt(workMinutesInput.value) * 60 + parseInt(workSecondsInput.value);
  const breakTime = parseInt(breakMinutesInput.value) * 60 + parseInt(breakSecondsInput.value);

  // default to workTime based on requirement
  timeLeft = isWorkState ? workTime : breakTime;

  timer = setInterval(function() {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer); // Stop the timer
      alert(isWorkState ? 'Work session is over. Take a break!' : 'Break is over. Back to work!');

      // Switch to the next state
      isWorkState = !isWorkState;
      timeLeft = isWorkState ? workTime : breakTime;
      updateTimerDisplay();
      startTimer(); // Start the next session
    }
  }, 1000); // Update every second
}

function resetTimer() {
  clearInterval(timer);
  const workTime = parseInt(workMinutesInput.value) * 60 + parseInt(workSecondsInput.value);
  timeLeft = workTime;
  prevState = "work";
  isWorkState = true;
  isRunning = false;
  updateTimerDisplay();
}

function updateTimerDisplay() {
    if (isRunning) {
        statusDisplay.textContent = isWorkState ? "WORKING" : "RESTING";
    } else {
        statusDisplay.textContent = "";
    }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Initialize the display with the default or inputted time
resetTimer();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start') {
    startTimer();
  } else if (message.action === 'reset') {
    resetTimer();
  }
});