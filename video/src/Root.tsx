import { Composition } from "remotion";
import { RedBullVsCola, durationInFrames } from "./RedBullVsCola";

export function Root() {
  return <Composition id="RedBullVsCola" component={RedBullVsCola} durationInFrames={durationInFrames} fps={30} width={1080} height={1920} />;
}
