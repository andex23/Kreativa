import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion';

interface ProfileShowcaseProps {
    name: string;
    category: string;
    location: string;
    bio: string;
}

export const ProfileShowcase: React.FC<ProfileShowcaseProps> = ({
    name,
    category,
    location,
    bio,
}) => {
    const frame = useCurrentFrame();
    const fps = 30;

    // Animation values
    const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const titleY = interpolate(frame, [0, 30], [50, 0], {
        extrapolateRight: 'clamp',
    });

    const categoryScale = spring({
        frame: frame - 20,
        fps,
        config: {
            damping: 100,
        },
    });

    const bioOpacity = interpolate(frame, [40, 70], [0, 1], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: '#FAF8F5',
                fontFamily: 'Arial, sans-serif',
                padding: '80px',
            }}
        >
            {/* Background Pattern */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.03,
                    backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}
            >
                {/* Name */}
                <h1
                    style={{
                        fontSize: '120px',
                        fontWeight: 'bold',
                        color: '#000',
                        margin: 0,
                        opacity: titleOpacity,
                        transform: `translateY(${titleY}px)`,
                        letterSpacing: '-0.02em',
                    }}
                >
                    {name}
                </h1>

                {/* Category Tag */}
                <div
                    style={{
                        display: 'inline-block',
                        marginTop: '40px',
                        padding: '20px 40px',
                        backgroundColor: '#000',
                        color: '#FAF8F5',
                        fontSize: '32px',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        transform: `scale(${categoryScale})`,
                    }}
                >
                    {category}
                </div>

                {/* Location */}
                <p
                    style={{
                        fontSize: '36px',
                        color: '#666',
                        marginTop: '40px',
                        opacity: bioOpacity,
                    }}
                >
                    📍 {location}
                </p>

                {/* Bio */}
                <p
                    style={{
                        fontSize: '42px',
                        color: '#333',
                        marginTop: '60px',
                        lineHeight: 1.6,
                        maxWidth: '900px',
                        opacity: bioOpacity,
                    }}
                >
                    {bio}
                </p>

                {/* Branding */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '80px',
                        right: '80px',
                        fontSize: '24px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: '#999',
                        opacity: bioOpacity,
                    }}
                >
                    KREATIVA
                </div>
            </div>
        </AbsoluteFill>
    );
};
