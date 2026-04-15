import type { ExtractedEvent } from './types';

const SCOPE = 'https://www.googleapis.com/auth/calendar.events';
const TOKEN_KEY = 'gcal_token';
const TOKEN_EXPIRY_KEY = 'gcal_token_expiry';

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string; expires_in: number; error?: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

function getStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!token || !expiry) return null;
  if (Date.now() > parseInt(expiry)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    return null;
  }
  return token;
}

function storeToken(token: string, expiresIn: number): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + expiresIn * 1000));
}

export function getToken(): string | null {
  return getStoredToken();
}

export function signIn(clientId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPE,
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        storeToken(response.access_token, response.expires_in);
        resolve(response.access_token);
      },
    });
    client.requestAccessToken();
  });
}

export function signOut(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

export async function addEvent(event: ExtractedEvent, token: string): Promise<void> {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const body: Record<string, unknown> = {
    summary: event.title,
    description: event.description ?? '',
  };

  if (event.startTime) {
    body.start = {
      dateTime: `${event.date}T${event.startTime}:00`,
      timeZone: tz,
    };
    body.end = {
      dateTime: `${event.date}T${event.endTime ?? event.startTime}:00`,
      timeZone: tz,
    };
  } else {
    body.start = { date: event.date };
    body.end   = { date: event.date };
  }

  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) throw new Error(await res.text());
}
