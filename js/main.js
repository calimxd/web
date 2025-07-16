// Variables globales
let currentEpisodeIndex = 0;
let filteredEpisodes = [];
let currentSeason = 'all';
let playInSameTab = true; // Variable para controlar modo de reproducción

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Función principal de inicialización
function initializeApp() {
    showLoading();
    
    // Verificar si los datos están disponibles
    if (typeof episodesData === 'undefined' || !episodesData) {
        console.error('Los datos de episodios no están disponibles');
        hideLoading();
        showError('Error al cargar los datos de episodios. Por favor, recarga la página.');
        return;
    }
    
    console.log('Datos cargados:', episodesData.length, 'episodios');
    
    setTimeout(() => {
        try {
            loadEpisodes();
            setupEventListeners();
        } catch (error) {
            console.error('Error al inicializar:', error);
            hideLoading();
            showError('Error al inicializar la aplicación: ' + error.message);
        }
    }, 1000);
}

// Función para mostrar errores
function showError(message) {
    const episodesGrid = document.getElementById('episodesGrid');
    if (episodesGrid) {
        episodesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; background: #ffe6e6; border-radius: 10px; color: #cc0000;">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #cc0000; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Recargar Página
                </button>
            </div>
        `;
    }
}

// Mostrar pantalla de carga
function showLoading() {
    const loading = document.getElementById('loading');
    loading.classList.add('show');
}

// Ocultar pantalla de carga
function hideLoading() {
    const loading = document.getElementById('loading');
    loading.classList.remove('show');
}

// Cargar episodios en la grid
function loadEpisodes(season = 'all') {
    const episodesGrid = document.getElementById('episodesGrid');
    
    // Filtrar episodios por temporada
    filteredEpisodes = season === 'all' 
        ? episodesData 
        : episodesData.filter(ep => ep.season === parseInt(season));
    
    // Limpiar grid
    episodesGrid.innerHTML = '';
    
    // Crear cards de episodios con lazy loading
    filteredEpisodes.forEach((episode, index) => {
        const card = createEpisodeCard(episode, index);
        episodesGrid.appendChild(card);
    });
    
    // Aplicar lazy loading
    applyLazyLoading();
    
    // Ocultar pantalla de carga
    hideLoading();
}

// Crear card de episodio
function createEpisodeCard(episode, index) {
    const card = document.createElement('div');
    card.className = 'episode-card';
    card.setAttribute('data-loaded', 'false');
    card.setAttribute('data-episode-id', episode.id);
    
    card.innerHTML = `
        <div class="episode-thumbnail">
            <div class="episode-emoji">${episode.thumbnail}</div>
            <div class="play-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </div>
        </div>
        <div class="episode-info">
            <div class="episode-season">Temporada ${episode.season} - Episodio ${episode.episode}</div>
            <h3 class="episode-title">${episode.title}</h3>
            <p class="episode-description">${episode.description}</p>
        </div>
    `;
    
    // Agregar evento de click
    card.addEventListener('click', () => {
        openEpisodeModal(index);
    });
    
    return card;
}

// Reproducir episodio
function playEpisode(index) {
    if (index < 0 || index >= filteredEpisodes.length) return;
    
    currentEpisodeIndex = index;
    const episode = filteredEpisodes[index];
    
    // Actualizar información
    const currentEpisode = document.getElementById('currentEpisode');
    const currentDescription = document.getElementById('currentDescription');
    
    if (currentEpisode) {
        currentEpisode.textContent = episode.title;
    }
    if (currentDescription) {
        currentDescription.textContent = episode.description;
    }
    
    // Manejar diferentes tipos de URLs
    const videoWrapper = document.querySelector('.video-wrapper');
    
    if (videoWrapper && episode.url.includes('cubeembed.rpmvid.com/#')) {
        // Para URLs de cubeembed, usar la URL completa
        if (playInSameTab) {
            videoWrapper.innerHTML = `
                <div class="video-container">
                    <div class="video-controls-top">
                        <button onclick="toggleFullscreen(this.parentElement.parentElement.querySelector('iframe'))" class="fullscreen-btn" title="Pantalla completa">
                            ⛶ Pantalla Completa
                        </button>
                    </div>
                    <iframe 
                        src="${episode.url}" 
                        width="100%" 
                        height="400" 
                        frameborder="0" 
                        allowfullscreen
                        ondblclick="handleDoubleClick(this)"
                        style="border-radius: 0 0 10px 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);"
                    ></iframe>
                    <div class="video-info">
                        <p>Temporada ${episode.season} - Episodio ${episode.episode}</p>
                        <p class="double-click-hint">
                            💡 Haz doble clic en el video para pantalla completa
                        </p>
                    </div>
                </div>
            `;
        } else {
            videoWrapper.innerHTML = `
                <div class="external-player">
                    <div class="video-icon">📺</div>
                    <h3>${episode.title}</h3>
                    <p>Este episodio se abrirá en una nueva ventana</p>
                    <button onclick="openExternalVideo('${episode.url}', '${episode.title.replace(/'/g, "\\'")}')">
                        🎬 Ver Episodio en Nueva Ventana
                    </button>
                    <div class="video-info">
                        <p>Temporada ${episode.season} - Episodio ${episode.episode}</p>
                    </div>
                </div>
            `;
        }
    } else if (episode.url.includes('youtube.com') || episode.url.includes('youtu.be')) {
        // Para URLs de YouTube, usar iframe
        let embedUrl = episode.url;
        if (episode.url.includes('watch?v=')) {
            const videoId = episode.url.split('watch?v=')[1].split('&')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (episode.url.includes('youtu.be/')) {
            const videoId = episode.url.split('youtu.be/')[1];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        
        videoWrapper.innerHTML = `
            <iframe id="videoPlayer" 
                    src="${embedUrl}" 
                    frameborder="0" 
                    allowfullscreen
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
            </iframe>
        `;
    } else {
        // Para otras URLs, intentar iframe directo
        videoWrapper.innerHTML = `
            <iframe id="videoPlayer" 
                    src="${episode.url}" 
                    frameborder="0" 
                    allowfullscreen
                    loading="lazy">
            </iframe>
        `;
    }
    
    // Actualizar controles
    updatePlayerControls();
    
    // Highlight del episodio actual
    highlightCurrentEpisode();
}

// Función para alternar modo de reproducción
function togglePlayMode() {
    playInSameTab = !playInSameTab;
    const button = document.getElementById('playModeToggle');
    if (button) {
        button.textContent = playInSameTab ? '🖥️ Reproducir en nueva ventana' : '📺 Reproducir en misma pestaña';
    }
}

// Función para abrir video externo (solo se usa si playInSameTab es false)
function openExternalVideo(url, title) {
    if (!playInSameTab) {
        const popup = window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        
        if (popup) {
            popup.focus();
            
            // Mostrar mensaje de éxito
            const currentDescription = document.getElementById('currentDescription');
            if (currentDescription) {
                const originalText = currentDescription.textContent;
                currentDescription.textContent = `✅ Abriendo "${title}" en nueva ventana...`;
                currentDescription.style.color = '#28a745';
                
                setTimeout(() => {
                    currentDescription.textContent = originalText;
                    currentDescription.style.color = '';
                }, 3000);
            }
        } else {
            alert('Por favor, permite ventanas emergentes para ver el video.\n\nO puedes copiar este enlace y abrirlo manualmente:\n' + url);
        }
    }
}

// Actualizar controles
function updatePlayerControls() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentEpisodeIndex === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentEpisodeIndex === filteredEpisodes.length - 1;
    }
}

// Highlight del episodio actual
function highlightCurrentEpisode() {
    // Remover highlight anterior
    document.querySelectorAll('.episode-card').forEach(card => {
        card.classList.remove('current-episode');
    });
    
    // Agregar highlight al episodio actual
    const currentCard = document.querySelector(`[data-episode-id="${filteredEpisodes[currentEpisodeIndex].id}"]`);
    if (currentCard) {
        currentCard.classList.add('current-episode');
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros de temporada
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Actualizar botón activo
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Filtrar episodios
            const season = e.target.getAttribute('data-season');
            currentSeason = season;
            loadEpisodes(season);
        });
    });
    
    // Controles del reproductor
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentEpisodeIndex > 0) {
                playEpisode(currentEpisodeIndex - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentEpisodeIndex < filteredEpisodes.length - 1) {
                playEpisode(currentEpisodeIndex + 1);
            }
        });
    }
    
    // Navegación suave
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Teclas de acceso rápido
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('videoModal');
        const isModalOpen = modal && modal.classList.contains('show');
        
        if (isModalOpen) {
            if (e.key === 'ArrowLeft') {
                modalPreviousEpisode();
            } else if (e.key === 'ArrowRight') {
                modalNextEpisode();
            } else if (e.key === 'Escape') {
                closeEpisodeModal();
            }
        } else {
            if (e.key === 'ArrowLeft' && prevBtn) {
                prevBtn.click();
            } else if (e.key === 'ArrowRight' && nextBtn) {
                nextBtn.click();
            }
        }
    });
    
    // Event listeners para controles del modal
    const modalPrevBtn = document.getElementById('modalPrevBtn');
    const modalNextBtn = document.getElementById('modalNextBtn');
    
    if (modalPrevBtn) {
        modalPrevBtn.addEventListener('click', modalPreviousEpisode);
    }
    if (modalNextBtn) {
        modalNextBtn.addEventListener('click', modalNextEpisode);
    }
    
    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('videoModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEpisodeModal();
        }
    });
    
    // Escuchar cambios de pantalla completa
    document.addEventListener('fullscreenchange', function() {
        const fullscreenButtons = document.querySelectorAll('.fullscreen-btn');
        fullscreenButtons.forEach(btn => {
            if (document.fullscreenElement) {
                btn.innerHTML = '⛶ Salir de Pantalla Completa';
                btn.style.background = '#ff4444';
                btn.style.color = 'white';
            } else {
                btn.innerHTML = '⛶ Pantalla Completa';
                btn.style.background = 'rgba(255, 255, 255, 0.9)';
                btn.style.color = '#333';
            }
        });
    });
    
    // También para webkit
    document.addEventListener('webkitfullscreenchange', function() {
        const fullscreenButtons = document.querySelectorAll('.fullscreen-btn');
        fullscreenButtons.forEach(btn => {
            if (document.webkitFullscreenElement) {
                btn.innerHTML = '⛶ Salir de Pantalla Completa';
                btn.style.background = '#ff4444';
                btn.style.color = 'white';
            } else {
                btn.innerHTML = '⛶ Pantalla Completa';
                btn.style.background = 'rgba(255, 255, 255, 0.9)';
                btn.style.color = '#333';
            }
        });
    });
}

// Función para abrir el modal del episodio
function openEpisodeModal(index) {
    if (index < 0 || index >= filteredEpisodes.length) return;
    
    currentEpisodeIndex = index;
    const episode = filteredEpisodes[index];
    
    // Actualizar información del modal
    const modalTitle = document.getElementById('modalTitle');
    const modalEpisodeTitle = document.getElementById('modalEpisodeTitle');
    const modalEpisodeDescription = document.getElementById('modalEpisodeDescription');
    const modalPlayer = document.getElementById('modalPlayer');
    
    modalTitle.textContent = `Temporada ${episode.season} - Episodio ${episode.episode}`;
    modalEpisodeTitle.textContent = episode.title;
    modalEpisodeDescription.textContent = episode.description;
    
    // Configurar el reproductor en el modal
    if (episode.url.includes('cubeembed.rpmvid.com/#')) {
        if (playInSameTab) {
            // Reproducir en iframe dentro del modal usando la URL completa
            modalPlayer.innerHTML = `
                <div class="video-container">
                    <div class="video-controls-top">
                        <button onclick="toggleFullscreen(this.parentElement.parentElement.querySelector('iframe'))" class="fullscreen-btn" title="Pantalla completa">
                            ⛶ Pantalla Completa
                        </button>
                    </div>
                    <iframe 
                        src="${episode.url}" 
                        width="100%" 
                        height="500" 
                        frameborder="0" 
                        allowfullscreen
                        style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); max-width: 100%;"
                        onload="this.style.opacity='1'" 
                        ondblclick="handleDoubleClick(this)"
                        onerror="this.parentElement.innerHTML='<div class=external-player><div class=video-icon>📺</div><h3>Error de carga</h3><p>No se pudo cargar el video en iframe. Usa el botón para abrir en nueva ventana.</p><button onclick=openExternalVideo(\\\'${episode.url}\\\',\\\'${episode.title.replace(/'/g, "\\'")}\\\')''>🎬 Ver en Nueva Ventana</button></div>'"
                    ></iframe>
                    <div class="video-info" style="margin-top: 1rem; text-align: center;">
                        <p style="font-size: 0.9rem; opacity: 0.8;">
                            ${episode.thumbnail} Temporada ${episode.season} - Episodio ${episode.episode}
                        </p>
                        <p class="double-click-hint">
                            💡 Haz doble clic en el video para pantalla completa
                        </p>
                        <button onclick="openExternalVideo('${episode.url}', '${episode.title.replace(/'/g, "\\'")}')'" 
                                style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: var(--secondary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
                            🔗 Abrir en Nueva Ventana
                        </button>
                    </div>
                </div>
            `;
        } else {
            // Mostrar botón para abrir en nueva ventana
            modalPlayer.innerHTML = `
                <div class="external-player">
                    <div class="video-icon">📺</div>
                    <h3>${episode.title}</h3>
                    <p>Este episodio se abrirá en una nueva ventana</p>
                    <button onclick="openExternalVideo('${episode.url}', '${episode.title.replace(/'/g, "\\'")}')">
                        🎬 Ver Episodio en Nueva Ventana
                    </button>
                    <div style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
                        <p>${episode.thumbnail} Temporada ${episode.season} - Episodio ${episode.episode}</p>
                    </div>
                </div>
            `;
        }
    } else {
        // Para URLs de YouTube u otras
        let embedUrl = episode.url;
        if (episode.url.includes('watch?v=')) {
            const videoId = episode.url.split('watch?v=')[1].split('&')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        
        modalPlayer.innerHTML = `
            <iframe src="${embedUrl}" 
                    width="560" 
                    height="315" 
                    frameborder="0" 
                    allowfullscreen
                    style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            </iframe>
        `;
    }
    
    // Actualizar controles del modal
    updateModalControls();
    
    // Mostrar el modal
    const modal = document.getElementById('videoModal');
    modal.classList.add('show');
    
    // Highlight del episodio actual
    highlightCurrentEpisode();
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

// Función para cerrar el modal
function closeEpisodeModal() {
    const modal = document.getElementById('videoModal');
    modal.classList.remove('show');
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
    
    // Limpiar el reproductor
    const modalPlayer = document.getElementById('modalPlayer');
    modalPlayer.innerHTML = '';
}

// Actualizar controles del modal
function updateModalControls() {
    const modalPrevBtn = document.getElementById('modalPrevBtn');
    const modalNextBtn = document.getElementById('modalNextBtn');
    
    if (modalPrevBtn) {
        modalPrevBtn.disabled = currentEpisodeIndex === 0;
    }
    if (modalNextBtn) {
        modalNextBtn.disabled = currentEpisodeIndex === filteredEpisodes.length - 1;
    }
}

// Navegación en el modal
function modalPreviousEpisode() {
    if (currentEpisodeIndex > 0) {
        openEpisodeModal(currentEpisodeIndex - 1);
    }
}

function modalNextEpisode() {
    if (currentEpisodeIndex < filteredEpisodes.length - 1) {
        openEpisodeModal(currentEpisodeIndex + 1);
    }
}

// Lazy loading para mejor rendimiento
function applyLazyLoading() {
    const cards = document.querySelectorAll('.episode-card[data-loaded="false"]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.setAttribute('data-loaded', 'true');
                
                // Animación de entrada
                card.style.transition = 'all 0.5s ease';
                card.style.transform = 'scale(1)';
                card.style.opacity = '1';
                
                observer.unobserve(card);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

// Función para scroll al reproductor
function scrollToPlayer() {
    const playerSection = document.getElementById('reproductor');
    playerSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Función para scroll a temporadas (llamada desde el botón hero)
function scrollToTemporadas() {
    const temporadasSection = document.getElementById('temporadas');
    temporadasSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Función de búsqueda (funcionalidad futura)
function searchEpisodes(query) {
    if (!query.trim()) {
        loadEpisodes(currentSeason);
        return;
    }
    
    const searchResults = episodesData.filter(episode => 
        episode.title.toLowerCase().includes(query.toLowerCase()) ||
        episode.description.toLowerCase().includes(query.toLowerCase())
    );
    
    displaySearchResults(searchResults);
}

// Mostrar resultados de búsqueda
function displaySearchResults(results) {
    const episodesGrid = document.getElementById('episodesGrid');
    episodesGrid.innerHTML = '';
    
    if (results.length === 0) {
        episodesGrid.innerHTML = '<p class="no-results">No se encontraron episodios</p>';
        return;
    }
    
    results.forEach((episode, index) => {
        const card = createEpisodeCard(episode, index);
        episodesGrid.appendChild(card);
    });
    
    applyLazyLoading();
}

// Función para reproducir episodio aleatorio
function playRandomEpisode() {
    const randomIndex = Math.floor(Math.random() * filteredEpisodes.length);
    playEpisode(randomIndex);
    scrollToPlayer();
}

// Función para compartir episodio
function shareEpisode(episodeId) {
    const episode = episodesData.find(ep => ep.id === episodeId);
    if (episode) {
        const shareUrl = `${window.location.origin}${window.location.pathname}?episode=${episodeId}`;
        
        if (navigator.share) {
            navigator.share({
                title: episode.title,
                text: episode.description,
                url: shareUrl
            });
        } else {
            // Copiar al portapapeles
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('¡Enlace copiado al portapapeles!');
            });
        }
    }
}

// Función para agregar a favoritos (localStorage)
function toggleFavorite(episodeId) {
    let favorites = JSON.parse(localStorage.getItem('chavoFavorites')) || [];
    
    if (favorites.includes(episodeId)) {
        favorites = favorites.filter(id => id !== episodeId);
    } else {
        favorites.push(episodeId);
    }
    
    localStorage.setItem('chavoFavorites', JSON.stringify(favorites));
    updateFavoriteUI(episodeId);
}

// Actualizar UI de favoritos
function updateFavoriteUI(episodeId) {
    const favorites = JSON.parse(localStorage.getItem('chavoFavorites')) || [];
    const card = document.querySelector(`[data-episode-id="${episodeId}"]`);
    
    if (card) {
        if (favorites.includes(episodeId)) {
            card.classList.add('favorite');
        } else {
            card.classList.remove('favorite');
        }
    }
}

// Función para obtener parámetros de URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Cargar episodio desde URL
function loadEpisodeFromUrl() {
    const episodeId = getUrlParameter('episode');
    if (episodeId) {
        const episodeIndex = episodesData.findIndex(ep => ep.id === parseInt(episodeId));
        if (episodeIndex !== -1) {
            playEpisode(episodeIndex);
            scrollToPlayer();
        }
    }
}

// Inicializar después de cargar episodios
document.addEventListener('DOMContentLoaded', () => {
    // Cargar episodio desde URL si existe
    setTimeout(() => {
        loadEpisodeFromUrl();
    }, 1500);
});

// Optimización de rendimiento
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Manejar redimensión de ventana
window.addEventListener('resize', debounce(() => {
    // Reajustar layout si es necesario
    updatePlayerControls();
}, 300));

// Prevenir errores de reproducción
document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('videoPlayer');
    
    videoPlayer.addEventListener('error', (e) => {
        console.warn('Error al cargar el video:', e);
        // Mostrar mensaje de error al usuario
        const currentDescription = document.getElementById('currentDescription');
        currentDescription.textContent = 'Error al cargar el video. Por favor, intenta con otro episodio.';
    });
});

// Función para pantalla completa del iframe
function toggleFullscreen(element) {
    if (!document.fullscreenElement) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Función para manejar doble clic en el iframe
function handleDoubleClick(iframe) {
    toggleFullscreen(iframe);
}

// Exportar funciones para uso global
window.scrollToTemporadas = scrollToTemporadas;
window.playRandomEpisode = playRandomEpisode;
window.shareEpisode = shareEpisode;
window.toggleFavorite = toggleFavorite;
window.openExternalVideo = openExternalVideo;
window.openEpisodeModal = openEpisodeModal;
window.closeEpisodeModal = closeEpisodeModal;
window.modalPreviousEpisode = modalPreviousEpisode;
window.modalNextEpisode = modalNextEpisode;
window.togglePlayMode = togglePlayMode;
