import { LosslessAPI } from '/misc/musicplayer/js/api.js?v=1';
import { apiSettings, themeManager, nowPlayingSettings, playlistManager } from '/misc/musicplayer/js/storage.js?v=1';
import { UIRenderer } from '/misc/musicplayer/js/ui.js?v=1';
import { Player } from '/misc/musicplayer/js/player.js?v=1';
import { LastFMScrobbler } from '/misc/musicplayer/js/lastfm.js?v=1';
import { LyricsManager, createLyricsPanel, showKaraokeView } from '/misc/musicplayer/js/lyrics.js?v=1';
import { createRouter, updateTabTitle } from '/misc/musicplayer/js/router.js?v=1';
import { initializeSettings } from '/misc/musicplayer/js/settings.js?v=1';
import { initializePlayerEvents, initializeTrackInteractions } from '/misc/musicplayer/js/events.js?v=1';
import { initializeUIInteractions } from '/misc/musicplayer/js/ui-interactions.js?v=1';
import { downloadAlbumAsZip, downloadDiscography, downloadCurrentTrack } from '/misc/musicplayer/js/downloads.js?v=1';
import { SVG_PLAY, getInitials, trackDataStore } from '/misc/musicplayer/js/utils.js?v=1';

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

function createDialogManager() {
    const overlay = document.getElementById('app-dialog-overlay');
    const titleEl = document.getElementById('app-dialog-title');
    const messageEl = document.getElementById('app-dialog-message');
    const confirmBtn = document.getElementById('app-dialog-confirm');
    const cancelBtn = document.getElementById('app-dialog-cancel');
    const closeBtn = document.getElementById('app-dialog-close');
    const inputWrapper = document.getElementById('app-dialog-input-wrapper');
    const inputEl = document.getElementById('app-dialog-input');

    if (!overlay || !titleEl || !messageEl || !confirmBtn || !cancelBtn || !inputWrapper || !inputEl) {
        return {
            alert: async ({ message, title }) => {
                if (title) {
                    window.alert(`${title}\n\n${message || ''}`.trim());
                } else {
                    window.alert(message || '');
                }
            },
            confirm: async ({ message, title }) => {
                const text = title ? `${title}\n\n${message || ''}`.trim() : (message || '');
                return window.confirm(text);
            },
            prompt: async ({ message, title, defaultValue }) => {
                const text = title ? `${title}\n\n${message || ''}`.trim() : (message || '');
                const result = window.prompt(text, defaultValue ?? '');
                return result === null ? null : result;
            }
        };
    }

    const confirmVariants = ['btn-primary', 'btn-secondary', 'btn-danger'];
    let resolveFn = null;
    let currentConfig = null;

    const closeDialog = (result) => {
        overlay.classList.remove('visible');
        overlay.style.display = 'none';
        document.removeEventListener('keydown', handleKeyDown);
        resolveFn?.(result);
        resolveFn = null;
        currentConfig = null;
    };

    const handleConfirm = () => {
        if (!currentConfig) return;
        if (currentConfig.showInput) {
            closeDialog(inputEl.value);
        } else {
            closeDialog(true);
        }
    };

    const handleCancel = () => {
        if (!currentConfig) return;
        closeDialog(null);
    };

    const handleOverlayClick = (event) => {
        if (event.target === overlay && currentConfig?.dismissible) {
            handleCancel();
        }
    };

    const handleKeyDown = (event) => {
        if (!currentConfig) return;
        if (event.key === 'Escape' && currentConfig.dismissible) {
            event.preventDefault();
            handleCancel();
        } else if (event.key === 'Enter') {
            if (currentConfig.showInput) {
                if (event.target !== cancelBtn) {
                    event.preventDefault();
                    handleConfirm();
                }
            } else if (event.target !== cancelBtn) {
                event.preventDefault();
                handleConfirm();
            }
        }
    };

    confirmBtn.addEventListener('click', (event) => {
        event.preventDefault();
        handleConfirm();
    });

    cancelBtn.addEventListener('click', (event) => {
        event.preventDefault();
        handleCancel();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', (event) => {
            event.preventDefault();
            handleCancel();
        });
    }

    overlay.addEventListener('click', handleOverlayClick);

    const openDialog = (config) => new Promise((resolve) => {
        currentConfig = config;
        resolveFn = resolve;

        titleEl.textContent = config.title || '';
        messageEl.textContent = config.message || '';
        confirmBtn.textContent = config.confirmText || 'OK';
        cancelBtn.textContent = config.cancelText || 'Cancel';

        confirmBtn.classList.remove(...confirmVariants);
        confirmBtn.classList.add(config.confirmClass || 'btn-primary');

        cancelBtn.classList.remove(...confirmVariants);
        cancelBtn.classList.add(config.cancelClass || 'btn-secondary');
        cancelBtn.style.display = config.showCancel ? '' : 'none';
        if (closeBtn) {
            closeBtn.style.display = config.showCancel ? '' : 'none';
        }

        inputWrapper.style.display = config.showInput ? '' : 'none';
        if (config.showInput) {
            inputEl.value = config.inputValue ?? '';
            if (config.placeholder) {
                inputEl.placeholder = config.placeholder;
            } else {
                inputEl.removeAttribute('placeholder');
            }
        } else {
            inputEl.value = '';
            inputEl.removeAttribute('placeholder');
        }

        overlay.style.display = 'flex';
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
            if (config.showInput) {
                inputEl.focus();
                inputEl.select();
            } else {
                confirmBtn.focus();
            }
        });

        document.addEventListener('keydown', handleKeyDown);
    });

    const makeDismissible = (config) => ({ ...config, dismissible: config.dismissible ?? config.showCancel });

    return {
        alert: async ({ title, message, confirmText }) => {
            await openDialog(makeDismissible({
                title,
                message,
                confirmText: confirmText || 'OK',
                showCancel: false,
                showInput: false,
                dismissible: false
            }));
        },
        confirm: async ({ title, message, confirmText, cancelText, confirmClass, cancelClass }) => {
            const result = await openDialog(makeDismissible({
                title,
                message,
                confirmText: confirmText || 'Confirm',
                cancelText: cancelText || 'Cancel',
                confirmClass: confirmClass || 'btn-primary',
                cancelClass: cancelClass || 'btn-secondary',
                showCancel: true,
                showInput: false
            }));
            return result === true;
        },
        prompt: async ({ title, message, confirmText, cancelText, confirmClass, defaultValue, placeholder }) => {
            const result = await openDialog(makeDismissible({
                title,
                message,
                confirmText: confirmText || 'Save',
                cancelText: cancelText || 'Cancel',
                confirmClass: confirmClass || 'btn-primary',
                cancelClass: 'btn-secondary',
                showCancel: true,
                showInput: true,
                inputValue: defaultValue ?? '',
                placeholder: placeholder || ''
            }));
            if (result === null) return null;
            return typeof result === 'string' ? result.trim() : result;
        }
    };
}

