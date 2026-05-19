import { formatTime, createPlaceholder, trackDataStore, hasExplicitContent, getTrackArtists, getTrackTitle, calculateTotalDuration, formatDuration, getInitials } from './utils.js?v=1';
import { recentActivityManager, playlistManager } from './storage.js?v=1';

export class UIRenderer {
    constructor(api) {
        this.api = api;
        this.currentSearchQuery = null;
        this.searchData = {
            tracks: null,
            albums: null,
            artists: null,
        };
        this.activePlaylistId = null;
        this.playlistSearchState = new Map();
    }

    createExplicitBadge() {
        return '<span class="explicit-badge" title="Explicit">E</span>';
    }

    createTrackMenuButton() {
        return `
            <button class="track-menu-btn" onclick="event.stopPropagation();" title="More options">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                </svg>
            </button>
        `;
    }

    createTrackItemHTML(track, index, showCover = false, options = {}) {
        const playIconSmall = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        const trackNumberHTML = `<div class="track-number">${showCover ? playIconSmall : index + 1}</div>`;
        const explicitBadge = hasExplicitContent(track) ? this.createExplicitBadge() : '';
        const trackArtists = getTrackArtists(track);
        const trackTitle = getTrackTitle(track);
        const context = options.context || {};
        const playlistRemoveBtn = context.type === 'playlist'
            ? `
                <button class="track-remove-btn" type="button" title="Remove from playlist" data-action="remove-track-from-playlist" data-index="${index}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `
            : '';
        
        return `
            <div class="track-item" data-track-id="${track.id}">
                ${trackNumberHTML}
                <div class="track-item-info">
                    ${showCover ? `<img src="${this.api.getCoverUrl(track.album?.cover, '80')}" alt="Track Cover" class="track-item-cover" loading="lazy">` : ''}
                    <div class="track-item-details">
                        <div class="title">
                            ${trackTitle}
                            ${explicitBadge}
                        </div>
                        <div class="artist">${trackArtists}</div>
                    </div>
                </div>
                <div class="track-item-duration">${formatTime(track.duration)}</div>
                ${playlistRemoveBtn}
                <button class="track-menu-btn" type="button" title="More options">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                </button>
            </div>
        `;
    }

    createAlbumCardHTML(album) {
        const explicitBadge = hasExplicitContent(album) ? this.createExplicitBadge() : '';
        return `
            <a href="#album/${album.id}" class="card">
                <div class="card-image-wrapper">
                    <img src="${this.api.getCoverUrl(album.cover, '320')}" alt="${album.title}" class="card-image" loading="lazy">
                </div>
                <h3 class="card-title">${album.title} ${explicitBadge}</h3>
                <p class="card-subtitle">Album • ${album.artist?.name ?? ''}</p>
            </a>
        `;
    }

    createArtistCardHTML(artist) {
        return `
            <a href="#artist/${artist.id}" class="card artist">
                <div class="card-image-wrapper">
                    <img src="${this.api.getArtistPictureUrl(artist.picture, '320')}" alt="${artist.name}" class="card-image" loading="lazy">
                </div>
                <h3 class="card-title">${artist.name}</h3>
                <p class="card-subtitle">Artist</p>
            </a>
        `;
    }

    createPlaylistCardHTML(playlist) {
        const initials = getInitials(playlist.name, 2);
        const trackCount = playlist.tracks.length;
        const tracks = playlist.tracks.map(entry => entry.track || entry);
        const duration = formatDuration(calculateTotalDuration(tracks));
        const subtitleParts = [];
        subtitleParts.push(`${trackCount} ${trackCount === 1 ? 'song' : 'songs'}`);
        if (trackCount > 0) {
            subtitleParts.push(duration);
        }

        return `
            <div class="playlist-card" data-playlist-id="${playlist.id}">
                <a href="#playlist/${playlist.id}" class="playlist-card-link">
                    <div class="playlist-card-cover" aria-hidden="true">${initials}</div>
                    <div class="playlist-card-info">
                        <h3 class="playlist-card-title">${playlist.name}</h3>
                        <p class="playlist-card-subtitle">${subtitleParts.join(' • ')}</p>
                    </div>
                </a>
                <div class="playlist-card-actions">
                    <button class="btn-secondary" data-action="play-playlist" data-playlist-id="${playlist.id}">Play</button>
                    <button class="btn-secondary" data-action="shuffle-playlist" data-playlist-id="${playlist.id}">Shuffle</button>
                    <button class="btn-danger" data-action="delete-playlist" data-playlist-id="${playlist.id}">Delete</button>
                </div>
            </div>
        `;
    }

