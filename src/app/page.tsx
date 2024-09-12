'use client';

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, Brain, Trophy } from "lucide-react"
import Image from 'next/image'
import ChessBackground from "@/components/ChessBackground/ChessBackground"
import { useEffect } from "react"
export default function LandingPage() {
  useEffect(() => {
    console.log('LandingPage mounted');
  }, []);

  console.log('Rendering LandingPage');

  return (
    
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
        <Image 
            src="/logo.png" 
            alt="ChessStake Logo" 
            width={40} 
            height={40} 
            className="mr-2"
          />
          <span className="font-bold text-lg">ChessStake</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#how-it-works">
          How it works           </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
          Prices          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#mission">
          Our mission          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative min-h-[50vh]">
          <ChessBackground />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Monetize your chess skills
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Wager against personalized AI opponents and grow as a player. Join ChessStake today!
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              How It Works
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <DollarSign className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Wager</h3>
                <p className="text-gray-500">Play against our AI and bet on your skills</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Brain className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Learn</h3>
                <p className="text-gray-500">Improve your game with personalized AI opponents</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Trophy className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Earn</h3>
                <p className="text-gray-500">Win matches and earn real money</p>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Simple Pricing
            </h2>
            <div className="mx-auto max-w-sm space-y-4">
              <div className="flex flex-col p-6 bg-gray-100 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-center mb-4">Monthly Subscription</h3>
                <div className="text-center text-4xl font-bold mb-4">$19.99</div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>Unlimited matches</span>
                  </li>
                  <li className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>Real money wagering</span>
                  </li>
                  <li className="flex items-center">
                    <Brain className="mr-2 h-4 w-4" />
                    <span>Personalized AI opponents</span>
                  </li>
                </ul>
                <Button className="w-full">Subscribe Now</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="mission" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Our Mission
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  We're dedicated to helping chess players monetize their skills and grow as players. 
                  With ChessStake, you can turn your passion into profit while continuously improving your game.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2023 ChessStake. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}