import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import { RotateCcw, Trophy, Clock, Flag, Zap, Swords, ChevronRight } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

// Piece values for minimax evaluation
const PIECE_VALUES = {
    p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000,
    P: -100, N: -320, B: -330, R: -500, Q: -900, K: -20000,
}

// Unicode Chess Glyphs
const PIECE_SYMBOLS = {
    K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
    k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
}

// Predefined Set Configurations
const PREDEFINED_SETS = [
    {
        id: 'standard',
        name: 'Standard 5-Min Blitz',
        desc: 'Classical 8x8 opening against Computer AI (5-minute clock)',
        board: [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ],
        turn: 'w',
    },
    {
        id: 'queen_sac',
        name: "Tactical Set: Queen's Sac",
        desc: "Morphy's famous mate in 2. White sacrifices the Queen for mate!",
        board: [
            ['r', '', '', '', 'k', '', '', 'r'],
            ['p', 'p', 'p', '', '', 'p', 'p', 'p'],
            ['', '', 'n', '', '', '', '', ''],
            ['', '', '', 'b', '', '', '', ''],
            ['', '', '', '', 'P', '', '', ''],
            ['', '', '', '', '', 'N', '', ''],
            ['P', 'P', 'P', '', '', 'P', 'P', 'P'],
            ['R', '', 'B', 'Q', 'K', '', '', 'R'],
        ],
        turn: 'w',
    },
    {
        id: 'smothered',
        name: 'Tactical Set: Smothered Mate',
        desc: 'Trap the enemy king inside his own pawns using the Knight!',
        board: [
            ['', '', '', '', '', 'r', 'k', ''],
            ['', '', '', '', '', 'p', 'p', 'p'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', 'N', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', 'P', 'P', '', '', 'P', 'P', 'P'],
            ['R', '', '', '', 'K', '', '', 'R'],
        ],
        turn: 'w',
    },
    {
        id: 'endgame',
        name: 'Endgame Challenge: Rook + King',
        desc: 'Deliver checkmate with King and Rook against lone enemy King before time runs out!',
        board: [
            ['', '', '', '', 'k', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', 'K', '', '', ''],
            ['', '', '', '', '', '', '', 'R'],
        ],
        turn: 'w',
    },
]

const Chess = () => {
    const [selectedSet, setSelectedSet] = useState(PREDEFINED_SETS[0])
    const [board, setBoard] = useState(PREDEFINED_SETS[0].board)
    const [turn, setTurn] = useState('w') // 'w' for user, 'b' for computer
    const [selectedSquare, setSelectedSquare] = useState(null)
    const [legalMoves, setLegalMoves] = useState([])
    const [capturedWhite, setCapturedWhite] = useState([])
    const [capturedBlack, setCapturedBlack] = useState([])
    const [moveHistory, setMoveHistory] = useState([])
    const [gameStatus, setGameStatus] = useState('playing') // 'playing', 'win', 'loss', 'draw'
    const [statusMessage, setStatusMessage] = useState('Your turn (White)')

    // 5-Minute (300 seconds) Blitz Clocks
    const [whiteTime, setWhiteTime] = useState(300)
    const [blackTime, setBlackTime] = useState(300)
    const timerRef = useRef(null)

    // Dispatch global notification events on Win / Loss
    useEffect(() => {
        if (gameStatus === 'win') {
            setStatusMessage('🎉 You have won a MACBOOK virtually! Claim your victory!')
            window.dispatchEvent(new CustomEvent('chess-game-win'))
        } else if (gameStatus === 'loss') {
            setStatusMessage('🎧 You have to give AirPods as a gift to the computer, as computer is tired playing CHESS!')
            window.dispatchEvent(new CustomEvent('chess-game-loss'))
        }
    }, [gameStatus])

    // Clock Interval
    useEffect(() => {
        if (gameStatus !== 'playing') {
            clearInterval(timerRef.current)
            return
        }

        timerRef.current = setInterval(() => {
            if (turn === 'w') {
                setWhiteTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current)
                        setGameStatus('loss')
                        return 0
                    }
                    return prev - 1
                })
            } else {
                setBlackTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current)
                        setGameStatus('win')
                        return 0
                    }
                    return prev - 1
                })
            }
        }, 1000)

        return () => clearInterval(timerRef.current)
    }, [turn, gameStatus])

    // Reset Game
    const handleReset = (set = selectedSet) => {
        setSelectedSet(set)
        setBoard(set.board.map((row) => [...row]))
        setTurn('w')
        setSelectedSquare(null)
        setLegalMoves([])
        setCapturedWhite([])
        setCapturedBlack([])
        setMoveHistory([])
        setGameStatus('playing')
        setStatusMessage('Your turn (White)')
        setWhiteTime(300)
        setBlackTime(300)
    }

    // Helper: Is white piece
    const isWhite = (piece) => piece && piece === piece.toUpperCase()
    // Helper: Is black piece
    const isBlack = (piece) => piece && piece === piece.toLowerCase()

    // Generate Legal Moves for a square
    const getPieceMoves = (b, r, c) => {
        const piece = b[r][c]
        if (!piece) return []

        const moves = []
        const isW = isWhite(piece)
        const type = piece.toLowerCase()

        const addMove = (nr, nc) => {
            if (nr < 0 || nr > 7 || nc < 0 || nc > 7) return false
            const target = b[nr][nc]
            if (!target) {
                moves.push([nr, nc])
                return true // Continue line
            }
            if (isW ? isBlack(target) : isWhite(target)) {
                moves.push([nr, nc])
            }
            return false // Blocked
        }

        // Pawns
        if (type === 'p') {
            const dir = isW ? -1 : 1
            const startRow = isW ? 6 : 1
            // Forward 1
            if (r + dir >= 0 && r + dir <= 7 && !b[r + dir][c]) {
                moves.push([r + dir, c])
                // Forward 2 from start
                if (r === startRow && !b[r + 2 * dir][c]) {
                    moves.push([r + 2 * dir, c])
                }
            }
            // Diagonal captures
            for (const dc of [-1, 1]) {
                const nr = r + dir
                const nc = c + dc
                if (nr >= 0 && nr <= 7 && nc >= 0 && nc <= 7) {
                    const target = b[nr][nc]
                    if (target && (isW ? isBlack(target) : isWhite(target))) {
                        moves.push([nr, nc])
                    }
                }
            }
        }

        // Knights
        if (type === 'n') {
            const deltas = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1],
            ]
            for (const [dr, dc] of deltas) {
                addMove(r + dr, c + dc)
            }
        }

        // Bishops & Queens (Diagonals)
        if (type === 'b' || type === 'q') {
            const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]]
            for (const [dr, dc] of dirs) {
                let nr = r + dr
                let nc = c + dc
                while (addMove(nr, nc)) {
                    nr += dr
                    nc += dc
                }
            }
        }

        // Rooks & Queens (Straights)
        if (type === 'r' || type === 'q') {
            const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
            for (const [dr, dc] of dirs) {
                let nr = r + dr
                let nc = c + dc
                while (addMove(nr, nc)) {
                    nr += dr
                    nc += dc
                }
            }
        }

        // Kings
        if (type === 'k') {
            const dirs = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1], [0, 1],
                [1, -1], [1, 0], [1, 1],
            ]
            for (const [dr, dc] of dirs) {
                addMove(r + dr, c + dc)
            }
        }

        return moves
    }

    // Execute Move
    const makeMove = (fromR, fromC, toR, toC) => {
        const movingPiece = board[fromR][fromC]
        const capturedPiece = board[toR][toC]

        const newBoard = board.map((row) => [...row])
        newBoard[toR][toC] = movingPiece
        newBoard[fromR][fromC] = ''

        // Pawn Promotion to Queen
        if (movingPiece === 'P' && toR === 0) newBoard[toR][toC] = 'Q'
        if (movingPiece === 'p' && toR === 7) newBoard[toR][toC] = 'q'

        // Record Captured
        if (capturedPiece) {
            if (isBlack(capturedPiece)) {
                setCapturedWhite((prev) => [...prev, capturedPiece])
            } else {
                setCapturedBlack((prev) => [...prev, capturedPiece])
            }
            // If King captured, instant win
            if (capturedPiece.toLowerCase() === 'k') {
                setBoard(newBoard)
                setGameStatus(turn === 'w' ? 'win' : 'loss')
                setStatusMessage(turn === 'w' ? 'Checkmate! YOU WIN! 🏆' : 'Checkmate! Computer Wins.')
                return
            }
        }

        // Record Move History
        const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        const moveNotation = `${movingPiece.toUpperCase()}${cols[fromC]}${8 - fromR}→${cols[toC]}${8 - toR}`
        setMoveHistory((prev) => [...prev, moveNotation])

        setBoard(newBoard)
        setSelectedSquare(null)
        setLegalMoves([])

        const nextTurn = turn === 'w' ? 'b' : 'w'
        setTurn(nextTurn)
        setStatusMessage(nextTurn === 'w' ? 'Your turn (White)' : 'Computer is thinking... 🤖')
    }

    // Computer Move (AI Minimax / Heuristic)
    useEffect(() => {
        if (turn !== 'b' || gameStatus !== 'playing') return

        const timer = setTimeout(() => {
            // Find all black pieces and their moves
            const allMoves = []
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (isBlack(board[r][c])) {
                        const moves = getPieceMoves(board, r, c)
                        for (const [tr, tc] of moves) {
                            allMoves.push({ from: [r, c], to: [tr, tc] })
                        }
                    }
                }
            }

            if (allMoves.length === 0) {
                setGameStatus('win')
                setStatusMessage('Checkmate / Stalemate! You Win!')
                return
            }

            // Score moves with heuristic: capture values + center control
            let bestMove = allMoves[0]
            let bestScore = -999999

            for (const move of allMoves) {
                const [fr, fc] = move.from
                const [tr, tc] = move.to
                const piece = board[fr][fc]
                const target = board[tr][tc]

                let score = 0
                // Capture bonus
                if (target) {
                    score += Math.abs(PIECE_VALUES[target] || 0) * 10
                }
                // Central position bonus
                const distToCenter = Math.abs(3.5 - tr) + Math.abs(3.5 - tc)
                score += (7 - distToCenter) * 2

                // Add slight randomness for variety
                score += Math.random() * 5

                if (score > bestScore) {
                    bestScore = score
                    bestMove = move
                }
            }

            makeMove(bestMove.from[0], bestMove.from[1], bestMove.to[0], bestMove.to[1])
        }, 500)

        return () => clearTimeout(timer)
    }, [turn, board, gameStatus])

    // Square Click Handler
    const handleSquareClick = (r, c) => {
        if (gameStatus !== 'playing' || turn !== 'w') return

        // If clicking on an active legal move destination
        if (selectedSquare) {
            const isLegal = legalMoves.some(([mr, mc]) => mr === r && mc === c)
            if (isLegal) {
                makeMove(selectedSquare[0], selectedSquare[1], r, c)
                return
            }
        }

        // Selecting own white piece
        const piece = board[r][c]
        if (piece && isWhite(piece)) {
            setSelectedSquare([r, c])
            setLegalMoves(getPieceMoves(board, r, c))
        } else {
            setSelectedSquare(null)
            setLegalMoves([])
        }
    }

    // Format mm:ss
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    return (
        <>
            <div id='window-header'>
                <WindowControls target='chess' />
                <div className='flex items-center gap-2'>
                    <Swords className='size-4 text-amber-400' />
                    <span className='window-title font-semibold'>Chess Live: 5-Min Blitz AI</span>
                </div>
                <div className='w-16' />
            </div>

            <div className='bg-[#18181f] text-gray-200 p-2.5 sm:p-4 flex flex-col md:flex-row gap-3 sm:gap-5 h-full overflow-y-auto select-none'>
                {/* Left: Chessboard & Clocks */}
                <div className='flex flex-col items-center flex-1 max-w-[460px] mx-auto w-full'>
                    {/* Computer Header & Clock */}
                    <div className='w-full flex items-center justify-between px-3 py-1.5 mb-2 bg-[#23232c] rounded-lg border border-gray-800 shadow'>
                        <div className='flex items-center gap-2'>
                            <div className='size-3 rounded-full bg-red-400 animate-pulse' />
                            <span className='text-xs font-semibold text-gray-200'>Computer AI (Black)</span>
                            <div className='flex gap-0.5 text-xs text-gray-400'>
                                {capturedWhite.map((p, i) => (
                                    <span key={i}>{PIECE_SYMBOLS[p]}</span>
                                ))}
                            </div>
                        </div>
                        <div
                            className={`flex items-center gap-1.5 font-mono px-2.5 py-0.5 rounded text-xs font-bold ${
                                blackTime < 30 ? 'bg-red-900/60 text-red-300 animate-pulse' : 'bg-black/50 text-emerald-400'
                            } ${turn === 'b' ? 'ring-1 ring-emerald-400' : ''}`}
                        >
                            <Clock className='size-3.5' />
                            <span>{formatTime(blackTime)}</span>
                        </div>
                    </div>

                    {/* The 8x8 Board */}
                    <div className='relative border-2 sm:border-4 border-[#2b2b38] rounded-lg overflow-hidden shadow-2xl'>
                        <div className='grid grid-cols-8 w-[min(88vw,340px)] h-[min(88vw,340px)] sm:w-[400px] sm:h-[400px] touch-manipulation'>
                            {board.map((row, r) =>
                                row.map((cell, c) => {
                                    const isLight = (r + c) % 2 === 0
                                    const isSelected = selectedSquare && selectedSquare[0] === r && selectedSquare[1] === c
                                    const isMoveTarget = legalMoves.some(([mr, mc]) => mr === r && mc === c)

                                    return (
                                        <div
                                            key={`${r}-${c}`}
                                            onClick={() => handleSquareClick(r, c)}
                                            className={`relative flex items-center justify-center cursor-pointer transition-colors touch-manipulation ${
                                                isLight ? 'bg-[#e2d6b5]' : 'bg-[#b88b4a]'
                                            } ${isSelected ? '!bg-amber-300 ring-2 ring-amber-500 z-10' : ''}`}
                                        >
                                            {/* Coordinate notation on edges */}
                                            {c === 0 && (
                                                <span className={`absolute top-0.5 left-1 text-[9px] font-bold ${isLight ? 'text-[#b88b4a]' : 'text-[#e2d6b5]'}`}>
                                                    {8 - r}
                                                </span>
                                            )}
                                            {r === 7 && (
                                                <span className={`absolute bottom-0.5 right-1 text-[9px] font-bold ${isLight ? 'text-[#b88b4a]' : 'text-[#e2d6b5]'}`}>
                                                    {String.fromCharCode(97 + c)}
                                                </span>
                                            )}

                                            {/* Legal move marker */}
                                            {isMoveTarget && (
                                                <div
                                                    className={`absolute ${
                                                        cell ? 'size-9 border-4 border-emerald-500/80 rounded-full' : 'size-3.5 bg-emerald-600/70 rounded-full'
                                                    }`}
                                                />
                                            )}

                                            {/* Piece glyph */}
                                            {cell && (
                                                <span
                                                    className={`text-3xl sm:text-4xl transition-transform hover:scale-110 ${
                                                        isWhite(cell)
                                                            ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                                                            : 'text-zinc-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]'
                                                    }`}
                                                >
                                                    {PIECE_SYMBOLS[cell]}
                                                </span>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* Player Header & Clock */}
                    <div className='w-full flex items-center justify-between px-3 py-1.5 mt-2 bg-[#23232c] rounded-lg border border-gray-800 shadow'>
                        <div className='flex items-center gap-2'>
                            <div className='size-3 rounded-full bg-emerald-400' />
                            <span className='text-xs font-semibold text-gray-200'>You (White)</span>
                            <div className='flex gap-0.5 text-xs text-gray-400'>
                                {capturedBlack.map((p, i) => (
                                    <span key={i}>{PIECE_SYMBOLS[p]}</span>
                                ))}
                            </div>
                        </div>
                        <div
                            className={`flex items-center gap-1.5 font-mono px-2.5 py-0.5 rounded text-xs font-bold ${
                                whiteTime < 30 ? 'bg-red-900/60 text-red-300 animate-pulse' : 'bg-black/50 text-cyan-300'
                            } ${turn === 'w' ? 'ring-1 ring-cyan-400' : ''}`}
                        >
                            <Clock className='size-3.5' />
                            <span>{formatTime(whiteTime)}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Controls, Sets, Moves & Status */}
                <div className='w-full md:w-64 flex flex-col gap-3 justify-between'>
                    {/* Game Status Banner */}
                    <div
                        className={`p-3 rounded-lg border text-center transition-all ${
                            gameStatus === 'win'
                                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                                : gameStatus === 'loss'
                                ? 'bg-red-950/60 border-red-500 text-red-300'
                                : 'bg-[#23232c] border-gray-800 text-gray-300'
                        }`}
                    >
                        <div className='flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider mb-1'>
                            {gameStatus === 'win' && <Trophy className='size-4 text-yellow-400 animate-bounce' />}
                            {gameStatus === 'loss' && <Flag className='size-4 text-red-400' />}
                            {gameStatus === 'playing' && <Zap className='size-4 text-cyan-400' />}
                            <span>{gameStatus === 'playing' ? 'Game in Progress' : 'Game Over'}</span>
                        </div>
                        <p className='text-xs font-medium'>{statusMessage}</p>
                    </div>

                    {/* Predefined Game Set Selector */}
                    <div className='bg-[#23232c] p-2.5 rounded-lg border border-gray-800'>
                        <span className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5'>
                            Select Game Set / Puzzle:
                        </span>
                        <div className='space-y-1'>
                            {PREDEFINED_SETS.map((set) => (
                                <button
                                    key={set.id}
                                    onClick={() => handleReset(set)}
                                    className={`w-full text-left px-2 py-1.5 rounded text-xs transition flex items-center justify-between ${
                                        selectedSet.id === set.id
                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                                            : 'bg-black/30 hover:bg-gray-800 text-gray-400'
                                    }`}
                                >
                                    <span className='truncate'>{set.name}</span>
                                    <ChevronRight className='size-3 opacity-60' />
                                </button>
                            ))}
                        </div>
                        <p className='mt-2 text-[10px] text-gray-500 italic'>{selectedSet.desc}</p>
                    </div>

                    {/* Move History Log */}
                    <div className='bg-[#23232c] p-2.5 rounded-lg border border-gray-800 flex-1 min-h-[90px] max-h-[130px] overflow-y-auto'>
                        <span className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1'>
                            Move Notation:
                        </span>
                        {moveHistory.length === 0 ? (
                            <p className='text-[11px] text-gray-500 italic'>Make your first move...</p>
                        ) : (
                            <div className='flex flex-wrap gap-1'>
                                {moveHistory.map((m, i) => (
                                    <span key={i} className='bg-black/40 text-[10px] font-mono px-1.5 py-0.5 rounded text-gray-300 border border-gray-800'>
                                        {i + 1}. {m}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-2'>
                        <button
                            onClick={() => handleReset(selectedSet)}
                            className='flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow transition hover:scale-[1.02]'
                        >
                            <RotateCcw className='size-3.5' />
                            Restart (5m)
                        </button>
                        <button
                            onClick={() => {
                                setGameStatus('loss')
                                setStatusMessage('You resigned. Computer Wins.')
                            }}
                            disabled={gameStatus !== 'playing'}
                            className='flex items-center justify-center gap-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/80 text-xs font-medium py-2 px-3 rounded-lg transition disabled:opacity-50'
                        >
                            <Flag className='size-3.5' />
                            Resign
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

const ChessWindow = WindowWrapper(Chess, 'chess')

export default ChessWindow
