// Objeto para armazenar o estado do quiz
const quizState = {
    currentPage: 1,
    currentSegment: null,
    answers: {}
};

// Define os caminhos de navegação para cada segmento
const navigationPaths = {
    'environment': [
        'page-1',
        'page-environment-2', 'page-environment-3', 'page-environment-4', 'page-environment-5',
        'page-environment-6', 'page-environment-7', 'page-environment-8', 'page-environment-9',
        'page-environment-10', 'page-environment-11',
        'page-summary'
    ],
    'social': [
        'page-1',
        'page-social-2', 'page-social-3', 'page-social-4', 'page-social-5',
        'page-social-6', 'page-social-7', 'page-social-8', 'page-social-9',
        'page-social-10', 'page-social-11',
        'page-summary'
    ],
    'governance': [
        'page-1',
        'page-governance-2', 'page-governance-3', 'page-governance-4', 'page-governance-5',
        'page-governance-6', 'page-governance-7', 'page-governance-8', 'page-governance-9',
        'page-governance-10', 'page-governance-11',
        'page-summary'
    ]
};

// Mapeamento para gerar o conteúdo do RoadMap
const roadmapContentMap = {
    'environment': (answers) => {
        const question1Answer = answers['environment_q2'];
        return `
            <h3>Seu RoadMap Personalizado em Ambiental (E)</h3>
            <p>Com base em suas respostas, identificamos que seu principal foco é em <strong>${question1Answer}</strong>. Seu RoadMap foi adaptado para aprofundar seu conhecimento e habilidades nesta área.</p>
            <p>Seu plano de aprendizado para os próximos meses:</p>
            <ul>
                <li><strong>Módulo 1:</strong> Fundamentos de Sustentabilidade Ambiental
                    <br>Entenda os conceitos básicos e a importância para a transição verde.</li>
                <li><strong>Módulo 2:</strong> Estratégias em ${question1Answer}
                    <br>Aprofunde-se em como implementar ações eficazes para mitigar o impacto ambiental.</li>
                <li><strong>Módulo 3:</strong> Ferramentas e Métricas ESG
                    <br>Descubra as ferramentas certas para medir o impacto e os indicadores de desempenho para relatórios de sustentabilidade.</li>
                <li><strong>Módulo 4:</strong> Inovação e Políticas Verdes
                    <br>Explore como as novas tecnologias e políticas públicas podem impulsionar a sustentabilidade.</li>
            </ul>
        `;
    },
    'social': (answers) => {
        const question1Answer = answers['social_q2'];
        return `
            <h3>Seu RoadMap Personalizado em Social (S)</h3>
            <p>Com base em suas respostas, identificamos que seu principal foco é em <strong>${question1Answer}</strong>. Seu RoadMap foi adaptado para aprofundar seu conhecimento e habilidades nesta área.</p>
            <p>Seu plano de aprendizado para os próximos meses:</p>
            <ul>
                <li><strong>Módulo 1:</strong> Fundamentos de Impacto Social
                    <br>Entenda os conceitos de diversidade, inclusão e o papel das empresas na sociedade.</li>
                <li><strong>Módulo 2:</strong> Estratégias em ${question1Answer}
                    <br>Aprofunde-se em como promover a igualdade e lidar com questões sociais complexas no ambiente corporativo.</li>
                <li><strong>Módulo 3:</strong> Medição de Impacto Social
                    <br>Descubra como criar métricas para avaliar o impacto social de suas iniciativas.</li>
                <li><strong>Módulo 4:</strong> Engajamento e Relações Comunitárias
                    <br>Aprenda a construir relações duradouras com as comunidades e stakeholders.</li>
            </ul>
        `;
    },
    'governance': (answers) => {
        const question1Answer = answers['governance_q2'];
        return `
            <h3>Seu RoadMap Personalizado em Governança (G)</h3>
            <p>Com base em suas respostas, identificamos que seu principal foco é em <strong>${question1Answer}</strong>. Seu RoadMap foi adaptado para aprofundar seu conhecimento e habilidades nesta área.</p>
            <p>Seu plano de aprendizado para os próximos meses:</p>
            <ul>
                <li><strong>Módulo 1:</strong> Fundamentos de Governança Corporativa
                    <br>Entenda o papel da governança na longevidade e na sustentabilidade do negócio.</li>
                <li><strong>Módulo 2:</strong> Estratégias em ${question1Answer}
                    <br>Aprofunde-se em como garantir a conformidade, a ética e a transparência em sua empresa.</li>
                <li><strong>Módulo 3:</strong> Gestão de Riscos e Compliance
                    <br>Aprenda a identificar e mitigar riscos, além de implementar práticas anticorrupção eficazes.</li>
                <li><strong>Módulo 4:</strong> Liderança e Estrutura de Conselho
                    <br>Desenvolva uma liderança forte e um conselho diversificado e independente.</li>
            </ul>
        `;
    }
};

