// High-Fidelity Motivational Beatbox & EDM Audio Engine for macOS Portfolio
// Features: 30 Best Beatbox / EDM tracks, 2-minute randomized auto-play,
// Web Audio API procedural beatbox synthesizer fallback (never stops),
// Global keyboard shortcuts (M: Play/Pause, N: Next, P: Prev, R: Shuffle).

export const TRACKS_30 = [
    { id: 1, title: "Believer (Power EDM Remix)", artist: "Imagine Dragons (High-Octane)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", mood: "Unstoppable Drive", genre: "EDM Anthem" },
    { id: 2, title: "Titan Awakening (Epic Glitch Beat)", artist: "Two Steps (Cyber Remix)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", mood: "Apex Focus", genre: "Glitch Beatbox" },
    { id: 3, title: "Hall of Fame (Winner's Beat)", artist: "Script (Trap Motivation)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", mood: "Champion Spirit", genre: "Trap Beat" },
    { id: 4, title: "Cyberpunk Protocol 2077", artist: "Synthwave Beatbox Core", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", mood: "Deep Flow State", genre: "Cyber Synth" },
    { id: 5, title: "Limitless Velocity (Bass Drop)", artist: "Apex Bass Masters", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", mood: "Peak Adrenaline", genre: "Bass EDM" },
    { id: 6, title: "Tokyo Drift Beatbox Fusion", artist: "Hacker Room Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", mood: "Hyper Speed", genre: "Beatbox Trap" },
    { id: 7, title: "Warriors of the Code", artist: "Orchestral Hybrid EDM", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", mood: "Relentless Hustle", genre: "Cinematic EDM" },
    { id: 8, title: "Matrix Neural Pulse", artist: "Sub-Bass Overdrive", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", mood: "Pure Adrenaline", genre: "Dubstep Cyber" },
    { id: 9, title: "Radioactive Surge (Club EDM)", artist: "Vocal Uplift Club", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", mood: "Laser Sharp Focus", genre: "Club EDM" },
    { id: 10, title: "Principal Victory Fanfare", artist: "Kishor AI Theme (Prod)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", mood: "Mastery Triumph", genre: "Hero Anthem" },
    { id: 11, title: "Unstoppable Sia (EDM Drop)", artist: "Festival Stage Mix", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", mood: "Invincible Aura", genre: "Festival EDM" },
    { id: 12, title: "Legends Never Die (Beatbox Cut)", artist: "Championship Live", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", mood: "Godlike Confidence", genre: "Vocal Beatbox" },
    { id: 13, title: "Faded Cyber Echoes", artist: "Alan Walker Vibe", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", mood: "Euphoric Elevation", genre: "Melodic EDM" },
    { id: 14, title: "Animals Heavy Drop", artist: "Dutch House Energy", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", mood: "Crowd Banger", genre: "Electro House" },
    { id: 15, title: "Astronomia Coffin Beatbox", artist: "Bass Boosted Viral", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", mood: "Pure Dopamine", genre: "Viral EDM" },
    { id: 16, title: "Centuries Heavy March", artist: "Gladiator Rhythm", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", mood: "Battle Ready", genre: "Stadium Beat" },
    { id: 17, title: "Natural (Rock-EDM Hybrid)", artist: "Thunder Pulse Drive", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", mood: "Raw Power", genre: "Hybrid Bass" },
    { id: 18, title: "Ghost Town Beatbox Solos", artist: "World Champion Looper", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", mood: "Intricate Rhythm", genre: "Raw Beatbox" },
    { id: 19, title: "Midnight City Sax-Electro", artist: "Retro Neon Waves", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", mood: "Euphoric Night Run", genre: "Synth Electro" },
    { id: 20, title: "Levels Avicii Tribute Mix", artist: "Eternal Melodic Glow", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", mood: "Timeless Energy", genre: "Progressive" },
    { id: 21, title: "Closer Chillstep Beat", artist: "Future Bass Flow", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", mood: "Smooth Coding", genre: "Future Bass" },
    { id: 22, title: "Wake Me Up Folk-Dance", artist: "Sunrise Elevation", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", mood: "Morning Surge", genre: "Dance Anthem" },
    { id: 23, title: "Don't You Worry Child", artist: "Swedish Stadium Wave", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", mood: "Soulful Uplift", genre: "Anthem" },
    { id: 24, title: "Tremor Big Room Drop", artist: "Dimitri Festival Vibe", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", mood: "Wall of Sound", genre: "Big Room" },
    { id: 25, title: "Alone Dark Beatbox Trap", artist: "Marshmello Glitch", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", mood: "Late Night Hustle", genre: "Trap EDM" },
    { id: 26, title: "Starboy Electro Groove", artist: "Daft Synth Fusion", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", mood: "Cool Sophistication", genre: "Electro Funk" },
    { id: 27, title: "In The End Drum & Bass", artist: "Breakbeat Motivation", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", mood: "174 BPM Rush", genre: "DnB" },
    { id: 28, title: "Stronger Harder Faster", artist: "French Cyber House", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", mood: "Infinite Stamina", genre: "Cyber Electro" },
    { id: 29, title: "Spectre Phantom Beats", artist: "Nordic Frost Electro", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", mood: "Ethereal Speed", genre: "Melodic Electro" },
    { id: 30, title: "Infinite Horizon Outro", artist: "Principal Architect Suite", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", mood: "Supreme Zen", genre: "Deep Ambient EDM" },
];

class ReinventMacAudioEngine {
    constructor() {
        this.tracks = TRACKS_30;
        this.currentIndex = Math.floor(Math.random() * this.tracks.length);
        this.isPlaying = false;
        this.volume = 0.35;
        this.secondsPlayed = 0;
        this.audio = null;
        this.listeners = new Set();
        this.synthAudioCtx = null;
        this.synthInterval = null;
        this.playTimer = null;

        this.initAudio();
        this.initKeyListeners();
    }

    initAudio() {
        if (typeof window === 'undefined') return;
        this.audio = new Audio();
        this.audio.preload = 'auto';
        this.audio.volume = this.volume;
        this.audio.src = this.tracks[this.currentIndex].url;

        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.startTimer();
            this.notify();
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.stopTimer();
            this.notify();
        });

        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });

        this.audio.addEventListener('error', (e) => {
            console.warn('Audio stream error, activating procedural Web Audio synth fallback:', e);
            if (this.isPlaying) {
                this.startSyntheticBeatbox();
            }
        });
    }

    initKeyListeners() {
        if (typeof window === 'undefined') return;
        window.addEventListener('keydown', (e) => {
            // Ignore keystrokes inside input or textarea
            const targetTag = e.target?.tagName?.toLowerCase();
            if (targetTag === 'input' || targetTag === 'textarea' || e.target?.isContentEditable) {
                return;
            }

            if (e.key === 'm' || e.key === 'M') {
                e.preventDefault();
                this.toggle();
            } else if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                this.nextTrack();
            } else if (e.key === 'p' || e.key === 'P') {
                e.preventDefault();
                this.prevTrack();
            } else if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                this.shuffle();
            }
        });
    }

    startTimer() {
        if (this.playTimer) clearInterval(this.playTimer);
        this.playTimer = setInterval(() => {
            this.secondsPlayed += 1;
            // 2-minute randomized auto advance (120 seconds)
            if (this.secondsPlayed >= 120) {
                this.secondsPlayed = 0;
                this.nextTrack();
            } else {
                this.notify();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.playTimer) {
            clearInterval(this.playTimer);
            this.playTimer = null;
        }
    }

    // Procedural Synth Beatbox Fallback (Offline / Failover)
    playSyntheticBeat() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!this.synthAudioCtx) {
                this.synthAudioCtx = new AudioCtx();
            }
            const ctx = this.synthAudioCtx;
            if (ctx.state === 'suspended') ctx.resume();
            const now = ctx.currentTime;

            // Kick
            const kickOsc = ctx.createOscillator();
            const kickGain = ctx.createGain();
            kickOsc.frequency.setValueAtTime(150, now);
            kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.18);
            kickGain.gain.setValueAtTime(0.28, now);
            kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            kickOsc.connect(kickGain);
            kickGain.connect(ctx.destination);
            kickOsc.start(now);
            kickOsc.stop(now + 0.22);

            // Snare / Hi-Hat
            const snareOsc = ctx.createOscillator();
            const snareGain = ctx.createGain();
            snareOsc.type = 'triangle';
            snareOsc.frequency.setValueAtTime(320, now + 0.25);
            snareOsc.frequency.exponentialRampToValueAtTime(80, now + 0.45);
            snareGain.gain.setValueAtTime(0.14, now + 0.25);
            snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            snareOsc.connect(snareGain);
            snareGain.connect(ctx.destination);
            snareOsc.start(now + 0.25);
            snareOsc.stop(now + 0.45);
        } catch (err) {
            console.warn('Synth error:', err);
        }
    }

    startSyntheticBeatbox() {
        if (this.synthInterval) return;
        this.playSyntheticBeat();
        this.synthInterval = setInterval(() => {
            if (this.isPlaying) this.playSyntheticBeat();
        }, 500);
    }

    stopSyntheticBeatbox() {
        if (this.synthInterval) {
            clearInterval(this.synthInterval);
            this.synthInterval = null;
        }
    }

    subscribe(callback) {
        this.listeners.add(callback);
        callback(this.getState());
        return () => this.listeners.delete(callback);
    }

    getState() {
        const track = this.tracks[this.currentIndex] || this.tracks[0];
        return {
            isPlaying: this.isPlaying,
            currentIndex: this.currentIndex,
            currentTrack: this.currentIndex + 1,
            totalTracks: this.tracks.length,
            title: track.title,
            artist: track.artist,
            mood: track.mood,
            genre: track.genre,
            trackName: track.title,
            volume: this.volume,
            secondsPlayed: this.secondsPlayed,
            tracks: this.tracks,
        };
    }

    notify() {
        const state = this.getState();
        this.listeners.forEach((cb) => {
            try { cb(state); } catch (e) {}
        });
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
            this.stopSyntheticBeatbox();
            this.startTimer();
            this.notify();
        } catch (err) {
            console.warn('Audio play restricted by browser policy; starting procedural synth:', err);
            this.isPlaying = true;
            this.startSyntheticBeatbox();
            this.startTimer();
            this.notify();
        }
    }

    pause() {
        if (this.audio) {
            this.audio.pause();
        }
        this.isPlaying = false;
        this.stopSyntheticBeatbox();
        this.stopTimer();
        this.notify();
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    loadTrack(index) {
        this.currentIndex = (index + this.tracks.length) % this.tracks.length;
        this.secondsPlayed = 0;
        const track = this.tracks[this.currentIndex];

        if (!this.audio) this.initAudio();
        this.audio.src = track.url;
        this.audio.load();

        if (this.isPlaying) {
            this.audio.play().catch(() => {
                this.startSyntheticBeatbox();
            });
        }
        this.notify();
    }

    nextTrack() {
        this.loadTrack(this.currentIndex + 1);
    }

    prevTrack() {
        this.loadTrack(this.currentIndex - 1);
    }

    shuffle() {
        let nextIdx;
        do {
            nextIdx = Math.floor(Math.random() * this.tracks.length);
        } while (nextIdx === this.currentIndex && this.tracks.length > 1);
        this.loadTrack(nextIdx);
    }

    switchTrack(trackNum) {
        this.loadTrack(trackNum - 1);
    }
}

export const audioEngine = new ReinventMacAudioEngine();
