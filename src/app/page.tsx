import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DollarSign, Brain, Trophy, type LucideProps } from "lucide-react";
import { RandomChessPiece } from "@/components/RandomPiece";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import Header from "@/components/landing/Header";

type Icon = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

const FeatureCard = ({
  Icon,
  title,
  description,
}: {
  Icon: Icon;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center text-center">
    <Icon className="mb-4 size-12" aria-hidden="true" />
    <h3 className="mb-2 text-xl font-bold md:text-2xl">{title}</h3>
    <p className="text-gray-500 md:text-lg">{description}</p>
  </div>
);

const PricingCard = ({
  title,
  price,
  features,
  buttonText,
}: {
  title: string;
  price: string;
  features: {
    icon?: Icon;
    text: string;
  }[];
  buttonText: string;
}) => (
  <div className="flex flex-col rounded-lg bg-gray-100 p-6 shadow-sm md:p-8 lg:p-10">
    <h3 className="mb-4 text-center text-2xl font-bold md:text-3xl">{title}</h3>
    <div className="mb-4 text-center text-4xl font-bold md:text-5xl">
      {price}
    </div>
    <ul className="mb-6 space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          {feature.icon && (
            <feature.icon className="mr-2 size-4" aria-hidden="true" />
          )}
          <span>{feature.text}</span>
        </li>
      ))}
    </ul>
    <Button className="w-full" asChild>
      <Link href="https://www.chessstake.com/">{buttonText}</Link>
    </Button>
  </div>
);

/**
 *
 */
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="min-h-[50vh] w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <RandomChessPiece className="mx-auto size-24 md:size-32 lg:size-48" />
          <div className="container z-10 px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Monetize your chess skills
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Earn on every game you play, choose your level, play, win, and cash out.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="w-full bg-gray-100 py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                Icon={DollarSign}
                title="Earn"
                description="Play against our AI levels, and if you win, we pay you."
              />
              <FeatureCard
                Icon={Brain}
                title="Improve"
                description="Improve your level while earning money."
              />
              <FeatureCard
                Icon={Trophy}
                title="Top Stakers"
                description="Join the top players' ranking and win cash prizes."
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Our Mission
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  We&apos;re dedicated to helping chess players monetize their
                  skills and grow as players. With ChessStake, you can turn your
                  passion into profit while continuously improving your game.
                </p>
            </h2>
            <div className="mx-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
            
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section
          id="mission"
          className="w-full bg-gray-100 py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  ¿Are you ready?
                </h2>
                <Button size="lg" className="mt-4" asChild>
                <Link href="https://www.chessstake.com/">Get Started</Link>
              </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex w-full flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} ChessStake. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link href="#" className="text-xs hover:underline">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
