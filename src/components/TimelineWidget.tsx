import React, { useState, useRef, useEffect } from 'react';
import Aurora from './reactbits/Aurora';
import MagicBento, { BentoItem } from './reactbits/MagicBento';
import { motion, AnimatePresence } from 'framer-motion';

const MONTHS = [
  'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV'
];

const YEARS = [2025, 2020, 2015, 2010, 2005, 2000];

// Seasonal color palettes for Aurora background
const SEASONAL_COLORS: Record<number, string[]> = {
  // Winter (Dec, Jan, Feb) - Cool blues and purples
  0: ['#1a1a3e', '#2d1b4e', '#4a148c'], // DEC
  1: ['#0d1b2a', '#1b263b', '#415a77'], // JAN
  2: ['#1a237e', '#283593', '#3949ab'], // FEB
  // Spring (Mar, Apr, May) - Greens and yellows
  3: ['#1b5e20', '#2e7d32', '#4caf50'], // MAR
  4: ['#33691e', '#558b2f', '#7cb342'], // APR
  5: ['#827717', '#9e9d24', '#c5ca33'], // MAY
  // Summer (Jun, Jul, Aug) - Warm oranges and yellows
  6: ['#e65100', '#ff6f00', '#ffa726'], // JUN
  7: ['#bf360c', '#d84315', '#ff6f00'], // JUL
  8: ['#e65100', '#f57c00', '#ffb74d'], // AUG
  // Fall (Sep, Oct, Nov) - Reds and oranges
  9: ['#b71c1c', '#c62828', '#d32f2f'], // SEP
  10: ['#d84315', '#e64a19', '#ff5722'], // OCT
  11: ['#8b0000', '#a52a2a', '#cd5c5c']  // NOV
};

// Seasonal glow colors for MagicBento (RGB format)
const SEASONAL_GLOW_COLORS: Record<number, string> = {
  0: '26, 26, 62',   // DEC - Deep blue
  1: '13, 27, 42',   // JAN - Dark blue
  2: '26, 35, 126',  // FEB - Indigo
  3: '27, 94, 32',   // MAR - Green
  4: '51, 105, 30',  // APR - Light green
  5: '130, 119, 23', // MAY - Yellow-green
  6: '230, 81, 0',   // JUN - Orange
  7: '191, 54, 12',  // JUL - Deep orange
  8: '230, 81, 0',   // AUG - Orange
  9: '183, 28, 28',  // SEP - Red
  10: '216, 67, 21', // OCT - Orange-red
  11: '139, 0, 0'    // NOV - Dark red
};

// Layout templates for different card counts
interface LayoutTemplate {
  cardCount: number;
  layouts: Array<{ colSpan: number; rowSpan: number }>;
}

const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  // 1 card layout
  {
    cardCount: 1,
    layouts: [
      { colSpan: 4, rowSpan: 4 }
    ]
  },
  // 2 card layouts
  {
    cardCount: 2,
    layouts: [
      { colSpan: 2, rowSpan: 4 },
      { colSpan: 2, rowSpan: 4 }
    ]
  },
  // 3 card layouts
  {
    cardCount: 3,
    layouts: [
      { colSpan: 2, rowSpan: 2 },
      { colSpan: 2, rowSpan: 2 },
      { colSpan: 4, rowSpan: 2 }
    ]
  },
  // 4 card layouts
  {
    cardCount: 4,
    layouts: [
      { colSpan: 2, rowSpan: 2 },
      { colSpan: 2, rowSpan: 2 },
      { colSpan: 2, rowSpan: 2 },
      { colSpan: 2, rowSpan: 2 }
    ]
  },
  // 5 card layouts
  {
    cardCount: 5,
    layouts: [
      { colSpan: 2, rowSpan: 2 },
      { colSpan: 2, rowSpan: 2 },
      { colSpan: 2, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 }
    ]
  }
];

