"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const chessPieces = ["B", "K", "N", "P", "Q", "R"] as const;
const colors = ["w", "b"] as const;

function getRandomChessPiece() {
  const randomPiece =
    chessPieces[Math.floor(Math.random() * chessPieces.length)];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  if (randomPiece === undefined || randomColor === undefined) {
    return getRandomChessPiece();
  }

  const piece = `${randomColor}${randomPiece}` as const;
  return piece;
}

const CHANGE_DURATION = 1000;

/**
 * Random chess piece component
 * @param props - Component props
 * @param props.className - Component class name
 * @returns Chess piece image which changes over time
 */
export function RandomChessPiece({ className }: { className?: string }) {
  const [piece, setPiece] =
    useState<ReturnType<typeof getRandomChessPiece>>(getRandomChessPiece);

  useEffect(() => {
    setPiece(getRandomChessPiece());

    const intervalId = setInterval(() => {
      console.log("setPiece");
      setPiece(getRandomChessPiece());
    }, CHANGE_DURATION);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Image
      src={`/images/pieces/${piece}.png`}
      alt={piece}
      width={100}
      height={100}
      className={cn(className)}
    />
  );
}
