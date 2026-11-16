import Composer from './components/Composer.jsx';
import MessageList from './components/MessageList.jsx';
import { useChat } from './useChat.js';

export default function App() {
  const { messages, connected, sendMessage, likeMessage } = useChat();

  return (
    <div className="chat">
      <header className="chat__header">
        <div>
          <h1 className="chat__title">Introductions</h1>
          <p className="chat__subtitle">This channel is for company wide chatter</p>
        </div>
        <span
          className={`status ${connected ? 'status--live' : ''}`}
          title={
            connected
              ? 'Connected to the socket.io server'
              : 'Server not reachable: messages stay in this tab'
          }
        >
          <span className="status__dot" />
          {connected ? 'Live' : 'Offline'}
        </span>
      </header>

      <MessageList messages={messages} onLike={likeMessage} />
      <Composer onSend={sendMessage} />
    </div>
  );
}
