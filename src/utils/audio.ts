
/**
 * A soft, professional harmonic chime for successful actions.
 * Optimized for a 'premium' feel with soft attacks and resonant decay.
 */
export const playSuccessSound = () => {
    try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const playNote = (freq: number, startTime: number, duration: number, volume: number) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            
            // Envelope
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(volume, startTime + 0.02); // Quick but soft attack
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        const now = audioCtx.currentTime;
        
        // Two-note elegant ascending chime (E6 to A6)
        // High frequencies give a 'crystal' clear feel
        playNote(1318.51, now, 0.8, 0.15);      // E6
        playNote(1760.00, now + 0.1, 1.0, 0.12); // A6
        
    } catch (e) {
        console.warn('Audio feedback failed', e);
    }
};

// Removed click sounds per user request for a quieter experience
export const playClickSound = () => {};
