export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  badge?: string;
}

export const FAQS: FAQItem[] = [
  {
    id: "free-and-ads",
    question: "Is Spidy Calculator truly 100% free with zero ads?",
    answer:
      "Yes, completely! There are zero banner ads, zero video popups, zero tracking trackers, and no paywalls. Spidy Calculator is built as an open-source, community-first math laboratory where you can solve problems with zero distractions.",
    badge: "100% FREE",
  },
  {
    id: "offline-pwa",
    question: "Does it work offline without an active internet connection?",
    answer:
      "Absolutely. Spidy Calculator is a Progressive Web App (PWA) with full service worker caching. Once visited in your browser, the entire app shell, sound effects, and math engines are cached locally. You can use it anywhere — on a flight, on the subway, or during network outages.",
    badge: "OFFLINE READY",
  },
  {
    id: "suites-and-powers",
    question: "What calculation modes and suites are available?",
    answer:
      "Spidy Calculator packs 7 specialized calculation powers into one platform: (1) Scientific Keypad with trigonometry, factorials, and powers; (2) 5-in-1 Percentage Suite; (3) 6-dimension Unit Converter (length, mass, temperature, speed, area, volume); (4) Maths & Fractions solver; (5) Interactive Soroban Abacus with 'Type to Animate' bead movement; (6) Darts 501/301 Match Scorer with checkout paths; and (7) Everyday Utilities including patio materials and international ring sizing.",
    badge: "7 SUITES",
  },
  {
    id: "privacy-and-storage",
    question: "Is my calculation history stored privately? Does it send data to servers?",
    answer:
      "Your privacy is absolute. All math calculations, state machines, and Case Files history are executed and stored strictly on your local device via standard browser storage. No calculation inputs, history, or telemetry data are ever transmitted to any remote server or third party.",
    badge: "100% PRIVATE",
  },
  {
    id: "install-instructions",
    question: "How do I install Spidy Calculator on my phone or computer?",
    answer:
      "On Chrome or Edge (Desktop and Android), click the 'Install App' icon in the address bar or browser menu. On iPhone and iPad (Safari), tap the Share icon (square with arrow up) and select 'Add to Home Screen'. The app will launch in standalone fullscreen mode just like a native app.",
    badge: "PWA APP",
  },
  {
    id: "keyboard-shortcuts",
    question: "Can I use keyboard shortcuts on desktop?",
    answer:
      "Yes! The calculator features comprehensive desktop keyboard support. Type numbers 0-9, operators (+, -, *, /), Enter or = for equals, Backspace to delete, Escape or 'c' to clear, and press '?' at any time to open the complete visual keyboard shortcut modal.",
    badge: "SHORTCUTS",
  },
  {
    id: "open-source-github",
    question: "Is the project open source? How can I contribute or star it?",
    answer:
      "Yes, Spidy Calculator is fully open-source under the MIT license! You can visit our GitHub repository (github.com/VARA4u-tech/spidy-calculator) to Star ⭐ the project, Fork 🍴 the codebase to create your own custom calculator engines, or report suggestions and improvements.",
    badge: "OPEN SOURCE",
  },
];
