// darkMode-module.js

document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Verificar se há preferência salva no localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Aplicar o modo escuro se estava ativo
    if (isDarkMode) {
        body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }
    }

    // Aguardar o carregamento do header para adicionar o event listener
    setTimeout(() => {
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            toggle.addEventListener('change', function() {
                if (this.checked) {
                    body.classList.add('dark-mode');
                    localStorage.setItem('darkMode', 'true');
                } else {
                    body.classList.remove('dark-mode');
                    localStorage.setItem('darkMode', 'false');
                }
            });
        }
    }, 100);
});

// Função para alternar modo escuro programaticamente
export function toggleDarkMode() {
    const body = document.body;
    const toggle = document.getElementById('darkModeToggle');
    
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    
    if (toggle) {
        toggle.checked = isDarkMode;
    }
    
    localStorage.setItem('darkMode', isDarkMode.toString());
}