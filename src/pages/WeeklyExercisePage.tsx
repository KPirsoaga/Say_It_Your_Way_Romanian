import { PageHeader } from '../components/PageHeader';
import { WeeklyMcExercise } from '../components/WeeklyMcExercise';
import { WeeklyTapMatch } from '../components/WeeklyTapMatch';
import { WeeklyCategorySort } from '../components/WeeklyCategorySort';
import { useProgress } from '../context/ProgressContext';
import { getWeeklyTopic } from '../content/weeklyTopics';
import type { WeeklyExerciseType } from '../types';

interface Props {
  topicId: string;
  exerciseType: WeeklyExerciseType;
  onBack: () => void;
}

const titles: Record<WeeklyExerciseType, string> = {
  'ro-en': 'Romanian → English',
  'en-ro': 'English → Romanian',
  match: 'Vocabulary Review',
  sort: 'Category Sorting',
};

export function WeeklyExercisePage({ topicId, exerciseType, onBack }: Props) {
  const topic = getWeeklyTopic(topicId);
  const { updateWeeklyTopicProgress } = useProgress();

  if (!topic) return null;

  const complete = () => {
    const patch =
      exerciseType === 'ro-en'
        ? { roToEnDone: true }
        : exerciseType === 'en-ro'
          ? { enToRoDone: true }
          : exerciseType === 'match'
            ? { matchingDone: true }
            : { sortingDone: true };
    updateWeeklyTopicProgress(topicId, patch);
  };

  return (
    <div className="min-h-screen">
      <PageHeader title={titles[exerciseType]} subtitle={topic.title} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4">
        {exerciseType === 'ro-en' && (
          <WeeklyMcExercise
            questions={topic.exercises.roToEn}
            title="What does it mean?"
            onComplete={complete}
            onBackToTopic={onBack}
          />
        )}
        {exerciseType === 'en-ro' && (
          <WeeklyMcExercise
            questions={topic.exercises.enToRo}
            title="How do you say it in Romanian?"
            onComplete={complete}
            onBackToTopic={onBack}
          />
        )}
        {exerciseType === 'match' && (
          <WeeklyTapMatch pairs={topic.exercises.matching} onComplete={complete} onBackToTopic={onBack} />
        )}
        {exerciseType === 'sort' && (
          <WeeklyCategorySort
            categories={topic.exercises.sortCategories}
            items={topic.exercises.sortItems}
            onComplete={complete}
            onBackToTopic={onBack}
          />
        )}
      </div>
    </div>
  );
}
