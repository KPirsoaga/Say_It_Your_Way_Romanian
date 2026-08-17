interface Props {
  chain: string[];
  label?: string;
  className?: string;
}

/** Recognisable word-family transformation pattern across the app */
export function WordFamilyChain({ chain, label = 'Word family', className = '' }: Props) {
  if (chain.length < 2) return null;

  return (
    <div className={`word-family-chain ${className}`}>
      <p className="word-family-chain__label">{label}</p>
      <p className="word-family-chain__forms" lang="ro">
        {chain.map((form, i) => (
          <span key={`${form}-${i}`}>
            {i > 0 && <span className="word-family-chain__arrow" aria-hidden>→</span>}
            {form}
          </span>
        ))}
      </p>
    </div>
  );
}

interface FormStepProps {
  form: string;
  meaning?: string;
  label?: string;
  isLast?: boolean;
}

/** Vertical word-family steps for dictionary entries */
export function WordFamilySteps({ steps }: { steps: FormStepProps[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={`${step.form}-${i}`} className="flex gap-3">
          <div className="flex flex-col items-center shrink-0 w-4 pt-2">
            <span className="h-2 w-2 rounded-full bg-olive-400 dark:bg-olive-300" aria-hidden />
            {!step.isLast && i < steps.length - 1 && (
              <span className="w-px flex-1 bg-olive-300/50 dark:bg-olive-600/50 my-1" aria-hidden />
            )}
          </div>
          <div className={`flex-1 min-w-0 ${i < steps.length - 1 ? 'pb-3' : ''}`}>
            {step.label && (
              <p className="text-xs font-semibold uppercase tracking-wide text-forest/50 dark:text-linen/50 mb-0.5">
                {step.label}
              </p>
            )}
            <p className="text-lg font-semibold text-forest dark:text-linen-100" lang="ro">
              {step.form}
            </p>
            {step.meaning && <p className="text-sm text-forest/70 dark:text-linen/70">{step.meaning}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
