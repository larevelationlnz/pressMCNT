import React from 'react';

// Icon: Tableau de Bord (Colorful vertical bar chart)
export const ChartIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    {/* Base outline or decorative colorful bars like the mockup */}
    <rect x="4" y="10" width="3" height="10" rx="0.5" fill="#4caf50" stroke="#333" strokeWidth="1" />
    <rect x="10" y="5" width="3" height="15" rx="0.5" fill="#2196f3" stroke="#333" strokeWidth="1" />
    <rect x="16" y="12" width="3" height="8" rx="0.5" fill="#f44336" stroke="#333" strokeWidth="1" />
    <line x1="2" y1="21" x2="22" y2="21" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Icon: Gestion des auteurs (Group of two people silhouettes, dark/grey)
export const UsersIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    {/* Dark grey silhouette groups matching the mockup */}
    <path
      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
      fill="#333333"
      stroke="#111"
      strokeWidth="0.5"
    />
    <path
      d="M6 20V17C6 14.7909 7.79086 13 10 13H14C16.2091 13 18 14.7909 18 17V20"
      stroke="#333333"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Secondary overlapping user */}
    <path
      d="M8.5 10.5C9.88071 10.5 11 9.38071 11 8C11 6.61929 9.88071 5.5 8.5 5.5C7.11929 5.5 6 6.61929 6 8C6 9.38071 7.11929 10.5 8.5 10.5Z"
      fill="#666666"
    />
    <path
      d="M3 20V18C3 16.3431 4.34315 15 6 15"
      stroke="#666666"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Icon: Gestion des publications (Document outline)
export const DocumentIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <rect x="5" y="3" width="14" height="18" rx="2" stroke="#333" strokeWidth="1.5" />
    <line x1="8" y1="8" x2="16" y2="8" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="12" x2="16" y2="12" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="16" x2="13" y2="16" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Icon: Crayon / Edit (Pencil with yellow barrel, white eraser)
export const PencilIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    {/* Pencil body */}
    <path
      d="M19.0711 4.92893L20.4853 6.34315C21.2663 7.1242 21.2663 8.39053 20.4853 9.17157L9.17157 20.4853L4.92893 20.4853L4.92893 16.2426L16.2426 4.92893C17.0237 4.14788 18.29 4.14788 19.0711 4.92893Z"
      stroke="#333"
      strokeWidth="1.5"
      fill="#ffb300"
      strokeLinejoin="round"
    />
    {/* Eraser tip metal ring */}
    <path d="M14.8284 6.34315L17.6569 9.17157" stroke="#333" strokeWidth="1.5" />
  </svg>
);

// Icon: Corbeille / Delete (Trash can)
export const TrashIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86725 19.1425L5 7"
      stroke="#333"
      strokeWidth="1.5"
      fill="#b0bec5"
      strokeLinejoin="round"
    />
    <path d="M3 7H21" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M10 3H14C14.5523 3 15 3.44772 15 4V7H9V4C9 3.44772 9.44772 3 10 3Z"
      stroke="#333"
      strokeWidth="1.5"
      fill="#b0bec5"
      strokeLinejoin="round"
    />
  </svg>
);

// Icon: Close / Fermer
export const CloseIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Icon: Eye / Voir / Visualiser (Orange/Brown color scheme matching mockup)
export const EyeIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke="#333"
      strokeWidth="1.5"
      fill="#ffcc80"
    />
    <circle cx="12" cy="12" r="3" stroke="#333" strokeWidth="1.5" fill="#e65100" />
  </svg>
);

// Icon: Hourglass / En attente (Orange/Amber sands of time)
export const HourglassIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      d="M5 2H19M5 22H19M17 2V7.17157C17 7.70201 16.7893 8.21071 16.4142 8.58579L12.8284 12.1716C12.4379 12.5621 12.4379 13.1953 12.8284 13.5858L16.4142 17.1716C16.7893 17.5467 17 18.0554 17 18.5858V22M7 2V7.17157C7 7.70201 7.21071 8.21071 7.58579 8.58579L11.1716 12.1716C11.5621 12.5621 11.5621 13.1953 11.1716 13.5858L7.58579 17.1716C7.21071 17.5467 7 18.0554 7 18.5858V22"
      stroke="#333"
      strokeWidth="1.5"
      fill="#ffe082"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9 5H15M10 19H14" stroke="#ffb300" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Icon: CheckedBox / Publié (Green checkbox box style)
export const CheckedBoxIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <rect x="3" y="3" width="18" height="18" rx="3" fill="#4caf50" stroke="#2e7d32" strokeWidth="1.5" />
    <path
      d="M9 12L11 14L15 9"
      stroke="#ffffff"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Icon: DocPencil / Brouillon (Document with orange pencil)
export const DocPencilIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
      stroke="#333"
      strokeWidth="1.5"
      fill="#eceff1"
      strokeLinejoin="round"
    />
    <path d="M14 2V8H20" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
    {/* Pencil overlay */}
    <path
      d="M8 15L15 8L17 10L10 17H8V15Z"
      stroke="#333"
      strokeWidth="1.2"
      fill="#ffb300"
      strokeLinejoin="round"
    />
  </svg>
);

