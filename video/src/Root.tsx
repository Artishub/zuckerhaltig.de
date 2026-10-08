import { Composition } from "remotion";
import { Cubes } from "./Cubes";
import { Duel } from "./Duel";
import { Fill, fillDuration } from "./Fill";
import { Split, splitDuration } from "./Split";
import { Ranking } from "./Ranking";
import { durationInFrames, fps } from "./common";
import { videos } from "./videos";

const size = { width: 1080, height: 1920, fps, durationInFrames };

export function Root() {
  return (
    <>
      {videos.map((video) => {
        const id = `v${video.id}`;
        if (video.template === "duel") return <Composition key={id} id={id} component={Duel} defaultProps={video.props} {...size} />;
        if (video.template === "fill") return <Composition key={id} id={id} component={Fill} defaultProps={video.props} {...size} durationInFrames={fillDuration} />;
        if (video.template === "split") return <Composition key={id} id={id} component={Split} defaultProps={video.props} {...size} durationInFrames={splitDuration} />;
        if (video.template === "cubes") return <Composition key={id} id={id} component={Cubes} defaultProps={video.props} {...size} />;
        return <Composition key={id} id={id} component={Ranking} defaultProps={video.props} {...size} />;
      })}
    </>
  );
}
