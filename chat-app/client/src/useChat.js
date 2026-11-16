import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL, randomUser } from './constants.js';

/**
 * Chat state. When the socket.io server is reachable it is the source of
 * truth (messages and likes are published to it and every client subscribes).
 * When it is not, the app keeps working with local state only.
 */
export function useChat() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { reconnectionDelayMax: 5000 });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('chat:history', (history) => setMessages(history));
    socket.on('chat:message', (message) =>
      setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message])),
    );
    socket.on('chat:like', ({ id, likes }) =>
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, likes } : m))),
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const sendMessage = useCallback((rawText) => {
    const text = rawText.trim();
    if (!text) return;

    const message = {
      id: crypto.randomUUID(),
      user: randomUser(),
      text,
      time: Date.now(),
      likes: 0,
    };

    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit('chat:message', message);
    } else {
      setMessages((prev) => [...prev, message]);
    }
  }, []);

  const likeMessage = useCallback((id) => {
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit('chat:like', id);
    } else {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m)));
    }
  }, []);

  return { messages, connected, sendMessage, likeMessage };
}
