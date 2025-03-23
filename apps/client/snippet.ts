// This script injects a floating chat box into a page and sends messages to a REST backend
(() => {
  const chatContainer: HTMLDivElement = document.createElement('div');
  chatContainer.style.position = 'fixed';
  chatContainer.style.bottom = '80px';
  chatContainer.style.right = '20px';
  chatContainer.style.width = '320px';
  chatContainer.style.backgroundColor = '#f9f9fb';
  chatContainer.style.border = '1px solid #ddd';
  chatContainer.style.borderRadius = '12px';
  chatContainer.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
  chatContainer.style.zIndex = '10000';
  chatContainer.style.fontFamily = '"Helvetica Neue", sans-serif';
  chatContainer.style.overflow = 'hidden';
  chatContainer.style.display = 'none';

  const siteDomain = window.location.hostname;

  chatContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; background-color: #fff; padding: 6px 10px; font-weight: 600; border-bottom: 1px solid #eee; font-size: 13px; color: #333;">
      <span>${siteDomain}</span>
      <button id="collapseChat" style="background: none; border: none; font-size: 16px; cursor: pointer;">&minus;</button>
    </div>
    <div id="productDescription" style="padding: 6px 10px; font-size: 13px; color: #666; border-bottom: 1px solid #eee;"></div>
    <div id="chatMessages" style="height: 45vh; overflow-y: auto; padding: 16px; font-size: 14px;"></div>
    <form id="chatForm" style="display: flex; border-top: 1px solid #eee; background: #fff;">
      <input id="chatInput" type="text" placeholder="Chat..." style="flex: 1; padding: 12px; border: none; font-size: 14px; outline: none;">
      <button type="submit" style="padding: 12px; background: #3399ff; color: white; border: none; cursor: pointer; font-size: 14px;">➤</button>
    </form>
  `;

  const chatToggle: HTMLDivElement = document.createElement('div');
  chatToggle.innerHTML = '💬';
  chatToggle.style.position = 'fixed';
  chatToggle.style.bottom = '20px';
  chatToggle.style.right = '20px';
  chatToggle.style.width = '48px';
  chatToggle.style.height = '48px';
  chatToggle.style.borderRadius = '24px';
  chatToggle.style.backgroundColor = '#3399ff';
  chatToggle.style.color = 'white';
  chatToggle.style.display = 'flex';
  chatToggle.style.alignItems = 'center';
  chatToggle.style.justifyContent = 'center';
  chatToggle.style.fontSize = '24px';
  chatToggle.style.cursor = 'pointer';
  chatToggle.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  chatToggle.style.zIndex = '10000';

  chatToggle.addEventListener('click', () => {
    chatContainer.style.display = 'block';
  });

  document.body.appendChild(chatContainer);
  document.body.appendChild(chatToggle);

  const collapseButton = chatContainer.querySelector('#collapseChat') as HTMLButtonElement;
  collapseButton.addEventListener('click', () => {
    chatContainer.style.display = 'none';
    chatToggle.style.display = 'flex';
  });

  const chatMessages = document.getElementById('chatMessages') as HTMLElement;
  const chatIntro = document.createElement('div');
  chatIntro.style.background = '#f0f0f5';
  chatIntro.style.color = '#333';
  chatIntro.style.padding = '10px 14px';
  chatIntro.style.borderRadius = '16px';
  chatIntro.style.marginBottom = '10px';
  chatIntro.style.maxWidth = '80%';
  chatIntro.innerHTML = `👋 Hi, I'm an <strong>AI Bot</strong>. I can answer any questions you have about this page! Average reply time: <strong>&gt;1 min</strong>.`;
  chatMessages.appendChild(chatIntro);

  const scrollToBottom = () => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  scrollToBottom();

  const productDescription = document.getElementById('productDescription') as HTMLElement;
  const titleText = document.title.trim();
  productDescription.textContent = titleText.length > 64 ? titleText.slice(0, 64) + '...' : titleText;

  const chatForm = document.getElementById('chatForm') as HTMLFormElement;
  const chatInput = document.getElementById('chatInput') as HTMLInputElement;

  chatForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    const message: string = chatInput.value.trim();
    if (!message) return;

    const userMessage: HTMLDivElement = document.createElement('div');
    userMessage.textContent = message;
    userMessage.style.margin = '8px 0';
    userMessage.style.textAlign = 'right';
    userMessage.style.background = '#3399ff';
    userMessage.style.color = 'white';
    userMessage.style.padding = '8px 12px';
    userMessage.style.borderRadius = '16px';
    userMessage.style.display = 'inline-block';
    chatMessages.appendChild(userMessage);
    scrollToBottom();

    chatInput.value = '';

    try {
      const response: Response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          message,
          pageTitle: document.title,
          url: window.location.href,
        }),
      });

      const data: { reply?: string } = await response.json();

      const botMessage: HTMLDivElement = document.createElement('div');
      botMessage.textContent = data.reply || 'No response';
      botMessage.style.margin = '8px 0';
      botMessage.style.textAlign = 'left';
      botMessage.style.background = '#eee';
      botMessage.style.color = '#333';
      botMessage.style.padding = '8px 12px';
      botMessage.style.borderRadius = '16px';
      botMessage.style.display = 'inline-block';
      chatMessages.appendChild(botMessage);
      scrollToBottom();
    } catch (error) {
      const errorMessage: HTMLDivElement = document.createElement('div');
      errorMessage.textContent = 'Error sending message.';
      errorMessage.style.color = 'red';
      errorMessage.style.marginTop = '10px';
      chatMessages.appendChild(errorMessage);
      scrollToBottom();
    }
  });
})();