// Generate dynamic data for each month with varied card counts (1-5) and layouts
const generateMonthData = (monthIndex: number): BentoItem[] => {
  const monthName = MONTHS[monthIndex];
  const baseColor = '#0a0a0a'; // Off-black
  
  // Vary card count from 1-5 using a deterministic pattern based on month
  // Pattern: cycles through 1, 3, 2, 5, 4, 2, 1, 4, 3, 5, 1, 3
  const cardCountPattern = [1, 3, 2, 5, 4, 2, 1, 4, 3, 5, 1, 3];
  const cardCount = cardCountPattern[monthIndex];
  
  // Get layout template for this card count
  const template = LAYOUT_TEMPLATES.find(t => t.cardCount === cardCount) || LAYOUT_TEMPLATES[2]; // Default to 3 cards
  
  // Varied content themes per month
  const themes = [
    { project: 'Infrastructure', metric: 'Uptime: 99.9%', extra: 'Security Audit', milestone: 'System Upgrade' },
    { project: 'User Experience', metric: 'NPS Score: 85', extra: 'A/B Testing', milestone: 'Design System' },
    { project: 'Performance', metric: 'Load Time: 1.2s', extra: 'CDN Optimization', milestone: 'Caching Layer' },
    { project: 'Mobile Launch', metric: 'Downloads: 10K', extra: 'App Store Featured', milestone: 'Beta Release' },
    { project: 'API Gateway', metric: 'Throughput: +40%', extra: 'Rate Limiting', milestone: 'Version 2.0' },
    { project: 'Analytics', metric: 'MAU: 50K', extra: 'Dashboard v3', milestone: 'Real-time Metrics' },
    { project: 'Localization', metric: 'Languages: 12', extra: 'EMEA Expansion', milestone: 'Translation API' },
    { project: 'AI Features', metric: 'Accuracy: 94%', extra: 'ML Pipeline', milestone: 'Model Training' },
    { project: 'DevOps', metric: 'Deploy Time: 5min', extra: 'CI/CD Upgrade', milestone: 'Auto-scaling' },
    { project: 'Content CMS', metric: 'Articles: 500+', extra: 'SEO Boost', milestone: 'Editor v2' },
    { project: 'Payments', metric: 'Revenue: +25%', extra: 'Stripe Integration', milestone: 'Multi-currency' },
    { project: 'Marketplace', metric: 'Vendors: 150', extra: 'Commission Model', milestone: 'API Access' }
  ];
  
  const theme = themes[monthIndex];
  
  // Card content templates
  const cardContents = [
    { title: `${monthName} - ${theme.project}`, description: `Focus area for this month`, label: 'Initiative' },
    { title: 'Key Metric', description: theme.metric, label: 'Performance' },
    { title: 'Progress', description: `${80 + (monthIndex * 3) % 20}% Complete`, label: 'Status' },
    { title: theme.extra, description: 'Additional deliverable', label: 'Milestone' },
    { title: theme.milestone, description: 'Major achievement', label: 'Achievement' }
  ];
  
  // Generate items based on template layout
  const items: BentoItem[] = template.layouts.map((layout, index) => ({
    color: baseColor,
    ...cardContents[index % cardContents.length],
    colSpan: layout.colSpan,
    rowSpan: layout.rowSpan
  }));

  return items;
};