    createSkeletonTrack(showCover = false) {
        return `
            <div class="skeleton-track">
                <div class="skeleton skeleton-track-number"></div>
                <div class="skeleton-track-info">
                    ${showCover ? '<div class="skeleton skeleton-track-cover"></div>' : ''}
                    <div class="skeleton-track-details">
                        <div class="skeleton skeleton-track-title"></div>
                        <div class="skeleton skeleton-track-artist"></div>
                    </div>
                </div>
                <div class="skeleton skeleton-track-duration"></div>
            </div>
        `;
    }

    createSkeletonCard(isArtist = false) {
        return `
            <div class="skeleton-card ${isArtist ? 'artist' : ''}">
                <div class="skeleton skeleton-card-image"></div>
                <div class="skeleton skeleton-card-title"></div>
                <div class="skeleton skeleton-card-subtitle"></div>
            </div>
        `;
    }

    createSkeletonTracks(count = 5, showCover = false) {
        return `<div class="skeleton-container">${Array(count).fill(0).map(() => this.createSkeletonTrack(showCover)).join('')}</div>`;
    }

    createSkeletonCards(count = 6, isArtist = false) {
        return `<div class="card-grid">${Array(count).fill(0).map(() => this.createSkeletonCard(isArtist)).join('')}</div>`;
    }

    renderListWithTracks(container, tracks, showCover, options = {}) {
        const fragment = document.createDocumentFragment();
        const tempDiv = document.createElement('div');

        tempDiv.innerHTML = tracks.map((track, i) => 
            this.createTrackItemHTML(track, i, showCover, options)
        ).join('');
        
        while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
        }
        
        if (!options.append) {
            container.innerHTML = '';
        }
        container.appendChild(fragment);
        
