export const apiSettings = {
    STORAGE_KEY: 'monochrome-api-instances',
    SPEED_TEST_CACHE_KEY: 'monochrome-instance-speeds',
    SPEED_TEST_CACHE_DURATION: 1000 * 60 * 60,
    defaultInstances: [],
    instancesLoaded: false,
    
    async loadInstancesFromGitHub() {
        if (this.instancesLoaded) {
            return this.defaultInstances;
        }
        const url = window.location.origin
        console.log(url)
         this.defaultInstances = [
                `${url}/api/music/url=https://wolf.qqdl.site/`,
                `${url}/api/music/url=https://maus.qqdl.site/`,
                `${url}/api/music/url=https://vogel.qqdl.site/`,
                `${url}/api/music/url=https://hund.qqdl.site/`,
            ];
            this.instancesLoaded = true;
            return this.defaultInstances;
 
    },
    
    async speedTestInstance(url) {
        const proxyPrefix = "url=";
        const baseProxyUrl = url.substring(0, url.indexOf(proxyPrefix) + proxyPrefix.length);
        const targetUrl = url.substring(url.indexOf(proxyPrefix) + proxyPrefix.length);

        const path = 'track/?id=204567804&quality=HIGH';
        const fullTargetUrl = targetUrl.endsWith('/')
            ? `${targetUrl}${path}`
            : `${targetUrl}/${path}`;
        
        const testUrl = `${baseProxyUrl}${encodeURIComponent(fullTargetUrl)}`;
        
        const startTime = performance.now();
        
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(testUrl, {
                signal: controller.signal,
                cache: 'no-store'
            });
            
            clearTimeout(timeout);
            
            if (!response.ok) {
                return { url, speed: Infinity, error: `HTTP ${response.status}` };
            }
            
            const endTime = performance.now();
            const speed = endTime - startTime;
            
            return { url, speed, error: null };
        } catch (error) {
            return { url, speed: Infinity, error: error.message };
        }
    },
    
    async runSpeedTests(instances) {
        console.log('[SpeedTest] Testing', instances.length, 'instances...');
        
        const results = await Promise.all(
            instances.map(url => this.speedTestInstance(url))
        );
        
        const validResults = results.filter(r => r.speed !== Infinity);
        const failedResults = results.filter(r => r.speed === Infinity);
        
        if (failedResults.length > 0) {
            console.log('[SpeedTest] Failed instances:', failedResults.map(r => `${r.url} (${r.error})`));
        }
        
        validResults.sort((a, b) => a.speed - b.speed);
        
        console.log('[SpeedTest] Results:', validResults.map(r => `${r.url}: ${r.speed.toFixed(0)}ms`));
        
        const sortedInstances = [
            ...validResults.map(r => r.url),
            ...failedResults.map(r => r.url)
        ];
        
        const cacheData = {
            timestamp: Date.now(),
            speeds: results.reduce((acc, r) => {
                acc[r.url] = { speed: r.speed, error: r.error };
                return acc;
            }, {})
        };
        
        try {
            localStorage.setItem(this.SPEED_TEST_CACHE_KEY, JSON.stringify(cacheData));
        } catch (e) {
            console.warn('[SpeedTest] Failed to cache results');
        }
        
        return sortedInstances;
    },
    
    getCachedSpeedTests() {
        try {
            const cached = localStorage.getItem(this.SPEED_TEST_CACHE_KEY);
            if (!cached) return null;
            
            const data = JSON.parse(cached);
            
            if (Date.now() - data.timestamp > this.SPEED_TEST_CACHE_DURATION) {
                return null;
            }
            
            return data;
        } catch (e) {
            return null;
        }
    },
    
    sortInstancesByCache(instances, cachedData) {
        const speeds = cachedData.speeds;
        
        const sorted = [...instances].sort((a, b) => {
            const speedA = speeds[a]?.speed ?? Infinity;
            const speedB = speeds[b]?.speed ?? Infinity;
            return speedA - speedB;
        });
        
        console.log('[SpeedTest] Using cached results (age:', 
            Math.round((Date.now() - cachedData.timestamp) / 1000 / 60), 'minutes)');
        
        return sorted;
    },
    
    async getInstances() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
            
            const instances = await this.loadInstancesFromGitHub();
            
            const cachedSpeedTests = this.getCachedSpeedTests();
            
            let sortedInstances;
            if (cachedSpeedTests) {
                sortedInstances = this.sortInstancesByCache(instances, cachedSpeedTests);
            } else {
                sortedInstances = await this.runSpeedTests(instances);
            }
            
            this.saveInstances(sortedInstances);
            
            return sortedInstances;
        } catch (e) {
            const instances = await this.loadInstancesFromGitHub();
            return instances;
        }
    },
    
    async refreshSpeedTests() {
        const instances = await this.loadInstancesFromGitHub();
        const sortedInstances = await this.runSpeedTests(instances);
        this.saveInstances(sortedInstances);
        return sortedInstances;
    },
    
    saveInstances(instances) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(instances));
    }
};

