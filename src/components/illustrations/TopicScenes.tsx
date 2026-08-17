import type { SVGProps } from 'react';
import { ILLUSTRATION } from './illustrationTokens';

type SceneProps = SVGProps<SVGSVGElement>;

export type TopicIllustrationId =
  | 'building-cabin'
  | 'camping'
  | 'dog-walkers'
  | 'driving-car-road-signs'
  | 'bbq-socialising';

function CabinScene({ className = 'h-full w-full', ...rest }: SceneProps) {
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden {...rest}>
      <rect width="120" height="80" fill={ILLUSTRATION.linen} rx="6" />
      <path d="M0 58 L120 58" stroke={ILLUSTRATION.olive} strokeWidth="1" opacity="0.4" />
      <rect x="38" y="32" width="36" height="26" fill={ILLUSTRATION.clay} stroke={ILLUSTRATION.forest} strokeWidth="1.6" />
      <path d="M32 32 L56 14 L80 32" fill={ILLUSTRATION.forestMid} stroke={ILLUSTRATION.forest} strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="50" y="42" width="12" height="16" fill={ILLUSTRATION.linenDark} stroke={ILLUSTRATION.forest} strokeWidth="1.2" />
      <rect x="14" y="48" width="16" height="6" fill={ILLUSTRATION.forestLight} stroke={ILLUSTRATION.forest} strokeWidth="1.2" transform="rotate(-8 22 51)" />
      <rect x="18" y="52" width="14" height="5" fill={ILLUSTRATION.oliveLight} stroke={ILLUSTRATION.forest} strokeWidth="1" transform="rotate(4 25 54)" />
      <path d="M88 38 L88 28" stroke={ILLUSTRATION.forest} strokeWidth="2" strokeLinecap="round" />
      <path d="M84 32 L92 32" stroke={ILLUSTRATION.forest} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M96 44 L104 52" stroke={ILLUSTRATION.coral} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CampingScene({ className = 'h-full w-full', ...rest }: SceneProps) {
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden {...rest}>
      <rect width="120" height="80" fill={ILLUSTRATION.sky} rx="6" />
      <path d="M0 52 L30 28 L54 44 L78 22 L120 40 L120 80 L0 80 Z" fill={ILLUSTRATION.forestLight} opacity="0.3" />
      <path d="M44 50 L60 26 L76 50 Z" fill={ILLUSTRATION.linen} stroke={ILLUSTRATION.forest} strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="60" y1="26" x2="60" y2="50" stroke={ILLUSTRATION.forest} strokeWidth="1.2" />
      <ellipse cx="58" cy="58" rx="8" ry="3" fill={ILLUSTRATION.coral} opacity="0.5" />
      <path d="M54 56 Q58 50 62 56" stroke={ILLUSTRATION.coral} strokeWidth="1.4" fill="none" />
      <path d="M18 48 L18 38 M14 42 L22 42" stroke={ILLUSTRATION.olive} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M96 46 L96 36 M92 40 L100 40" stroke={ILLUSTRATION.olive} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="98" cy="16" r="7" fill={ILLUSTRATION.coral} opacity="0.8" />
    </svg>
  );
}