        const elements = container.querySelectorAll('.track-item');
        elements.forEach((element, index) => {
            const track = tracks[index];
            if (!track) return;
            trackDataStore.set(element, track);
            if (options.draggable) {
                element.setAttribute('draggable', 'true');
            }
            if (options.context?.type === 'playlist') {
                element.dataset.playlistId = options.context.playlistId;
                element.dataset.playlistIndex = String(index);
            } else {
                element.removeAttribute('data-playlist-id');
                element.removeAttribute('data-playlist-index');
            }
        });
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.toggle('active', page.id === `page-${pageId}`);
        });
        
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            const isActive = link.hash === `#${pageId}` || (pageId === 'playlist' && link.hash === '#playlists');
            link.classList.toggle('active', isActive);
        });
        
        document.querySelector('.main-content').scrollTop = 0;
        
        if (pageId === 'settings') {
            this.renderApiSettings();
        }
    }

    async renderHomePage() {
        this.showPage('home');
        const recents = recentActivityManager.getRecents();
        
        const albumsContainer = document.getElementById('home-recent-albums');
        const artistsContainer = document.getElementById('home-recent-artists');
        
        albumsContainer.innerHTML = recents.albums.length
            ? recents.albums.map(album => this.createAlbumCardHTML(album)).join('')
            : createPlaceholder("You haven't viewed any albums yet. Search for music to get started!");
        
        artistsContainer.innerHTML = recents.artists.length
            ? recents.artists.map(artist => this.createArtistCardHTML(artist)).join('')
            : createPlaceholder("You haven't viewed any artists yet. Search for music to get started!");
    }

    renderPlaylistsPage() {
        this.showPage('playlists');
        this.activePlaylistId = null;
        const container = document.getElementById('playlists-list');
        if (!container) return;
        const playlists = playlistManager.getAll()
            .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        if (!playlists.length) {
            container.innerHTML = createPlaceholder('No playlists yet. Create one to get started.');
            return;
        }
        container.innerHTML = playlists.map(playlist => this.createPlaylistCardHTML(playlist)).join('');
    }

    renderPlaylistPage(playlistId) {
        this.showPage('playlist');
        this.activePlaylistId = playlistId;

        const coverEl = document.getElementById('playlist-detail-cover');
        const titleEl = document.getElementById('playlist-detail-title');
        const metaEl = document.getElementById('playlist-detail-meta');
        const tracklistContainer = document.getElementById('playlist-tracklist');
        const searchInput = document.getElementById('playlist-search-input');

        if (tracklistContainer) {
            tracklistContainer.dataset.playlistId = playlistId || '';
        }

        const playlist = playlistManager.getPlaylist(playlistId);
        if (!playlist) {
            this.activePlaylistId = null;
            if (coverEl) coverEl.textContent = '--';
            if (titleEl) titleEl.textContent = 'Playlist not found';
            if (metaEl) metaEl.innerHTML = '';
            if (tracklistContainer) tracklistContainer.innerHTML = createPlaceholder('This playlist could not be found.');
            this.updatePlaylistSearchState(playlistId, { query: '', items: [], status: 'idle' });
            return;
        }

        const initials = getInitials(playlist.name, 2);
        const tracks = playlist.tracks.map(entry => entry.track || entry);
        const trackCount = tracks.length;
        const durationSeconds = calculateTotalDuration(tracks);
        const updatedAt = playlist.updatedAt ? new Date(playlist.updatedAt) : null;

        if (coverEl) coverEl.textContent = initials || 'PL';
        if (titleEl) titleEl.textContent = playlist.name;
        if (metaEl) {
            const parts = [];
            parts.push(`${trackCount} ${trackCount === 1 ? 'song' : 'songs'}`);
            if (trackCount > 0) {
                parts.push(formatDuration(durationSeconds));
            }
            if (updatedAt) {
                parts.push(`Updated ${updatedAt.toLocaleDateString()}`);
            }
            metaEl.textContent = parts.join(' • ');
        }

        document.title = `${playlist.name} - Playlist - Monochrome`;

        if (tracklistContainer) {
            if (trackCount === 0) {
                tracklistContainer.innerHTML = createPlaceholder('No tracks yet. Search and add songs to this playlist.');
            } else {
                tracklistContainer.innerHTML = `
                    <div class="track-list-header">
                        <span style="width: 40px; text-align: center;">#</span>
                        <span>Title</span>
                        <span class="duration-header">Duration</span>
                    </div>
                    <div class="playlist-track-items"></div>
                `;
                const itemsContainer = tracklistContainer.querySelector('.playlist-track-items');
                this.renderListWithTracks(itemsContainer, tracks, false, {
                    context: { type: 'playlist', playlistId },
                    draggable: true,
                    append: true
                });
            }
        }

        const state = this.playlistSearchState.get(playlistId) || { query: '', items: [], status: 'idle' };
        this.playlistSearchState.set(playlistId, state);
        if (searchInput) {
            searchInput.value = state.query || '';
        }
        this.renderPlaylistSearchResults(playlistId, state);
    }

    renderPlaylistSearchResults(playlistId, state) {
        const container = document.getElementById('playlist-search-results');
        if (!container) return;
        const { status = 'idle', items = [], query = '', error } = state || {};

        if (!query && status === 'idle') {
            container.innerHTML = createPlaceholder('Search for songs to add to this playlist.');
            return;
        }

        if (status === 'loading') {
            container.innerHTML = this.createSkeletonTracks(3, false);
            return;
        }

        if (error) {
            container.innerHTML = createPlaceholder(error);
            return;
        }

        if (!items.length) {
            container.innerHTML = createPlaceholder('No tracks found. Try a different search.');
            return;
        }

        const fragment = document.createDocumentFragment();
        items.forEach(track => {
            const row = document.createElement('div');
            row.className = 'playlist-search-result';
            row.dataset.trackId = track.id;
            row.innerHTML = `
                <div class="playlist-search-info">
                    <div class="playlist-search-title">${getTrackTitle(track)}</div>
                    <div class="playlist-search-subtitle">${getTrackArtists(track)}</div>
                </div>
                <button class="btn-secondary" data-action="add-track-to-playlist" data-track-id="${track.id}" data-playlist-id="${playlistId}">Add</button>
            `;
            trackDataStore.set(row, track);
            fragment.appendChild(row);
        });
        container.innerHTML = '';
        container.appendChild(fragment);
    }

    updatePlaylistSearchState(playlistId, partial) {
        if (!playlistId) return;
        const prev = this.playlistSearchState.get(playlistId) || { query: '', items: [], status: 'idle' };
        const next = { ...prev, ...partial };
        this.playlistSearchState.set(playlistId, next);
        this.renderPlaylistSearchResults(playlistId, next);
    }

    clearPlaylistSearchState(playlistId) {
        if (!playlistId) return;
        this.playlistSearchState.delete(playlistId);
        this.renderPlaylistSearchResults(playlistId, { status: 'idle', items: [], query: '' });
    }

    getActivePlaylistId() {
        return this.activePlaylistId;
    }

    async renderSearchPage(query) {
        this.showPage('search');
        document.getElementById('search-results-title').textContent = `Search Results for "${query}"`;

        // Reset previous search
        if (this.currentSearchQuery !== query) {
            this.currentSearchQuery = query;
            this.searchData = { tracks: null, albums: null, artists: null };
        }

        // Reset tabs
        document.querySelectorAll('.search-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.search-tab-content').forEach(content => content.classList.remove('active'));
        document.querySelector('.search-tab[data-tab="tracks"]').classList.add('active');
        document.getElementById('search-tab-tracks').classList.add('active');

        const tracksContainer = document.getElementById('search-tracks-container');
        
        // Only fetch tracks if they haven't been fetched for the current query
        if (!this.searchData.tracks) {
            tracksContainer.innerHTML = this.createSkeletonTracks(8, false);
            try {
                const result = await this.api.searchTracks(query);
                this.searchData.tracks = result.items;
                
                if (this.searchData.tracks.length) {
                    this.renderListWithTracks(tracksContainer, this.searchData.tracks, false);
                } else {
                    tracksContainer.innerHTML = createPlaceholder('No tracks found.');
                }
            } catch (error) {
                console.error("Track search failed:", error);
                tracksContainer.innerHTML = createPlaceholder(`Error during track search. ${error.message}`);
            }
        }
    }

    async handleSearchTabClick(tab, query) {
        const artistsContainer = document.getElementById('search-artists-container');
        const albumsContainer = document.getElementById('search-albums-container');

        if (tab === 'albums' && !this.searchData.albums) {
            albumsContainer.innerHTML = this.createSkeletonCards(6, false);
            try {
                const result = await this.api.searchAlbums(query);
                this.searchData.albums = result.items;
                albumsContainer.innerHTML = this.searchData.albums.length
                    ? this.searchData.albums.map(album => this.createAlbumCardHTML(album)).join('')
                    : createPlaceholder('No albums found.');
            } catch (error) {
                console.error("Album search failed:", error);
                albumsContainer.innerHTML = createPlaceholder(`Error during album search. ${error.message}`);
            }
        }

        if (tab === 'artists' && !this.searchData.artists) {
            artistsContainer.innerHTML = this.createSkeletonCards(6, true);
            try {
                const result = await this.api.searchArtists(query);
                this.searchData.artists = result.items;
                artistsContainer.innerHTML = this.searchData.artists.length
                    ? this.searchData.artists.map(artist => this.createArtistCardHTML(artist)).join('')
                    : createPlaceholder('No artists found.');
            } catch (error) {
                console.error("Artist search failed:", error);
                artistsContainer.innerHTML = createPlaceholder(`Error during artist search. ${error.message}`);
            }
        }
    }

    async renderAlbumPage(albumId) {
        this.showPage('album');
        
        const imageEl = document.getElementById('album-detail-image');
        const titleEl = document.getElementById('album-detail-title');
        const metaEl = document.getElementById('album-detail-meta');
        const tracklistContainer = document.getElementById('album-detail-tracklist');
        
        imageEl.src = '';
        imageEl.style.backgroundColor = 'var(--muted)';
        titleEl.innerHTML = '<div class="skeleton" style="height: 48px; width: 300px; max-width: 90%;"></div>';
        metaEl.innerHTML = '<div class="skeleton" style="height: 16px; width: 200px; max-width: 80%;"></div>';
        tracklistContainer.innerHTML = `
            <div class="track-list-header">
                <span style="width: 40px; text-align: center;">#</span>
                <span>Title</span>
                <span class="duration-header">Duration</span>
            </div>
            ${this.createSkeletonTracks(10, false)}
        `;
        
        try {
            const { album, tracks } = await this.api.getAlbum(albumId);
            
            imageEl.src = this.api.getCoverUrl(album.cover, '1280');
            imageEl.style.backgroundColor = '';
            
            const explicitBadge = hasExplicitContent(album) ? this.createExplicitBadge() : '';
            titleEl.innerHTML = `${album.title} ${explicitBadge}`;
            
            // Calculate total duration
            const totalDuration = calculateTotalDuration(tracks);
            const releaseDate = new Date(album.releaseDate);
            const year = releaseDate.getFullYear();
            
            // Desktop: full date, Mobile: year only
            const dateDisplay = window.innerWidth > 768 
                ? releaseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : year;
            
            metaEl.innerHTML = 
                `By <a href="#artist/${album.artist.id}">${album.artist.name}</a> • ${dateDisplay} • ${tracks.length} tracks • ${formatDuration(totalDuration)}`;
            
            tracklistContainer.innerHTML = `
                <div class="track-list-header">
                    <span style="width: 40px; text-align: center;">#</span>
                    <span>Title</span>
                    <span class="duration-header">Duration</span>
                </div>
            `;
            
            tracks.sort((a, b) => a.trackNumber - b.trackNumber);
            this.renderListWithTracks(tracklistContainer, tracks, false);
            
            recentActivityManager.addAlbum(album);
            
            // Update tab title when no song is playing
            document.title = `${album.title} - ${album.artist.name} - Monochrome`;
        } catch (error) {
            console.error("Failed to load album:", error);
            tracklistContainer.innerHTML = createPlaceholder(`Could not load album details. ${error.message}`);
        }
    }

    async renderArtistPage(artistId) {
        this.showPage('artist');
        
        const imageEl = document.getElementById('artist-detail-image');
        const nameEl = document.getElementById('artist-detail-name');
        const metaEl = document.getElementById('artist-detail-meta');
        const tracksContainer = document.getElementById('artist-detail-tracks');
        const albumsContainer = document.getElementById('artist-detail-albums');
        
        imageEl.src = '';
        imageEl.style.backgroundColor = 'var(--muted)';
        nameEl.innerHTML = '<div class="skeleton" style="height: 48px; width: 300px; max-width: 90%;"></div>';
        metaEl.innerHTML = '<div class="skeleton" style="height: 16px; width: 150px;"></div>';
        tracksContainer.innerHTML = this.createSkeletonTracks(5, true);
        albumsContainer.innerHTML = this.createSkeletonCards(6, false);
        
        try {
            const artist = await this.api.getArtist(artistId);
            
            imageEl.src = this.api.getArtistPictureUrl(artist.picture, '750');
            imageEl.style.backgroundColor = '';
            nameEl.textContent = artist.name;
            metaEl.textContent = `${artist.popularity} popularity`;
            
            this.renderListWithTracks(tracksContainer, artist.tracks, true);
            albumsContainer.innerHTML = artist.albums.map(album => 
                this.createAlbumCardHTML(album)
            ).join('');
            
            recentActivityManager.addArtist(artist);
            
            // Update tab title
            document.title = `${artist.name} - Monochrome`;
        } catch (error) {
            console.error("Failed to load artist:", error);
            tracksContainer.innerHTML = albumsContainer.innerHTML = 
                createPlaceholder(`Could not load artist details. ${error.message}`);
        }
    }

    renderApiSettings() {
        const container = document.getElementById('api-instance-list');
        this.api.settings.getInstances().then(instances => {
            const cachedData = this.api.settings.getCachedSpeedTests();
            const speeds = cachedData?.speeds || {};
            
            container.innerHTML = instances.map((url, index) => {
                const speedInfo = speeds[url];
                const speedText = speedInfo 
                    ? (speedInfo.speed === Infinity 
                        ? `<span style="color: var(--muted-foreground); font-size: 0.8rem;">Failed</span>` 
                        : `<span style="color: var(--muted-foreground); font-size: 0.8rem;">${speedInfo.speed.toFixed(0)}ms</span>`)
                    : '';
                
                return `
                    <li data-index="${index}">
                        <div style="flex: 1; min-width: 0;">
                            <div class="instance-url">${url}</div>
                            ${speedText}
                        </div>
                        <div class="controls">
                            <button class="move-up" title="Move Up" ${index === 0 ? 'disabled' : ''}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 19V5M5 12l7-7 7 7"/>
                                </svg>
                            </button>
                            <button class="move-down" title="Move Down" ${index === instances.length - 1 ? 'disabled' : ''}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 5v14M19 12l-7 7-7-7"/>
                                </svg>
                            </button>
                        </div>
                    </li>
                `;
            }).join('');

            const stats = this.api.getCacheStats();
            const cacheInfo = document.getElementById('cache-info');
            if (cacheInfo) {
                cacheInfo.textContent = `Cache: ${stats.memoryEntries}/${stats.maxSize} entries`;
            }
        });
    }
}