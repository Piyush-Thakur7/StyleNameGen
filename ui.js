/* ═══════════════════════════════════════════════════════════
   ui.js — UI Manager & Event Bindings
   Handles screens, lobby controls, canvas interaction,
   mute, help, confetti, and window resize.
   ═══════════════════════════════════════════════════════════ */

const LudoUI = (() => {

    let gameMode = 'ai';         // 'ai' or 'local'
    let gameDifficulty = 'medium';
    let playerCount = 4;

    // ─── Screen Management ────────────────────────────────

    function showScreen(id) {
        document.querySelectorAll('.screen').forEach(el => {
            el.classList.toggle('active', el.id === id);
        });
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.style.display = (id === 'play-screen') ? 'flex' : 'none';
        }
        
        // Update lobby scoreboard and names when entering lobby screen
        if (id === 'lobby-screen') {
            const lobbyScoreboard = document.getElementById('lobby-scoreboard');
            if (lobbyScoreboard) {
                if (hasPlayedARound) {
                    lobbyScoreboard.style.display = 'block';
                    renderScoreboard('scoreboard-entries');
                } else {
                    lobbyScoreboard.style.display = 'none';
                }
            }
            updateNamesInputs();
        }
    }

    // ─── Scoreboard & Player Name State ──────────────────
    let winsScore = { red: 0, green: 0, yellow: 0, blue: 0 };
    let hasPlayedARound = false;

    // ─── Confetti Effect ──────────────────────────────────

    function launchConfetti(color) {
        const container = document.getElementById('confetti-container');
        if (!container) return;
        container.innerHTML = '';

        const palette = ['#e74c3c','#2ecc71','#f39c12','#3498db','#9b59b6','#1abc9c','#e84393','#ffeaa7'];
        for (let i = 0; i < 120; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = palette[Math.floor(Math.random() * palette.length)];
            
            // Randomize size and shape
            const size = Math.random() * 8 + 6; // 6px to 14px
            piece.style.width = size + 'px';
            piece.style.height = (Math.random() > 0.5 ? size : size * 0.6) + 'px';
            if (Math.random() > 0.5) {
                piece.style.borderRadius = '50%';
            }

            // Sway animation offset
            const sway = (Math.random() * 200 - 100) + 'px';
            piece.style.setProperty('--sway-x', sway);

            piece.style.animationDelay = (Math.random() * 1.5) + 's';
            piece.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(piece);
        }

        setTimeout(() => { container.innerHTML = ''; }, 6000);
    }

    // ─── Player Name Inputs Generation ────────────────────

    function updateNamesInputs() {
        const container = document.getElementById('names-inputs-container');
        if (!container) return;

        // Remember existing names entered by user so they don't get lost
        const savedNames = {};
        container.querySelectorAll('.name-input-field').forEach(input => {
            if (input.dataset.color) {
                savedNames[input.dataset.color] = input.value.trim();
            }
        });

        container.innerHTML = '';

        let activeColors = [];
        if (playerCount === 2) activeColors = ['red', 'yellow'];
        else if (playerCount === 3) activeColors = ['red', 'green', 'yellow'];
        else activeColors = ['red', 'green', 'yellow', 'blue'];

        activeColors.forEach((color, idx) => {
            const group = document.createElement('div');
            group.className = 'name-input-group';

            const indicator = document.createElement('div');
            indicator.className = `name-input-color-indicator ${color}`;

            const label = document.createElement('span');
            label.className = 'name-input-label';
            label.textContent = color.charAt(0).toUpperCase() + color.slice(1);

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'name-input-field';
            input.dataset.color = color;
            input.maxLength = 16;

            const isCPU = (gameMode === 'ai' && color !== 'red');
            if (isCPU) {
                input.value = `Computer (${color.charAt(0).toUpperCase() + color.slice(1)})`;
                input.disabled = true;
                input.style.color = '#747d8c';
                input.style.cursor = 'not-allowed';
            } else {
                const defaultName = `Player ${idx + 1}`;
                input.value = savedNames[color] || (color === 'red' ? 'Player 1' : defaultName);
                input.placeholder = defaultName;
            }

            group.appendChild(indicator);
            group.appendChild(label);
            group.appendChild(input);
            container.appendChild(group);
        });
    }

    // ─── Scoreboard Rendering ─────────────────────────────

    function renderScoreboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        const names = window.LudoGame ? LudoGame.getPlayerNames() : { red: 'Red', green: 'Green', yellow: 'Yellow', blue: 'Blue' };

        let activeColors = [];
        if (playerCount === 2) activeColors = ['red', 'yellow'];
        else if (playerCount === 3) activeColors = ['red', 'green', 'yellow'];
        else activeColors = ['red', 'green', 'yellow', 'blue'];

        activeColors.forEach(color => {
            const card = document.createElement('div');
            card.className = 'score-card';

            const info = document.createElement('div');
            info.className = 'score-info';

            const dot = document.createElement('div');
            dot.className = `score-color-dot ${color}`;

            const nameSpan = document.createElement('span');
            nameSpan.className = 'score-name';
            nameSpan.textContent = names[color] || (color.charAt(0).toUpperCase() + color.slice(1));

            const scoreVal = document.createElement('span');
            scoreVal.className = 'score-number';
            scoreVal.textContent = winsScore[color] || 0;

            info.appendChild(dot);
            info.appendChild(nameSpan);
            card.appendChild(info);
            card.appendChild(scoreVal);
            container.appendChild(card);
        });
    }

    // ─── Canvas Resize Handler ────────────────────────────

    function resizeCanvas() {
        if (window.LudoGame) LudoGame.resize();
    }

    // ─── Initialize All Bindings ──────────────────────────

    function init() {
        // Initialize dice
        if (window.LudoDice) LudoDice.init();

        // ── Mode Toggle ──
        const modeToggle = document.getElementById('mode-toggle');
        const aiOpt = document.getElementById('mode-ai');
        const localOpt = document.getElementById('mode-local');
        const diffSection = document.getElementById('difficulty-section');

        if (modeToggle) {
            modeToggle.addEventListener('click', () => {
                if (gameMode === 'ai') {
                    gameMode = 'local';
                    if (aiOpt) aiOpt.classList.remove('active');
                    if (localOpt) localOpt.classList.add('active');
                    if (diffSection) diffSection.style.display = 'none';
                } else {
                    gameMode = 'ai';
                    if (aiOpt) aiOpt.classList.add('active');
                    if (localOpt) localOpt.classList.remove('active');
                    if (diffSection) diffSection.style.display = '';
                }
                if (window.LudoSounds) LudoSounds.playClick();
                updateNamesInputs();
            });
        }

        // ── Difficulty Buttons ──
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                gameDifficulty = btn.dataset.diff || 'medium';
                if (window.LudoSounds) LudoSounds.playClick();
            });
        });

        // ── Player Count Buttons ──
        document.querySelectorAll('.count-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                playerCount = parseInt(btn.dataset.count) || 4;
                if (window.LudoSounds) LudoSounds.playClick();
                updateNamesInputs();
            });
        });

        // ── Start Game Button ──
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                // Read names from inputs
                const names = {};
                document.querySelectorAll('.name-input-field').forEach(input => {
                    const color = input.dataset.color;
                    names[color] = input.value.trim() || input.placeholder || color;
                });

                // Unlock AudioContext on first user gesture
                if (window.LudoSounds) LudoSounds.init();
                if (window.LudoSounds) LudoSounds.playClick();

                // Show loading screen briefly
                showScreen('loading-screen');
                setTimeout(() => {
                    showScreen('play-screen');
                    if (window.LudoGame) {
                        LudoGame.start(gameMode, gameDifficulty, playerCount, names);
                    }
                }, 800);
            });
        }

        // ── Dice Button Click ──
        const diceBtn = document.getElementById('dice-btn');
        if (diceBtn) {
            diceBtn.addEventListener('click', () => {
                if (window.LudoGame) LudoGame.humanRoll();
            });
        }

        // ── Canvas Click (mouse) ──
        const boardCanvas = document.getElementById('ludo-board');
        if (boardCanvas) {
            boardCanvas.addEventListener('click', (e) => {
                if (window.LudoGame) LudoGame.canvasClick(e.clientX, e.clientY);
            });

            // Touch support (prevent ghost clicks)
            boardCanvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (e.changedTouches.length > 0) {
                    const t = e.changedTouches[0];
                    if (window.LudoGame) LudoGame.canvasClick(t.clientX, t.clientY);
                }
            }, { passive: false });
        }

        // ── Quit Button ──
        const quitBtn = document.getElementById('quit-btn');
        if (quitBtn) {
            quitBtn.addEventListener('click', () => {
                if (confirm("Are you sure you want to quit the current match? Your progress will be lost.")) {
                    if (window.LudoSounds) LudoSounds.playClick();
                    if (window.LudoGame) window.LudoGame.stop();
                    
                    // Exit fullscreen if active
                    if (document.body.classList.contains('theater-mode')) {
                        if (document.exitFullscreen) {
                            document.exitFullscreen().catch(() => {});
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        }
                        document.body.classList.remove('theater-mode');
                    }
                    
                    showScreen('lobby-screen');
                }
            });
        }

        // ── Play Again Button ──
        const playAgainBtn = document.getElementById('play-again-btn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                if (window.LudoSounds) LudoSounds.playClick();
                if (window.LudoGame) window.LudoGame.stop();
                
                // Exit fullscreen if active
                if (document.body.classList.contains('theater-mode')) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen().catch(() => {});
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                    document.body.classList.remove('theater-mode');
                }
                
                showScreen('lobby-screen');
            });
        }

        // ── Mute Button ──
        const muteBtn = document.getElementById('mute-btn');
        if (muteBtn) {
            if (window.LudoSounds) {
                const muted = LudoSounds.isMuted();
                muteBtn.textContent = muted ? '🔇' : '🔊';
                muteBtn.title = muted ? 'Unmute' : 'Mute';
            }
            muteBtn.addEventListener('click', () => {
                if (!window.LudoSounds) return;
                const muted = LudoSounds.toggleMute();
                muteBtn.textContent = muted ? '🔇' : '🔊';
                muteBtn.title = muted ? 'Unmute' : 'Mute';
            });
        }

        // ── Help Button ──
        const helpBtn = document.getElementById('help-btn');
        const helpModal = document.getElementById('help-modal');
        const closeHelp = document.getElementById('close-help');
        if (helpBtn && helpModal) {
            helpBtn.addEventListener('click', () => {
                helpModal.classList.toggle('active');
                if (window.LudoSounds) LudoSounds.playClick();
            });
        }
        if (closeHelp && helpModal) {
            closeHelp.addEventListener('click', () => {
                helpModal.classList.remove('active');
            });
        }



        // ── Tutorial Overlay ──
        const tutorial = document.getElementById('tutorial-overlay');
        if (tutorial) {
            tutorial.addEventListener('click', () => {
                tutorial.classList.add('hidden');
            });
        }

        // ── Fullscreen Toggle ──
        const fsBtn = document.getElementById('fullscreen-btn');
        if (fsBtn) {
            fsBtn.addEventListener('click', () => {
                if (window.LudoSounds) LudoSounds.playClick();
                
                const body = document.body;
                const isFs = body.classList.toggle('theater-mode');
                
                if (isFs) {
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen().catch(() => {});
                    } else if (document.documentElement.webkitRequestFullscreen) {
                        document.documentElement.webkitRequestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen().catch(() => {});
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
                
                updateFsButton(isFs);
                setTimeout(resizeCanvas, 150);
            });
        }

        document.addEventListener('fullscreenchange', () => {
            const isNativeFs = !!document.fullscreenElement;
            document.body.classList.toggle('theater-mode', isNativeFs);
            updateFsButton(isNativeFs);
            setTimeout(resizeCanvas, 150);
        });
        document.addEventListener('webkitfullscreenchange', () => {
            const isNativeFs = !!document.webkitFullscreenElement;
            document.body.classList.toggle('theater-mode', isNativeFs);
            updateFsButton(isNativeFs);
            setTimeout(resizeCanvas, 150);
        });

        function updateFsButton(active) {
            if (!fsBtn) return;
            if (active) {
                fsBtn.textContent = '🗗';
                fsBtn.title = 'Minimize Screen';
                fsBtn.setAttribute('aria-label', 'Minimize Screen');
            } else {
                fsBtn.textContent = '⛶';
                fsBtn.title = 'Fullscreen Mode';
                fsBtn.setAttribute('aria-label', 'Fullscreen Mode');
            }
        }

        // ── Window Resize ──
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 150);
        });

        // Initial scoreboard and names generation setup
        updateNamesInputs();
        if (hasPlayedARound) {
            document.getElementById('lobby-scoreboard').style.display = 'block';
            renderScoreboard('scoreboard-entries');
        } else {
            document.getElementById('lobby-scoreboard').style.display = 'none';
        }

        // ── Score Reset Button ──
        const resetBtn = document.getElementById('reset-score-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                winsScore = { red: 0, green: 0, yellow: 0, blue: 0 };
                hasPlayedARound = false;
                document.getElementById('lobby-scoreboard').style.display = 'none';
                if (window.LudoSounds) LudoSounds.playClick();
            });
        }

        // Show lobby
        showScreen('lobby-screen');
    }

    return {
        init,
        showScreen,

        /** Show the win screen with confetti */
        showWin(player) {
            // Track wins
            if (winsScore[player] !== undefined) {
                winsScore[player]++;
                hasPlayedARound = true;
            }

            const names = window.LudoGame ? LudoGame.getPlayerNames() : {};
            const name = names[player] || (player.charAt(0).toUpperCase() + player.slice(1));
            
            const winnerText = document.getElementById('winner-text');
            if (winnerText) {
                winnerText.textContent = `🎉 ${name} Wins! 🎉`;
                winnerText.style.color = LudoBoard.COLORS[player].fill;
            }

            // Render win screen scoreboard
            renderScoreboard('win-scoreboard-entries');

            launchConfetti(player);
            setTimeout(() => showScreen('win-screen'), 1500);
        }
    };
})();

if (typeof window !== 'undefined') window.LudoUI = LudoUI;

// ─── Bootstrap on DOM Ready ──────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    LudoUI.init();
});
