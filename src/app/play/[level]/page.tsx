import { getLevel } from "@/lib/utils";
import ChessGame from "./ChessGame";

/**
 *
 * @param root0
 * @param root0.params
 * @param root0.params.level
 */
export default async function ChessPage({
  params,
}: {
  params: { level: string };
}) {
  const level = getLevel(params.level);

  if (level === undefined) {
    return <div>Invalid level</div>;
  }

  return <ChessGame level={level} />;
}
