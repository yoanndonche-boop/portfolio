// Curseur liquide
class LiquidCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorFollower = document.querySelector('.cursor-follower');
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.speed = 0.3;

        this.setupEventListeners();
        this.animate();
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Animation du curseur au survol
        document.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'A' || 
                e.target.classList.contains('project-card') ||
                e.target.classList.contains('tech-badge') ||
                e.target.tagName === 'BUTTON') {
                this.cursor.style.width = '30px';
                this.cursor.style.height = '30px';
                this.cursor.style.borderRadius = '40%';
                this.cursor.style.borderColor = '#00ff00';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.tagName === 'A' || 
                e.target.classList.contains('project-card') ||
                e.target.classList.contains('tech-badge') ||
                e.target.tagName === 'BUTTON') {
                this.cursor.style.width = '20px';
                this.cursor.style.height = '20px';
                this.cursor.style.borderRadius = '50%';
                this.cursor.style.borderColor = '#ffffff';
            }
        });
    }

    animate() {
        // Smooth follow pour le curseur principal
        this.cursorX += (this.mouseX - this.cursorX) * this.speed;
        this.cursorY += (this.mouseY - this.cursorY) * this.speed;

        this.cursor.style.left = this.cursorX - 10 + 'px';
        this.cursor.style.top = this.cursorY - 10 + 'px';

        this.cursorFollower.style.left = this.mouseX - 5 + 'px';
        this.cursorFollower.style.top = this.mouseY - 5 + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// Récupération des projets GitHub
async function loadGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/users/yoanndonche-boop/repos');
        const repos = await response.json();

        // Filtrer les repos et les trier par date de mise à jour
        const sortedRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 10); // Limiter à 10 projets

        const projectsList = document.getElementById('projectsList');
        projectsList.innerHTML = '';

        if (sortedRepos.length === 0) {
            projectsList.innerHTML = '<p class="loading">Aucun projet trouvé</p>';
            return;
        }

        sortedRepos.forEach(repo => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';

            const languages = repo.language ? repo.language : 'N/A';
            const description = repo.description || 'Pas de description';

            projectCard.innerHTML = `
                <div class="project-name">${repo.name}</div>
                <div class="project-description">${description}</div>
                <div class="language-tag">${languages}</div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank">GitHub →</a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank">Démo →</a>` : ''}
                </div>
            `;

            projectsList.appendChild(projectCard);
        });

    } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
        document.getElementById('projectsList').innerHTML = 
            '<p class="error-text">Erreur lors du chargement des projets</p>';
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le curseur liquide
    new LiquidCursor();

    // Charger les projets
    loadGitHubProjects();

    // Focus sur l'input du terminal
    document.getElementById('terminalInput').focus();
});

// Garder le focus sur l'input du terminal
document.addEventListener('click', () => {
    document.getElementById('terminalInput').focus();
});
