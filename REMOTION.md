# Remotion Setup - Kreativa App

Remotion is now set up for creating programmatic videos in your Kreativa app!

## 📁 Folder Structure

```
kreativa-app/
├── remotion.config.ts          # Remotion configuration
├── src/
│   └── remotion/
│       ├── Root.tsx             # Main composition registry
│       └── compositions/
│           ├── HelloWorld.tsx   # Example: Simple animated text
│           └── ProfileShowcase.tsx  # Example: Profile showcase video
```

## 🚀 Quick Start

### 1. Preview Compositions (Studio Mode)

Launch the Remotion Studio to preview and edit your video compositions:

```bash
npm run remotion:studio
```

This opens a browser-based editor where you can:
- Preview all compositions
- Adjust props in real-time
- Scrub through timeline
- Test animations

### 2. Render Videos

Render a specific composition to video:

```bash
npm run remotion:render <composition-id> <output-path>
```

Examples:
```bash
# Render HelloWorld composition
npm run remotion:render HelloWorld out/hello.mp4

# Render ProfileShowcase composition
npm run remotion:render ProfileShowcase out/profile.mp4
```

## 🎨 Available Compositions

### 1. HelloWorld
Simple animated text composition for testing.

**Props:**
- `titleText` (string): The text to display
- `titleColor` (string): Color of the text

**Settings:**
- Duration: 5 seconds (150 frames @ 30fps)
- Resolution: 1920x1080

### 2. ProfileShowcase
Showcase a creative professional's profile with animations.

**Props:**
- `profileName` (string): Name of the creative
- `profileImage` (string): URL to profile image
- `profileBio` (string): Short bio/tagline
- `categories` (string[]): Array of category tags

**Settings:**
- Duration: 10 seconds (300 frames @ 30fps)
- Resolution: 1920x1080
- Features: Animated entrance, gradient background, category badges

## 🛠️ Creating New Compositions

### Step 1: Create Component

Create a new file in `src/remotion/compositions/`:

```tsx
// src/remotion/compositions/MyComposition.tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MyCompositionProps {
  text: string;
}

export const MyComposition: React.FC<MyCompositionProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>{text}</h1>
    </AbsoluteFill>
  );
};
```

### Step 2: Register in Root.tsx

Add your composition to `src/remotion/Root.tsx`:

```tsx
import { MyComposition } from './compositions/MyComposition';

// Inside RemotionRoot component:
<Composition
  id="MyComposition"
  component={MyComposition}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    text: 'Hello World',
  }}
/>
```

### Step 3: Preview

Run `npm run remotion:studio` to see your new composition!

## 🎬 Use Cases for Kreativa

### Potential Video Compositions:

1. **Profile Intro Videos**
   - Showcase creative's work
   - Animated portfolio highlights
   - Social media share videos

2. **Category Highlight Reels**
   - Featured creatives by category
   - Weekly/monthly showcases
   - Event promotions

3. **Submission Confirmation**
   - Animated "thank you" video
   - Profile approval notifications
   - Welcome videos

4. **Marketing Content**
   - Platform overview videos
   - Feature demonstrations
   - Social media ads

## 📚 Remotion Concepts

### Key Hooks:
- `useCurrentFrame()` - Get current frame number for animations
- `useVideoConfig()` - Get fps, width, height, duration
- `interpolate()` - Map frame ranges to values
- `spring()` - Create spring-based animations

### Components:
- `<AbsoluteFill>` - Full-screen container
- `<Img>` - Remotion's image component
- `<Video>` - Embed other videos
- `<Audio>` - Add audio tracks

### Animation Tips:
1. Use `spring()` for natural motion
2. Use `interpolate()` for linear transitions
3. Delay animations with `frame - offset`
4. Use `extrapolateRight: 'clamp'` to hold final values

## 🔧 Configuration

Edit `remotion.config.ts` to customize:

```typescript
import { Config } from '@remotion/cli/config';

// Image format for video frames
Config.setVideoImageFormat('jpeg'); // or 'png'

// Overwrite existing output files
Config.setOverwriteOutput(true);

// Set concurrency for rendering
Config.setConcurrency(4);

export default Config;
```

## 📖 Resources

- [Remotion Documentation](https://www.remotion.dev/docs)
- [Remotion Examples](https://github.com/remotion-dev/remotion)
- [Animation Techniques](https://www.remotion.dev/docs/animating-properties)
- [Performance Tips](https://www.remotion.dev/docs/performance)

## 🎯 Next Steps

1. Launch Studio: `npm run remotion:studio`
2. Explore the example compositions
3. Modify props to see real-time changes
4. Create your first custom composition
5. Render your first video!

---

**Happy creating with Remotion!** 🎥✨
