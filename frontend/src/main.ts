import './style.css'
import { sendMessage, getHistory } from './lib/api'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <div class="chat-window" id="chat-window">
      <div class="empty-state" id="empty-state">
        <p>👋 Hi! I'm the Spur Support Agent. How can I help you today?</p>
      </div>
    </div>
    <form class="input-area" id="chat-form">
      <input type="text" id="chat-input" placeholder="Type your message..." />
      <button type="submit" id="send-btn" disabled>Send</button>
    </form>
  </div>
`

const chatWindow = document.getElementById('chat-window')!;
const chatForm = document.getElementById('chat-form') as HTMLFormElement;
const chatInput = document.getElementById('chat-input') as HTMLInputElement;
const sendBtn = document.getElementById('send-btn') as HTMLButtonElement;
const emptyState = document.getElementById('empty-state')!;

let sessionId = localStorage.getItem('chatSessionId') || '';
let loading = false;

function appendMessage(sender: 'user' | 'ai', text: string) {
  emptyState.style.display = 'none';
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.innerHTML = `<div class="bubble">${text}</div>`;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function setLoading(isLoading: boolean) {
  loading = isLoading;
  chatInput.disabled = isLoading;
  sendBtn.disabled = isLoading || !chatInput.value.trim();

  if (isLoading) {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-bubble';
    loadingDiv.className = 'message ai';
    loadingDiv.innerHTML = '<div class="bubble typing">...</div>';
    chatWindow.appendChild(loadingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } else {
    const loadingDiv = document.getElementById('loading-bubble');
    if (loadingDiv) loadingDiv.remove();
  }
}

// Load history
if (sessionId) {
  getHistory(sessionId).then(data => {
    if (data.messages.length > 0) {
      emptyState.style.display = 'none';
      data.messages.forEach((m: any) => appendMessage(m.sender, m.text));
    }
  }).catch(console.error);
}

chatInput.addEventListener('input', () => {
  sendBtn.disabled = loading || !chatInput.value.trim();
});

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text || loading) return;

  appendMessage('user', text);
  chatInput.value = '';
  setLoading(true);

  try {
    const data = await sendMessage(text, sessionId);
    if (!sessionId) {
      sessionId = data.sessionId;
      localStorage.setItem('chatSessionId', sessionId);
    }
    appendMessage('ai', data.reply);
  } catch (error) {
    appendMessage('ai', 'Error: Could not reach the agent.');
  } finally {
    setLoading(false);
    // Re-focus input
    chatInput.focus();
  }
});
