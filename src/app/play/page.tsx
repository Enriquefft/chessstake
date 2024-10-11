import {
  difficultyLevelsInfo,
  type DifficultyLevel,
  ErrorType,
} from "@/lib/utils";
import Link from "next/link";
import { auth } from "@/auth";
import ErrorPage from "@/components/error";

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const WAITOUT_TIME = 1000 * 60 * 60 * 24; // 24 Hours in milliseconds for getTime() comparison

/**
 *
 * @param root0
 * @param root0.levelName
 * @param root0.levelInfo
 */
function LevelCard({
  levelName,
  levelInfo,
}: {
  levelName: string;
  levelInfo: DifficultyLevel;
}) {
  if (levelInfo.disabled === true) {
    return null;
  }

  return (
    <Link
      href={`/play/${levelName}`}
      className="flex flex-col items-center rounded-lg border border-gray-300 bg-blue-50 p-4 shadow-md transition hover:bg-blue-100"
    >
      <h3 className="text-lg font-semibold">{levelName}</h3>
      <p>{levelInfo.cost} Soles</p>
      <p className="text-lg font-bold text-blue-600">ELO {levelInfo.elo}</p>
    </Link>
  );
}

/**
 *
 */
export default async function ChessChallenge() {
  const player = (await auth())?.user;

  if (!player) {
    return <ErrorPage type={ErrorType.PlayerNotFound} />;
  }

  if (!player.active) {
    return <ErrorPage type={ErrorType.PlayerNotActive} />;
  }

  const now = new Date();

  if (
    player.last_match &&
    now.getTime() - new Date(player.last_match).getTime() < WAITOUT_TIME
  ) {
    return <ErrorPage type={ErrorType.PlayerCanOnlyPlayEvery24Hours} />;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold">
          ¿En qué nivel quieres retar a la IA?
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(difficultyLevelsInfo).map(
            ([levelName, levelInfo]) => (
              <LevelCard
                key={levelName}
                levelName={levelName}
                levelInfo={levelInfo}
              />
            ),
          )}
        </div>
        <p className="mt-4 text-center text-gray-500">
          Depende del nivel, el premio ganado.
        </p>
      </div>
    </div>
  );
}
