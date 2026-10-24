// High-Fidelity Ambient Sound Engine using Web Audio API
// Generates warm, calming meditative soundscapes:
// Track 1 (0:00 - 1:00): 432Hz Om Drone & Resonant Handpan Pentatonic Chimes
// Track 2 (1:00+): Tranquil Bamboo Flute & Flowing Rain / Stream Water

class AmbientAudioEngine {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.currentTrack = 1; // 1: Om & Handpan, 2: Flute & Water
        this.volume = 0.25;
        this.masterGain = null;
        this.activeNodes = [];
        this.timerInterval = null;
        this.listeners = new Set();
    }

    initContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notify() {
        this.listeners.forEach((cb) => cb({
            isPlaying: this.isPlaying,
            currentTrack: this.currentTrack,
            trackName: this.getTrackName(),
            volume: this.volume
        }));
    }

    getTrackName() {
        return this.currentTrack === 1
            ? '432Hz Meditative Om & Handpan'
            : 'Zen Bamboo Flute & Flowing Rain';
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
        }
        this.notify();
    }

    play() {
        this.initContext();
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.startCurrentTrack();
        this.notify();
    }

    pause() {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        this.stopActiveNodes();
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.notify();
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    switchTrack(trackNum) {
        if (trackNum === this.currentTrack) return;
        this.currentTrack = trackNum;
        if (this.isPlaying) {
            this.stopActiveNodes();
            this.startCurrentTrack();
        }
        this.notify();
    }

    stopActiveNodes() {
        this.activeNodes.forEach((node) => {
            try {
                if (node.stop) node.stop();
                if (node.disconnect) node.disconnect();
            } catch (e) {
                // Ignore stopped node errors
            }
        });
        this.activeNodes = [];
    }

    startCurrentTrack() {
        if (!this.ctx || !this.isPlaying) return;

        if (this.currentTrack === 1) {
            this.startOmAndHandpan();
        } else {
            this.startFluteAndWater();
        }
    }

    // TRACK 1: 432Hz Sacred Om + Handpan Pentatonic Chimes
    startOmAndHandpan() {
        const now = this.ctx.currentTime;

        // 1. Root Om Drone (432 Hz fundamental with warm octave below at 216 Hz & 108 Hz)
        const fundamental = 108; // A2 / D tone tuned to 432Hz scale
        const harmonics = [1, 2, 4, 6];

        harmonics.forEach((h, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = index % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(fundamental * h, now);

            // Subtle gentle vibrato (binaural 7.83Hz Schumann resonance)
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.setValueAtTime(7.83, now);
            lfoGain.gain.setValueAtTime(1.5, now);
            lfo.connect(osc.frequency);
            lfo.start(now);
            this.activeNodes.push(lfo, lfoGain);

            const gainVal = (0.08 / (index + 1)) * 0.7;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(gainVal, now + 3);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now);
            this.activeNodes.push(osc, gain);
        });

        // 2. Handpan Pentatonic Bell Sequence (D3, F3, G3, A3, C4, D4)
        const handpanPitches = [144, 172.8, 192, 216, 259.2, 288, 345.6, 384, 432];
        const playHandpanChime = () => {
            if (!this.isPlaying || this.currentTrack !== 1) return;
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            const pitch = handpanPitches[Math.floor(Math.random() * handpanPitches.length)];
            osc.type = 'sine';
            osc.frequency.setValueAtTime(pitch, t);

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.09, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(t);
            osc.stop(t + 4.8);
            this.activeNodes.push(osc, gain);
        };

        // Trigger chimes periodically every 3.5 - 6 seconds
        const scheduleNextChime = () => {
            if (!this.isPlaying || this.currentTrack !== 1) return;
            playHandpanChime();
            const nextDelay = 3500 + Math.random() * 3000;
            this.timerInterval = setTimeout(scheduleNextChime, nextDelay);
        };

        playHandpanChime();
        this.timerInterval = setTimeout(scheduleNextChime, 4000);
    }

    // TRACK 2: Zen Bamboo Flute & Flowing Rain/Water
    startFluteAndWater() {
        const now = this.ctx.currentTime;

        // 1. Gentle Flowing Rain & Water stream (Filtered Pink Noise)
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
            b6 = white * 0.115926;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Lowpass filter for smooth rain sound
        const rainFilter = this.ctx.createBiquadFilter();
        rainFilter.type = 'lowpass';
        rainFilter.frequency.setValueAtTime(850, now);

        const rainGain = this.ctx.createGain();
        rainGain.gain.setValueAtTime(0, now);
        rainGain.gain.linearRampToValueAtTime(0.08, now + 3);

        whiteNoise.connect(rainFilter);
        rainFilter.connect(rainGain);
        rainGain.connect(this.masterGain);
        whiteNoise.start(now);
        this.activeNodes.push(whiteNoise, rainFilter, rainGain);

        // 2. Bamboo Shakuhachi Flute Melody Notes
        const fluteNotes = [293.66, 329.63, 392.00, 440.00, 523.25, 587.33]; // D4, E4, G4, A4, C5, D5
        const playFluteTone = () => {
            if (!this.isPlaying || this.currentTrack !== 2) return;
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            const note = fluteNotes[Math.floor(Math.random() * fluteNotes.length)];
            osc.type = 'sine';
            osc.frequency.setValueAtTime(note, t);

            // Breath pitch flutter
            const breath = this.ctx.createOscillator();
            const breathGain = this.ctx.createGain();
            breath.frequency.setValueAtTime(5.2, t);
            breathGain.gain.setValueAtTime(3.5, t);
            breath.connect(osc.frequency);
            breath.start(t);
            this.activeNodes.push(breath, breathGain);

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.06, t + 0.6);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.0);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(t);
            osc.stop(t + 4.2);
            this.activeNodes.push(osc, gain);
        };

        const scheduleFlute = () => {
            if (!this.isPlaying || this.currentTrack !== 2) return;
            playFluteTone();
            const nextDelay = 4000 + Math.random() * 3500;
            this.timerInterval = setTimeout(scheduleFlute, nextDelay);
        };

        playFluteTone();
        this.timerInterval = setTimeout(scheduleFlute, 3000);
    }
}

export const audioEngine = new AmbientAudioEngine();
