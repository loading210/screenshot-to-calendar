import { useState, useEffect } from 'react';
import { getToken, signIn, signOut, addEvent } from '../lib/google';
import type { EventCardState } from '../lib/types';

export function useCalendar() {
  const [token, setToken] = useState<string | null>(getToken());
  const [adding, setAdding] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

  useEffect(() => {
    // Re-sync token from storage when window regains focus (after OAuth popup)
    const onFocus = () => {
      const t = getToken();
      if (t) setToken(t);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  async function login() {
    if (!clientId) {
      alert('Missing VITE_GOOGLE_CLIENT_ID in .env');
      return;
    }
    try {
      const t = await signIn(clientId);
      setToken(t);
    } catch (err) {
      console.error('Google sign-in failed', err);
    }
  }

  function logout() {
    signOut();
    setToken(null);
  }

  async function addEvents(
    cards: EventCardState[],
    onUpdate: (id: string, status: EventCardState['status']) => void,
  ) {
    if (!token) return;
    setAdding(true);

    const checked = cards.filter((c) => c.checked && c.status !== 'success');

    // Mark all as 'adding'
    checked.forEach((c) => onUpdate(c.id, 'adding'));

    await Promise.allSettled(
      checked.map(async (card) => {
        try {
          await addEvent(card, token);
          onUpdate(card.id, 'success');
        } catch {
          onUpdate(card.id, 'error');
        }
      })
    );

    setAdding(false);
  }

  return { token, login, logout, addEvents, adding };
}