const TimelineWidget: React.FC = () => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(1); // 1 = JAN
  const [currentYear, setCurrentYear] = useState(2025);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [rotation, setRotation] = useState(30); // Start at JAN (30deg)
  const [isDragging, setIsDragging] = useState(false);
  const watchRef = useRef<HTMLDivElement>(null);
  
  // Seasonal color states with smooth transitions
  const [auroraColors, setAuroraColors] = useState<string[]>(SEASONAL_COLORS[1]);
  const [glowColor, setGlowColor] = useState<string>(SEASONAL_GLOW_COLORS[1]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Snap to nearest month
    const snappedRotation = Math.round(rotation / 30) * 30;
    setRotation(snappedRotation);
    
    // Calculate month index based on snapped rotation
    // 0 deg = DEC (index 0)
    // 30 deg = JAN (index 1)
    // ...
    // Normalize rotation to 0-360
    let normalizedRot = snappedRotation % 360;
    if (normalizedRot < 0) normalizedRot += 360;
    
    const monthIndex = Math.round(normalizedRot / 30) % 12;
    setCurrentMonthIndex(monthIndex);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !watchRef.current) return;

    const rect = watchRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate angle from center to mouse
    // At top (Dec), angle should be 0.
    // Math.atan2(y, x) returns angle from X axis (right).
    // We want 0 at Y axis (top, negative Y).
    
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    
    // atan2(dy, dx) gives angle in radians from positive X axis.
    // -PI to PI.
    // We want 0 at -Y (top).
    // Top (-Y): -PI/2
    // Right (+X): 0
    // Bottom (+Y): PI/2
    // Left (-X): PI or -PI
    
    let angleRad = Math.atan2(dy, dx);
    let angleDeg = angleRad * (180 / Math.PI);
    
    // Convert to clock-wise from top
    // Top (-90 deg) -> 0
    // Right (0 deg) -> 90
    // Bottom (90 deg) -> 180
    // Left (180 deg) -> 270
    
    let clockAngle = angleDeg + 90;
    if (clockAngle < 0) clockAngle += 360;
    
    setRotation(clockAngle);
    
    // Update month while dragging for live feedback
    const monthIndex = Math.round(clockAngle / 30) % 12;
    if (monthIndex !== currentMonthIndex) {
      setCurrentMonthIndex(monthIndex);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentMonthIndex]);

  // Handle month changes with smooth color transitions
  useEffect(() => {
    const newColors = SEASONAL_COLORS[currentMonthIndex] || SEASONAL_COLORS[1];
    const newGlowColor = SEASONAL_GLOW_COLORS[currentMonthIndex] || SEASONAL_GLOW_COLORS[1];
    
    // Smooth transition for colors
    setAuroraColors(newColors);
    setGlowColor(newGlowColor);
  }, [currentMonthIndex]);

  const currentData = generateMonthData(currentMonthIndex);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-mono text-green-500 selection:bg-green-900 selection:text-white">
      {/* Background Aurora */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ opacity: 0.85 }}
        animate={{ opacity: 0.85 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <Aurora 
          colorStops={auroraColors}
          amplitude={1.4}
          blend={0.7}
        />
      </motion.div>

      {/* Grid Overlay for Terminal Feel */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full p-8 gap-12">
        
        {/* Watch Face Section */}
        <div className="relative flex-shrink-0 w-[80vw] h-[80vw] max-w-[300px] max-h-[300px] md:max-w-[400px] md:max-h-[400px]" ref={watchRef}>
          {/* Month Labels */}
          {MONTHS.map((month, i) => {
            const angle = i * 30;
            const radius = 170; // Distance from center
            // Convert angle to radians, subtract 90deg to start from top
            const rad = (angle - 90) * (Math.PI / 180);
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            
            const isSelected = i === currentMonthIndex;

            return (
              <div
                key={month}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 lowercase ${isSelected ? 'text-2xl font-bold text-[#00ff00] drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]' : 'text-lg text-[#00cc00]'}`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  fontFamily: '"Orbitron", sans-serif'
                }}
              >
                {month}
              </div>
            );
          })}

          {/* Hour Hand */}
          <div 
            className={`absolute top-1/2 left-1/2 w-1 h-32 bg-green-500 origin-bottom hover:brightness-125 transition-colors z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Hand Tip/Decoration */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 border-2 border-green-500 rounded-full bg-black"></div>
          </div>
          
          {/* Center Pivot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[0.25rem] h-[0.25rem] bg-green-500 rounded-full shadow-[0_0_10px_rgba(0,255,0,0.8)] pointer-events-none z-30"></div>

          {/* Center Info - Moved below hour hand (z-index lower than hand) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto z-10 pt-16">
            <h2 className="text-lg tracking-widest font-thin text-white font-sans mb-1">ALBERT VARGAS</h2>
            
            {/* Year Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="flex items-center text-lg font-normal text-white hover:text-green-400 transition-colors"
                style={{ fontFamily: '"Orbitron", sans-serif' }}
              >
                {currentYear}
                <svg className={`w-5 h-5 ml-2 transform transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {isYearDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-32 bg-black border border-green-500 rounded-md shadow-[0_0_15px_rgba(0,255,0,0.3)] overflow-hidden z-50"
                  >
                    {YEARS.map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setCurrentYear(year);
                          setIsYearDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-center hover:bg-green-900/30 transition-colors ${year === currentYear ? 'text-green-400 font-bold' : 'text-green-600'}`}
                        style={{ fontFamily: '"Orbitron", sans-serif' }}
                      >
                        {year}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bento Grid Section */}
        <div className="w-full max-w-2xl h-[400px] md:h-[500px]">
          <MagicBento 
            items={currentData}
            glowColor={glowColor}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            spotlightRadius={200}
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineWidget;
