import { useEffect, useRef, useState } from 'react';
import { EMOJIS, USER_COLORS, user_list } from '../constants.js';

// An "@" at the start or after whitespace, followed by the letters typed so far.
const MENTION_QUERY = /(^|\s)@(\w*)$/;

function findMention(text, caret) {
  const match = MENTION_QUERY.exec(text.slice(0, caret));
  if (!match) return null;
  const query = match[2];
  const users = user_list.filter((u) => u.toLowerCase().startsWith(query.toLowerCase()));
  if (users.length === 0) return null;
  return { start: caret - query.length - 1, users };
}

export default function Composer({ onSend }) {
  const [text, setText] = useState('');
  const [mention, setMention] = useState(null); // { start, users } while the list is open
  const [activeIndex, setActiveIndex] = useState(0);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const inputRef = useRef(null);
  const rootRef = useRef(null);
  const pendingCaret = useRef(null);

  // Restore the caret after programmatic inserts (emoji, mention).
  useEffect(() => {
    if (pendingCaret.current === null) return;
    const input = inputRef.current;
    input.focus();
    input.setSelectionRange(pendingCaret.current, pendingCaret.current);
    pendingCaret.current = null;
  }, [text]);

  // Close popovers when clicking elsewhere.
  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setEmojiOpen(false);
        setMention(null);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const syncMention = (value, caret) => {
    setMention(findMention(value, caret));
    setActiveIndex(0);
  };

  const insertAt = (start, end, insert) => {
    const next = text.slice(0, start) + insert + text.slice(end);
    pendingCaret.current = start + insert.length;
    setText(next);
    return next;
  };

  const caretRange = () => {
    const input = inputRef.current;
    return [input.selectionStart ?? text.length, input.selectionEnd ?? text.length];
  };

  const pickUser = (user) => {
    const [, end] = caretRange();
    insertAt(mention.start, Math.max(end, mention.start + 1), `@${user} `);
    setMention(null);
  };

  const pickEmoji = (emoji) => {
    const [start, end] = caretRange();
    insertAt(start, end, emoji);
  };

  const openMentions = () => {
    const [start, end] = caretRange();
    const needsSpace = start > 0 && !/\s/.test(text[start - 1]);
    const insert = `${needsSpace ? ' ' : ''}@`;
    const next = insertAt(start, end, insert);
    setEmojiOpen(false);
    syncMention(next, start + insert.length);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
    setMention(null);
    setEmojiOpen(false);
    inputRef.current.focus();
  };

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      setMention(null);
      setEmojiOpen(false);
      return;
    }
    if (!mention) return;

    const last = mention.users.length - 1;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (i >= last ? 0 : i + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? last : i - 1));
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      pickUser(mention.users[activeIndex]);
    }
  };

  return (
    <form className="composer" onSubmit={submit} ref={rootRef}>
      {mention && (
        <ul className="popover mentions" role="listbox" aria-label="Mention a user">
          {mention.users.map((user, index) => (
            <li key={user} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                className={`mentions__item ${index === activeIndex ? 'mentions__item--active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => pickUser(user)}
              >
                <span className="avatar avatar--small" style={{ backgroundColor: USER_COLORS[user] }}>
                  {user.slice(0, 2).toUpperCase()}
                </span>
                {user}
              </button>
            </li>
          ))}
        </ul>
      )}

      {emojiOpen && (
        <div className="popover emojis" role="group" aria-label="Emoji">
          {EMOJIS.map((emoji) => (
            <button key={emoji} type="button" className="emojis__item" onClick={() => pickEmoji(emoji)}>
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="composer__field">
        <input
          ref={inputRef}
          className="composer__input"
          type="text"
          value={text}
          placeholder="Type Message"
          aria-label="Message"
          autoComplete="off"
          autoFocus
          maxLength={2000}
          onChange={(event) => {
            setText(event.target.value);
            syncMention(event.target.value, event.target.selectionStart ?? event.target.value.length);
          }}
          onKeyDown={onKeyDown}
          onClick={(event) => syncMention(text, event.target.selectionStart ?? text.length)}
        />
        <button
          type="button"
          className="icon-button"
          onClick={openMentions}
          aria-label="Mention a user"
          title="Mention a user"
        >
          @
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => {
            setEmojiOpen((open) => !open);
            setMention(null);
          }}
          aria-label="Add emoji"
          aria-expanded={emojiOpen}
          title="Add emoji"
        >
          😊
        </button>
      </div>

      <button type="submit" className="send" disabled={!text.trim()}>
        Send
      </button>
    </form>
  );
}
