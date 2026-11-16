import { useEffect, useRef } from 'react';
import Message from './Message.jsx';

export default function MessageList({ messages, onLike }) {
  const endRef = useRef(null);
  const count = messages.length;

  // Keep the newest message in view.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [count]);

  return (
    <main className="thread" aria-live="polite">
      {count === 0 ? (
        <p className="thread__empty">No messages yet. Send one to get the conversation started.</p>
      ) : (
        <ul className="thread__list">
          {messages.map((message) => (
            <Message key={message.id} message={message} onLike={onLike} />
          ))}
        </ul>
      )}
      <div ref={endRef} />
    </main>
  );
}