document.addEventListener('DOMContentLoaded', async () => {
    const api = new LosslessAPI(apiSettings);
    const ui = new UIRenderer(api);
    const dialogs = createDialogManager();
    
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
    initializeTrackInteractions(player, api, document.querySelector('.main-content'), document.getElementById('context-menu'), ui);
    initializeUIInteractions(player, api, ui);
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
    
    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            window.location.hash = `#search/${encodeURIComponent(query)}`;
        }
    });
    
    // Search Tabs
    document.querySelector('.search-tabs').addEventListener('click', (e) => {
        if (e.target.classList.contains('search-tab')) {
            const tab = e.target.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            // Show correct content
            document.querySelectorAll('.search-tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`search-tab-${tab}`).classList.add('active');
            
            // Fetch data if needed
            if (ui.currentSearchQuery) {
                ui.handleSearchTabClick(tab, ui.currentSearchQuery);
            }
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

    setupPlaylistUI(player, api, ui, dialogs);
    
    // Update tab title on track change
    audioPlayer.addEventListener('play', () => {
        updateTabTitle(player);
    });
    
    // Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/misc/musicplayer/js/sw.js?v=1')
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

function setupPlaylistUI(player, api, ui, dialogs) {
    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    const playlistPlayBtn = document.getElementById('playlist-play-btn');
    const playlistShuffleBtn = document.getElementById('playlist-shuffle-btn');
    const playlistRenameBtn = document.getElementById('playlist-rename-btn');
    const playlistDeleteBtn = document.getElementById('playlist-delete-btn');
    const playlistTracklist = document.getElementById('playlist-tracklist');
    const playlistsList = document.getElementById('playlists-list');
    const playlistSearchForm = document.getElementById('playlist-search-form');
    const playlistSearchInput = document.getElementById('playlist-search-input');
    const playlistPickerOverlay = document.getElementById('playlist-picker-overlay');
    const playlistPickerList = document.getElementById('playlist-picker-list');
    const playlistPickerCreateBtn = document.getElementById('playlist-picker-create');
    const playlistPickerClose = document.getElementById('playlist-picker-close');

    window.pendingPlaylistTrack = null;

    const hidePicker = (clearTrack = true) => {
        if (playlistPickerOverlay) {
            playlistPickerOverlay.style.display = 'none';
            playlistPickerOverlay.dataset.trackId = '';
        }
        if (clearTrack) {
            window.pendingPlaylistTrack = null;
        }
    };

    const showPicker = (track) => {
        if (!playlistPickerOverlay || !playlistPickerList) return;
        const playlists = playlistManager.getAll().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        playlistPickerList.innerHTML = playlists.length
            ? playlists.map(pl => `
                <button class="playlist-picker-item" data-playlist-id="${pl.id}">
                    <span class="picker-initials">${getInitials(pl.name)}</span>
                    <span class="picker-name">${pl.name}</span>
                    <span class="picker-count">${pl.tracks.length} ${pl.tracks.length === 1 ? 'song' : 'songs'}</span>
                </button>
            `).join('')
            : '<div class="placeholder-text">No playlists yet. Create one below.</div>';

        playlistPickerOverlay.dataset.trackId = track?.id || '';
        playlistPickerOverlay.style.display = 'flex';
    };

    playlistsList?.addEventListener('click', async (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;
        e.preventDefault();
        e.stopPropagation();
        const playlistId = actionBtn.dataset.playlistId;
        if (!playlistId) return;
        if (actionBtn.dataset.action === 'play-playlist') {
            const playlist = playlistManager.getPlaylist(playlistId);
            if (!playlist || !playlist.tracks.length) {
                await dialogs.alert({
                    title: 'Playlist Empty',
                    message: 'Add some songs to this playlist to start playing.'
                });
                return;
            }
            playPlaylist(player, playlist, false);
        } else if (actionBtn.dataset.action === 'shuffle-playlist') {
            const playlist = playlistManager.getPlaylist(playlistId);
            if (!playlist || !playlist.tracks.length) {
                await dialogs.alert({
                    title: 'Playlist Empty',
                    message: 'Add some songs to this playlist to start playing.'
                });
                return;
            }
            playPlaylist(player, playlist, true);
        } else if (actionBtn.dataset.action === 'delete-playlist') {
            const confirmed = await dialogs.confirm({
                title: 'Delete Playlist',
                message: 'Delete this playlist? This cannot be undone.',
                confirmText: 'Delete',
                confirmClass: 'btn-danger'
            });
            if (!confirmed) return;
            if (playlistManager.deletePlaylist(playlistId)) {
                ui.renderPlaylistsPage();
                if (ui.getActivePlaylistId() === playlistId) {
                    window.location.hash = '#playlists';
                }
            }
        }
    });

    createPlaylistBtn?.addEventListener('click', async () => {
        const name = await dialogs.prompt({
            title: 'New Playlist',
            message: 'Give your playlist a name.',
            confirmText: 'Create',
            placeholder: 'Playlist name'
        });
        if (name === null) return;
        const playlist = playlistManager.createPlaylist(name);
        ui.renderPlaylistsPage();
        window.location.hash = `#playlist/${playlist.id}`;
    });

    playlistPlayBtn?.addEventListener('click', async () => {
        const playlistId = ui.getActivePlaylistId();
        if (!playlistId) return;
        const playlist = playlistManager.getPlaylist(playlistId);
        if (!playlist || playlist.tracks.length === 0) {
            await dialogs.alert({
                title: 'Playlist Empty',
                message: 'Add some songs to this playlist to start playing.'
            });
            return;
        }
        playPlaylist(player, playlist, false);
    });

    playlistShuffleBtn?.addEventListener('click', async () => {
        const playlistId = ui.getActivePlaylistId();
        if (!playlistId) return;
        const playlist = playlistManager.getPlaylist(playlistId);
        if (!playlist || playlist.tracks.length === 0) {
            await dialogs.alert({
                title: 'Playlist Empty',
                message: 'Add some songs to this playlist to start playing.'
            });
            return;
        }
        playPlaylist(player, playlist, true);
    });

    playlistRenameBtn?.addEventListener('click', async () => {
        const playlistId = ui.getActivePlaylistId();
        if (!playlistId) return;
        const playlist = playlistManager.getPlaylist(playlistId);
        if (!playlist) return;
        const nextName = await dialogs.prompt({
            title: 'Rename Playlist',
            message: 'Update the playlist name.',
            confirmText: 'Save',
            defaultValue: playlist.name,
            placeholder: 'Playlist name'
        });
        if (nextName === null) return;
        const updated = playlistManager.renamePlaylist(playlistId, nextName);
        if (updated) {
            ui.renderPlaylistPage(playlistId);
            if (window.location.hash === '#playlists') {
                ui.renderPlaylistsPage();
            }
        }
    });

    playlistDeleteBtn?.addEventListener('click', async () => {
        const playlistId = ui.getActivePlaylistId();
        if (!playlistId) return;
        const confirmed = await dialogs.confirm({
            title: 'Delete Playlist',
            message: 'Delete this playlist? This cannot be undone.',
            confirmText: 'Delete',
            confirmClass: 'btn-danger'
        });
        if (!confirmed) return;
        if (playlistManager.deletePlaylist(playlistId)) {
            ui.renderPlaylistsPage();
            window.location.hash = '#playlists';
        }
    });

    playlistSearchForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const playlistId = ui.getActivePlaylistId();
        if (!playlistId) return;
        const query = playlistSearchInput?.value.trim();
        if (!query) {
            ui.clearPlaylistSearchState(playlistId);
            return;
        }

        ui.updatePlaylistSearchState(playlistId, { status: 'loading', query });
        try {
            const result = await api.searchTracks(query);
            ui.updatePlaylistSearchState(playlistId, {
                status: 'success',
                items: result.items,
                query
            });
        } catch (error) {
            ui.updatePlaylistSearchState(playlistId, {
                status: 'error',
                error: error.message || 'Search failed',
                query
            });
        }
    });

    playlistSearchInput?.addEventListener('input', () => {
        const playlistId = ui.getActivePlaylistId();
        if (!playlistId) return;
        if (!playlistSearchInput.value.trim()) {
            ui.clearPlaylistSearchState(playlistId);
        }
    });

    playlistTracklist?.addEventListener('dragstart', (e) => {
        const item = e.target.closest('.track-item');
        if (!item) return;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.dataset.playlistIndex || '');
    });

    playlistTracklist?.addEventListener('dragend', (e) => {
        const item = e.target.closest('.track-item');
        if (item) item.classList.remove('dragging');
    });

    playlistTracklist?.addEventListener('dragover', (e) => {
        if (!e.dataTransfer) return;
        const playlistId = ui.getActivePlaylistId();
        if (!playlistId) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    playlistTracklist?.addEventListener('drop', (e) => {
        e.preventDefault();
        const playlistId = ui.getActivePlaylistId();
        if (!playlistId) return;
        const playlist = playlistManager.getPlaylist(playlistId);
        if (!playlist) return;
        const targetItem = e.target.closest('.track-item');
        const fromIndex = parseInt(e.dataTransfer?.getData('text/plain') || '-1', 10);
        let toIndex = targetItem ? parseInt(targetItem.dataset.playlistIndex || '-1', 10) : playlist.tracks.length - 1;
        if (toIndex < 0 || toIndex >= playlist.tracks.length) {
            toIndex = playlist.tracks.length - 1;
        }
        if (Number.isNaN(fromIndex) || Number.isNaN(toIndex) || fromIndex === toIndex) return;
        if (playlistManager.moveTrack(playlistId, fromIndex, toIndex)) {
            ui.renderPlaylistPage(playlistId);
        }
    });

    playlistTracklist?.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        const playlistId = ui.getActivePlaylistId();
        if (actionBtn) {
            e.stopPropagation();
            if (!playlistId) return;
            const action = actionBtn.dataset.action;
            if (action === 'remove-track-from-playlist') {
                const index = parseInt(actionBtn.dataset.index || '-1', 10);
                if (!Number.isNaN(index) && playlistManager.removeTrack(playlistId, index)) {
                    if (ui.getActivePlaylistId() === playlistId) {
                        ui.renderPlaylistPage(playlistId);
                    }
                    if (window.location.hash === '#playlists') {
                        ui.renderPlaylistsPage();
                    }
                }
            }
            return;
        }

        const trackItem = e.target.closest('.track-item');
        if (!trackItem || !playlistId) return;
        const index = parseInt(trackItem.dataset.playlistIndex || '-1', 10);
        if (Number.isNaN(index)) return;
        const playlist = playlistManager.getPlaylist(playlistId);
        if (!playlist) return;
        const tracks = playlist.tracks.map(entry => entry.track || entry);
        player.setQueue(tracks, index);
        player.playTrackFromQueue();
    });

    document.getElementById('playlist-search-results')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action="add-track-to-playlist"]');
        if (!btn) return;
        const playlistId = btn.dataset.playlistId;
        const trackId = btn.dataset.trackId;
        const track = trackDataStore.get(btn.closest('.playlist-search-result'));
        if (!playlistId || !track) return;
        playlistManager.addTrack(playlistId, track);
        if (ui.getActivePlaylistId() === playlistId) {
            ui.renderPlaylistPage(playlistId);
        }
        if (window.location.hash === '#playlists') {
            ui.renderPlaylistsPage();
        }
        btn.disabled = true;
        btn.textContent = 'Added';
    });

    playlistTracklist?.addEventListener('contextmenu', (e) => {
        const item = e.target.closest('.track-item');
        if (!item) return;
        if (!playlistPickerOverlay) return;
        item.dataset.context = 'playlist';
    });

    playlistPickerOverlay?.addEventListener('click', (e) => {
        if (e.target === playlistPickerOverlay) {
            hidePicker();
        }
    });

    playlistPickerClose?.addEventListener('click', hidePicker);

    playlistPickerList?.addEventListener('click', (e) => {
        const btn = e.target.closest('.playlist-picker-item');
        if (!btn) return;
        const playlistId = btn.dataset.playlistId;
        const trackId = playlistPickerOverlay.dataset.trackId;
        if (!playlistId || !trackId) {
            hidePicker();
            return;
        }
        const track = window.pendingPlaylistTrack;
        if (track) {
            playlistManager.addTrack(playlistId, track);
            if (ui.getActivePlaylistId() === playlistId) {
                ui.renderPlaylistPage(playlistId);
            }
            if (window.location.hash === '#playlists') {
                ui.renderPlaylistsPage();
            }
        }
        window.pendingPlaylistTrack = null;
        hidePicker();
    });

    playlistPickerCreateBtn?.addEventListener('click', async () => {
        const track = window.pendingPlaylistTrack;
        hidePicker(false);
        const name = await dialogs.prompt({
            title: 'New Playlist',
            message: 'Give your playlist a name.',
            confirmText: 'Create',
            placeholder: 'Playlist name'
        });
        if (name === null) {
            hidePicker();
            return;
        }
        const playlist = playlistManager.createPlaylist(name);
        if (track) {
            playlistManager.addTrack(playlist.id, track);
        }
        ui.renderPlaylistsPage();
        hidePicker();
        window.location.hash = `#playlist/${playlist.id}`;
    });

    document.addEventListener('showPlaylistPicker', (e) => {
        const { track } = e.detail || {};
        if (!track) return;
        window.pendingPlaylistTrack = track;
        showPicker(track);
    });
}

function playPlaylist(player, playlist, shuffle) {
    const tracks = playlist.tracks.map(entry => entry.track || entry);
    if (!tracks.length) return;
    player.setQueue(tracks, 0);
    const shuffleBtn = document.getElementById('shuffle-btn');
    if (shuffle) {
        player.shuffleActive = true;
        player.originalQueueBeforeShuffle = [...tracks];
        player.shuffledQueue = [...tracks].sort(() => Math.random() - 0.5);
        player.currentQueueIndex = 0;
        shuffleBtn?.classList.add('active');
    } else {
        player.shuffleActive = false;
        player.shuffledQueue = [];
        player.originalQueueBeforeShuffle = [];
        shuffleBtn?.classList.remove('active');
    }
    player.playTrackFromQueue();
    if (typeof window.renderQueueFunction === 'function') {
        window.renderQueueFunction();
    }
}

function showInstallPrompt(deferredPrompt) {
    // hello
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