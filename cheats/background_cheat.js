let timer;
let timeLeft;
let isWorkState = true;
let workTimeGlobal, restTimeGlobal;

chrome.notifications.onClosed.addListener(() => {
    isWorkState = !isWorkState;
    startTimer(workTimeGlobal, restTimeGlobal);
});

function startTimer(workTime, restTime) {
    if (timer) clearInterval(timer);

    workTimeGlobal = workTime;
    restTimeGlobal = restTime;

    timeLeft = isWorkState ? workTime : restTime;

    timer = setInterval(function() {
        timeLeft--;

        chrome.runtime.sendMessage({
            action: 'updateTime',
            timeLeft: timeLeft,
            isWorkState: isWorkState
        });

        if (timeLeft <= 0) {
            clearInterval(timer);

            // Create a notification when the timer ends
            chrome.notifications.create('pomodoroNotification', {
                type: 'basic',
                iconUrl: "icon.png",
                title: 'Pomodoro Timer',
                message: isWorkState ? 'Work session is over. Take a break!' : 'Break is over. Back to work!',
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
    }
});