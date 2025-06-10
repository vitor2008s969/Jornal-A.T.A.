// Inicialização do sistema
document.addEventListener('DOMContentLoaded', function() {
    // Efeito de inicialização do terminal
    showBootSequence();
    
    // Inicializar partículas
    if (typeof particlesJS !== 'undefined') {
        particlesJS.load('particles-js', 'assets/config/particles.json');
    }
    
    // Carregar notícias
    loadNews();
    
    // Inicializar calendário
    initCalendar();
    
    // Configurar eventos de UI
    setupUIEvents();
    
    // Configurar efeitos de som
    setupSoundEffects();
    
    // Simular feed ao vivo
    simulateLiveFeed();
});

// Sequência de inicialização futurista
function showBootSequence() {
    const terminal = document.createElement('div');
    terminal.className = 'terminal-effect';
    terminal.innerHTML = `
        <div class="terminal-text">
            <p>> Inicializando Sistema Holográfico v4.2...</p>
            <p>> Carregando módulos de realidade aumentada...</p>
            <p>> Conectando à rede neural escolar...</p>
            <p>> Verificando credenciais de acesso...</p>
            <p>> Sistema pronto <span class="terminal-cursor">_</span></p>
        </div>
    `;
    document.body.appendChild(terminal);
    
    setTimeout(() => {
        terminal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(terminal);
            // Ativar animações após carregamento
            document.documentElement.classList.remove('no-js');
        }, 1000);
    }, 3000);
}

// Carregar notícias dinamicamente
async function loadNews() {
    try {
        const response = await fetch('news/data.json');
        const newsData = await response.json();
        
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = '';
        
        newsData.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            newsCard.innerHTML = `
                <h3>${news.title}</h3>
                <p>${news.summary}</p>
                <div class="meta">
                    <span>${news.date}</span>
                    <span>${news.author}</span>
                </div>
            `;
            newsCard.addEventListener('click', () => {
                window.location.href = `news/${news.id}.html`;
            });
            newsContainer.appendChild(newsCard);
        });
    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        document.getElementById('news-container').innerHTML = `
            <p class="error">⚠️ Falha na conexão com o servidor de notícias</p>
        `;
    }
}

// Calendário interativo
function initCalendar() {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                       "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    const events = {
        '15/6/2025': { title: 'Reunião de Pais', time: '18:30', location: 'Auditório Principal' },
        '1/7/2025': { title: 'Feira de Ciências', time: '09:00', location: 'Quadra Coberta' },
        '20/7/2025': { title: 'Jogos Internos', time: '08:00', location: 'Quadras Esportivas' }
    };
    
    function renderCalendar(month, year) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
        
        const calendarGrid = document.getElementById('calendar-days');
        calendarGrid.innerHTML = '';
        
        // Dias da semana
        const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        weekdays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-weekday';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });
        
        // Espaços vazios no início
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const dateKey = `${day}/${month + 1}/${year}`;
            if (events[dateKey]) {
                dayElement.classList.add('event');
            }
            
            if (day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                dayElement.classList.add('today');
            }
            
            dayElement.addEventListener('click', () => showEventDetails(dateKey));
            calendarGrid.appendChild(dayElement);
        }
    }
    
    function showEventDetails(dateKey) {
        const eventDetails = document.getElementById('event-details');
        const selectedEvent = document.getElementById('selected-event');
        
        if (events[dateKey]) {
            const event = events[dateKey];
            selectedEvent.innerHTML = `
                <p><strong>Evento:</strong> ${event.title}</p>
                <p><strong>Horário:</strong> ${event.time}</p>
                <p><strong>Local:</strong> ${event.location}</p>
            `;
            eventDetails.querySelector('h4').textContent = `Evento: ${dateKey}`;
        } else {
            selectedEvent.innerHTML = '<p>Nenhum evento agendado para esta data</p>';
            eventDetails.querySelector('h4').textContent = `Data: ${dateKey}`;
        }
    }
    
    // Navegação do calendário
    document.getElementById('prev-month').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    // Botão de adicionar à agenda
    document.getElementById('add-to-schedule').addEventListener('click', function() {
        const eventTitle = document.getElementById('event-details').querySelector('h4').textContent;
        playSound('notification-sound');
        alert(`Evento "${eventTitle}" adicionado à sua agenda digital`);
    });
    
    // Renderizar calendário inicial
    renderCalendar(currentMonth, currentYear);
}

