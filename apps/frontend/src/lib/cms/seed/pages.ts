import type { SeedPart } from './types';

// Copy as the public pages show it today: app/(public)/curation-process and contact (Indonesian strings).

export const seed: SeedPart = {
  sections: {
    'curation.header': {
      eyebrow: 'Curation Process',
      title: 'How batch admissions work.',
      description: 'Selective intake ensures each batch has strong collaboration fit and publication execution capacity.',
    },
    'curation.steps': {
      steps: [
        { title: 'Apply with Google Scholar ID', desc: 'Submit identity and academic profile. Google Scholar ID is mandatory for baseline credibility verification.' },
        { title: 'Metadata verification', desc: 'Our team validates profile consistency, publication signal, and institutional alignment.' },
        { title: 'Council review', desc: 'Curation Council evaluates fit with batch focus, collaboration potential, and execution readiness.' },
        { title: 'Decision', desc: 'Applicants receive approved or rejected status with onboarding instructions for the selected batch.' },
        { title: 'Member activation', desc: 'Approved members are staged for program onboarding and collaboration sprint kickoff.' },
      ],
    },
  },
};
