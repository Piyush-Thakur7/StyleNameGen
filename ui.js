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
    }

    // ─── Confetti Effect ──────────────────────────────────

    function launchConfetti(color) {
        const container = document.getElementById('confetti-container');
        if (!container) return;
        container.innerHTML = '';

        const palette = ['#e74c3c','#2ecc71','#f39c12','#3498db','#9b59b6','#1abc9c','#fff'];
        for (let i = 0; i < 80; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = palette[Math.floor(Math.random() * palette.length)];
            piece.style.animationDelay = (Math.random() * 2) + 's';
            piece.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(piece);
        }

        setTimeout(() => { container.innerHTML = ''; }, 5000);
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
            });
        });

        // ── Start Game Button ──
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                // Unlock AudioContext on first user gesture
                if (window.LudoSounds) LudoSounds.init();
                if (window.LudoSounds) LudoSounds.playClick();

                // Show loading screen briefly
                showScreen('loading-screen');
                setTimeout(() => {
                    showScreen('play-screen');
                    if (window.LudoGame) {
                        LudoGame.start(gameMode, gameDifficulty, playerCount);
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

        // Show lobby
        showScreen('lobby-screen');
    }

    return {
        init,
        showScreen,

        /** Show the win screen with confetti */
        showWin(player) {
            const name = player.charAt(0).toUpperCase() + player.slice(1);
            const winnerText = document.getElementById('winner-text');
            if (winnerText) {
                winnerText.textContent = `🎉 ${name} Wins! 🎉`;
                winnerText.style.color = LudoBoard.COLORS[player].fill;
            }
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
