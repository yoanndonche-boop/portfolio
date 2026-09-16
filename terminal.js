class Terminal {
    constructor() {
        this.input = document.getElementById('terminalInput');
        this.content = document.getElementById('terminalContent');
        this.currentPath = 'home';
        this.history = [];
        this.historyIndex = -1;

        this.commands = {
            help: this.help.bind(this),
            ls: this.ls.bind(this),
            cd: this.cd.bind(this),
            cat: this.cat.bind(this),
            clear: this.clear.bind(this),
            whoami: this.whoami.bind(this),
            pwd: this.pwd.bind(this),
            echo: this.echo.bind(this),
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => this.handleInput(e));
    }

    handleInput(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            if (command) {
                this.execute(command);
                this.history.push(command);
                this.historyIndex = this.history.length;
            }
            this.input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = this.history.length;
                this.input.value = '';
            }
        }
    }

    execute(command) {
        const trimmed = command.trim();
        const [cmd, ...args] = trimmed.split(' ');

        // Afficher la commande
        this.printLine(`$ ${command}`);

        // Exécuter la commande
        if (this.commands[cmd]) {
            this.commands[cmd](...args);
        } else if (cmd === '') {
            // Rien à faire
        } else {
            this.printError(`command not found: ${cmd}`);
        }

        // Scroll vers le bas
        setTimeout(() => {
            this.content.scrollTop = this.content.scrollHeight;
        }, 0);
    }

    printLine(text, className = '') {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        if (className) line.classList.add(className);
        line.innerHTML = text;
        this.content.appendChild(line);
    }

    printError(text) {
        this.printLine(`<span class="error-text">${text}</span>`);
    }

    printSuccess(text) {
        this.printLine(`<span class="success-text">${text}</span>`);
    }

    // Commandes
    help() {
        const helpText = `
<span class="success-text">Commandes disponibles:</span>
  <span class="command-highlight">help</span>       - Affiche cette aide
  <span class="command-highlight">ls</span>         - Liste les sections disponibles
  <span class="command-highlight">cd</span> &lt;section&gt; - Accède à une section (about, projects, contact, objectives)
  <span class="command-highlight">cat</span> &lt;file&gt;   - Affiche le contenu d'un fichier
  <span class="command-highlight">pwd</span>        - Affiche le répertoire courant
  <span class="command-highlight">whoami</span>     - Affiche des infos
  <span class="command-highlight">clear</span>      - Nettoie le terminal
  <span class="command-highlight">echo</span> &lt;text&gt; - Affiche un texte
        `;
        this.printLine(helpText);
    }

    ls() {
        const sections = ['about', 'projects', 'contact', 'objectives'];
        this.printLine('Sections disponibles:');
        sections.forEach(section => {
            this.printLine(`  <span class="command-highlight">${section}/</span>`);
        });
    }

    cd(section) {
        if (!section) {
            this.printError('cd: missing argument');
            return;
        }

        const validSections = ['about', 'projects', 'contact', 'objectives'];
        
        if (!validSections.includes(section)) {
            this.printError(`cd: ${section}: No such file or directory`);
            return;
        }

        this.currentPath = section;
        this.displaySection(section);
        this.printSuccess(`Section "${section}" chargée`);
    }

    cat(file) {
        if (!file) {
            this.printError('cat: missing argument');
            return;
        }

        const validFiles = ['about', 'projects', 'contact', 'objectives'];
        
        if (!validFiles.includes(file)) {
            this.printError(`cat: ${file}: No such file or directory`);
            return;
        }

        this.displaySection(file);
    }

    displaySection(sectionName) {
        // Masquer tous les sections
        document.querySelectorAll('.hidden-section').forEach(section => {
            section.classList.remove('active');
        });

        // Afficher la section demandée
        const sectionId = sectionName + 'Section';
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
    }

    clear() {
        this.content.innerHTML = '';
    }

    pwd() {
        this.printLine(`/home/yoann/${this.currentPath === 'home' ? '' : this.currentPath}`);
    }

    whoami() {
        const whoami = `
<span class="success-text">Yoann</span>
Terminale • Lycée à Lyon
Spécialités: Mathématiques & NSI
Passionné par le développement et l'informatique
        `;
        this.printLine(whoami);
    }

    echo(...args) {
        if (args.length === 0) {
            return;
        }
        this.printLine(args.join(' '));
    }
}

// Initialiser le terminal au chargement
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
    document.getElementById('terminalInput').focus();
});
