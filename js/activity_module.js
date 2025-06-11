// activity_module.js

let timerInterval = null;
let totalSeconds = 0;
let remainingSeconds = 0;
let isRunning = false;

// Configurações das atividades (importado do section_module.js)
let currentActivity = null;

// Função para definir a imagem da atividade
export function setActivityImage(imagePath) {
    const activityImg = document.getElementById('activity-id');
    if (activityImg) {
        activityImg.src = imagePath;
        activityImg.alt = `Imagem da atividade: ${imagePath}`;
    }
}

// Função para configurar o timer com minutos específicos
export function setTimer(minutes = 10) {
    totalSeconds = minutes * 60;
    remainingSeconds = totalSeconds;
    updateTimerDisplay();
    resetTimer();
}

// Função para iniciar o timer
window.startTimer = function() {
    if (remainingSeconds <= 0) {
        alert('Configure o tempo primeiro!');
        return;
    }
    
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            remainingSeconds--;
            updateTimerDisplay();
            
            // Alerta quando restam 5 minutos
            if (remainingSeconds === 300) {
                showNotification('⚠️ Restam 5 minutos!', 'warning');
            }
            
            // Alerta quando resta 1 minuto
            if (remainingSeconds === 60) {
                showNotification('⏰ Último minuto!', 'danger');
            }
            
            // Timer finalizado
            if (remainingSeconds <= 0) {
                finishTimer();
            }
        }, 1000);
        
        updateTimerButtons();
        showNotification('⏱️ Timer iniciado!', 'success');
    }
};

// Função para pausar o timer
window.pauseTimer = function() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        updateTimerButtons();
        showNotification('⏸️ Timer pausado!', 'info');
    }
};

// Função para resetar o timer
window.resetTimer = function() {
    isRunning = false;
    clearInterval(timerInterval);
    remainingSeconds = totalSeconds;
    updateTimerDisplay();
    updateTimerButtons();
    showNotification('🔄 Timer resetado!', 'secondary');
};

// Função para configurar o timer manualmente
window.setTimer = function() {
    const minutes = prompt('Digite o tempo em minutos:', Math.floor(totalSeconds / 60));
    if (minutes !== null && !isNaN(minutes) && minutes > 0) {
        totalSeconds = parseInt(minutes) * 60;
        remainingSeconds = totalSeconds;
        updateTimerDisplay();
        resetTimer();
        showNotification(`⚙️ Timer configurado para ${minutes} minutos!`, 'primary');
    }
};

// Função para atualizar o display do timer
function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const chronometer = document.getElementById('chronometer');
    if (chronometer) {
        chronometer.textContent = display;
        
        // Mudança de cor baseada no tempo restante
        chronometer.className = '';
        if (remainingSeconds <= 60) {
            chronometer.classList.add('text-danger');
        } else if (remainingSeconds <= 300) {
            chronometer.classList.add('text-warning');
        } else {
            chronometer.classList.add('text-success');
        }
    }
    
    // Atualizar título da página com tempo restante
    if (remainingSeconds > 0 && isRunning) {
        document.title = `(${display}) INFO - Atividade`;
    } else {
        document.title = 'INFO';
    }
}

// Função para atualizar estado dos botões
function updateTimerButtons() {
    const buttons = document.querySelectorAll('.btn-group button');
    buttons.forEach(btn => {
        btn.disabled = false;
    });
    
    // Desabilitar botão play se já estiver rodando
    const playBtn = document.querySelector('button[onclick="startTimer()"]');
    if (playBtn && isRunning) {
        playBtn.disabled = true;
    }
    
    // Desabilitar botão pause se não estiver rodando
    const pauseBtn = document.querySelector('button[onclick="pauseTimer()"]');
    if (pauseBtn && !isRunning) {
        pauseBtn.disabled = true;
    }
}

// Função chamada quando o timer termina
function finishTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    remainingSeconds = 0;
    updateTimerDisplay();
    updateTimerButtons();
    
    // Notificação e efeitos quando termina
    showNotification('🎉 Tempo esgotado! Atividade finalizada!', 'success');
    
    // Piscar o cronômetro
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
    
    // Som de notificação (opcional)
    playNotificationSound();
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
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
    
    // Mostrar com animação
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    // Remover automaticamente após 4 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Função para tocar som de notificação
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

// Função para configurar atividade específica
export function setupActivity(activityIndex, activities) {
    if (activities && activities[activityIndex]) {
        currentActivity = activities[activityIndex];
        setActivityImage(currentActivity.imagePath);
        setTimer(currentActivity.minutes);
    }
}

// Salvar estado do timer (útil para não perder progresso)
function saveTimerState() {
    const state = {
        totalSeconds,
        remainingSeconds,
        isRunning,
        timestamp: Date.now()
    };
    sessionStorage.setItem('timerState', JSON.stringify(state));
}

// Restaurar estado do timer
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

// Salvar estado periodicamente
setInterval(saveTimerState, 5000);

// Restaurar estado quando o módulo é carregado
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(restoreTimerState, 1000);
});