const safeParseJSON = (value, fallback) => {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch (e) {
        return fallback;
    }
};

const generatePlaylistId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `pl_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
};

const cloneTrack = (track) => {
    try {
        return JSON.parse(JSON.stringify(track));
    } catch (e) {
        return track;
    }
};

const normalizePlaylistName = (name) => {
    const trimmed = (name || '').trim();
    return trimmed || 'Untitled Playlist';
};

export const playlistManager = {
    STORAGE_KEY: 'monochrome-playlists',

    _getPlaylists() {
        return safeParseJSON(localStorage.getItem(this.STORAGE_KEY), []);
    },

    _savePlaylists(playlists) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(playlists));
    },

    _touchPlaylist(playlist) {
        playlist.updatedAt = Date.now();
        return playlist;
    },

    getAll() {
        return this._getPlaylists();
    },

    getPlaylist(id) {
        if (!id) return null;
        return this._getPlaylists().find(playlist => playlist.id === id) || null;
    },

    createPlaylist(name) {
        const playlists = this._getPlaylists();
        const now = Date.now();
        const newPlaylist = {
            id: generatePlaylistId(),
            name: normalizePlaylistName(name),
            createdAt: now,
            updatedAt: now,
            tracks: []
        };
        playlists.push(newPlaylist);
        this._savePlaylists(playlists);
        return newPlaylist;
    },

    renamePlaylist(id, name) {
        if (!id) return null;
        const playlists = this._getPlaylists();
        const playlist = playlists.find(p => p.id === id);
        if (!playlist) return null;
        playlist.name = normalizePlaylistName(name);
        this._touchPlaylist(playlist);
        this._savePlaylists(playlists);
        return playlist;
    },

    deletePlaylist(id) {
        if (!id) return false;
        const playlists = this._getPlaylists();
        const next = playlists.filter(p => p.id !== id);
        if (next.length === playlists.length) {
            return false;
        }
        this._savePlaylists(next);
        return true;
    },

    addTrack(playlistId, track) {
        if (!playlistId || !track) return null;
        const playlists = this._getPlaylists();
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) return null;
        const entry = {
            id: track.id,
            addedAt: Date.now(),
            track: cloneTrack(track)
        };
        playlist.tracks.push(entry);
        this._touchPlaylist(playlist);
        this._savePlaylists(playlists);
        return entry;
    },

    removeTrack(playlistId, trackIndex) {
        if (!playlistId) return false;
        const playlists = this._getPlaylists();
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) return false;
        if (typeof trackIndex === 'number') {
            if (trackIndex < 0 || trackIndex >= playlist.tracks.length) {
                return false;
            }
            playlist.tracks.splice(trackIndex, 1);
        } else if (trackIndex) {
            const idx = playlist.tracks.findIndex(entry => entry.id === trackIndex);
            if (idx === -1) return false;
            playlist.tracks.splice(idx, 1);
        } else {
            return false;
        }
        this._touchPlaylist(playlist);
        this._savePlaylists(playlists);
        return true;
    },

    moveTrack(playlistId, fromIndex, toIndex) {
        if (!playlistId) return false;
        const playlists = this._getPlaylists();
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) return false;
        if (fromIndex === toIndex) return true;
        if (
            typeof fromIndex !== 'number' || typeof toIndex !== 'number' ||
            fromIndex < 0 || fromIndex >= playlist.tracks.length ||
            toIndex < 0 || toIndex >= playlist.tracks.length
        ) {
            return false;
        }
        const [entry] = playlist.tracks.splice(fromIndex, 1);
        playlist.tracks.splice(toIndex, 0, entry);
        this._touchPlaylist(playlist);
        this._savePlaylists(playlists);
        return true;
    }
};

export const recentActivityManager = {
    STORAGE_KEY: 'monochrome-recent-activity',
    LIMIT: 10,
    
    _get() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : { artists: [], albums: [] };
        } catch (e) {
            return { artists: [], albums: [] };
        }
    },
    
    _save(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },
    
    getRecents() {
        return this._get();
    },
    
    _add(type, item) {
        const data = this._get();
        data[type] = data[type].filter(i => i.id !== item.id);
        data[type].unshift(item);
        data[type] = data[type].slice(0, this.LIMIT);
        this._save(data);
    },
    
    addArtist(artist) {
        this._add('artists', artist);
    },
    
    addAlbum(album) {
        this._add('albums', album);
    }
};

export const themeManager = {
    STORAGE_KEY: 'monochrome-theme',
    CUSTOM_THEME_KEY: 'monochrome-custom-theme',
    
    defaultThemes: {
        monochrome: {},
        dark: {},
        ocean: {},
        purple: {},
        forest: {}
    },
    
    getTheme() {
        try {
            return localStorage.getItem(this.STORAGE_KEY) || 'monochrome';
        } catch (e) {
            return 'monochrome';
        }
    },
    
    setTheme(theme) {
        localStorage.setItem(this.STORAGE_KEY, theme);
        document.documentElement.setAttribute('data-theme', theme);
    },
    
    getCustomTheme() {
        try {
            const stored = localStorage.getItem(this.CUSTOM_THEME_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    },
    
    setCustomTheme(colors) {
        localStorage.setItem(this.CUSTOM_THEME_KEY, JSON.stringify(colors));
        this.applyCustomTheme(colors);
    },
    
    applyCustomTheme(colors) {
        const root = document.documentElement;
        for (const [key, value] of Object.entries(colors)) {
            root.style.setProperty(`--${key}`, value);
        }
    }
};

export const lastFMStorage = {
    STORAGE_KEY: 'lastfm-enabled',
    
    isEnabled() {
        try {
            return localStorage.getItem(this.STORAGE_KEY) === 'true';
        } catch (e) {
            return false;
        }
    },
    
    setEnabled(enabled) {
        localStorage.setItem(this.STORAGE_KEY, enabled ? 'true' : 'false');
    }
};

export const nowPlayingSettings = {
    STORAGE_KEY: 'now-playing-mode',
    
    getMode() {
        try {
            return localStorage.getItem(this.STORAGE_KEY) || 'cover';
        } catch (e) {
            return 'cover';
        }
    },
    
    setMode(mode) {
        localStorage.setItem(this.STORAGE_KEY, mode);
    }
};

export const lyricsSettings = {
    DOWNLOAD_WITH_TRACKS: 'lyrics-download-with-tracks',
    
    shouldDownloadLyrics() {
        try {
            return localStorage.getItem(this.DOWNLOAD_WITH_TRACKS) === 'true';
        } catch (e) {
            return false;
        }
    },
    
    setDownloadLyrics(enabled) {
        localStorage.setItem(this.DOWNLOAD_WITH_TRACKS, enabled ? 'true' : 'false');
    }
};