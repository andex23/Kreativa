import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from 'remotion';

export interface HelloWorldProps {
  titleText: string;
  titleColor: string;
}

export const HelloWorld: React.FC<HelloWorldProps> = ({
  titleText,
  titleColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame,
    config: {
      damping: 100,
    },
  });

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        <h1
          style={{
            fontSize: 100,
            fontWeight: 'bold',
            color: titleColor,
            textAlign: 'center',
          }}
        >
          {titleText}
        </h1>
      </div>
    </AbsoluteFill>
  );
};
