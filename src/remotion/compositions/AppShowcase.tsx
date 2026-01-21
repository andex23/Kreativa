import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

interface AppShowcaseProps {
  title?: string;
}

export const AppShowcase: React.FC<AppShowcaseProps> = ({
  title = "KREATIVA",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timings (in seconds) - removed admin scene
  const SCENE_1_END = 5 * fps; // Opening
  const SCENE_2_END = 10 * fps; // Problem
  const SCENE_3_END = 15 * fps; // Solution
  const SCENE_4_END = 27 * fps; // Browse (extended)
  const SCENE_5_END = 35 * fps; // Filter
  const SCENE_6_END = 42 * fps; // Submit
  const SCENE_7_END = 52 * fps; // Community
  const SCENE_8_END = 60 * fps; // CTA

  // Current scene
  const currentScene =
    frame < SCENE_1_END
      ? 1
      : frame < SCENE_2_END
      ? 2
      : frame < SCENE_3_END
      ? 3
      : frame < SCENE_4_END
      ? 4
      : frame < SCENE_5_END
      ? 5
      : frame < SCENE_6_END
      ? 6
      : frame < SCENE_7_END
      ? 7
      : 8;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FAF8F5",
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      {currentScene === 1 && <Scene1Opening frame={frame} fps={fps} title={title} />}
      {currentScene === 2 && (
        <Scene2Problem frame={frame - SCENE_1_END} fps={fps} />
      )}
      {currentScene === 3 && (
        <Scene3Solution frame={frame - SCENE_2_END} fps={fps} />
      )}
      {currentScene === 4 && (
        <Scene4Browse frame={frame - SCENE_3_END} fps={fps} />
      )}
      {currentScene === 5 && (
        <Scene5Filter frame={frame - SCENE_4_END} fps={fps} />
      )}
      {currentScene === 6 && (
        <Scene6Submit frame={frame - SCENE_5_END} fps={fps} />
      )}
      {currentScene === 7 && (
        <Scene7Community frame={frame - SCENE_6_END} fps={fps} />
      )}
      {currentScene === 8 && <Scene8CTA frame={frame - SCENE_7_END} fps={fps} />}
    </AbsoluteFill>
  );
};

