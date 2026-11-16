import { memo } from 'react';
import { USER_COLORS, user_list } from '../constants.js';

const MENTION_PATTERN = new RegExp(`(@(?:${user_list.join('|')})\\b)`, 'g');

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });

function renderText(text) {
  return text.split(MENTION_PATTERN).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="mention">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function Message({ message, onLike }) {
  const { id, user, text, time, likes } = message;

  return (
    <li className="message">
      <span className="avatar" style={{ backgroundColor: USER_COLORS[user] }} aria-hidden="true">
        {user.slice(0, 2).toUpperCase()}
      </span>

      <div className="message__body">
        <div className="message__meta">
          <span className="message__user">{user}</span>
          <time className="message__time" dateTime={new Date(time).toISOString()}>
            {timeFormat.format(time)}
          </time>
        </div>
        <p className="message__bubble">{renderText(text)}</p>
      </div>

      <button
        type="button"
        className={`like ${likes > 0 ? 'like--active' : ''}`}
        onClick={() => onLike(id)}
        aria-label={`Like message from ${user}, ${likes} ${likes === 1 ? 'like' : 'likes'}`}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M12 20.5l-1.3-1.2C5.9 15 3 12.3 3 9a4.5 4.5 0 0 1 9-1.5A4.5 4.5 0 0 1 21 9c0 3.300-2.900 6-7.700 10.300L12 20.500z" />
        </svg>
        <span className="like__count">{likes}</span>
      </button>
    </li>
  );
}

export default memo(Message);
