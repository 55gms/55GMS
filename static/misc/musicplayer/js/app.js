import { LosslessAPI } from '/misc/musicplayer/js/api.js';
import { apiSettings, themeManager, nowPlayingSettings } from '/misc/musicplayer/js/storage.js';
import { UIRenderer } from '/misc/musicplayer/js/ui.js';
import { Player } from '/misc/musicplayer/js/player.js';
import { LastFMScrobbler } from '/misc/musicplayer/js/lastfm.js';
import { LyricsManager, createLyricsPanel, showKaraokeView } from '/misc/musicplayer/js/lyrics.js';
import { createRouter, updateTabTitle } from '/misc/musicplayer/js/router.js';
import { initializeSettings } from '/misc/musicplayer/js/settings.js';
import { initializePlayerEvents, initializeTrackInteractions } from '/misc/musicplayer/js/events.js';
import { initializeUIInteractions } from '/misc/musicplayer/js/ui-interactions.js';
import { downloadAlbumAsZip, downloadDiscography, downloadCurrentTrack } from '/misc/musicplayer/js/downloads.js';
import { debounce, SVG_PLAY } from '/misc/musicplayer/js/utils.js';

function initializeCasting(audioPlayer, castBtn) {
    if (!castBtn) return;
    
    // Check for Remote Playback API (Chrome)
    if ('remote' in audioPlayer) {
        audioPlayer.remote.watchAvailability((available) => {
            if (available) {
                castBtn.style.display = 'flex';
                castBtn.classList.add('available');
            }
        }).catch(err => {
            console.log('Remote playback not available:', err);
            // Still show button on desktop
            if (window.innerWidth > 768) {
                castBtn.style.display = 'flex';
            }
        });
        
        castBtn.addEventListener('click', () => {
            audioPlayer.remote.prompt().catch(err => {
                console.log('Cast prompt error:', err);
            });
        });
        
        // Listen for connection state changes
        audioPlayer.addEventListener('playing', () => {
            if (audioPlayer.remote && audioPlayer.remote.state === 'connected') {
                castBtn.classList.add('connected');
            }
        });
        
        audioPlayer.addEventListener('pause', () => {
            if (audioPlayer.remote && audioPlayer.remote.state === 'disconnected') {
                castBtn.classList.remove('connected');
            }
        });
    } 
    // Check for AirPlay (Safari)
    else if (audioPlayer.webkitShowPlaybackTargetPicker) {
        castBtn.style.display = 'flex';
        castBtn.classList.add('available');
        
        castBtn.addEventListener('click', () => {
            audioPlayer.webkitShowPlaybackTargetPicker();
        });
        
        // Listen for AirPlay connection state
        audioPlayer.addEventListener('webkitplaybacktargetavailabilitychanged', (e) => {
            if (e.availability === 'available') {
                castBtn.classList.add('available');
            }
        });
        
        audioPlayer.addEventListener('webkitcurrentplaybacktargetiswirelesschanged', () => {
            if (audioPlayer.webkitCurrentPlaybackTargetIsWireless) {
                castBtn.classList.add('connected');
            } else {
                castBtn.classList.remove('connected');
            }
        });
    }
    // Show on desktop anyway
    else if (window.innerWidth > 768) {
        castBtn.style.display = 'flex';
        castBtn.addEventListener('click', () => {
            alert('Casting is not supported in this browser. Try Chrome for Chromecast or Safari for AirPlay.');
        });
    }
}

function initializeKeyboardShortcuts(player, audioPlayer) {
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.matches('input, textarea')) return;
        
        switch(e.key.toLowerCase()) {
            case ' ':
                e.preventDefault();
                player.handlePlayPause();
                break;
            case 'arrowright':
                if (e.shiftKey) {
                    player.playNext();
                } else {
                    audioPlayer.currentTime = Math.min(
                        audioPlayer.duration, 
                        audioPlayer.currentTime + 10
                    );
                }
                break;
            case 'arrowleft':
                if (e.shiftKey) {
                    player.playPrev();
                } else {
                    audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
                }
                break;
            case 'arrowup':
                e.preventDefault();
                audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.1);
                break;
            case 'arrowdown':
                e.preventDefault();
                audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.1);
                break;
            case 'm':
                audioPlayer.muted = !audioPlayer.muted;
                break;
            case 's':
                document.getElementById('shuffle-btn')?.click();
                break;
            case 'r':
                document.getElementById('repeat-btn')?.click();
                break;
            case 'q':
                document.getElementById('queue-btn')?.click();
                break;
            case '/':
                e.preventDefault();
                document.getElementById('search-input')?.focus();
                break;
            case 'escape':
                document.getElementById('search-input')?.blur();
                document.getElementById('queue-modal-overlay').style.display = 'none';
                const lyricsPanel = document.getElementById('lyrics-panel');
                if (lyricsPanel) {
                    lyricsPanel.classList.add('hidden');
                }
                const karaokeView = document.getElementById('karaoke-view');
                if (karaokeView) {
                    karaokeView.remove();
                }
                break;
            case 'l':
                // Toggle lyrics
                document.querySelector('.now-playing-bar .cover')?.click();
                break;
        }
    });
}

