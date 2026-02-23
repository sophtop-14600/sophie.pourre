let currentLang = localStorage.getItem('preferredLang') || 'fr';

document.addEventListener('DOMContentLoaded', () => {
    updateUIContent();
    setupEventListeners();
    updateProgressBar();
    
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, { threshold: 0.6, rootMargin: "-10% 0px -10% 0px" });
        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }
});

function unlockPortfolio() {
    const input = document.getElementById('portfolio-pwd');
    const error = document.getElementById('pwd-error');
    const modal = document.getElementById('portfolio-modal');
    const modalContent = document.getElementById('portfolio-content');
    
    const validPasswords = ['recruteur', 'portfolio', 'lxdesign', 'sophie'];
    const val = input.value.trim().toLowerCase();
    
    if (!val) {
        error.textContent = translations[currentLang]['pwd_required'];
        error.classList.remove('hidden');
        input.parentElement.classList.add('shake', 'border-red-500');
        setTimeout(() => input.parentElement.classList.remove('shake'), 400);
        return;
    }

    if (validPasswords.includes(val)) {
        error.classList.add('hidden');
        input.parentElement.classList.remove('border-red-500');
        input.value = ''; 
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    } else {
        error.textContent = translations[currentLang]['pwd_incorrect'];
        error.classList.remove('hidden');
        input.parentElement.classList.add('shake', 'border-red-500');
        setTimeout(() => input.parentElement.classList.remove('shake'), 400);
    }
}

function closePortfolio() {
    const modal = document.getElementById('portfolio-modal');
    const modalContent = document.getElementById('portfolio-content');
    
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

function toggleDetails(id, btn) {
    const el = document.getElementById(id);
    if (!el) return;
    const isHidden = el.classList.contains('hidden');
    el.classList.toggle('hidden');
    const textDetails = translations[currentLang]['details_button'] || 'Détails';
    const textLess = translations[currentLang]['less_button'] || 'Moins';
    if (isHidden) {
        btn.querySelector('span').textContent = textLess;
        btn.querySelector('i').classList.remove('fa-plus-circle');
        btn.querySelector('i').classList.add('fa-minus-circle');
    } else {
        btn.querySelector('span').textContent = textDetails;
        btn.querySelector('i').classList.remove('fa-minus-circle');
        btn.querySelector('i').classList.add('fa-plus-circle');
    }
}

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
    
    const searchInput = document.getElementById('search-input');
    if (searchInput && translations[currentLang]['search_placeholder']) {
        searchInput.placeholder = translations[currentLang]['search_placeholder'];
    }
    
    const pwdInput = document.getElementById('portfolio-pwd');
    if (pwdInput && translations[currentLang]['pwd_placeholder']) {
        pwdInput.placeholder = translations[currentLang]['pwd_placeholder'];
    }

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