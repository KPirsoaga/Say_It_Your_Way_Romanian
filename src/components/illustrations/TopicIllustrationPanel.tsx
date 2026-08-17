import type { ReactNode } from 'react';
import { IllustrationPanel } from '../illustrations/IllustrationPanel';
import { TopicScene, type TopicIllustrationId } from '../illustrations/TopicScenes';
import type { IllustrationTone } from '../illustrations/illustrationTokens';

interface Props {
  topicId: TopicIllustrationId | string;
  tone?: IllustrationTone;
  className?: string;
  aspect?: 'wide' | 'square' | 'banner';
  children?: ReactNode;
}

const topicTones: Record<string, IllustrationTone> = {
  'building-cabin': 'clay',
  camping: 'sky',
  'dog-walkers': 'olive',
  'driving-car-road-signs': 'linen',
  'bbq-socialising': 'coral',
};

export function TopicIllustrationPanel({
  topicId,
  tone,
  className = '',
  aspect = 'wide',
  children,
}: Props) {
  const resolvedTone = tone ?? topicTones[topicId] ?? 'olive';

  return (
    <div className={`relative ${className}`}>
      <IllustrationPanel tone={resolvedTone} aspect={aspect} className="w-full">
        <TopicScene topicId={topicId} className="h-full w-full" />
      </IllustrationPanel>
      {children}
    </div>
  );
}
