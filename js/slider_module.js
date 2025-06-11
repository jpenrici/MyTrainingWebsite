// slider_module.js

let currentSlides = [];
let currentSlideIndex = 0;
let slidesContainer = null;
let isZoomed = false;
let autoSlideInterval = null;
let isAutoSliding = false;

// Main function to configure slides
export function setSlides(slideGroup) {
    if (!slideGroup || !slideGroup.slides || slideGroup.slides.length === 0) {
        console.error('Grupo de slides inválido');
        return;
    }
    
    currentSlides = slideGroup.slides.map(slide => `${slideGroup.path}/${slide}`);
    currentSlideIndex = 0;
    isZoomed = false;
    
    initializeSlider();
    loadSlides();
    showSlide(0);
    setupKeyboardControls();
    setupAutoSlide();
}

// Initialize the slider container
function initializeSlider() {
    slidesContainer = document.getElementById('slidesContainer');
    if (!slidesContainer) {
        console.error('Container de slides não encontrado');
        return;
    }
    
    slidesContainer.innerHTML = '';
    slidesContainer.className = 'slider-container';
}

// Load all slides
function loadSlides() {
    if (!slidesContainer) return;
    
    currentSlides.forEach((slidePath, index) => {
        const slideDiv = createSlideElement(slidePath, index);
        slidesContainer.appendChild(slideDiv);
    });
    
    // Adding navigation controls if there are multiple slides
    if (currentSlides.length > 1) {
        addNavigationControls();
        addSlideIndicators();
    }
    
    // Adicionar informações do slide atual
    addSlideInfo();
}

// Create individual slide element
function createSlideElement(slidePath, index) {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'slide';
    slideDiv.dataset.slideIndex = index;
    
    const img = document.createElement('img');
    img.src = slidePath;
    img.alt = `Slide ${index + 1}`;
    img.loading = 'lazy';
    
    // Image events
    img.addEventListener('click', toggleZoom);
    img.addEventListener('load', () => {
        slideDiv.classList.add('loaded');
    });
    img.addEventListener('error', () => {
        handleImageError(img, slideDiv);
    });
    
    slideDiv.appendChild(img);
    return slideDiv;
}

// Adding navigation controls (arrows)
function addNavigationControls() {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'prev-btn';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.title = 'Slide anterior';
    prevBtn.addEventListener('click', previousSlide);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'next-btn';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.title = 'Próximo slide';
    nextBtn.addEventListener('click', nextSlide);
    
    slidesContainer.appendChild(prevBtn);
    slidesContainer.appendChild(nextBtn);
}

