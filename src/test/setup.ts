import '@testing-library/jest-dom';

// Web Audio API の JSDOM 向けモック
class AudioContextMock {
  state: AudioContextState = 'running';
  currentTime = 0;
  destination = {};

  createOscillator() {
    return {
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  createGain() {
    return {
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };
  }

  createBiquadFilter() {
    return {
      type: 'bandpass',
      Q: { setValueAtTime: vi.fn() },
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };
  }

  resume = vi.fn().mockResolvedValue(undefined);
}

// globalThis に AudioContext を設定
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: AudioContextMock,
});

// JSDOM に存在しない PointerEvent および PointerCapture のモック
if (typeof window.PointerEvent === 'undefined') {
  class PointerEventMock extends MouseEvent {
    pointerId: number;
    pointerType: string;
    isPrimary: boolean;

    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId ?? 0;
      this.pointerType = params.pointerType ?? 'mouse';
      this.isPrimary = params.isPrimary ?? false;
    }
  }

  window.PointerEvent = PointerEventMock as unknown as typeof PointerEvent;
}

if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = vi.fn();
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = vi.fn();
}

