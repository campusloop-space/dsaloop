import React from "react";
import { cn } from "@/lib/utils";

interface IllustrationProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * Hand-drawn style soft coral heart
 */
export function CuteHeart({ className, size = 20, ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#FF804E"
        stroke="#BD4B2A"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Friendly pastel cat mascot sitting peacefully with warm outlines and rosy cheeks
 */
export function CuteCatMascot({ className, size = 80, ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      aria-label="CampusLoop Cat Mascot"
      role="img"
      {...props}
    >
      {/* Soft Ambient Shadow */}
      <ellipse cx="50" cy="88" rx="34" ry="7" fill="currentColor" className="text-black/5 dark:text-white/5" />

      {/* Cat Tail */}
      <path
        d="M72 74C82 72 88 64 86 54C84 48 78 50 78 54C78 60 74 66 66 70"
        stroke="#5A554B"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cat Body */}
      <path
        d="M28 82C28 66 36 56 50 56C64 56 72 66 72 82C72 86 64 88 50 88C36 88 28 86 28 82Z"
        fill="#FFF8ED"
        stroke="#5A554B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Cat Belly Patch - Soft Pastel Yellow */}
      <ellipse cx="50" cy="74" rx="14" ry="10" fill="#FFE59C" opacity="0.75" />

      {/* Left Ear */}
      <path
        d="M26 38L32 18C33 16 36 16 38 19L44 32"
        fill="#FFF8ED"
        stroke="#5A554B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Left Inner Ear - Pastel Pink */}
      <path d="M30 34L34 22L40 31Z" fill="#F2A4A4" opacity="0.8" />

      {/* Right Ear */}
      <path
        d="M74 38L68 18C67 16 64 16 62 19L56 32"
        fill="#FFF8ED"
        stroke="#5A554B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Right Inner Ear - Pastel Pink */}
      <path d="M70 34L66 22L60 31Z" fill="#F2A4A4" opacity="0.8" />

      {/* Cat Head */}
      <circle cx="50" cy="42" r="26" fill="#FFF8ED" stroke="#5A554B" strokeWidth="3.5" />

      {/* Eyes - Happy Curved Arcs */}
      <path d="M40 40C40 43 43 45 45 45" stroke="#5A554B" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M60 40C60 43 57 45 55 45" stroke="#5A554B" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Cute Rosy Cheeks */}
      <circle cx="36" cy="48" r="4.5" fill="#F2A4A4" opacity="0.85" />
      <circle cx="64" cy="48" r="4.5" fill="#F2A4A4" opacity="0.85" />

      {/* Nose */}
      <polygon points="48,46 52,46 50,49" fill="#FF804E" />

      {/* Mouth */}
      <path
        d="M47 50C48.5 52.5 50 52.5 50 50C50 52.5 51.5 52.5 53 50"
        stroke="#5A554B"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Whiskers */}
      <path d="M26 46L18 45" stroke="#5A554B" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 50L17 52" stroke="#5A554B" strokeWidth="2" strokeLinecap="round" />
      <path d="M74 46L82 45" stroke="#5A554B" strokeWidth="2" strokeLinecap="round" />
      <path d="M74 50L83 52" stroke="#5A554B" strokeWidth="2" strokeLinecap="round" />

      {/* Small floating playful heart */}
      <path
        d="M68 22C66.5 19 62.5 20 64.5 23C66 25 68 27 68 27C68 27 70 25 71.5 23C73.5 20 69.5 19 68 22Z"
        fill="#FF804E"
        stroke="#BD4B2A"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * Sleepy, restful cat peeking from a soft pastel cloud/pillow for Empty States
 */
export function CuteCatEmpty({ className, size = 110, ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      aria-label="Empty State Illustration"
      role="img"
      {...props}
    >
      {/* Soft Pastel Blue Cushion / Cloud */}
      <path
        d="M24 74C16 74 12 66 16 58C12 50 18 42 26 44C30 36 42 34 48 40C56 32 70 32 78 40C86 34 98 38 100 46C108 48 112 58 106 66C110 74 102 82 92 82L28 82C25 82 24 78 24 74Z"
        fill="#C4DFEF"
        stroke="#5A554B"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Cat Head peeking behind cloud */}
      <path d="M42 34L46 16C47 14 50 14 52 17L57 30" fill="#FFF8ED" stroke="#5A554B" strokeWidth="3" />
      <path d="M45 30L48 20L53 28Z" fill="#F2A4A4" opacity="0.8" />

      <path d="M78 34L74 16C73 14 70 14 68 17L63 30" fill="#FFF8ED" stroke="#5A554B" strokeWidth="3" />
      <path d="M75 30L72 20L67 28Z" fill="#F2A4A4" opacity="0.8" />

      {/* Cat Face */}
      <circle cx="60" cy="38" r="22" fill="#FFF8ED" stroke="#5A554B" strokeWidth="3" />

      {/* Sleeping Closed Eyes */}
      <path d="M51 38C52.5 41 55.5 41 57 38" stroke="#5A554B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M63 38C64.5 41 67.5 41 69 38" stroke="#5A554B" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Nose & Mouth */}
      <polygon points="59,42 61,42 60,44" fill="#FF804E" />
      <path d="M58 45C59 46.5 60 46.5 60 45C60 46.5 61 46.5 62 45" stroke="#5A554B" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Rosy Cheeks */}
      <circle cx="48" cy="43" r="3.5" fill="#F2A4A4" opacity="0.8" />
      <circle cx="72" cy="43" r="3.5" fill="#F2A4A4" opacity="0.8" />

      {/* Paws resting on cushion */}
      <ellipse cx="48" cy="58" rx="6" ry="4.5" fill="#FFF8ED" stroke="#5A554B" strokeWidth="2.5" />
      <ellipse cx="72" cy="58" rx="6" ry="4.5" fill="#FFF8ED" stroke="#5A554B" strokeWidth="2.5" />

      {/* Floating gentle Zzz / dream sparkle */}
      <path d="M84 20L90 20L84 26L90 26" stroke="#BD4B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M92 12L96 12L92 16L96 16" stroke="#FF804E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Curious Cat with magnifying glass for Search & Discovery
 */
export function CuteCatSearch({ className, size = 100, ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      aria-label="Search Mascot"
      role="img"
      {...props}
    >
      <ellipse cx="50" cy="88" rx="28" ry="6" fill="currentColor" className="text-black/5 dark:text-white/5" />

      {/* Body */}
      <path d="M30 84C30 68 38 60 50 60C62 60 70 68 70 84Z" fill="#FFF8ED" stroke="#5A554B" strokeWidth="3" />

      {/* Ears */}
      <path d="M32 36L38 18C39 16 42 16 44 19L48 30" fill="#FFF8ED" stroke="#5A554B" strokeWidth="3" />
      <path d="M35 32L39 22L43 30Z" fill="#F2A4A4" opacity="0.8" />
      <path d="M68 36L62 18C61 16 58 16 56 19L52 30" fill="#FFF8ED" stroke="#5A554B" strokeWidth="3" />
      <path d="M65 32L61 22L57 30Z" fill="#F2A4A4" opacity="0.8" />

      {/* Head */}
      <circle cx="50" cy="40" r="22" fill="#FFF8ED" stroke="#5A554B" strokeWidth="3" />

      {/* Curious Big Round Eyes */}
      <circle cx="43" cy="40" r="4.5" fill="#5A554B" />
      <circle cx="42" cy="38.5" r="1.5" fill="#FFFFFF" />
      <circle cx="57" cy="40" r="4.5" fill="#5A554B" />
      <circle cx="56" cy="38.5" r="1.5" fill="#FFFFFF" />

      {/* Cheeks & Mouth */}
      <circle cx="36" cy="46" r="3.5" fill="#F2A4A4" opacity="0.8" />
      <circle cx="64" cy="46" r="3.5" fill="#F2A4A4" opacity="0.8" />
      <path d="M47 48C48.5 50 50 50 50 48C50 50 51.5 50 53 48" stroke="#5A554B" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Magnifying Glass */}
      <circle cx="68" cy="52" r="12" fill="#C4DFEF" fillOpacity="0.4" stroke="#5A554B" strokeWidth="3" />
      <path d="M76 60L88 72" stroke="#5A554B" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Studious Cat with glasses and open notebook for Problem & Study Contexts
 */
export function CuteCatStudy({ className, size = 100, ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      aria-label="Study Notes Mascot"
      role="img"
      {...props}
    >
      <ellipse cx="50" cy="88" rx="28" ry="6" fill="currentColor" className="text-black/5 dark:text-white/5" />

      {/* Body */}
      <path d="M30 84C30 68 38 58 50 58C62 58 70 68 70 84Z" fill="#FFF8ED" stroke="#5A554B" strokeWidth="3" />

      {/* Open Book in Paws */}
      <path
        d="M26 78C34 74 46 76 50 80C54 76 66 74 74 78L74 88C66 84 54 86 50 90C46 86 34 84 26 88Z"
        fill="#C4DFEF"
        stroke="#5A554B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Book Pages */}
      <path d="M30 80C36 78 44 79 48 82" stroke="#5A554B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M70 80C64 78 56 79 52 82" stroke="#5A554B" strokeWidth="1.5" strokeLinecap="round" />

      {/* Ears */}
      <path d="M30 36L36 16C37 14 40 14 42 17L46 28" fill="#FFF8ED" stroke="#5A554B" strokeWidth="3" />
      <path d="M33 32L37 20L41 28Z" fill="#F2A4A4" opacity="0.8" />
      <path d="M70 36L64 16C63 14 60 14 58 17L54 28" fill="#FFF8ED" stroke="#5A554B" strokeWidth="3" />
      <path d="M67 32L63 20L59 28Z" fill="#F2A4A4" opacity="0.8" />

      {/* Head */}
      <circle cx="50" cy="38" r="23" fill="#FFF8ED" stroke="#5A554B" strokeWidth="3" />

      {/* Cute Round Glasses */}
      <circle cx="42" cy="38" r="8" fill="#FFFFFF" fillOpacity="0.7" stroke="#5A554B" strokeWidth="2.5" />
      <circle cx="58" cy="38" r="8" fill="#FFFFFF" fillOpacity="0.7" stroke="#5A554B" strokeWidth="2.5" />
      <path d="M50 38L50 38" stroke="#5A554B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Friendly Eyes behind glasses */}
      <path d="M39 38C40.5 40 43.5 40 45 38" stroke="#5A554B" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M55 38C56.5 40 59.5 40 61 38" stroke="#5A554B" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Rosy Cheeks */}
      <circle cx="34" cy="45" r="3.5" fill="#F2A4A4" opacity="0.85" />
      <circle cx="66" cy="45" r="3.5" fill="#F2A4A4" opacity="0.85" />

      {/* Nose & Smile */}
      <polygon points="49,43 51,43 50,45" fill="#FF804E" />
      <path d="M47 46C48.5 48 50 48 50 46C50 48 51.5 48 53 46" stroke="#5A554B" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/**
 * Hand-drawn warm 4-point sparkle icon
 */
export function CuteSparkle({ className, size = 18, ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
        fill="#FF804E"
        stroke="#BD4B2A"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