function initializeMediaSessionHandlers(player) {
    if (!('mediaSession' in navigator)) return;
    
    try {
        navigator.mediaSession.setActionHandler('seekto', (details) => {
            if (details.seekTime !== undefined && details.fastSeek !== undefined && details.fastSeek) {
                player.audio.currentTime = details.seekTime;
                player.updateMediaSessionPositionState();
            }
        });
    } catch (error) {
        console.log('seekto action not supported');
    }
}

function showOfflineNotification() {
    const notification = document.createElement('div');
    notification.className = 'offline-notification';
    notification.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>You are offline. Some features may not work.</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function hideOfflineNotification() {
    const notification = document.querySelector('.offline-notification');
    if (notification) {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const api = new LosslessAPI(apiSettings);
    const ui = new UIRenderer(api);
    
    const audioPlayer = document.getElementById('audio-player');
    const currentQuality = localStorage.getItem('playback-quality') || 'LOSSLESS';
    const player = new Player(audioPlayer, api, currentQuality);
    
    const scrobbler = new LastFMScrobbler();
    const lyricsManager = new LyricsManager(api);
    const lyricsPanel = createLyricsPanel();
    
    const currentTheme = themeManager.getTheme();
    themeManager.setTheme(currentTheme);
    
    // Initialize all modules
    initializeSettings(scrobbler, player, api, ui);
    initializePlayerEvents(player, audioPlayer, scrobbler);
    initializeTrackInteractions(player, api, document.querySelector('.main-content'), document.getElementById('context-menu'));
    initializeUIInteractions(player, api);
    initializeKeyboardShortcuts(player, audioPlayer);
    initializeMediaSessionHandlers(player);
    
    // Initialize casting
    const castBtn = document.getElementById('cast-btn');
    initializeCasting(audioPlayer, castBtn);
    
    // Album art click handler for lyrics
    document.querySelector('.now-playing-bar .cover').addEventListener('click', async () => {
        if (!player.currentTrack) {
            alert('No track is currently playing');
            return;
        }
        
        const mode = nowPlayingSettings.getMode();
        
        if (mode === 'karaoke') {
            // Show karaoke view
            lyricsPanel.classList.add('hidden');
            const lyricsData = await lyricsManager.fetchLyrics(player.currentTrack.id);
            if (lyricsData) {
                showKaraokeView(player.currentTrack, lyricsData, audioPlayer);
            } else {
                alert('No lyrics available for this track');
            }
        } else if (mode === 'lyrics') {
            // Toggle lyrics panel
            const isHidden = lyricsPanel.classList.contains('hidden');
            lyricsPanel.classList.toggle('hidden');
            
            if (isHidden) {
                const content = lyricsPanel.querySelector('.lyrics-content');
                content.innerHTML = '<div class="lyrics-loading">Loading lyrics...</div>';
                
                const lyricsData = await lyricsManager.fetchLyrics(player.currentTrack.id);
                
                if (lyricsData) {
                    lyricsManager.currentLyrics = lyricsData;
                    
                    if (lyricsData.lyrics) {
                        const lines = lyricsData.lyrics.split('\n');
                        content.innerHTML = lines.map(line => 
                            `<p class="lyrics-line">${line || '&nbsp;'}</p>`
                        ).join('');
                    } else {
                        content.innerHTML = '<div class="lyrics-error">No lyrics available</div>';
                    }
                } else {
                    content.innerHTML = '<div class="lyrics-error">Failed to load lyrics</div>';
                }
            }
        }
        // If mode is 'cover', do nothing (default behavior)
    });
    
    // Close lyrics panel
    document.getElementById('close-lyrics-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        lyricsPanel.classList.add('hidden');
    });
    
    // Download LRC button
    document.getElementById('download-lrc-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (lyricsManager.currentLyrics && player.currentTrack) {
            lyricsManager.downloadLRC(lyricsManager.currentLyrics, player.currentTrack);
        }
    });
    
    // Download current track button
    document.getElementById('download-current-btn')?.addEventListener('click', () => {
        downloadCurrentTrack(player.currentTrack, player.quality, api, lyricsManager);
    });
    
    // Album/Discography downloads
    document.addEventListener('click', async (e) => {
        if (e.target.closest('#play-album-btn')) {
            const btn = e.target.closest('#play-album-btn');
            if (btn.disabled) return;
            
            const albumId = window.location.hash.split('/')[1];
            if (!albumId) return;
            
            try {
                const { tracks } = await api.getAlbum(albumId);
                if (tracks.length > 0) {
                    player.setQueue(tracks, 0);
                    document.getElementById('shuffle-btn').classList.remove('active');
                    player.playTrackFromQueue();
                }
            } catch (error) {
                console.error('Failed to play album:', error);
                alert('Failed to play album: ' + error.message);
            }
        }
        
        if (e.target.closest('#download-album-btn')) {
            const btn = e.target.closest('#download-album-btn');
            if (btn.disabled) return;
            
            const albumId = window.location.hash.split('/')[1];
            if (!albumId) return;
            
            btn.disabled = true;
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg><span>Downloading...</span>';
            
            try {
                const { album, tracks } = await api.getAlbum(albumId);
                await downloadAlbumAsZip(album, tracks, api, player.quality, lyricsManager);
            } catch (error) {
                console.error('Album download failed:', error);
                alert('Failed to download album: ' + error.message);
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }
        }
        
        if (e.target.closest('#download-discography-btn')) {
            const btn = e.target.closest('#download-discography-btn');
            if (btn.disabled) return;
            
            const artistId = window.location.hash.split('/')[1];
            if (!artistId) return;
            
            btn.disabled = true;
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg><span>Downloading...</span>';
            
            try {
                const artist = await api.getArtist(artistId);
                await downloadDiscography(artist, api, player.quality, lyricsManager);
            } catch (error) {
                console.error('Discography download failed:', error);
                alert('Failed to download discography: ' + error.message);
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }
        }
    });
    
    // Search
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    const performSearch = debounce((query) => {
        if (query) {
            window.location.hash = `#search/${encodeURIComponent(query)}`;
        }
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            performSearch(query);
        }
    });
    
    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            window.location.hash = `#search/${encodeURIComponent(query)}`;
        }
    });
    
    // Network status monitoring
    window.addEventListener('online', () => {
        hideOfflineNotification();
        console.log('Back online');
    });
    
    window.addEventListener('offline', () => {
        showOfflineNotification();
        console.log('Gone offline');
    });
    
    // Initialize UI
    document.querySelector('.play-pause-btn').innerHTML = SVG_PLAY;
    
    const router = createRouter(ui);
    router();
    window.addEventListener('hashchange', router);
    
    // Update tab title on track change
    audioPlayer.addEventListener('play', () => {
        updateTabTitle(player);
    });
    
    // Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/misc/musicplayer/js/sw.js')
                .then(reg => {
                    console.log('Service worker registered');
                    
                    // Check for updates
                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(err => console.log('Service worker not registered', err));
        });
    }
    
    // Install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt(deferredPrompt);
    });
    
    // Show keyboard shortcuts on first visit
    if (!localStorage.getItem('shortcuts-shown')) {
        setTimeout(() => {
            showKeyboardShortcuts();
            localStorage.setItem('shortcuts-shown', 'true');
        }, 3000);
    }
});

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div>
            <strong>Update Available</strong>
            <p>A new version of Monochrome is available.</p>
        </div>
        <button class="btn-secondary" onclick="window.location.reload()">Update Now</button>
    `;
    document.body.appendChild(notification);
}

function showInstallPrompt(deferredPrompt) {
    if (!deferredPrompt) return;
    
    const notification = document.createElement('div');
    notification.className = 'install-prompt';
    notification.innerHTML = `
        <div>
            <strong>Install Monochrome</strong>
            <p>Install this app for a better experience.</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
            <button class="btn-secondary" id="install-btn">Install</button>
            <button class="btn-secondary" id="dismiss-install">Dismiss</button>
        </div>
    `;
    document.body.appendChild(notification);
    
    document.getElementById('install-btn').addEventListener('click', async () => {
        notification.remove();
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        deferredPrompt = null;
    });
    
    document.getElementById('dismiss-install').addEventListener('click', () => {
        notification.remove();
    });
}

function showKeyboardShortcuts() {
    const modal = document.createElement('div');
    modal.className = 'shortcuts-modal-overlay';
    modal.innerHTML = `
        <div class="shortcuts-modal">
            <div class="shortcuts-header">
                <h3>Keyboard Shortcuts</h3>
                <button class="close-shortcuts">&times;</button>
            </div>
            <div class="shortcuts-content">
                <div class="shortcut-item">
                    <kbd>Space</kbd>
                    <span>Play / Pause</span>
                </div>
                <div class="shortcut-item">
                    <kbd>→</kbd>
                    <span>Seek forward 10s</span>
                </div>
                <div class="shortcut-item">
                    <kbd>←</kbd>
                    <span>Seek backward 10s</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Shift</kbd> + <kbd>→</kbd>
                    <span>Next track</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Shift</kbd> + <kbd>←</kbd>
                    <span>Previous track</span>
                </div>
                <div class="shortcut-item">
                    <kbd>↑</kbd>
                    <span>Volume up</span>
                </div>
                <div class="shortcut-item">
                    <kbd>↓</kbd>
                    <span>Volume down</span>
                </div>
                <div class="shortcut-item">
                    <kbd>M</kbd>
                    <span>Mute / Unmute</span>
                </div>
                <div class="shortcut-item">
                    <kbd>S</kbd>
                    <span>Toggle shuffle</span>
                </div>
                <div class="shortcut-item">
                    <kbd>R</kbd>
                    <span>Toggle repeat</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Q</kbd>
                    <span>Open queue</span>
                </div>
                <div class="shortcut-item">
                    <kbd>L</kbd>
                    <span>Toggle lyrics</span>
                </div>
                <div class="shortcut-item">
                    <kbd>/</kbd>
                    <span>Focus search</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Esc</kbd>
                    <span>Close modals</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('close-shortcuts')) {
            modal.remove();
        }
    });
}