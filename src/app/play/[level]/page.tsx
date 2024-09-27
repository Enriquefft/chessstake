import { getLevel } from "@/lib/utils";
import ChessGame from "./ChessGame";

/**
 * @param args - Page arguments
 * @param args.params - URL path parameters
 * @param args.params.level - Level of the AI
 * @returns Page component
 */
export default async function ChessPage({
  params,
}: {
  params: { level: string };
}) {
  const level = getLevel(params.level);

  return <ChessGame level={level} />;
}