// Função para exibir ou ocultar páginas
function updateUI() {
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.remove('active'));

    const currentPath = quizState.currentSegment ? navigationPaths[quizState.currentSegment] : navigationPaths['environment'];
    const currentPageId = currentPath[quizState.currentPage - 1];
    
    const currentPageElement = document.getElementById(currentPageId);
    if (currentPageElement) {
        currentPageElement.classList.add('active');
    }

    const backButton = document.getElementById('back-button');
    if (quizState.currentPage > 1) {
        backButton.style.display = 'flex';
    } else {
        backButton.style.display = 'none';
    }
}

// Função para atualizar a barra de progresso
function updateProgressBar() {
    const progress = document.getElementById('progress');
    const totalPagesInPath = quizState.currentSegment ? navigationPaths[quizState.currentSegment].length : 12;
    const progressPercentage = ((quizState.currentPage - 1) / (totalPagesInPath - 1)) * 100;
    progress.style.width = `${progressPercentage}%`;
}

// Função para gerar o RoadMap com base nas respostas
function generateRoadmap() {
    const summaryContainer = document.getElementById('summary');
    summaryContainer.innerHTML = `
        <div class="loading-spinner"></div>
        <p style="text-align:center;">Gerando seu RoadMap...</p>
    `;

    setTimeout(() => {
        const segment = quizState.currentSegment;
        const answers = {};
        // Mapeia o valor da resposta para o texto do botão para o RoadMap
        for (let i = 2; i <= 11; i++) {
            const answerKey = quizState.answers[`${segment}_q${i}`];
            if (answerKey) {
                const buttonElement = document.querySelector(`#options-container-${segment}-${i} button[data-value="${answerKey}"]`);
                answers[`${segment}_q${i}`] = buttonElement ? buttonElement.textContent : "Não respondido";
            }
        }
        
        if (roadmapContentMap[segment]) {
            const roadmapHTML = roadmapContentMap[segment](answers);
            summaryContainer.innerHTML = roadmapHTML;
        } else {
            summaryContainer.innerHTML = `<p>Ocorreu um erro ao gerar o RoadMap. Tente novamente.</p>`;
        }
    }, 3000); // 3 segundos de delay para simular o processamento da IA
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const mainElement = document.querySelector('main');
    const backButton = document.getElementById('back-button');

    // Listener para os cliques nas opções de todas as páginas
    mainElement.addEventListener('click', (event) => {
        const option = event.target.closest('.option-card, .option-button');
        if (!option) return;
        
        const currentPageElement = document.querySelector('.page.active');
        const currentPageId = currentPageElement.id;
        
        // Lógica para a primeira página
        if (currentPageId === 'page-1') {
            quizState.currentSegment = option.getAttribute('data-value');
            
            // Simula a seleção visual nos cards
            document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
            option.classList.add('selected');

            quizState.currentPage = 2; // Avança para a primeira página do segmento
            updateUI();
            updateProgressBar();
        } else {
            // Lógica para as páginas do quiz
            const answerValue = option.getAttribute('data-value');
            const pageIndex = currentPageElement.getAttribute('data-page-index');
            quizState.answers[`${quizState.currentSegment}_q${pageIndex}`] = answerValue;
            
            const path = navigationPaths[quizState.currentSegment];
            const currentPathIndex = path.indexOf(currentPageId);
            const nextPageIndex = currentPathIndex + 1;
            
            if (nextPageIndex < path.length) {
                quizState.currentPage = nextPageIndex + 1;
                updateUI();
                updateProgressBar();
                if (path[nextPageIndex] === 'page-summary') {
                    generateRoadmap();
                }
            }
        }
    });

    // Listener para o botão de voltar
    if (backButton) {
        backButton.addEventListener('click', () => {
            const path = navigationPaths[quizState.currentSegment];
            const currentPageId = document.querySelector('.page.active').id;
            const currentPathIndex = path.indexOf(currentPageId);
            const prevPageIndex = currentPathIndex - 1;
            
            if (prevPageIndex >= 0) {
                quizState.currentPage = prevPageIndex + 1;
                updateUI();
                updateProgressBar();
            }
        });
    }

    updateUI();
    updateProgressBar();
});


