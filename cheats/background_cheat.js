let timer;
let timeLeft;
let isWorkState = true;
let workTimeGlobal, restTimeGlobal;

// Setup the notification close listener
chrome.notifications.onClosed.addListener(() => {
    // Start the timer for the next state when the notification is closed
    isWorkState = !isWorkState;
    startTimer(workTimeGlobal, restTimeGlobal);
});

function startTimer(workTime, restTime) {
    if (timer) clearInterval(timer); // Clear any existing timer

    workTimeGlobal = workTime; // Save user input globally
    restTimeGlobal = restTime;

    timeLeft = isWorkState ? workTime : restTime;

    timer = setInterval(function() {
        timeLeft--;

        // Send the updated timeLeft to the popup to render the countdown
        chrome.runtime.sendMessage({
            action: 'updateTime',
            timeLeft: timeLeft,
            isWorkState: isWorkState
        });

        if (timeLeft <= 0) {
            clearInterval(timer);

            chrome.notifications.create('pomodoroNotification', {
                type: 'basic',
                iconUrl: 'icon.png',
                title: 'Pomodoro Timer',
                message: isWorkState ? 'Work session is over. Take a break!' : 'Break is over. Back to work!',
            }, (notificationId) => {
                chrome.notifications.onClicked.addListener(() => {
                    isWorkState = !isWorkState;
                    startTimer(workTime, restTime);
                });
            });

        }
    }, 1000); // Update every second
}

function resetTimer() {
    clearInterval(timer);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start') {
        startTimer(message.workTime, message.restTime);
    } else if (message.action === 'reset') {
        resetTimer();
    } else if (message.action === 'alertClosed') {
        isWorkState = !isWorkState;
        startTimer(message.workTime, message.restTime);
    }
});