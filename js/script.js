// script.js

// Module imports
import { loadComponent, loadSection } from "./section_module.js";
import { forceUpdateFooter } from "./footer_module.js";
import "./darkmode_module.js";

// Application initialization
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load components
        await loadComponent('header-placeholder', 'components/header.html');
        await loadComponent('footer-placeholder', 'components/footer.html');

        // Load home section by default
        await loadSection('home');
        
        console.log('Aplicação inicializada com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
    }

    // Update date and time
    forceUpdateFooter();
});

// Make the loadSection function available globally
window.loadSection = loadSection;