function DogWalkersScene({ className = 'h-full w-full', ...rest }: SceneProps) {
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden {...rest}>
      <rect width="120" height="80" fill={ILLUSTRATION.oliveLight} opacity="0.3" rx="6" />
      <path
        d="M8 58 C28 52 40 54 58 48 C76 42 90 46 112 40"
        stroke={ILLUSTRATION.olive}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="48" cy="38" r="5" fill={ILLUSTRATION.clay} stroke={ILLUSTRATION.forest} strokeWidth="1.2" />
      <path d="M48 43 L48 52" stroke={ILLUSTRATION.forest} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M48 46 L42 50 M48 46 L54 50" stroke={ILLUSTRATION.forest} strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="62" cy="52" rx="9" ry="5" fill={ILLUSTRATION.forestMid} stroke={ILLUSTRATION.forest} strokeWidth="1.2" />
      <circle cx="68" cy="48" r="4" fill={ILLUSTRATION.forestMid} stroke={ILLUSTRATION.forest} strokeWidth="1" />
      <path d="M72 50 L76 48" stroke={ILLUSTRATION.forest} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M20 54 Q22 46 26 48" stroke={ILLUSTRATION.olive} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M100 50 Q102 42 106 44" stroke={ILLUSTRATION.olive} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DrivingScene({ className = 'h-full w-full', ...rest }: SceneProps) {
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden {...rest}>
      <rect width="120" height="80" fill={ILLUSTRATION.linenDark} rx="6" />
      <path d="M0 56 L120 56" stroke={ILLUSTRATION.clay} strokeWidth="8" strokeLinecap="round" />
      <path d="M0 56 L120 56" stroke={ILLUSTRATION.forest} strokeWidth="1" strokeDasharray="8 10" opacity="0.35" />
      <path d="M0 48 L120 40" fill={ILLUSTRATION.oliveLight} opacity="0.25" />
      <polygon points="78,18 88,34 68,34" fill={ILLUSTRATION.coral} stroke={ILLUSTRATION.forest} strokeWidth="1.4" />
      <text x="73" y="30" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="700" fill={ILLUSTRATION.white}>
        STOP
      </text>
      <rect x="22" y="42" width="28" height="12" rx="3" fill={ILLUSTRATION.forestMid} stroke={ILLUSTRATION.forest} strokeWidth="1.2" />
      <circle cx="28" cy="56" r="4" fill={ILLUSTRATION.forest} />
      <circle cx="44" cy="56" r="4" fill={ILLUSTRATION.forest} />
      <path d="M14 38 L18 34 L22 38" stroke={ILLUSTRATION.olive} strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function BbqScene({ className = 'h-full w-full', ...rest }: SceneProps) {
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden {...rest}>
      <rect width="120" height="80" fill={ILLUSTRATION.coralSoft} opacity="0.25" rx="6" />
      <ellipse cx="60" cy="62" rx="24" ry="6" fill={ILLUSTRATION.forest} opacity="0.06" />
      <rect x="44" y="48" width="32" height="14" rx="2" fill={ILLUSTRATION.forestMid} stroke={ILLUSTRATION.forest} strokeWidth="1.4" />
      <path d="M48 48 L52 38 L56 48 M64 48 L68 38 L72 48" stroke={ILLUSTRATION.forest} strokeWidth="1.2" />
      <ellipse cx="60" cy="44" rx="10" ry="4" fill={ILLUSTRATION.coral} opacity="0.45" />
      <rect x="18" y="36" width="22" height="10" rx="2" fill={ILLUSTRATION.clay} stroke={ILLUSTRATION.forest} strokeWidth="1.2" />
      <circle cx="26" cy="32" r="4" fill={ILLUSTRATION.clay} stroke={ILLUSTRATION.forest} strokeWidth="1" />
      <circle cx="38" cy="30" r="4" fill={ILLUSTRATION.oliveLight} stroke={ILLUSTRATION.forest} strokeWidth="1" />
      <path d="M88 28 Q92 24 96 28" stroke={ILLUSTRATION.coral} strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M100 32 Q104 28 108 32" stroke={ILLUSTRATION.coral} strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
}

const topicScenes: Record<TopicIllustrationId, typeof CabinScene> = {
  'building-cabin': CabinScene,
  camping: CampingScene,
  'dog-walkers': DogWalkersScene,
  'driving-car-road-signs': DrivingScene,
  'bbq-socialising': BbqScene,
};

export function TopicScene({ topicId, ...props }: SceneProps & { topicId: TopicIllustrationId | string }) {
  const Scene = topicScenes[topicId as TopicIllustrationId] ?? CabinScene;
  return <Scene {...props} />;
}

export function isTopicIllustrationId(id: string): id is TopicIllustrationId {
  return id in topicScenes;
}
