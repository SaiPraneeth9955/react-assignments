export const user_list = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin'];

export const USER_COLORS = {
  Alan: '#e5484d',
  Bob: '#3e8ed0',
  Carol: '#2f9e6e',
  Dean: '#c98a12',
  Elin: '#8e5bd0',
};

export const EMOJIS = [
  '😀', '😂', '😊', '😍', '😎', '🤔', '😢', '😡',
  '👍', '👎', '👏', '🙏', '🙌', '💪', '👋', '🤝',
  '❤️', '🔥', '🎉', '✨', '💯', '✅', '🚀', '☕',
];

// Dev: Vite serves the client on :5173 and the server runs on :4000.
// Production build: the Express server serves the client, so use the same origin.
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.DEV ? 'http://localhost:4000' : window.location.origin);

export const randomUser = () => user_list[Math.floor(Math.random() * user_list.length)];