// Configurar eventos de UI
function setupUIEvents() {
    // Efeitos de hover
    const interactiveElements = document.querySelectorAll('.nav-link, .holo-button, .news-card, .social-icon, .calendar-day');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            playSound('hover-sound');
        });
        
        element.addEventListener('click', () => {
            playSound('click-sound');
        });
    });
    
    // Navegação por seções
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            document.querySelector(`#${section}`).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Formulário de login
    document.getElementById('login-btn').addEventListener('click', function() {
        const form = document.getElementById('login-form');
        form.style.display = form.style.display === 'block' ? 'none' : 'block';
    });
}

// Efeitos de som
function setupSoundEffects() {
    // Pré-carregar sons
    const sounds = {
        'hover-sound': new Audio('assets/sounds/hover.wav'),
        'click-sound': new Audio('assets/sounds/click.wav'),
        'notification-sound': new Audio('assets/sounds/notification.wav')
    };
    
    // Configurar volumes
    Object.values(sounds).forEach(sound => {
        sound.volume = 0.3;
    });
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Autoplay bloqueado:', e));
    }
}

// Simular feed ao vivo
function simulateLiveFeed() {
    const liveStream = document.getElementById('live-stream');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    
    // Simular conexão
    setTimeout(() => {
        liveStream.innerHTML = `
            <div class="live-video-placeholder">
                <div class="signal-indicator">
                    <div class="signal-bar"></div>
                    <div class="signal-bar"></div>
                    <div class="signal-bar"></div>
                    <div class="signal-text">TRANSMISSÃO AO VIVO</div>
                </div>
                <p class="live-title">Feira de Ciências 2025 - Transmissão Principal</p>
            </div>
        `;
    }, 2000);
    
    // Mensagens automáticas do chat
    const autoMessages = [
        "Sistema: Bem-vindos à transmissão ao vivo da Sala do Futuro!",
        "Prof. Silva: Lembrem-se de enviar seus projetos até sexta-feira!",
        "Aluno_123: Alguém sabe onde será a próxima reunião?",
        "Robô_Assistente: Para informações, digite /ajuda"
    ];
    
    autoMessages.forEach((msg, i) => {
        setTimeout(() => {
            addChatMessage(msg.split(':')[0], msg.split(':')[1].trim());
        }, 3000 + (i * 8000));
    });
    
    // Enviar mensagem
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addChatMessage("Você", message);
            chatInput.value = '';
            
            // Resposta automática
            setTimeout(() => {
                if (message.toLowerCase().includes('ajuda')) {
                    addChatMessage("Robô_Assistente", "Comandos disponíveis: /eventos, /notícias, /horários");
                } else {
                    addChatMessage("Robô_Assistente", "Mensagem recebida. Aguarde resposta de um moderador.");
                }
            }, 1000 + Math.random() * 2000);
        }
    }
    
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function addChatMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Realidade Aumentada
document.querySelectorAll('.ar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        const arViewer = document.getElementById('ar-viewer');
        
        // Simular diferentes modos de RA
        switch(target) {
            case 'school-map':
                arViewer.innerHTML = `
                    <h3>Mapa 3D da Escola</h3>
                    <div class="ar-map">
                        <div class="ar-room" style="top:20%; left:30%;">Biblioteca</div>
                        <div class="ar-room" style="top:50%; left:60%;">Laboratório</div>
                        <div class="ar-room" style="top:70%; left:20%;">Auditório</div>
                    </div>
                `;
                break;
            case 'timetable':
                arViewer.innerHTML = `
                    <h3>Horários de Aula</h3>
                    <div class="ar-timetable">
                        <div class="ar-class">Matemática - 08:00</div>
                        <div class="ar-class">Ciências - 10:00</div>
                        <div class="ar-class">Programação - 14:00</div>
                    </div>
                `;
                break;
            case 'achievements':
                arViewer.innerHTML = `
                    <h3>Conquistas Acadêmicas</h3>
                    <div class="ar-badges">
                        <div class="ar-badge">⭐ Top Matemática</div>
                        <div class="ar-badge">🏆 Feira de Ciências</div>
                        <div class="ar-badge">💻 Hackathon</div>
                    </div>
                `;
                break;
        }
        
        playSound('click-sound');
    });
});
<link rel="stylesheet" href="assistente-ia.css">
<script src="assistente-ia.js"></script>
