'use client';

import React, { useState, useEffect } from 'react';
import styles from './ChessBackground.module.css';

const chessPieces = ['♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟'] as const;
type ChessPiece = typeof chessPieces[number];

const getRandomChessPiece = (): ChessPiece => {
  const index = Math.floor(Math.random() * chessPieces.length);
  return chessPieces[index] as ChessPiece;
};

const ChessBackground: React.FC = () => {
  const [piece, setPiece] = useState<ChessPiece | null>(null);

  useEffect(() => {
    const selectedPiece = getRandomChessPiece();
    console.log('Selected chess piece:', selectedPiece);
    setPiece(selectedPiece);
  }, []);

  console.log('Rendering ChessBackground, piece:', piece);

  return (
    <div className={`${styles['chessBackground']} ${piece ? styles['fadeIn'] : ''}`}>
      {piece || '♟'}
    </div>
  );
};

export default ChessBackground;