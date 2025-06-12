// footer-module.js

document.addEventListener('DOMContentLoaded', function () {
    updateFooterInfo();

    // Update footer every second
    setInterval(updateFooterInfo, 1000);
});

function updateFooterInfo() {
    const footerInfo = document.getElementById('footer-info');
    if (!footerInfo) return;

    const now = new Date();
    const locale = navigator.language || "pt-BR";

    // Date and time formatting
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Sao_Paulo'
    };

    const dateTimeString = now.toLocaleDateString(locale, options);

    footerInfo.textContent = `${dateTimeString}`;
}

// Function call by module
export function forceUpdateFooter() {
    updateFooterInfo();
    console.log("Data e hora do 'footer' atualizada!");
}