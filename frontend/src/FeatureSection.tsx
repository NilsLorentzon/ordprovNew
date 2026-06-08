import React from 'react';

export default function FeaturesSection() {
  const features = [
    { id: 1, text: "Detaljerade definitioner och exempelmeningar" },
    { id: 2, text: "Ordlista med alla gamla ord från högskoleproven" },
    { id: 3, text: "Interaktiva quiz med inlärning i fokus" },
    {
      id: 4,
      text: (
        <>
          <a 
            href="https://en.wikipedia.org/wiki/Spaced_repetition" 
            aria-label="Spaced repetition" 
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Spaced repetition
          </a>{" "}
          som gör att orden sitter
        </>
      )
    },
    { id: 5, text: "Full koll på din statistik och dina framsteg" },
    { id: 6, text: "Helt gratis att använda och att skapa konto", highlight: true }
  ];

  return (
    <div className="w-full h-full py-16 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="w-full m-auto max-w-md lg:pl-4 flex flex-col items-start">
        
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl mb-10 font-medium  text-slate-900 dark:text-white text-left">
          Varför Ordprov.com?
        </h2>
        
        {/* Features List */}
        <ul className="space-y-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 w-full">
          {features.map((feature) => (
            <li key={feature.id} className="flex items-start gap-3">
              {/* Checkmark Icon */}
              <svg 
                className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              
              {/* Feature Text */}
              <span className={feature.highlight ? "font-medium text-slate-900 dark:text-white" : ""}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}