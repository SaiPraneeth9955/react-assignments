# React Chat App

Solution to the [Exactspace React chat assignment](https://github.com/exact-space/react-assignments/blob/main/chat-app/reactjs_chat_assignment.md).

## Features

**Basic task**

- Single page app with a message box and a Send button (Enter also sends).
- Sent messages appear in the thread above the input.
- Each message is assigned a random user from `["Alan", "Bob", "Carol", "Dean", "Elin"]`.
- Each message has a like button at its right end with a count that increases on every click.

**Stretch goals (all three)**

1. **Emoji** – an emoji picker in the input inserts at the cursor position.
2. **Mentions** – typing `@` (or clicking the `@` button) opens the user list. Keep typing to filter, use the arrow keys and Enter/Tab or click to pick. Mentions are highlighted in the thread.
3. **socket.io** – an Express + socket.io server. Clients publish `chat:message` and `chat:like` events; the server broadcasts them to every subscriber and sends `chat:history` to new connections, so messages and likes stay in sync across tabs.

If the server is not running, the client still works on its own with local state (the header shows "Offline" instead of "Live").

## Running it

Requires Node 18+.

```bash
npm install
npm run dev
```

This starts the server on http://localhost:4000 and the client on http://localhost:5173. Open the client in two tabs to see messages and likes sync.

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run client` | Client only (works offline, without the server) |
| `npm run server` | Server only |
| `npm run build` then `npm start` | Builds the client and serves it from the Express server on port 4000 |

Set `VITE_SOCKET_URL` to point the client at a server on another host.

## Structure

```
client/                React 18 + Vite
  src/
    App.jsx            Layout and header
    useChat.js         Chat state + socket.io publish/subscribe, local fallback
    constants.js       User list, emoji list, socket URL
    components/
      MessageList.jsx  Thread, auto-scrolls to the newest message
      Message.jsx      Avatar, name, time, bubble, like button
      Composer.jsx     Input, emoji picker, @mention list, send button
server/
  index.js             Express + socket.io server (in-memory message store)
```

## Notes

- Messages are kept in server memory, so they reset when the server restarts.
- No UI libraries are used; styling is plain CSS in `client/src/styles.css`.
