// IA Assistant - Integração avançada
class ATA_Assistant {
  constructor() {
    this.isListening = false;
    this.assistantActive = false;
    this.loadModels();
    this.setupUI();
  }

  async loadModels() {
    // Carregar modelos de IA (simulação - em produção seria via API)
    console.log("Carregando modelos de IA...");
    this.summarizerModel = await this.loadModel('summarizer');
    this.sentimentModel = await this.loadModel('sentiment-analysis');
    this.translationModel = await this.loadModel('translation');
    
    // Verificar suporte a Web Speech API
    this.speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (this.speechRecognition) {
      this.recognition = new this.speechRecognition();
      this.recognition.lang = 'pt-BR';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      
      this.recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        this.processVoiceCommand(speechResult);
      };
      
      this.recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
      };
    }
  }

  async loadModel(modelName) {
    // Simulação de carregamento de modelo
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Modelo ${modelName} carregado`);
        resolve({ predict: () => "Simulação de IA" });
      }, 1000);
    });
  }

  setupUI() {
    // Criar interface do assistente
    this.assistantUI = document.createElement('div');
    this.assistantUI.id = 'ata-assistant';
    this.assistantUI.innerHTML = `
      <div class="assistant-container">
        <div class="assistant-avatar">
          <img src="assets/images/ai-avatar.png" alt="Assistente A.T.A">
          <div class="pulse-ring"></div>
        </div>
        <div class="assistant-content">
          <div class="assistant-messages" id="assistant-messages"></div>
          <div class="assistant-controls">
            <button id="toggle-assistant">Ativar Assistente</button>
            <button id="voice-command" disabled>🎤 Comando de Voz</button>
            <input type="text" id="assistant-input" placeholder="Pergunte ao assistente...">
            <button id="send-question">Enviar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(this.assistantUI);
    
    // Event listeners
    document.getElementById('toggle-assistant').addEventListener('click', () => this.toggleAssistant());
    document.getElementById('voice-command').addEventListener('click', () => this.toggleVoiceRecognition());
    document.getElementById('send-question').addEventListener('click', () => this.processQuestion());
    document.getElementById('assistant-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.processQuestion();
    });
  }

  toggleAssistant() {
    this.assistantActive = !this.assistantActive;
    const assistant = document.getElementById('ata-assistant');
    const toggleBtn = document.getElementById('toggle-assistant');
    
    if (this.assistantActive) {
      assistant.classList.add('active');
      toggleBtn.textContent = 'Desativar Assistente';
      document.getElementById('voice-command').disabled = false;
      this.addMessage('assistant', 'Olá! Sou o assistente de IA do Jornal A.T.A. Como posso ajudar?');
    } else {
      assistant.classList.remove('active');
      toggleBtn.textContent = 'Ativar Assistente';
      document.getElementById('voice-command').disabled = true;
    }
  }

  toggleVoiceRecognition() {
    if (!this.isListening) {
      this.recognition.start();
      this.isListening = true;
      document.getElementById('voice-command').classList.add('listening');
      this.addMessage('system', 'Ouvindo... (fale agora)');
    } else {
      this.recognition.stop();
      this.isListening = false;
      document.getElementById('voice-command').classList.remove('listening');
    }
  }

  addMessage(sender, message) {
    const messagesContainer = document.getElementById('assistant-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    
    if (sender === 'assistant') {
      messageElement.innerHTML = `
        <div class="message-avatar">
          <img src="assets/images/ai-avatar-small.png" alt="Assistente">
        </div>
        <div class="message-content">
          ${message}
        </div>
      `;
    } else {
      messageElement.innerHTML = `
        <div class="message-content">
          ${message}
        </div>
      `;
    }
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async processQuestion() {
    const input = document.getElementById('assistant-input');
    const question = input.value.trim();
    
    if (question) {
      this.addMessage('user', question);
      input.value = '';
      
      // Mostrar "digitando..."
      const typingIndicator = document.createElement('div');
      typingIndicator.classList.add('message', 'assistant', 'typing');
      typingIndicator.innerHTML = `
        <div class="message-avatar">
          <img src="assets/images/ai-avatar-small.png" alt="Assistente">
        </div>
        <div class="message-content">
          <span class="typing-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </div>
      `;
      document.getElementById('assistant-messages').appendChild(typingIndicator);
      
      // Processar pergunta (simulação)
      setTimeout(async () => {
        document.getElementById('assistant-messages').removeChild(typingIndicator);
        const response = await this.generateResponse(question);
        this.addMessage('assistant', response);
      }, 1500);
    }
  }

  async processVoiceCommand(command) {
    this.addMessage('user', command);
    this.isListening = false;
    document.getElementById('voice-command').classList.remove('listening');
    
    // Mostrar "digitando..."
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'assistant', 'typing');
    typingIndicator.innerHTML = `
      <div class="message-avatar">
        <img src="assets/images/ai-avatar-small.png" alt="Assistente">
      </div>
      <div class="message-content">
        <span class="typing-dots">
          <span>.</span><span>.</span><span>.</span>
        </span>
      </div>
    `;
    document.getElementById('assistant-messages').appendChild(typingIndicator);
    
    // Processar comando de voz
    setTimeout(async () => {
      document.getElementById('assistant-messages').removeChild(typingIndicator);
      const response = await this.generateResponse(command);
      this.addMessage('assistant', response);
      this.speak(response);
    }, 1500);
  }

  async generateResponse(question) {
    // Simulação de processamento de linguagem natural
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('notícia') || lowerQuestion.includes('noticia')) {
      const summary = await this.generateNewsSummary();
      return `Aqui está um resumo das últimas notícias:<br><br>${summary}`;
    }
    else if (lowerQuestion.includes('evento') || lowerQuestion.includes('agenda')) {
      return this.getUpcomingEvents();
    }
    else if (lowerQuestion.includes('traduzir') || lowerQuestion.includes('translate')) {
      return this.handleTranslationRequest(question);
    }
    else if (lowerQuestion.includes('ajuda') || lowerQuestion.includes('help')) {
      return this.getHelpInfo();
    }
    else {
      return this.getGenericResponse();
    }
  }

  async generateNewsSummary() {
    // Simulação de resumo automático com IA
    const news = [
      "Prova Paulista 2025: Inscrições abertas para o 2° bimestre",
      "Feira de Ciências: Alunos apresentam projetos inovadores",
      "Jogos Internos: Competições começam no dia 20/07"
    ];
    
    // Simular resumo com IA
    const summary = await this.summarizerModel.predict(news.join('\n'));
    return summary || news.map(item => `• ${item}`).join('<br>');
  }

  getUpcomingEvents() {
    const events = [
      { date: "15/06", title: "Reunião de Pais", location: "Auditório" },
      { date: "01/07", title: "Feira de Ciências", location: "Quadra Coberta" },
      { date: "20/07", title: "Jogos Internos", location: "Quadras Esportivas" }
    ];
    
    return `Próximos eventos:<br><br>${
      events.map(e => `<strong>${e.date}:</strong> ${e.title} (${e.location})`).join('<br>')
    }`;
  }

  async handleTranslationRequest(text) {
    // Extrair texto para traduzir (remover "traduzir")
    const translationText = text.replace(/traduzir|translate/gi, '').trim();
    
    if (translationText) {
      // Simular tradução com IA
      const translation = await this.translationModel.predict(translationText);
      return `Tradução para inglês:<br><br>"${translationText}" → "${translation || '[simulação de tradução]'}"`;
    } else {
      return "Por favor, especifique o texto que deseja traduzir. Exemplo: 'traduzir onde fica a biblioteca?'";
    }
  }

  getHelpInfo() {
    return `Posso ajudar com:<br><br>
      • <strong>Notícias</strong>: Resumir últimas notícias<br>
      • <strong>Eventos</strong>: Listar próximos eventos<br>
      • <strong>Tradução</strong>: Traduzir textos para inglês<br>
      • <strong>Dúvidas</strong>: Responder perguntas sobre a escola<br><br>
      Experimente dizer: "Quais as notícias de hoje?" ou "Traduzir biblioteca"`;
  }

  getGenericResponse() {
    const responses = [
      "Interessante! Posso te ajudar com informações sobre notícias, eventos ou outros assuntos da escola.",
      "Hmm, não tenho certeza se entendi completamente. Você pode reformular?",
      "Posso pesquisar isso para você. Enquanto isso, que tal dar uma olhada nas últimas notícias?",
      "Minhas capacidades incluem resumir notícias, listar eventos e responder perguntas sobre a escola."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  speak(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, ''));
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      speechSynthesis.speak(utterance);
    }
  }

  // Análise de sentimento em comentários
  async analyzeCommentSentiment(comment) {
    try {
      // Simulação de análise de sentimento
      const analysis = await this.sentimentModel.predict(comment);
      return {
        sentiment: analysis.sentiment || 'neutral',
        confidence: analysis.confidence || 0.8
      };
    } catch (error) {
      console.error("Erro na análise de sentimento:", error);
      return { sentiment: 'neutral', confidence: 0 };
    }
  }

  // Moderação de conteúdo
  async moderateContent(text) {
    try {
      // Simulação de moderação
      const result = await this.sentimentModel.predict(text);
      return {
        approved: !result.isInappropriate,
        flags: result.flags || []
      };
    } catch (error) {
      console.error("Erro na moderação de conteúdo:", error);
      return { approved: true, flags: [] };
    }
  }
}

