import { Composition } from 'remotion';
import { ProfileShowcase } from './compositions/ProfileShowcase';
import { AppShowcase } from './compositions/AppShowcase';

export const RemotionRoot = () => {
    return (
        <>
            <Composition
                id="app-showcase"
                component={AppShowcase}
                durationInFrames={1800}
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{
                    title: 'KREATIVA',
                }}
            />
            <Composition
                id="profile-showcase"
                component={ProfileShowcase as any}
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
