"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 *
 */
export default function Header() {
  // State to control the mobile menu
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative flex h-14 items-center px-4 lg:px-6">
      {/* Logo and site name */}
      <Link href="#" className="flex items-center">
        <Image
          src="/images/logo.png"
          alt="ChessStake Logo"
          width={40}
          height={40}
          className="mr-2"
        />
        <span className="text-lg font-bold">ChessStake</span>
      </Link>

      {/* Hamburger menu button */}
      <Button
        className="ml-auto text-gray-700 hover:text-gray-900 focus:outline-none lg:hidden"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        variant="outline"
        size="icon"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        {/* Icon changes based on menu state */}
        {isOpen ? (
          <XIcon className="size-6" />
        ) : (
          <MenuIcon className="size-6" />
        )}
      </Button>

      {/* Navigation links */}
      <nav
        className={cn(
          "absolute left-0 top-full ml-auto w-full gap-4 bg-white sm:gap-6 lg:static lg:flex",
          isOpen ? "block border" : "hidden",
        )}
      >
        <Link
          href="#how-it-works"
          className="block px-4 py-2 text-sm font-medium hover:underline lg:inline-block"
        >
          How it works
        </Link>
        <Link
          href="#pricing"
          className="block px-4 py-2 text-sm font-medium hover:underline lg:inline-block"
        >
          Prices
        </Link>
        <Link
          href="#mission"
          className="block px-4 py-2 text-sm font-medium hover:underline lg:inline-block"
        >
          Our mission
        </Link>
      </nav>
    </header>
  );
}
