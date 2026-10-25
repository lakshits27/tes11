export interface Interest {
  id: string;
  label: string;
  short: string;
  description: string;
  color: string;
  icon: 'space' | 'music' | 'game' | 'future' | 'code' | 'ideas';
}

export const INTERESTS: readonly Interest[] = [
  {
    id: 'space',
    label: 'Space & the future',
    short: 'Big questions, bigger canvases.',
    description:
      'Space and futuristic technology give me the same feeling as a blank editor: a huge space where improbable ideas are still worth exploring.',
    color: '#8f8cff',
    icon: 'space',
  },
  {
    id: 'music',
    label: 'Music',
    short: 'Rhythm, texture, and energy.',
    description:
      'Sounds and songs are a different kind of interface. I like how music can change the mood of a room — and the pace of a work session.',
    color: '#ff78b7',
    icon: 'music',
  },
  {
    id: 'gaming',
    label: 'Gaming',
    short: 'Worlds with rules you can feel.',
    description:
      'Games combine systems, art, feedback, and story. They are a reminder that software should be understandable and enjoyable at the same time.',
    color: '#61e7ff',
    icon: 'game',
  },
  {
    id: 'future-tech',
    label: 'Futuristic tech',
    short: 'What if that actually worked?',
    description:
      'I enjoy following new interfaces, AI tools, and strange technical ideas — then asking what would make them genuinely useful.',
    color: '#d7ff65',
    icon: 'future',
  },
  {
    id: 'creative-code',
    label: 'Creative coding',
    short: 'Playgrounds for visual ideas.',
    description:
      'Procedural visuals, motion, and interaction let me experiment with design in a way that feels closer to making an instrument than a dashboard.',
    color: '#ffb86b',
    icon: 'code',
  },
  {
    id: 'ideas',
    label: 'Wild ideas',
    short: 'Curiosity before certainty.',
    description:
      'A lot of my favourite projects began as a small question. I like following that question far enough to learn whether it can become real.',
    color: '#b69bff',
    icon: 'ideas',
  },
];
