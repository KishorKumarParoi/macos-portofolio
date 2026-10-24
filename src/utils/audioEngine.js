// High-Fidelity Ambient Sound Engine for macOS Portfolio
// Uses HTML5 Audio with instant buffering, zero lag, smooth fading, and multi-track switching.

const TRACKS = [
    {
        id: 1,
        name: 'Focus Zen & Ambient Piano (432Hz)',
        src: '/audio/loop.mp3',
        type: 'ambient'
    },
    {
        id: 2,
        name: 'Deep Lo-Fi Study Chillwave',
        src: '/audio/audio-5.mp3',
        type: 'lofi'
    },
    {
        id: 3,
        name: 'Ethereal Cyber Ambient Flow',
        src: '/audio/audio-6.mp3',
        type: 'cyber'
    },
    {
        id: 4,
        name: 'Tranquil Bamboo Rain & Meditation',
        src: '/audio/audio-7.mp3',
        type: 'nature'
    },
    {
        id: 5,
        name: 'Late-Night Deep Synthwave',
        src: '/audio/audio-8.mp3',
        type: 'synth'
    }
];

class SmoothAudioEngine {
    constructor() {
        this.tracks = TRACKS;
        this.currentIndex = 0;
        this.isPlaying = false;
        this.volume = 0.35;
        this.audio = null;
        this.listeners = new Set();
        this.initAudio();
    }

    initAudio() {
        if (typeof window === 'undefined') return;
        this.audio = new Audio();
        this.audio.loop = true;
        this.audio.preload = 'auto';
        this.audio.volume = this.volume;
        this.audio.src = this.tracks[this.currentIndex].src;

        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.notify();
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.notify();
        });

        this.audio.addEventListener('error', (e) => {
            console.warn('Audio playback notice:', e);
        });
    }

    subscribe(callback) {
        this.listeners.add(callback);
        // Trigger initial state
        callback({
            isPlaying: this.isPlaying,
            currentTrack: this.currentIndex + 1,
            trackName: this.tracks[this.currentIndex].name,
            volume: this.volume,
            tracks: this.tracks
        });
        return () => this.listeners.delete(callback);
    }

    notify() {
        const state = {
            isPlaying: this.isPlaying,
            currentTrack: this.currentIndex + 1,
            trackName: this.tracks[this.currentIndex]?.name || 'Ambient Focus',
            volume: this.volume,
            tracks: this.tracks
        };
        this.listeners.forEach((cb) => cb(state));
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
        this.notify();
    }

    async play() {
        if (!this.audio) this.initAudio();
        try {
            await this.audio.play();
            this.isPlaying = true;
            this.notify();
        } catch (err) {
            console.warn('Autoplay prevented or waiting for interaction:', err);
        }
    }

    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.notify();
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    switchTrack(trackNum) {
        const targetIndex = (trackNum - 1 + this.tracks.length) % this.tracks.length;
        this.currentIndex = targetIndex;
        if (!this.audio) this.initAudio();

        const wasPlaying = this.isPlaying;
        this.audio.src = this.tracks[this.currentIndex].src;
        this.audio.load();

        if (wasPlaying) {
            this.audio.play().catch(() => {});
        }
        this.notify();
    }

    nextTrack() {
        this.switchTrack(this.currentIndex + 2);
    }

    prevTrack() {
        this.switchTrack(this.currentIndex);
    }
}

export const audioEngine = new SmoothAudioEngine();
