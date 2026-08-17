import type { SVGProps } from 'react';
import { ILLUSTRATION } from './illustrationTokens';

type SceneProps = SVGProps<SVGSVGElement>;

/** Mountains + winding path + sun — brand journey motif */
export function TopicsScene({ className = 'h-full w-full', ...rest }: SceneProps) {
  return (
    <svg viewBox="0 0 160 96" fill="none" className={className} aria-hidden {...rest}>
      <rect width="160" height="96" fill={ILLUSTRATION.sky} rx="8" />
      <circle cx="128" cy="22" r="10" fill={ILLUSTRATION.coral} opacity="0.9" />
      <path d="M0 72 L28 42 L52 58 L78 34 L108 52 L132 38 L160 56 L160 96 L0 96 Z" fill={ILLUSTRATION.forestLight} opacity="0.35" />
      <path d="M0 78 L22 54 L48 66 L72 46 L98 60 L124 44 L160 62 L160 96 L0 96 Z" fill={ILLUSTRATION.forestMid} opacity="0.5" />
      <path
        d="M8 82 C32 74 48 76 68 68 C88 60 104 64 128 56 C140 52 148 54 154 50"
        stroke={ILLUSTRATION.olive}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M118 58 L124 52 L130 58 L124 64 Z" fill={ILLUSTRATION.coral} opacity="0.85" />
      <rect x="108" y="48" width="14" height="10" rx="1" fill={ILLUSTRATION.clay} stroke={ILLUSTRATION.forest} strokeWidth="1.2" />
      <path d="M115 48 L115 42 L121 42 L121 48" stroke={ILLUSTRATION.forest} strokeWidth="1.2" fill={ILLUSTRATION.linenDark} />
      <path d="M18 78 Q20 70 24 72 Q22 76 18 78" fill={ILLUSTRATION.olive} opacity="0.7" />
      <path d="M142 76 Q144 68 148 70" stroke={ILLUSTRATION.olive} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="36" cy="80" rx="8" ry="3" fill={ILLUSTRATION.forest} opacity="0.08" />
    </svg>
  );
}

/** Open notebook, vocabulary cards, lettering */
export function DictionaryScene({ className = 'h-full w-full', ...rest }: SceneProps) {
  return (
    <svg viewBox="0 0 160 96" fill="none" className={className} aria-hidden {...rest}>
      <rect width="160" height="96" fill={ILLUSTRATION.linen} rx="8" />
      <rect x="24" y="14" width="88" height="68" rx="4" fill={ILLUSTRATION.white} stroke={ILLUSTRATION.forest} strokeWidth="1.8" />
      <line x1="68" y1="14" x2="68" y2="82" stroke={ILLUSTRATION.clay} strokeWidth="1" strokeDasharray="3 3" />
      {[28, 38, 48, 58, 68, 78].map((y) => (
        <line key={y} x1="30" y1={y} x2="106" y2={y} stroke={ILLUSTRATION.oliveLight} strokeWidth="0.6" opacity="0.5" />
      ))}
      <text x="34" y="36" fontFamily="Caveat, cursive" fontSize="14" fill={ILLUSTRATION.forest} opacity="0.85">
        câine
      </text>
      <text x="34" y="52" fontFamily="Caveat, cursive" fontSize="12" fill={ILLUSTRATION.olive} opacity="0.8">
        bună
      </text>
      <text x="34" y="68" fontFamily="Caveat, cursive" fontSize="13" fill={ILLUSTRATION.coral} opacity="0.85">
        a merge
      </text>
      <rect x="118" y="28" width="28" height="18" rx="3" fill={ILLUSTRATION.oliveLight} opacity="0.5" stroke={ILLUSTRATION.forest} strokeWidth="1.2" transform="rotate(6 132 37)" />
      <text x="122" y="41" fontFamily="Caveat, cursive" fontSize="10" fill={ILLUSTRATION.forest} transform="rotate(6 132 37)">
        casă
      </text>
      <path d="M120 62 L138 54" stroke={ILLUSTRATION.forest} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M138 54 L134 58 M138 54 L142 58" stroke={ILLUSTRATION.coral} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="44" cy="24" r="3" fill={ILLUSTRATION.coral} opacity="0.6" />
    </svg>
  );
}

