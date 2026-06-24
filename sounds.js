/* ═══════════════════════════════════════════════════════════
   sounds.js — Web Audio API Sound Effects Engine
   Zero-dependency synthesizer for instant game audio.
   All sounds generated procedurally — no external files needed.
   ═══════════════════════════════════════════════════════════ */

const LudoSounds = (() => {
    let ctx = null;
    let muted = false;

    // Load initial sound preference from localStorage
    try {
        const storedMuted = localStorage.getItem('ludo_muted');
        if (storedMuted !== null) {
            muted = storedMuted === 'true';
        }
    } catch (e) {
        // Fallback if localStorage is disabled
    }

    /** Create or resume AudioContext (must be called from user gesture) */
    function ensureCtx() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    /** Play a single synthesized tone */
    function tone(type, freq, endFreq, duration, volume, delay) {
        if (muted || !ctx) return;
        try {
            const t = ctx.currentTime + (delay || 0);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, t);
            if (endFreq !== freq) {
                osc.frequency.exponentialRampToValueAtTime(
                    Math.max(endFreq, 20), t + duration
                );
            }

            gain.gain.setValueAtTime(Math.min(volume, 1), t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

            osc.connect(gain).connect(ctx.destination);
            osc.start(t);
            osc.stop(t + duration + 0.01);
        } catch (e) {
            // Silently fail — audio is non-critical
        }
    }

    return {
        /** Resume AudioContext — call this from a click/tap handler */
        init() { ensureCtx(); },

        /** Toggle mute state. Returns true if now muted. */
        toggleMute() {
            muted = !muted;
            try {
                localStorage.setItem('ludo_muted', muted);
            } catch (e) {}
            ensureCtx();
            return muted;
        },

        isMuted() { return muted; },

        // ─── Game Sound Effects ───────────────────────────────

        /** Rattling dice roll with impact thump */
        playDiceRoll() {
            ensureCtx();
            for (let i = 0; i < 9; i++) {
                tone('square',
                    250 + Math.random() * 500,
                    80 + Math.random() * 150,
                    0.04, 0.18, i * 0.04
                );
            }
            // Impact thump at the end
            tone('triangle', 300, 120, 0.18, 0.25, 0.38);
            tone('sine', 180, 80, 0.12, 0.15, 0.40);
        },

        /** Satisfying pop when a token hops one cell */
        playTokenMove() {
            ensureCtx();
            tone('sine', 500, 900, 0.08, 0.18);
            tone('triangle', 700, 500, 0.06, 0.08, 0.03);
        },

        /** Dramatic crash when capturing an opponent */
        playCapture() {
            ensureCtx();
            tone('sawtooth', 900, 80, 0.35, 0.25);
            tone('square', 250, 40, 0.3, 0.18, 0.04);
            tone('triangle', 500, 100, 0.2, 0.12, 0.15);
        },

        /** Rising arpeggio when a token reaches home */
        playTokenHome() {
            ensureCtx();
            const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
            notes.forEach((f, i) => {
                tone('sine', f, f * 1.03, 0.25, 0.18, i * 0.1);
                tone('triangle', f * 0.5, f * 0.52, 0.2, 0.06, i * 0.1);
            });
        },

        /** Victory fanfare melody */
        playVictory() {
            ensureCtx();
            const melody = [
                523, 523, 659, 784, 659, 784, 1047, 1047,
                880, 1047, 1319, 1047
            ];
            melody.forEach((f, i) => {
                tone('triangle', f, f, 0.18, 0.2, i * 0.14);
                tone('sine', f * 2, f * 2, 0.1, 0.06, i * 0.14);
            });
        },

        /** Subtle error buzz */
        playError() {
            ensureCtx();
            tone('sawtooth', 160, 90, 0.18, 0.12);
        },

        /** Light UI click */
        playClick() {
            ensureCtx();
            tone('sine', 700, 400, 0.06, 0.1);
        }
    };
})();

if (typeof window !== 'undefined') window.LudoSounds = LudoSounds;