// Inicializar o assistente quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.ATA_Assistant = new ATA_Assistant();
  
  // Integrar com o sistema de comentários
  integrateCommentAnalysis();
  
  // Configurar recomendações personalizadas
  setupPersonalizedRecommendations();
});

// Análise de comentários em tempo real
function integrateCommentAnalysis() {
  const commentInput = document.getElementById('comment-input');
  const submitComment = document.getElementById('submit-comment');
  
  if (commentInput && submitComment) {
    commentInput.addEventListener('input', async () => {
      const sentiment = await window.ATA_Assistant.analyzeCommentSentiment(commentInput.value);
      updateSentimentIndicator(sentiment);
    });
    
    submitComment.addEventListener('click', async () => {
      const moderation = await window.ATA_Assistant.moderateContent(commentInput.value);
      if (!moderation.approved) {
        alert("Seu comentário contém conteúdo inapropriado. Por favor, revise.");
      } else {
        // Submeter comentário
        alert("Comentário enviado para moderação!");
      }
    });
  }
}

function updateSentimentIndicator(sentiment) {
  let indicator = document.getElementById('sentiment-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'sentiment-indicator';
    document.getElementById('comment-form').appendChild(indicator);
  }
  
  indicator.innerHTML = `
    <span class="sentiment-${sentiment.sentiment}">
      Tom: ${sentiment.sentiment} (${Math.round(sentiment.confidence * 100)}%)
    </span>
  `;
}

