import { Composition } from 'remotion';
import { ProfileShowcase } from './compositions/ProfileShowcase';

export const RemotionRoot = () => {
    return (
        <>
            <Composition
                id="profile-showcase"
                component={ProfileShowcase}
                durationInFrames={150}
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{
                    name: 'Creative Name',
                    category: 'Photography',
                    location: 'Lagos, Nigeria',
                    bio: 'Passionate creative making waves in the industry.',
                }}
            />
        </>
    );
};
