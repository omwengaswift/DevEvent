export type Event = {
  title: string;
  image: string; // path under /images in public
  slug: string;
  location: string;
  date: string; // human-readable date
  time: string; // human-readable time or range
  description?: string;
};

export const events: Event[] = [
  {
    title: 'React Summit 2026',
    image: '/images/event1.png',
    slug: 'react-summit-2026',
    location: 'Amsterdam, NL & Online',
    date: 'May 12–14, 2026',
    time: '09:00 – 18:00 CEST',
    description: 'A global conference focused on React, React Native and the ecosystem — talks, workshops and networking.'
  },
  {
    title: 'Next.js Conf 2026',
    image: '/images/event2.png',
    slug: 'nextjs-conf-2026',
    location: 'San Francisco, CA & Online',
    date: 'June 3, 2026',
    time: '10:00 – 17:00 PDT',
    description: 'The official Next.js conference: new features, case studies and deep dives from the core team.'
  },
  {
    title: 'NodeConf EU 2026',
    image: '/images/event3.png',
    slug: 'nodeconf-eu-2026',
    location: 'Belfast, UK',
    date: 'July 7–9, 2026',
    time: '09:30 – 18:00 BST',
    description: 'Community-driven Node.js conference with workshops, talks and contributor meetups.'
  },
  {
    title: 'JSConf US 2026',
    image: '/images/event4.png',
    slug: 'jsconf-us-2026',
    location: 'New York, NY',
    date: 'August 20–21, 2026',
    time: '10:00 – 18:00 EDT',
    description: 'A popular JavaScript conference covering language features, tooling and web platform topics.'
  },
  {
    title: 'Google I/O 2026 (Dev Track)',
    image: '/images/event5.png',
    slug: 'google-io-2026-dev',
    location: 'Mountain View, CA & Online',
    date: 'May 20–22, 2026',
    time: '09:00 – 17:00 PDT',
    description: 'Google’s annual developer conference — platform updates, SDKs and hands-on sessions.'
  },
  {
    title: 'Hack the Future — Global Hackathon 2026',
    image: '/images/event6.png',
    slug: 'hack-the-future-2026',
    location: 'Remote (Global)',
    date: 'September 10–12, 2026',
    time: '48-hour event (UTC)',
    description: 'Weekend-long global hackathon for developers, designers and product teams. Prizes and mentorship.'
  },
  {
    title: 'Dev Meet LA — Community Meetup',
    image: '/images/event-full.png',
    slug: 'dev-meet-la-2026',
    location: 'Los Angeles, CA',
    date: 'May 30, 2026',
    time: '18:30 – 21:00 PDT',
    description: 'Informal meetup for frontend and backend engineers to demo projects and swap hiring tips.'
  }
];

export default events;
