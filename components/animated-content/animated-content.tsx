import Lottie from "lottie-react";
import React from "react";

interface AnimatedContentProps {
  animationData: unknown;
  height?: number;
  width?: number;
}

const AnimatedContent = ({ animationData, height = 400, width }: AnimatedContentProps) => (
  <Lottie
    animationData={animationData}
    loop
    autoplay
    style={{
      height,
      width,
    }}
  />
);

export default AnimatedContent;
