// activity_module.js

let timerInterval = null;
let totalSeconds = 0;
let remainingSeconds = 0;
let isRunning = false;

let referenceSecondsWarningAlert = 60;
let referenceSecondsDangerAlert = 30;

// Activity settings (imported from section_module.js)
let currentActivity = null;

// Function to set the activity image
export function setActivityImage(imagePath) {
    const activityImg = document.getElementById('activity-id');
    if (activityImg) {
        activityImg.src = imagePath;
        activityImg.alt = `Imagem da atividade: ${imagePath}`;
    }
}

// Function to set the limit for seconds reference in percentage
function setLimitSecondsReference(seconds, percentage) {
    return parseInt(seconds * percentage / 100);
}

// Function to set the timer with specific minutes
export function setTimer(minutes = 10) {
    totalSeconds = minutes * 60;
    remainingSeconds = totalSeconds;
    referenceSecondsWarningAlert = setLimitSecondsReference(totalSeconds, 50); // half the time
    referenceSecondsDangerAlert = setLimitSecondsReference(totalSeconds, 10); // 10% of the time
    updateTimerDisplay();
}

// Function to start the timer
window.startTimer = function () {
    if (remainingSeconds <= 0) {
        alert('Configure o tempo primeiro!');
        return;
    }

    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            remainingSeconds--;
            updateTimerDisplay();

            // Alert when time limit is reached
            if (remainingSeconds === referenceSecondsWarningAlert) {
                showNotification(`Resta pouco tempo!`, 'warning');
            }

            // Alert when 1 minute remaining
            if (remainingSeconds === referenceSecondsDangerAlert) {
                showNotification('Tempo esgotando!', 'danger');
            }

            // Timer finished
            if (remainingSeconds <= 0) {
                finishTimer();
            }
        }, 1000);

        updateTimerButtons();
        showNotification('Timer iniciado!', 'success');
    }
};

// Function to pause the timer
window.pauseTimer = function () {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        updateTimerButtons();
        showNotification('Timer pausado!', 'info');
    }
};

// Function to reset the timer
window.resetTimer = function () {
    isRunning = false;
    clearInterval(timerInterval);
    remainingSeconds = totalSeconds;
    updateTimerDisplay();
    updateTimerButtons();
    showNotification('Timer resetado!', 'secondary');
};

// Function to set the timer manually
window.setTimer = function () {
    const minutes = prompt('Digite o tempo em minutos:', Math.floor(totalSeconds / 60));
    if (minutes !== null && !isNaN(minutes) && minutes > 0) {
        setTimer(minutes);
        updateTimerDisplay();
        showNotification(`Timer configurado para ${minutes} minutos!`, 'primary');
    }
};

// Function to update the timer display
function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const chronometer = document.getElementById('chronometer');
    if (chronometer) {
        chronometer.textContent = display;

        // Color change based on remaining time
        chronometer.className = '';
        if (remainingSeconds <= referenceSecondsDangerAlert) {
            chronometer.classList.add('text-danger');
        } else if (remainingSeconds <= referenceSecondsWarningAlert) {
            chronometer.classList.add('text-warning');
        } else {
            chronometer.classList.add('text-success');
        }
    }

    // Update page title with time remaining
    if (remainingSeconds > 0 && isRunning) {
        document.title = `(${display}) INFO - Atividade`;
    } else {
        document.title = 'INFO';
    }
}

// Function to update button status
function updateTimerButtons() {
    const buttons = document.querySelectorAll('.btn-group button');
    buttons.forEach(btn => {
        btn.disabled = false;
    });

    // Disable the play button if it is already spinning
    const playBtn = document.querySelector('button[onclick="startTimer()"]');
    if (playBtn && isRunning) {
        playBtn.disabled = true;
    }

    // Disable pause button if not spinning
    const pauseBtn = document.querySelector('button[onclick="pauseTimer()"]');
    if (pauseBtn && !isRunning) {
        pauseBtn.disabled = true;
    }
}

// Function called when the timer ends
function finishTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    remainingSeconds = 0;
    updateTimerDisplay();
    updateTimerButtons();

    // Notification and effects when finished
    showNotification('Tempo esgotado! Atividade finalizada!', 'success');

    // Flashing timer
    const chronometer = document.getElementById('chronometer');
    if (chronometer) {
        chronometer.classList.add('text-danger');
        let blinkCount = 0;
        const blinkInterval = setInterval(() => {
            chronometer.style.opacity = chronometer.style.opacity === '0.3' ? '1' : '0.3';
            blinkCount++;
            if (blinkCount >= 10) {
                clearInterval(blinkInterval);
                chronometer.style.opacity = '1';
            }
        }, 300);
    }

    // Notification sound
    playNotificationSound();
}

// Function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 80px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Show with animation
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);

    // Automatically remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Function to play notification sound
function playNotificationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.log('Som de notificação não disponível');
    }
}

// Function to configure specific activity
export function setupActivity(activityIndex, activities) {
    if (activities && activities[activityIndex]) {
        currentActivity = activities[activityIndex];
        setActivityImage(currentActivity.imagePath);
        setTimer(currentActivity.minutes);
    }
}

// Save timer status (useful to avoid losing progress)
function saveTimerState() {
    const state = {
        totalSeconds,
        remainingSeconds,
        isRunning,
        timestamp: Date.now()
    };
    sessionStorage.setItem('timerState', JSON.stringify(state));
}

// Restore timer status
function restoreTimerState() {
    const saved = sessionStorage.getItem('timerState');
    if (saved) {
        try {
            const state = JSON.parse(saved);
            const elapsed = Math.floor((Date.now() - state.timestamp) / 1000);

            if (state.isRunning && state.remainingSeconds > elapsed) {
                totalSeconds = state.totalSeconds;
                remainingSeconds = state.remainingSeconds - elapsed;
                updateTimerDisplay();
                if (remainingSeconds > 0) {
                    startTimer();
                }
            }
        } catch (error) {
            console.log('Erro ao restaurar estado do timer');
        }
    }
}

// Save state periodically
setInterval(saveTimerState, 5000);

// Restore state when module is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(restoreTimerState, 1000);
});