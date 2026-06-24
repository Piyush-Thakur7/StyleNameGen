/* ═══════════════════════════════════════════════════════════
   ai.js — Ludo AI Decision Engine
   Supports Easy (random), Medium (balanced), Hard (strategic).
   ═══════════════════════════════════════════════════════════ */

const LudoAI = (() => {

    const OFFSETS = { red: 40, green: 1, yellow: 14, blue: 27 };

    /** Get absolute track index for a player's relative position */
    function absIdx(player, pos) {
        if (pos < 0 || pos > 50) return -1;
        return (OFFSETS[player] + pos) % 52;
    }

    /** Check if landing on destPos would capture an opponent */
    function wouldCapture(player, destPos, allTokens) {
        if (destPos < 0 || destPos > 50) return false;
        const myAbs = absIdx(player, destPos);
        if (LudoBoard.isSafe(myAbs)) return false;

        return allTokens.some(t =>
            t.player !== player &&
            t.pos >= 0 && t.pos <= 50 &&
            absIdx(t.player, t.pos) === myAbs
        );
    }

    /** Check if a token at the given position is in danger of being captured */
    function isInDanger(player, pos, allTokens) {
        if (pos < 0 || pos > 50) return false;
        const myAbs = absIdx(player, pos);
        if (LudoBoard.isSafe(myAbs)) return false;

        for (const t of allTokens) {
            if (t.player === player || t.pos < 0 || t.pos > 50) continue;
            // Can this opponent reach our cell with a roll of 1–6?
            for (let d = 1; d <= 6; d++) {
                const oppDest = t.pos + d;
                if (oppDest > 50) continue;
                if (absIdx(t.player, oppDest) === myAbs) return true;
            }
        }
        return false;
    }

    /** Would landing here put the token on a safe cell? */
    function landsSafe(player, destPos) {
        if (destPos < 0 || destPos > 50) return false;
        return LudoBoard.isSafe(absIdx(player, destPos));
    }

    /** How far along is this token? Higher = closer to home */
    function progress(tok) { return tok.pos; }

    /**
     * Choose the best move for an AI player.
     * @param {string} player - Color
     * @param {Array} validMoves - [{player, id}]
     * @param {number} dice - Current dice value
     * @param {Array} allTokens - All 16 tokens
     * @param {string} difficulty - 'easy'|'medium'|'hard'
     * @returns {{player, id}|null}
     */
    function chooseMove(player, validMoves, dice, allTokens, difficulty) {
        if (!validMoves || validMoves.length === 0) return null;
        if (validMoves.length === 1) return validMoves[0];

        // Easy: random choice
        if (difficulty === 'easy') {
            return validMoves[Math.floor(Math.random() * validMoves.length)];
        }

        // Helper to evaluate a move
        function getMoveDetails(m) {
            const tok = allTokens.find(t => t.player === m.player && t.id === m.id);
            if (!tok) return null;
            const destPos = tok.pos === -1 ? 0 : tok.pos + dice;
            return { move: m, tok, destPos };
        }

        // Logic for Hard AI decision
        function getHardChoice() {
            const moveDetails = validMoves.map(getMoveDetails).filter(Boolean);

            // 1. Capture priority: check if any move captures an opponent
            const captureMoves = moveDetails.filter(d => wouldCapture(player, d.destPos, allTokens));
            if (captureMoves.length > 0) {
                // If multiple, prioritize the one that is most progressed (highest current pos)
                captureMoves.sort((a, b) => b.tok.pos - a.tok.pos);
                return captureMoves[0].move;
            }

            // 2. Protect near home priority: check if any move protects a token near home (pos >= 30 and pos < 51)
            const protectMoves = moveDetails.filter(d => {
                const tok = d.tok;
                if (tok.pos < 30 || tok.pos >= 51) return false;

                const currentDanger = isInDanger(player, tok.pos, allTokens);
                const currentSafe = landsSafe(player, tok.pos);
                
                const destDanger = isInDanger(player, d.destPos, allTokens);
                const destSafe = landsSafe(player, d.destPos) || d.destPos >= 51;

                // Case A: Escaping danger to safety (either dest is safe or not in danger)
                if (currentDanger && (!destDanger || destSafe)) {
                    return true;
                }
                // Case B: Moving from an unsafe tile to a safe tile/home stretch
                if (!currentSafe && destSafe) {
                    return true;
                }

                return false;
            });

            if (protectMoves.length > 0) {
                // Prioritize the one closest to home (highest current pos)
                protectMoves.sort((a, b) => b.tok.pos - a.tok.pos);
                return protectMoves[0].move;
            }

            // 3. Fallback / Advance priority: advance the most progressed token (highest current pos)
            moveDetails.sort((a, b) => b.tok.pos - a.tok.pos);
            return moveDetails[0].move;
        }

        // Medium: 70% smart (Hard decision), 30% random
        if (difficulty === 'medium') {
            if (Math.random() < 0.7) {
                return getHardChoice();
            } else {
                return validMoves[Math.floor(Math.random() * validMoves.length)];
            }
        }

        // Hard AI: 100% smart decision
        return getHardChoice();
    }

    return { chooseMove };
})();

if (typeof window !== 'undefined') window.LudoAI = LudoAI;