// Scene 1: Opening
const Scene1Opening: React.FC<{ frame: number; fps: number; title: string }> = ({
  frame,
  fps,
  title,
}) => {
  const titleOpacity = interpolate(frame, [0, fps * 1.2], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const titleScale = spring({
    frame: frame,
    fps,
    from: 0.85,
    to: 1,
    config: {
      damping: 25,
      mass: 0.5,
    },
  });

  const taglineOpacity = interpolate(frame, [fps * 2.5, fps * 3.5], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const lineWidth = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 300], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a1a",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
      }}
    >
      <div
        style={{
          fontSize: 140,
          fontWeight: 700,
          color: "#FAF8F5",
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          fontFamily: "'Courier Prime', monospace",
          letterSpacing: 12,
        }}
      >
        {title}
      </div>

      <div
        style={{
          width: lineWidth,
          height: 3,
          backgroundColor: "#FAF8F5",
          opacity: titleOpacity,
        }}
      />

      <div
        style={{
          fontSize: 36,
          color: "#FAF8F5",
          opacity: taglineOpacity,
          fontWeight: 300,
          letterSpacing: 3,
        }}
      >
        Nigeria's Creative Directory
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: The Problem
const Scene2Problem: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const textOpacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subtextOpacity = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FAF8F5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: "#1a1a1a",
          textAlign: "center",
          maxWidth: 1000,
          opacity: textOpacity,
          lineHeight: 1.3,
          fontFamily: "'Courier Prime', monospace",
        }}
      >
        Finding Nigerian
        <br />
        creative talent
        <br />
        <span style={{ color: "#dc2626", fontStyle: "italic" }}>
          shouldn't be this hard
        </span>
      </div>

      <div
        style={{
          fontSize: 28,
          color: "#6b7280",
          marginTop: 50,
          opacity: subtextOpacity,
          textAlign: "center",
          maxWidth: 700,
          lineHeight: 1.6,
          fontWeight: 400,
        }}
      >
        Scattered portfolios. Endless scrolling. No quality filter.
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: The Solution
const Scene3Solution: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const bgOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleScale = spring({
    frame: frame - fps * 0.5,
    fps,
    from: 0.9,
    to: 1,
    config: {
      damping: 20,
    },
  });

  const pillsOpacity = interpolate(frame, [fps * 2, fps * 3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
        opacity: bgOpacity,
      }}
    >
      <div
        style={{
          fontSize: 120,
          fontWeight: 700,
          color: "white",
          fontFamily: "'Courier Prime', monospace",
          letterSpacing: 8,
          transform: `scale(${titleScale})`,
        }}
      >
        KREATIVA
      </div>

      <div
        style={{
          display: "flex",
          gap: 30,
          opacity: pillsOpacity,
        }}
      >
        {["Discover", "Connect", "Create"].map((text, i) => {
          const scale = spring({
            frame: frame - fps * (2 + i * 0.3),
            fps,
            from: 0.8,
            to: 1,
            config: { damping: 15 },
          });

          return (
            <div
              key={i}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                padding: "20px 45px",
                borderRadius: 50,
                fontSize: 32,
                color: "white",
                fontWeight: 600,
                border: "2px solid rgba(255, 255, 255, 0.3)",
                transform: `scale(${scale})`,
              }}
            >
              {text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Browse & Discovery
const Scene4Browse: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const titleOpacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: "clamp",
  });

  const profiles = [
    { name: "Adewale K.", category: "Photographer", location: "Lagos", color: "#ec4899" },
    { name: "Chioma O.", category: "Graphic Designer", location: "Abuja", color: "#8b5cf6" },
    { name: "Ibrahim S.", category: "Videographer", location: "Port Harcourt", color: "#6366f1" },
    { name: "Aisha M.", category: "Content Creator", location: "Lagos", color: "#14b8a6" },
    { name: "Emeka N.", category: "Visual Artist", location: "Enugu", color: "#f59e0b" },
    { name: "Fatima A.", category: "Fashion Designer", location: "Kano", color: "#ef4444" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FAF8F5",
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: "#1a1a1a",
          marginBottom: 60,
          opacity: titleOpacity,
          fontFamily: "'Courier Prime', monospace",
        }}
      >
        Browse Creative Profiles
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 35,
        }}
      >
        {profiles.map((profile, i) => {
          const cardOpacity = interpolate(
            frame,
            [fps * (0.8 + i * 0.35), fps * (1.5 + i * 0.35)],
            [0, 1],
            {
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }
          );

          const cardY = interpolate(
            frame,
            [fps * (0.8 + i * 0.35), fps * (1.5 + i * 0.35)],
            [60, 0],
            {
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }
          );

          return (
            <div
              key={i}
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                padding: 0,
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
                boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                overflow: "hidden",
                border: "1px solid #f3f4f6",
              }}
            >
              {/* Header Image with gradient overlay */}
              <div
                style={{
                  width: "100%",
                  height: 160,
                  background: `linear-gradient(135deg, ${profile.color} 0%, ${profile.color}dd 100%)`,
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 700,
                    color: "white",
                    opacity: 0.9,
                  }}
                >
                  {profile.name.split(" ")[0][0]}
                </div>
              </div>

              {/* Profile Info */}
              <div style={{ padding: 25 }}>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    marginBottom: 8,
                  }}
                >
                  {profile.name}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    color: profile.color,
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  {profile.category}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    color: "#9ca3af",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 14 }}>●</span>
                  {profile.location}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 50,
          fontSize: 24,
          color: "#6b7280",
          textAlign: "center",
          opacity: interpolate(frame, [fps * 8, fps * 9], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        500+ verified creative professionals
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Search & Filter
const Scene5Filter: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const bgOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const searchScale = spring({
    frame: frame - fps * 0.5,
    fps,
    from: 0.95,
    to: 1,
    config: { damping: 20 },
  });

  const filters = [
    { label: "Category", options: "15 options" },
    { label: "Location", options: "11 cities" },
    { label: "Platform", options: "3 platforms" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a1a",
        padding: 80,
        display: "flex",
        flexDirection: "column",
        gap: 50,
        opacity: bgOpacity,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: "#FAF8F5",
          fontFamily: "'Courier Prime', monospace",
        }}
      >
        Find Your Perfect Match
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: 30,
          fontSize: 32,
          color: "#9ca3af",
          transform: `scale(${searchScale})`,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <span style={{ fontSize: 36 }}>⌕</span>
        <span>Search by name, category, or location...</span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 25,
          marginTop: 20,
        }}
      >
        {filters.map((filter, i) => {
          const opacity = interpolate(
            frame,
            [fps * (1.5 + i * 0.6), fps * (2.2 + i * 0.6)],
            [0, 1],
            { extrapolateRight: "clamp" }
          );

          const y = interpolate(
            frame,
            [fps * (1.5 + i * 0.6), fps * (2.2 + i * 0.6)],
            [40, 0],
            {
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }
          );

          return (
            <div
              key={i}
              style={{
                backgroundColor: "#2d2d2d",
                color: "#FAF8F5",
                padding: "30px 45px",
                borderRadius: 12,
                fontSize: 28,
                fontWeight: 600,
                opacity,
                transform: `translateY(${y}px)`,
                border: "2px solid #3d3d3d",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div>{filter.label}</div>
              <div style={{ fontSize: 18, color: "#9ca3af", fontWeight: 400 }}>
                {filter.options}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          fontSize: 28,
          color: "#9ca3af",
          marginTop: 20,
          opacity: interpolate(frame, [fps * 5, fps * 6], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        Real-time filtering • Instant results
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Profile Submission
const Scene6Submit: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const titleOpacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: "clamp",
  });

  const steps = [
    { step: "1", title: "Submit", desc: "Share your details" },
    { step: "2", title: "Review", desc: "48-hour verification" },
    { step: "3", title: "Go Live", desc: "Join the directory" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FAF8F5",
        padding: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 70,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: "#1a1a1a",
          opacity: titleOpacity,
          fontFamily: "'Courier Prime', monospace",
        }}
      >
        Join the Directory
      </div>

      <div
        style={{
          display: "flex",
          gap: 50,
          alignItems: "center",
        }}
      >
        {steps.map((item, i) => {
          const opacity = interpolate(
            frame,
            [fps * (1.2 + i * 0.9), fps * (1.8 + i * 0.9)],
            [0, 1],
            { extrapolateRight: "clamp" }
          );

          const scale = spring({
            frame: frame - fps * (1.2 + i * 0.9),
            fps,
            from: 0.7,
            to: 1,
            config: { damping: 18 },
          });

          return (
            <React.Fragment key={i}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 20,
                  opacity,
                  transform: `scale(${scale})`,
                }}
              >
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    backgroundColor: "#1a1a1a",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 56,
                    fontWeight: 700,
                    color: "#FAF8F5",
                    border: "4px solid #e5e7eb",
                  }}
                >
                  {item.step}
                </div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#1a1a1a",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    color: "#6b7280",
                    textAlign: "center",
                  }}
                >
                  {item.desc}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    fontSize: 48,
                    color: "#d1d5db",
                    opacity,
                    fontWeight: 300,
                  }}
                >
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 7: Community Scale
const Scene7Community: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const bgOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [fps * 0.5, fps * 1.2], [0, 1], {
    extrapolateRight: "clamp",
  });

  const stats = [
    { number: "15+", label: "Creative Categories", sublabel: "From photography to UI/UX" },
    { number: "11", label: "Nigerian Cities", sublabel: "Lagos to Kaduna" },
    { number: "500+", label: "Verified Creatives", sublabel: "Growing daily" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)",
        padding: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 80,
        opacity: bgOpacity,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: "white",
          opacity: titleOpacity,
          textAlign: "center",
          fontFamily: "'Courier Prime', monospace",
          maxWidth: 1000,
        }}
      >
        Nigeria's Largest Creative Network
      </div>

      <div
        style={{
          display: "flex",
          gap: 70,
        }}
      >
        {stats.map((stat, i) => {
          const opacity = interpolate(
            frame,
            [fps * (1.5 + i * 0.9), fps * (2.2 + i * 0.9)],
            [0, 1],
            { extrapolateRight: "clamp" }
          );

          const scale = spring({
            frame: frame - fps * (1.5 + i * 0.9),
            fps,
            from: 0.6,
            to: 1,
            config: { damping: 15 },
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 15,
                opacity,
                transform: `scale(${scale})`,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                padding: "40px 50px",
                borderRadius: 20,
                border: "2px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <div
                style={{
                  fontSize: 90,
                  fontWeight: 700,
                  color: "white",
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontSize: 28,
                  color: "white",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: "rgba(255, 255, 255, 0.8)",
                  textAlign: "center",
                  fontWeight: 400,
                }}
              >
                {stat.sublabel}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 8: Call to Action
const Scene8CTA: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const bgOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const ctaScale = spring({
    frame: frame - fps * 0.5,
    fps,
    from: 0.9,
    to: 1,
    config: { damping: 20 },
  });

  const urlOpacity = interpolate(frame, [fps * 2.5, fps * 3.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 600], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a1a",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
        opacity: bgOpacity,
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: 700,
          color: "#FAF8F5",
          textAlign: "center",
          maxWidth: 1100,
          lineHeight: 1.3,
          transform: `scale(${ctaScale})`,
        }}
      >
        Join Nigeria's
        <br />
        Creative Community
      </div>

      <div
        style={{
          width: lineWidth,
          height: 3,
          backgroundColor: "#FAF8F5",
          opacity: urlOpacity * 0.3,
        }}
      />

      <div
        style={{
          fontSize: 64,
          color: "#FAF8F5",
          opacity: urlOpacity,
          fontWeight: 700,
          fontFamily: "'Courier Prime', monospace",
          letterSpacing: 4,
        }}
      >
        kreativa.ng
      </div>

      <div
        style={{
          fontSize: 28,
          color: "#9ca3af",
          opacity: urlOpacity,
          marginTop: 20,
        }}
      >
        Discover • Connect • Create
      </div>
    </AbsoluteFill>
  );
};