// Adding slide indicators (dots)
function addSlideIndicators() {
    const indicatorsDiv = document.createElement('div');
    indicatorsDiv.className = 'slide-indicators';
    indicatorsDiv.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        z-index: 15;
    `;
    
    currentSlides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = 'slide-indicator';
        indicator.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.5);
            background: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        indicator.title = `Ir para slide ${index + 1}`;
        indicator.addEventListener('click', () => showSlide(index));
        indicatorsDiv.appendChild(indicator);
    });
    
    slidesContainer.appendChild(indicatorsDiv);
}

// Adding information from the current slide
function addSlideInfo() {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'slide-info';
    infoDiv.style.cssText = `
        position: absolute;
        top: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 15;
        user-select: none;
    `;
    
    slidesContainer.appendChild(infoDiv);
    updateSlideInfo();
}

// Show specific slide
function showSlide(index) {
    if (index < 0 || index >= currentSlides.length) return;
    
    // Hide current slide
    const currentSlide = slidesContainer.querySelector('.slide.active');
    if (currentSlide) {
        currentSlide.classList.remove('active');
    }
    
    // Show new slide
    const newSlide = slidesContainer.querySelector(`[data-slide-index="${index}"]`);
    if (newSlide) {
        newSlide.classList.add('active');
        currentSlideIndex = index;
        updateSlideIndicators();
        updateSlideInfo();
        resetZoom();
    }
}

// Next slide
function nextSlide() {
    const nextIndex = (currentSlideIndex + 1) % currentSlides.length;
    showSlide(nextIndex);
}

// Previous slide
function previousSlide() {
    const prevIndex = (currentSlideIndex - 1 + currentSlides.length) % currentSlides.length;
    showSlide(prevIndex);
}

// Toggle image zoom
function toggleZoom(event) {
    const slide = event.target.closest('.slide');
    const img = event.target;
    
    if (!isZoomed) {
        // Calculate click position for targeted zoom
        const rect = img.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        
        img.style.transformOrigin = `${50 + x * 20}% ${50 + y * 20}%`;
        slide.classList.add('zoomed');
        isZoomed = true;
        
        // Disable auto-slide during zoom
        pauseAutoSlide();
    } else {
        slide.classList.remove('zoomed');
        isZoomed = false;
        
        // Reactivate auto-slide
        resumeAutoSlide();
    }
}

// Reset zoom
function resetZoom() {
    const currentSlide = slidesContainer.querySelector('.slide.active');
    if (currentSlide) {
        currentSlide.classList.remove('zoomed');
        isZoomed = false;
    }
}

// Updating slide indicators
function updateSlideIndicators() {
    const indicators = slidesContainer.querySelectorAll('.slide-indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentSlideIndex) {
            indicator.style.background = 'rgba(255, 255, 255, 0.9)';
            indicator.style.borderColor = 'rgba(255, 255, 255, 0.9)';
        } else {
            indicator.style.background = 'transparent';
            indicator.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        }
    });
}

// Updating slide information
function updateSlideInfo() {
    if (currentSlides.length <= 1) return;
    const infoDiv = slidesContainer.querySelector('.slide-info');
    if (infoDiv) {
        infoDiv.textContent = `${currentSlideIndex + 1} / ${currentSlides.length}`;
    }
}

// Configuring Keyboard Controls
function setupKeyboardControls() {
    document.addEventListener('keydown', handleKeyboard);
}

// Handling Keyboard Events
function handleKeyboard(event) {
    // Only works if the slider is active
    if (!slidesContainer || !slidesContainer.querySelector('.slide.active')) return;
    
    switch(event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
            event.preventDefault();
            previousSlide();
            break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // Space
            event.preventDefault();
            nextSlide();
            break;
        case 'Home':
            event.preventDefault();
            showSlide(0);
            break;
        case 'End':
            event.preventDefault();
            showSlide(currentSlides.length - 1);
            break;
        case 'Escape':
            if (isZoomed) {
                resetZoom();
            } else {
                toggleAutoSlide();
            }
            break;
        case 'f':
        case 'F':
            toggleFullscreen();
            break;
    }
}

// Configure auto-slide
function setupAutoSlide() {
    if (currentSlides.length > 1) {
        addAutoSlideControls();
    }
}

// Add auto-slide controls
function addAutoSlideControls() {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'auto-slide-controls';
    controlsDiv.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
        z-index: 15;
    `;
    
    const playPauseBtn = document.createElement('button');
    playPauseBtn.className = 'auto-slide-btn';
    playPauseBtn.innerHTML = 'Auto';
    playPauseBtn.title = 'Auto-slide (ESC)';
    playPauseBtn.style.cssText = `
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
    `;
    playPauseBtn.addEventListener('click', toggleAutoSlide);
    
    controlsDiv.appendChild(playPauseBtn);
    slidesContainer.appendChild(controlsDiv);
}

// Toggle auto-slide
function toggleAutoSlide() {
    if (isAutoSliding) {
        pauseAutoSlide();
    } else {
        startAutoSlide();
    }
}

// Start auto-slide
function startAutoSlide() {
    if (currentSlides.length <= 1) return;
    
    isAutoSliding = true;
    autoSlideInterval = setInterval(nextSlide, 5000); // 5 seconds
    
    const btn = slidesContainer.querySelector('.auto-slide-btn');
    if (btn) {
        btn.innerHTML = 'Pausar';
        btn.title = 'Pausar auto-slide (ESC)';
    }
}

// Pause auto-slide
function pauseAutoSlide() {
    isAutoSliding = false;
    clearInterval(autoSlideInterval);
    
    const btn = slidesContainer.querySelector('.auto-slide-btn');
    if (btn) {
        btn.innerHTML = 'Auto';
        btn.title = 'Iniciar auto-slide (ESC)';
    }
}

// Auto-slide resume
function resumeAutoSlide() {
    if (isAutoSliding) {
        startAutoSlide();
    }
}

// Toggle full screen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        slidesContainer.requestFullscreen?.() || 
        slidesContainer.webkitRequestFullscreen?.() || 
        slidesContainer.mozRequestFullScreen?.();
    } else {
        document.exitFullscreen?.() || 
        document.webkitExitFullscreen?.() || 
        document.mozCancelFullScreen?.();
    }
}

// Dealing with image loading error
function handleImageError(img, slideDiv) {
    img.alt = 'Erro ao carregar imagem';
    img.style.display = 'none';
    
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: #f8f9fa;
        color: #6c757d;
        font-size: 18px;
        text-align: center;
    `;
    errorDiv.innerHTML = `
        <div>
            <div style="font-size: 48px; margin-bottom: 10px;">Sem Imagem</div>
            <div>Erro ao carregar imagem</div>
            <div style="font-size: 14px; margin-top: 5px;">${img.src}</div>
        </div>
    `;
    
    slideDiv.appendChild(errorDiv);
}

// Cleanup when exiting slider
export function cleanupSlider() {
    pauseAutoSlide();
    document.removeEventListener('keydown', handleKeyboard);
    resetZoom();
}

// Event listener for automatic cleaning
document.addEventListener('beforeunload', cleanupSlider);