// Sistema de recomendações personalizadas
function setupPersonalizedRecommendations() {
  // Simular histórico do usuário
  const userHistory = {
    viewedNews: ['Prova Paulista', 'Feira de Ciências'],
    interests: ['educação', 'tecnologia', 'esportes']
  };
  
  // Gerar recomendações baseadas no perfil
  setTimeout(() => {
    const recommendations = generateRecommendations(userHistory);
    displayRecommendations(recommendations);
  }, 3000);
}

function generateRecommendations(history) {
  // Simular geração de recomendações com IA
  const allNews = [
    { id: 1, title: "Novo Laboratório de Robótica", tags: ["tecnologia", "educação"] },
    { id: 2, title: "Resultados dos Jogos Internos", tags: ["esportes"] },
    { id: 3, title: "Palestra sobre IA na Educação", tags: ["tecnologia", "educação"] },
    { id: 4, title: "Inscrições para Olimpíada de Matemática", tags: ["educação"] }
  ];
  
  // Filtrar notícias relevantes
  return allNews.filter(news => 
    news.tags.some(tag => history.interests.includes(tag)) ||
    !history.viewedNews.includes(news.title)
  ).slice(0, 3);
}

function displayRecommendations(recommendations) {
  const container = document.getElementById('recommendations-container');
  if (container && recommendations.length > 0) {
    container.innerHTML = `
      <h3>Recomendado para você</h3>
      <div class="recommendations-list">
        ${recommendations.map(news => `
          <div class="recommendation-item">
            <a href="/news/${news.id}">${news.title}</a>
            <span class="recommendation-badge">⭐ Recomendação IA</span>
          </div>
        `).join('')}
      </div>
    `;
  }
                       }
