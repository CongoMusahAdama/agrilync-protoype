
/**
 * Shared Web Audio context — unlocked on first user gesture so background alerts can play.
 */
let sharedCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    try {
        if (!sharedCtx) {
            sharedCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (sharedCtx.state === 'suspended') {
            void sharedCtx.resume();
        }
        return sharedCtx;
    } catch {
        return null;
    }
};

if (typeof window !== 'undefined') {
    const unlock = () => getAudioContext();
    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true });
}

const playTone = (
    audioCtx: AudioContext,
    freq: number,
    startTime: number,
    duration: number,
    volume: number,
    type: OscillatorType = 'sine'
) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
};

/**
 * A soft, professional harmonic chime for successful actions.
 */
export const playSuccessSound = () => {
    try {
        const audioCtx = getAudioContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        playTone(audioCtx, 1318.51, now, 0.8, 0.15);
        playTone(audioCtx, 1760.0, now + 0.1, 1.0, 0.12);
    } catch (e) {
        console.warn('Audio feedback failed', e);
    }
};

/**
 * Pleasant two-tone alert for new system notifications.
 */
export const playNotificationBeep = () => {
    try {
        const audioCtx = getAudioContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        playTone(audioCtx, 880, now, 0.22, 0.14);
        playTone(audioCtx, 1174.66, now + 0.18, 0.28, 0.12);
    } catch (e) {
        console.warn('Notification beep failed', e);
    }
};

export const playClickSound = () => {};
