let currentLang = localStorage.getItem('preferredLang') || 'fr';

document.addEventListener('DOMContentLoaded', () => {
    updateUIContent();
    setupEventListeners();
    updateProgressBar();
});

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const searchGo = document.getElementById('search-go');
    const clearViewBtn = document.getElementById('clear-view');

    const performSearch = () => {
        searchContent(searchInput.value);
        const cards = document.querySelectorAll('.searchable');
        for (const card of cards) {
            if (card.style.display !== 'none') {
                card.scrollIntoView({ behavior: 'smooth' });
                break;
            }
        }
        if (clearViewBtn) clearViewBtn.classList.remove('hidden');
    };

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            searchContent(searchInput.value);
            if (e.key === 'Enter') {
                performSearch();
                closeSearch(false);
            }
        });
    }

    if (searchGo) {
        searchGo.addEventListener('click', () => {
            performSearch();
            closeSearch(false);
        });
    }

    if (clearViewBtn) {
        clearViewBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            searchContent('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            clearViewBtn.classList.add('hidden');
        });
    }

    window.addEventListener('scroll', updateProgressBar);
}

function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) progressBar.style.width = scrolled + "%";
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToSection(category) {
    const map = {
        all: null,
        experience: 'experience',
        education: 'education',
        skills: 'moodle'
    };
    const targetId = map[category];

    // Update visual state of tabs
    const tabs = document.querySelectorAll('.tab-btn');
    const activeClasses = ['bg-[#395144]', 'text-white', 'shadow-md'];
    const inactiveClasses = ['text-[#395144]/60', 'hover:text-[#395144]', 'hover:bg-white/40'];
    tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === category) {
            tab.classList.remove(...inactiveClasses);
            tab.classList.add(...activeClasses);
        } else {
            tab.classList.remove(...activeClasses);
            tab.classList.add(...inactiveClasses);
        }
    });

    if (!targetId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeSearch(clearResults = true) {
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
        if (clearResults) {
            input.value = '';
            searchContent('');
        }
    }, 300);
}

function toggleSearch() {
    const overlay = document.getElementById('search-overlay');
    if (overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            document.getElementById('search-input').focus();
        }, 10);
    } else {
        closeSearch();
    }
}

function toggleLang() {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('preferredLang', currentLang);
    updateUIContent();
}

function updateUIContent() {
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (translations[currentLang] && translations[currentLang][key]) {
            elem.textContent = translations[currentLang][key];
        }
    });
    const input = document.getElementById('search-input');
    if (input) input.placeholder = translations[currentLang]['search_placeholder'];
    const langBtnText = document.getElementById('lang-btn-text');
    if (langBtnText) langBtnText.textContent = currentLang === 'fr' ? 'EN' : 'FR';
}

function searchContent(query) {
    const filter = query.toLowerCase();
    const cards = document.querySelectorAll('.searchable');
    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(filter) ? "" : "none";
    });
}

function filterSection(category) {
    const cards = document.querySelectorAll('.bento-card');
    const tabs = document.querySelectorAll('.tab-link');

    // Mise à jour visuelle des onglets
    tabs.forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === category);
    });

    // Filtrage des cartes
    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = "block";
            card.style.opacity = "1";
        } else {
            if (card.classList.contains(`cat-${category}`)) {
                card.style.display = "block";
                card.style.opacity = "1";
            } else {
                card.style.display = "none";
                card.style.opacity = "0";
            }
        }
    });
    
    // Retour en haut de la grille pour le confort utilisateur
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterSection(category) {
    const cards = document.querySelectorAll('.bento-card');
    const tabs = document.querySelectorAll('.tab-btn');

    const activeClasses = ['bg-[#395144]', 'text-white', 'shadow-md'];
    const inactiveClasses = ['text-[#395144]/60', 'hover:text-[#395144]', 'hover:bg-white/40'];

    tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === category) {
            tab.classList.remove(...inactiveClasses);
            tab.classList.add(...activeClasses);
        } else {
            tab.classList.remove(...activeClasses);
            tab.classList.add(...inactiveClasses);
        }
    });

    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = "block";
            setTimeout(() => card.style.opacity = "1", 10);
        } else {
            if (card.classList.contains(`cat-${category}`)) {
                card.style.display = "block";
                setTimeout(() => card.style.opacity = "1", 10);
            } else {
                card.style.opacity = "0";
                setTimeout(() => card.style.display = "none", 300);
            }
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}