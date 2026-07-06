import type { ScenarioId } from '../types';

export interface ScenarioGroup {
  title: string;
  description: string;
  scenarioIds: ScenarioId[];
}

/** Home and Scenarios page grouping — maps to existing scenario content */
export const scenarioGroups: ScenarioGroup[] = [
  {
    title: 'Learning & communication',
    description: 'Lessons, small talk, and asking for help',
    scenarioIds: ['lesson', 'smalltalk', 'help'],
  },
  {
    title: 'Daily life',
    description: 'Shopping, food, health, travel, and appointments',
    scenarioIds: ['shop', 'coffee', 'pharmacy', 'taxi', 'doctor', 'vet', 'appointment'],
  },
  {
    title: 'Home & neighbourhood',
    description: 'Neighbours, home problems, routines, and admin',
    scenarioIds: ['neighbours', 'problem', 'today', 'accountant'],
  },
];

export function scenariosByGroup(
  allIds: Set<ScenarioId>,
  groups: ScenarioGroup[] = scenarioGroups
): ScenarioGroup[] {
  return groups
    .map((g) => ({
      ...g,
      scenarioIds: g.scenarioIds.filter((id) => allIds.has(id)),
    }))
    .filter((g) => g.scenarioIds.length > 0);
}