/** Connected word forms, handwritten marks */
export function GrammarScene({ className = 'h-full w-full', ...rest }: SceneProps) {
  return (
    <svg viewBox="0 0 160 96" fill="none" className={className} aria-hidden {...rest}>
      <rect width="160" height="96" fill={ILLUSTRATION.linenDark} rx="8" />
      <rect x="16" y="12" width="128" height="72" rx="6" fill={ILLUSTRATION.white} stroke={ILLUSTRATION.forest} strokeWidth="1.5" opacity="0.95" />
      <text x="28" y="38" fontFamily="Caveat, cursive" fontSize="16" fill={ILLUSTRATION.forest}>
        sunt
      </text>
      <path d="M58 34 L72 34" stroke={ILLUSTRATION.olive} strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="76" y="38" fontFamily="Caveat, cursive" fontSize="16" fill={ILLUSTRATION.olive}>
        ești
      </text>
      <path d="M106 34 L120 34" stroke={ILLUSTRATION.olive} strokeWidth="1.5" />
      <text x="124" y="38" fontFamily="Caveat, cursive" fontSize="16" fill={ILLUSTRATION.coral}>
        este
      </text>
      <path d="M32 52 Q48 48 64 54 T96 50" stroke={ILLUSTRATION.coral} strokeWidth="1.2" strokeDasharray="4 3" fill="none" opacity="0.7" />
      <text x="28" y="68" fontFamily="Caveat, cursive" fontSize="11" fill={ILLUSTRATION.forestMid} opacity="0.65">
        present · eu / tu / el
      </text>
      <circle cx="130" cy="62" r="12" fill="none" stroke={ILLUSTRATION.coral} strokeWidth="1.4" strokeDasharray="2 2" />
      <path d="M126 62 L130 66 L136 58" stroke={ILLUSTRATION.olive} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill={ILLUSTRATION.olive} />
        </marker>
      </defs>
    </svg>
  );
}

/** Winding path, milestones, growing plant */
export function ProgressScene({ className = 'h-full w-full', ...rest }: SceneProps) {
  return (
    <svg viewBox="0 0 160 96" fill="none" className={className} aria-hidden {...rest}>
      <rect width="160" height="96" fill={ILLUSTRATION.oliveLight} opacity="0.25" rx="8" />
      <path d="M0 70 L24 52 L48 58 L72 42 L96 50 L120 36 L144 44 L160 32" fill={ILLUSTRATION.forestLight} opacity="0.2" />
      <path
        d="M12 78 C36 68 52 72 72 62 C92 52 108 58 132 48 C144 42 152 46 158 42"
        stroke={ILLUSTRATION.olive}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      {[
        [24, 70],
        [72, 58],
        [120, 46],
        [148, 40],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={i === 3 ? 5 : 4} fill={i === 3 ? ILLUSTRATION.coral : ILLUSTRATION.white} stroke={ILLUSTRATION.forest} strokeWidth="1.4" />
          {i < 3 && <path d={`M${cx - 2} ${cy} L${cx} ${cy + 2} L${cx + 3} ${cy - 2}`} stroke={ILLUSTRATION.olive} strokeWidth="1.2" strokeLinecap="round" />}
        </g>
      ))}
      <path d="M20 82 Q22 74 26 76 Q24 80 20 82" fill={ILLUSTRATION.olive} />
      <path d="M24 76 L24 68" stroke={ILLUSTRATION.olive} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M18 70 Q24 66 30 70" stroke={ILLUSTRATION.olive} strokeWidth="1.2" fill="none" />
      <circle cx="140" cy="18" r="8" fill={ILLUSTRATION.coral} opacity="0.85" />
    </svg>
  );
}

/** Notebook + pencil + calm practice moment */
export function DailyPracticeScene({ className = 'h-full w-full', ...rest }: SceneProps) {
  return (
    <svg viewBox="0 0 160 96" fill="none" className={className} aria-hidden {...rest}>
      <rect width="160" height="96" fill={ILLUSTRATION.coralSoft} opacity="0.35" rx="8" />
      <rect x="28" y="16" width="76" height="64" rx="4" fill={ILLUSTRATION.white} stroke={ILLUSTRATION.forest} strokeWidth="1.8" />
      {[30, 40, 50, 60, 70].map((y) => (
        <line key={y} x1="36" y1={y} x2="96" y2={y} stroke={ILLUSTRATION.oliveLight} strokeWidth="0.5" opacity="0.45" />
      ))}
      <text x="40" y="38" fontFamily="Caveat, cursive" fontSize="13" fill={ILLUSTRATION.forest}>
        recunosc forme
      </text>
      <rect x="38" y="46" width="10" height="10" rx="2" stroke={ILLUSTRATION.olive} strokeWidth="1.4" fill="none" />
      <path d="M40 52 L44 56 L50 48" stroke={ILLUSTRATION.olive} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="54" y="56" fontFamily="Caveat, cursive" fontSize="12" fill={ILLUSTRATION.forestMid} opacity="0.7">
        am mers
      </text>
      <rect x="38" y="60" width="10" height="10" rx="2" stroke={ILLUSTRATION.clay} strokeWidth="1.2" fill="none" />
      <path d="M114 24 L126 76" stroke={ILLUSTRATION.coral} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M114 24 L108 30 L120 32 Z" fill={ILLUSTRATION.forest} />
      <circle cx="132" cy="20" r="9" fill={ILLUSTRATION.coral} opacity="0.75" />
      <path d="M118 82 Q122 78 126 82" stroke={ILLUSTRATION.olive} strokeWidth="1.2" fill="none" opacity="0.6" />
    </svg>
  );
}

export type ExploreDestination = 'topics' | 'dictionary' | 'grammar' | 'progress' | 'daily';

const exploreScenes = {
  topics: TopicsScene,
  dictionary: DictionaryScene,
  grammar: GrammarScene,
  progress: ProgressScene,
  daily: DailyPracticeScene,
} as const;

export function ExploreScene({ destination, ...props }: SceneProps & { destination: ExploreDestination }) {
  const Scene = exploreScenes[destination];
  return <Scene {...props} />;
}
