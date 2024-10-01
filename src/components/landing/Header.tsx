"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon } from "lucide-react";

/**
 *
 */
export default function Header() {
  // State to control the mobile menu
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative bg-white shadow">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo and site name */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="ChessStake Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-lg font-bold">ChessStake</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:items-center lg:space-x-6">
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-gray-700 hover:underline"
          >
            How it works
          </Link>
          <Link
            href="#mission"
            className="text-sm font-medium text-gray-700 hover:underline"
          >
            Our mission
          </Link>
        </nav>

        {/* CTA Button for Desktop */}
        <div className="hidden lg:block">
          <Button
            asChild
            className="ml-4 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Link href="/play">Get Started</Link>
          </Button>
        </div>

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
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <nav className="border-t border-gray-200 bg-white lg:hidden">
          <div className="space-y-1 px-4 pb-2 pt-4">
            <Link
              href="#how-it-works"
              className="block rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              How it works
            </Link>
            <Link
              href="#mission"
              className="block rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Our mission
            </Link>
            {/* CTA Button for Mobile */}
            <div className="mt-4">
              <Button
                asChild
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                <Link href="/play">Get Started</Link>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
