// section-module.js

// Module imports
import { setupActivity } from "./activity_module.js";
import { setSlides } from "./slider_module.js";

// Activity settings
const activities = [
    { imagePath: "img/activities/default-activity.svg", minutes: 2 }, // standard image and minimum time
    { imagePath: "img/activities/activity_01.svg", minutes: 30 },
    { imagePath: "img/activities/activity_02.svg", minutes: 40 }
];

// Slides settings
const sliders = [
    { path: "img/welcome", slides: ['welcome.svg'] },
    { path: "img/slides/group_01", slides: ['slide_01.svg', 'slide_02.svg'] },
    { path: "img/slides/group_01", slides: ['slide_02.svg', 'slide_01.svg'] },
];

// Topic settings
const topics = [
    { title: "Tema 01", content: "theme_01" },
    { title: "Tema 02", content: "theme_02" },
];

// Function that loads HTML components when using module
export async function loadComponent(placeholderId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Erro ao carregar ${componentPath}: ${response.status}`);
        }
        const html = await response.text();
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = html;
        }
    } catch (error) {
        console.error('Erro ao carregar componente:', error);
    }
}

// Function that loads sections when using module
export async function loadSection(sectionName) {
    try {       
        const response = await fetch(`components/sections/${sectionName}.html`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar seção ${sectionName}: ${response.status}`);
        }
        const html = await response.text();
        const mainContent = document.getElementById('main-content-placeholder');
        if (mainContent) {
            mainContent.innerHTML = html;
        }
    } catch (error) {
        console.error('Erro ao carregar seção:', error);
    }
}

// Function for menu navigation
window.menu = function(type, index) {
    switch(type) {
        case 'activities':
            loadActivitySection(index);
            break;
        case 'slider':
            loadSliderSection(index);
            break;
        case 'topics':
            loadTopicSection(index);
            break;
        default:
            console.warn('Tipo de menu não reconhecido:', type);
    }
};

// Load activities section
async function loadActivitySection(activityIndex) {
    try {
        await loadSection('activity');
        
        // Wait for the DOM to be updated
        setTimeout(() => {
            if (activities[activityIndex]) {
                setupActivity(activityIndex, activities);
                console.log(`Atividade ${activityIndex} carregada`);
            } else {
                console.error('Índice de atividade inválido:', activityIndex);
            }
        }, 100);
        
    } catch (error) {
        console.error('Erro ao carregar atividade:', error);
    }
}

// Load slide section
async function loadSliderSection(sliderIndex) {
    try {
        await loadSection('slider');
        
        // Wait for the DOM to be updated
        setTimeout(() => {
            if (sliders[sliderIndex]) {
                setSlides(sliders[sliderIndex]);
                console.log(`Slides ${sliderIndex} carregados`);
            } else {
                console.error('Índice de slider inválido:', sliderIndex);
            }
        }, 100);
        
    } catch (error) {
        console.error('Erro ao carregar slides:', error);
    }
}

// Load Topic Section
async function loadTopicSection(topicIndex) {
    try {
        console.log(`Carregando tópico ${topicIndex}`);
        await loadSection(topics[topicIndex].content);
        
    } catch (error) {
        console.error('Erro ao carregar tópico:', error);
    }
}

// Export settings for external use if needed
export { activities, sliders, topics };

// Make menu function available globally
window.loadSection = loadSection;