import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { usePrivacyConsent } from './usePrivacyConsent.ts';
import { PRIVACY_POLICY_ACCEPTED_STORAGE_KEY } from '../utils/privacyPolicy.ts';

describe('usePrivacyConsent フック', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('初期状態（未同意）では isConsentModalOpen が true、hasAccepted が false であること', () => {
    const { result } = renderHook(() => usePrivacyConsent());
    expect(result.current.hasAccepted).toBe(false);
    expect(result.current.isConsentModalOpen).toBe(true);
  });

  it('すでに同意済みの場合は isConsentModalOpen が false、hasAccepted が true であること', () => {
    localStorage.setItem(PRIVACY_POLICY_ACCEPTED_STORAGE_KEY, 'true');
    const { result } = renderHook(() => usePrivacyConsent());
    expect(result.current.hasAccepted).toBe(true);
    expect(result.current.isConsentModalOpen).toBe(false);
  });

  it('acceptConsent を実行すると localStorage に記録され、モーダルが閉じて hasAccepted が true になること', () => {
    const { result } = renderHook(() => usePrivacyConsent());
    expect(result.current.isConsentModalOpen).toBe(true);

    act(() => {
      result.current.acceptConsent();
    });

    expect(result.current.hasAccepted).toBe(true);
    expect(result.current.isConsentModalOpen).toBe(false);
    expect(localStorage.getItem(PRIVACY_POLICY_ACCEPTED_STORAGE_KEY)).toBe('true');
  });

  it('openConsentModal と closeConsentModal で開閉状態を変更できること', () => {
    localStorage.setItem(PRIVACY_POLICY_ACCEPTED_STORAGE_KEY, 'true');
    const { result } = renderHook(() => usePrivacyConsent());
    expect(result.current.isConsentModalOpen).toBe(false);

    act(() => {
      result.current.openConsentModal();
    });
    expect(result.current.isConsentModalOpen).toBe(true);

    act(() => {
      result.current.closeConsentModal();
    });
    expect(result.current.isConsentModalOpen).toBe(false);
  });
});
