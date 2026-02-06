/**
 * AVEMO Fahrersoftware - Magnum Opus Presentation v2
 * 
 * REDESIGNED with Modern Web Design Standards:
 * - Distinctive typography (Montserrat + Source Sans Pro)
 * - Atmospheric backgrounds with layered depth
 * - Proper shadows and elevation
 * - Asymmetric, unexpected compositions
 * - Visual memorability on every slide
 */

import React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import {
  Presentation,
  Slide,
  Text,
  Shape,
  render,
} from 'react-pptx-extended';

import {
  SLIDE,
  SPACING,
  RADIUS,
} from './theme/layout';

import {
  GRAY,
  ORANGE,
} from './theme/colors';

// ===========================================
// MODERN DESIGN SYSTEM
// ===========================================

const FONTS = {
  // Distinctive display font - geometric, modern, bold
  DISPLAY: 'Montserrat',
  // Clean body font that complements display
  BODY: 'Source Sans Pro',
  // Metric font for numbers
  METRIC: 'Montserrat',
};

const THEME = {
  // Rich, deep backgrounds
  bg: '#0d0d0f',           // Near black with subtle warmth
  bgAlt: '#141418',        // Slightly lighter for layers
  bgCard: '#1a1a1f',       // Card background
  bgElevated: '#222228',   // Elevated card
  
  // Gradient overlay colors (for atmosphere)
  gradientLight: 'rgba(255,85,10,0.08)',  // Subtle orange glow
  gradientDark: 'rgba(0,0,0,0.6)',
  
  // Text colors
  text: '#ffffff',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  textOnAccent: '#000000',
  
  // Accent - Bold AVEMO orange
  accent: '#ff550a',
  accentLight: '#ff7733',
  accentDark: '#cc4408',
  
  // Supporting colors
  border: '#2d2d35',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

// Shadow presets for elevation
const SHADOWS = {
  // Card elevation - subtle, diffuse
  card: {
    type: 'outer' as const,
    blur: 12,
    offset: 6,
    angle: 50,
    color: '000000',
    opacity: 0.4,
  },
  // Elevated card - more pronounced
  elevated: {
    type: 'outer' as const,
    blur: 20,
    offset: 10,
    angle: 50,
    color: '000000',
    opacity: 0.5,
  },
  // Accent glow
  accentGlow: {
    type: 'outer' as const,
    blur: 30,
    offset: 0,
    angle: 0,
    color: 'ff550a',
    opacity: 0.3,
  },
  // Text shadow for depth
  text: {
    type: 'outer' as const,
    blur: 4,
    offset: 2,
    angle: 45,
    color: '000000',
    opacity: 0.3,
  },
};

// ===========================================
// CONTENT DATA (unchanged)
// ===========================================

const content = {
  title: 'Fahrersoftware',
  subtitle: 'Vorstellung in der Geschäftsführerrunde',
  company: 'AVEMO Group',
  
  agenda: [
    { num: '01', title: 'Aktuelle Situation', desc: 'Herausforderungen in der AVEMO Group' },
    { num: '02', title: 'Die Zukunft', desc: 'Vision mit der Fahrersoftware' },
    { num: '03', title: 'Highlights', desc: 'PoC, Konzept & MVP' },
    { num: '04', title: 'Business Case', desc: 'ROI und Einsparungen' },
  ],
  
  problems: {
    mainIssues: [
      {
        title: 'Isolierte Standorte',
        points: [
          'Jeder Standort hat seinen eigenen Fahrdienst',
          'Es werden keine Synergien genutzt',
        ],
      },
      {
        title: 'Manuelle Prozesse',
        points: [
          'Einplanung erfolgt in Outlook und Excel',
          'Gleiche Inhalte in mehreren Listen eintragen',
        ],
      },
      {
        title: 'Fehlende Transparenz',
        points: [
          'Kein Reporting möglich',
          'Keine KPIs für effizienten Fahrereinsatz',
        ],
      },
      {
        title: 'Dokumentenprobleme',
        points: [
          'Unterlagen unvollständig oder verloren',
          'Verspätete Abgabe in der Dispo',
        ],
      },
    ],
    
    criticalIssues: [
      { text: 'Leerlaufzeiten nicht messbar und nicht ausgenutzt' },
      { text: 'Keine Abstimmung zwischen Standorten im Rhein-Main-Gebiet' },
      { text: 'Kompetente Fahrer nicht optimal eingesetzt' },
      { text: 'Schlechte Updates an Kunden über Lieferstatus' },
    ],
  },
  
  vision: {
    tagline: 'Eine Software. Alle Standorte.',
    benefits: [
      { title: 'Synergien schaffen', desc: 'Gruppenübergreifende Vernetzung der Fahrdienste', icon: '1' },
      { title: 'Effizienz steigern', desc: 'Großes Einsparpotential und mehr Fahrten', icon: '2' },
      { title: 'Kapazitäten schaffen', desc: 'Ohne neues Personal bei höheren Stückzahlen', icon: '3' },
      { title: 'Professioneller Auftritt', desc: 'Innovatives Image vor dem Kunden', icon: '4' },
    ],
    outcomes: [
      'KPIs sichtbar machen',
      'Optimaler Fahrereinsatz',
      'Transparente Abrechnungen',
      'Automationen in der Abwicklung',
      'Maximale Bonusausschöpfung',
      'Reduzierung der Standzeiten',
    ],
  },
  
  poc: {
    goal: 'Nachweis, dass ein automatisierter Tagesplan für einen vollständigen Monat erstellt werden kann',
    optimization: [
      'Maximale Auslastung interner Fahrer',
      'Minimierung der Gesamtkosten',
      'Externe Dienstleister nur bei Engpässen',
      'Qualifikation & Zeitfenster berücksichtigen',
    ],
    dataInputs: [
      'Fahrtenkatalog (ABA, AB, BA)',
      'Fahrerprofil mit Verfügbarkeit',
      'Anbindung GeNesys und KDV',
      'Routing-Provider Integration',
    ],
  },
  
  mvp: {
    coreFeatures: [
      { num: '01', title: 'Web-Backoffice', desc: 'Dispo-Planung, Monitoring' },
      { num: '02', title: 'Fahrer-App', desc: 'Tagesübersicht, Protokolle' },
      { num: '03', title: 'Auto-Planung', desc: 'Optimierung nach Kosten' },
      { num: '04', title: 'Ext. Dienstleister', desc: 'Portal für Zuweisung' },
      { num: '05', title: 'Live-Monitoring', desc: 'Status aller Fahrten' },
      { num: '06', title: 'Reporting', desc: 'Dashboards & Exporte' },
    ],
    epics: [
      { title: 'Authentifizierung', desc: 'Benutzerverwaltung, Rollen' },
      { title: 'Fahrer-Management', desc: 'Qualifikation, Import KDV' },
      { title: 'Auftragsdaten', desc: 'GeNesys-Integration' },
      { title: 'Disposition', desc: 'Automatische Zuordnung' },
      { title: 'Fahrer-App', desc: 'Flows, Offline-Sync' },
      { title: 'Monitoring', desc: 'Live-Status, Alerts' },
    ],
  },
  
  businessCase: {
    description: 'Der Kunde wird per Mail aufgefordert, sein Neufahrzeug online zu terminieren',
    customerInputs: ['Wunschtermin', 'Wunschkennzeichen', 'Zieladresse'],
    savings: {
      total: '260.000 €',
      perVehicle: '1 Stunde',
      vehicles: '8.000',
      hourlyRate: '32,40 €',
      fte: '4 Mitarbeiter',
    },
  },
  
  closing: {
    title: 'Nächste Schritte',
    cta: 'Gemeinsam die Fahrzeugdisposition der AVEMO Group transformieren.',
  },
};

// ===========================================
// REUSABLE DESIGN COMPONENTS
// ===========================================

// Atmospheric background layers for depth
const AtmosphericBackground = () => (
  <>
    {/* Base dark background */}
    {/* Large diagonal accent shape - creates energy and asymmetry */}
    <Shape type="rect" style={{
      x: 7, y: -1, w: 5, h: 8,
      backgroundColor: 'rgba(255,85,10,0.04)',
      rotate: 15,
    }} />
    {/* Subtle corner glow */}
    <Shape type="ellipse" style={{
      x: -2, y: -2, w: 6, h: 6,
      backgroundColor: 'rgba(255,85,10,0.03)',
    }} />
    {/* Top edge accent line */}
    <Shape type="rect" style={{
      x: 0, y: 0, w: SLIDE.WIDTH, h: 0.04,
      backgroundColor: THEME.accent,
    }} />
  </>
);

// Section label with modern styling
const SectionLabel = ({ num, title, y = 0.4 }: { num: string; title: string; y?: number }) => (
  <>
    <Text style={{
      x: 0.6, y,
      w: 0.4, h: 0.3,
      fontSize: 11, bold: true, fontFace: FONTS.DISPLAY,
      color: THEME.accent,
    }}>
      {num}
    </Text>
    <Text style={{
      x: 1.0, y,
      w: 3, h: 0.3,
      fontSize: 11, fontFace: FONTS.BODY,
      color: THEME.textSecondary,
    }}>
      {title.toUpperCase()}
    </Text>
  </>
);

// Elevated card with shadow
const ElevatedCard = ({ 
  x, y, w, h, 
  children,
  accentTop = false,
  accentLeft = false,
}: { 
  x: number; y: number; w: number; h: number;
  children?: React.ReactNode;
  accentTop?: boolean;
  accentLeft?: boolean;
}) => (
  <>
    <Shape type="roundRect" style={{
      x, y, w, h,
      backgroundColor: THEME.bgCard,
      rectRadius: 0.08,
      shadow: SHADOWS.card,
    }} />
    {accentTop && (
      <Shape type="rect" style={{
        x, y, w, h: 0.05,
        backgroundColor: THEME.accent,
      }} />
    )}
    {accentLeft && (
      <Shape type="rect" style={{
        x, y: y + 0.1, w: 0.05, h: h - 0.2,
        backgroundColor: THEME.accent,
      }} />
    )}
  </>
);

// ===========================================
// MAGNUM OPUS v2 - REDESIGNED
// ===========================================

const MagnumOpusV2 = () => {
  return (
    <Presentation layout="16x9" title="Fahrersoftware - AVEMO Group" author="AVEMO Group">
      
      {/* ============================================
          SLIDE 1: TITLE - Asymmetric, Bold, Memorable
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        
        {/* Large geometric accent block - HERO ELEMENT */}
        <Shape type="rect" style={{
          x: 6.5, y: 1.2, w: 4, h: 3.5,
          backgroundColor: THEME.accent,
          shadow: SHADOWS.elevated,
          rotate: -3,
        }} />
        
        {/* Main title - positioned at golden ratio */}
        <Text style={{
          x: 0.6, y: 1.8,
          w: 6.5, h: 1.4,
          fontSize: 56, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
          shadow: SHADOWS.text,
        }}>
          Fahrer{'\n'}software
        </Text>
        
        {/* Subtitle - left aligned, clear hierarchy */}
        <Text style={{
          x: 0.6, y: 3.4,
          w: 5.5, h: 0.5,
          fontSize: 18, fontFace: FONTS.BODY,
          color: THEME.textSecondary,
        }}>
          {content.subtitle}
        </Text>
        
        {/* Accent underline */}
        <Shape type="rect" style={{
          x: 0.6, y: 4.0, w: 1.2, h: 0.06,
          backgroundColor: THEME.accent,
        }} />
        
        {/* Company branding - bottom left */}
        <Text style={{
          x: 0.6, y: 5.0,
          w: 3, h: 0.3,
          fontSize: 11, fontFace: FONTS.BODY,
          color: THEME.textMuted,
        }}>
          {content.company}
        </Text>
        
        {/* Date/context on the orange block */}
        <Text style={{
          x: 7, y: 3.8,
          w: 3, h: 0.4,
          fontSize: 14, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.textOnAccent,
        }}>
          2024
        </Text>
      </Slide>

      {/* ============================================
          SLIDE 2: AGENDA - Diagonal flow, visual rhythm
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        
        {/* Section header */}
        <Text style={{
          x: 0.6, y: 0.5,
          w: 4, h: 0.6,
          fontSize: 32, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          Agenda
        </Text>
        
        {/* Diagonal accent element */}
        <Shape type="rect" style={{
          x: 8.5, y: 0.2, w: 2, h: 0.15,
          backgroundColor: THEME.accent,
          rotate: -45,
        }} />
        
        {/* Agenda items with staggered layout */}
        {content.agenda.map((item, i) => {
          const x = 0.6 + (i * 0.15); // Slight diagonal offset
          const y = 1.4 + i * 1.0;
          
          return (
            <React.Fragment key={i}>
              {/* Large number - hero moment for each section */}
              <Text style={{
                x, y,
                w: 0.9, h: 0.7,
                fontSize: 36, bold: true, fontFace: FONTS.METRIC,
                color: THEME.accent,
              }}>
                {item.num}
              </Text>
              
              {/* Title */}
              <Text style={{
                x: x + 1.0, y: y + 0.05,
                w: 4, h: 0.4,
                fontSize: 18, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.text,
              }}>
                {item.title}
              </Text>
              
              {/* Description */}
              <Text style={{
                x: x + 1.0, y: y + 0.45,
                w: 5, h: 0.35,
                fontSize: 12, fontFace: FONTS.BODY,
                color: THEME.textSecondary,
              }}>
                {item.desc}
              </Text>
              
              {/* Connecting line */}
              {i < content.agenda.length - 1 && (
                <Shape type="rect" style={{
                  x: x + 0.4, y: y + 0.85, w: 0.02, h: 0.3,
                  backgroundColor: THEME.border,
                }} />
              )}
            </React.Fragment>
          );
        })}
        
        {/* Visual rhythm element - vertical accent bar */}
        <Shape type="rect" style={{
          x: 9.2, y: 1.4, w: 0.08, h: 3.5,
          backgroundColor: THEME.accent,
          shadow: SHADOWS.accentGlow,
        }} />
      </Slide>

      {/* ============================================
          SLIDE 3: PROBLEMS - Elevated cards, clear hierarchy
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="01" title="Aktuelle Situation" />
        
        <Text style={{
          x: 0.6, y: 0.85,
          w: 8, h: 0.6,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          Herausforderungen in der Fahrerplanung
        </Text>
        
        {/* 2x2 Problem cards with shadows and accents */}
        {content.problems.mainIssues.map((issue, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 0.6 + col * 4.65;
          const y = 1.6 + row * 1.75;
          const cardW = 4.45;
          const cardH = 1.55;
          
          return (
            <React.Fragment key={i}>
              {/* Card with shadow */}
              <Shape type="roundRect" style={{
                x, y, w: cardW, h: cardH,
                backgroundColor: THEME.bgCard,
                rectRadius: 0.1,
                shadow: SHADOWS.card,
              }} />
              
              {/* Left accent bar */}
              <Shape type="rect" style={{
                x, y: y + 0.15, w: 0.06, h: cardH - 0.3,
                backgroundColor: THEME.accent,
              }} />
              
              {/* Title */}
              <Text style={{
                x: x + 0.25, y: y + 0.2,
                w: cardW - 0.4, h: 0.4,
                fontSize: 15, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.text,
              }}>
                {issue.title}
              </Text>
              
              {/* Points */}
              {issue.points.map((point, j) => (
                <Text key={j} style={{
                  x: x + 0.25, y: y + 0.65 + j * 0.35,
                  w: cardW - 0.4, h: 0.3,
                  fontSize: 10, fontFace: FONTS.BODY,
                  color: THEME.textSecondary,
                }}>
                  {point}
                </Text>
              ))}
            </React.Fragment>
          );
        })}
      </Slide>

      {/* ============================================
          SLIDE 4: KEY METRICS - Hero number, dramatic
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="01" title="Aktuelle Situation" />
        
        <Text style={{
          x: 0.6, y: 0.85,
          w: 8, h: 0.5,
          fontSize: 24, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          Die Zahlen sprechen für sich
        </Text>
        
        {/* HERO METRIC - Large orange block with number */}
        <Shape type="roundRect" style={{
          x: 0.6, y: 1.5, w: 4.2, h: 3.2,
          backgroundColor: THEME.accent,
          rectRadius: 0.12,
          shadow: SHADOWS.elevated,
        }} />
        
        {/* The big number */}
        <Text style={{
          x: 0.8, y: 1.7,
          w: 3.8, h: 1.8,
          fontSize: 120, bold: true, fontFace: FONTS.METRIC,
          color: THEME.textOnAccent,
        }}>
          30
        </Text>
        
        <Text style={{
          x: 0.8, y: 3.5,
          w: 3.8, h: 0.5,
          fontSize: 24, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.textOnAccent,
        }}>
          Tage
        </Text>
        
        <Text style={{
          x: 0.8, y: 4.0,
          w: 3.8, h: 0.4,
          fontSize: 12, fontFace: FONTS.BODY,
          color: 'rgba(0,0,0,0.7)',
        }}>
          bis ein Fahrzeug ausgeliefert wird
        </Text>
        
        {/* Secondary metrics - vertical stack with cards */}
        {[
          { value: '2,5h', label: 'Leerlaufzeit pro Tag' },
          { value: '8.000', label: 'Fahrzeuge pro Jahr' },
          { value: '3,5h', label: 'pro Fahrzeug Bearbeitung' },
        ].map((m, i) => (
          <React.Fragment key={i}>
            <Shape type="roundRect" style={{
              x: 5.2, y: 1.5 + i * 1.15, w: 4.3, h: 1.0,
              backgroundColor: THEME.bgCard,
              rectRadius: 0.08,
              shadow: SHADOWS.card,
            }} />
            <Text style={{
              x: 5.45, y: 1.6 + i * 1.15,
              w: 2, h: 0.55,
              fontSize: 28, bold: true, fontFace: FONTS.METRIC,
              color: THEME.text,
            }}>
              {m.value}
            </Text>
            <Text style={{
              x: 5.45, y: 2.1 + i * 1.15,
              w: 4, h: 0.3,
              fontSize: 10, fontFace: FONTS.BODY,
              color: THEME.textSecondary,
            }}>
              {m.label}
            </Text>
          </React.Fragment>
        ))}
      </Slide>

      {/* ============================================
          SLIDE 5: CRITICAL ISSUES - Warning emphasis
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="01" title="Aktuelle Situation" />
        
        <Text style={{
          x: 0.6, y: 0.85,
          w: 8, h: 0.5,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          Kritische Schwachstellen
        </Text>
        
        {/* Issue cards with warning styling */}
        {content.problems.criticalIssues.map((issue, i) => (
          <React.Fragment key={i}>
            <Shape type="roundRect" style={{
              x: 0.6, y: 1.5 + i * 0.95,
              w: 8.8, h: 0.8,
              backgroundColor: THEME.bgCard,
              rectRadius: 0.08,
              shadow: SHADOWS.card,
            }} />
            
            {/* Warning badge */}
            <Shape type="roundRect" style={{
              x: 0.8, y: 1.65 + i * 0.95,
              w: 0.5, h: 0.5,
              backgroundColor: THEME.warning,
              rectRadius: 0.08,
            }} />
            <Text style={{
              x: 0.88, y: 1.72 + i * 0.95,
              w: 0.35, h: 0.35,
              fontSize: 16, bold: true, fontFace: FONTS.DISPLAY,
              color: THEME.bg,
              align: 'center',
            }}>
              !
            </Text>
            
            {/* Issue text */}
            <Text style={{
              x: 1.5, y: 1.72 + i * 0.95,
              w: 7.7, h: 0.4,
              fontSize: 13, fontFace: FONTS.BODY,
              color: THEME.text,
            }}>
              {issue.text}
            </Text>
          </React.Fragment>
        ))}
        
        {/* Bottom accent bar */}
        <Shape type="rect" style={{
          x: 0.6, y: 5.0, w: 2, h: 0.06,
          backgroundColor: THEME.accent,
        }} />
      </Slide>

      {/* ============================================
          SLIDE 6: VISION - Bold statement, benefits
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="02" title="Die Zukunft" />
        
        {/* Hero tagline */}
        <Text style={{
          x: 0.6, y: 0.85,
          w: 9, h: 0.7,
          fontSize: 32, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          {content.vision.tagline}
        </Text>
        
        {/* Orange accent underline */}
        <Shape type="rect" style={{
          x: 0.6, y: 1.5, w: 3, h: 0.08,
          backgroundColor: THEME.accent,
        }} />
        
        {/* Benefits - 2x2 with overlapping design */}
        {content.vision.benefits.map((benefit, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 0.6 + col * 4.65;
          const y = 1.8 + row * 1.65;
          const cardW = 4.45;
          const cardH = 1.45;
          
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y, w: cardW, h: cardH,
                backgroundColor: THEME.bgCard,
                rectRadius: 0.1,
                shadow: SHADOWS.card,
              }} />
              
              {/* Number circle - overlapping top-left */}
              <Shape type="ellipse" style={{
                x: x + 0.15, y: y + 0.15,
                w: 0.5, h: 0.5,
                backgroundColor: THEME.accent,
                shadow: SHADOWS.card,
              }} />
              <Text style={{
                x: x + 0.27, y: y + 0.22,
                w: 0.3, h: 0.35,
                fontSize: 14, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.textOnAccent,
                align: 'center',
              }}>
                {benefit.icon}
              </Text>
              
              {/* Title */}
              <Text style={{
                x: x + 0.8, y: y + 0.2,
                w: 3.5, h: 0.4,
                fontSize: 14, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.text,
              }}>
                {benefit.title}
              </Text>
              
              {/* Description */}
              <Text style={{
                x: x + 0.2, y: y + 0.75,
                w: cardW - 0.4, h: 0.5,
                fontSize: 11, fontFace: FONTS.BODY,
                color: THEME.textSecondary,
              }}>
                {benefit.desc}
              </Text>
            </React.Fragment>
          );
        })}
      </Slide>

      {/* ============================================
          SLIDE 7: OUTCOMES - Checklist style with highlight
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="02" title="Die Zukunft" />
        
        <Text style={{
          x: 0.6, y: 0.85,
          w: 6, h: 0.5,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          Erwartete Ergebnisse
        </Text>
        
        {/* Outcomes in 2 columns */}
        {content.vision.outcomes.map((outcome, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 0.6 + col * 4.65;
          const y = 1.5 + row * 0.65;
          
          return (
            <React.Fragment key={i}>
              {/* Check circle */}
              <Shape type="ellipse" style={{
                x, y: y + 0.05,
                w: 0.25, h: 0.25,
                backgroundColor: THEME.accent,
              }} />
              <Text style={{
                x: x + 0.4, y,
                w: 4, h: 0.4,
                fontSize: 13, fontFace: FONTS.BODY,
                color: THEME.text,
              }}>
                {outcome}
              </Text>
            </React.Fragment>
          );
        })}
        
        {/* Highlight box - overlapping bottom */}
        <Shape type="roundRect" style={{
          x: 0.6, y: 3.7,
          w: 8.8, h: 1.4,
          backgroundColor: THEME.accent,
          rectRadius: 0.12,
          shadow: SHADOWS.elevated,
        }} />
        
        <Text style={{
          x: 0.9, y: 3.9,
          w: 8.2, h: 0.4,
          fontSize: 16, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.textOnAccent,
        }}>
          Professioneller Auftritt vor Kunde
        </Text>
        <Text style={{
          x: 0.9, y: 4.35,
          w: 8.2, h: 0.5,
          fontSize: 12, fontFace: FONTS.BODY,
          color: 'rgba(0,0,0,0.7)',
        }}>
          Innovatives Image durch moderne Technologie und transparente Kommunikation
        </Text>
      </Slide>

      {/* ============================================
          SLIDE 8: POC - Technical details with structure
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="03" title="Highlights" />
        
        <Text style={{
          x: 0.6, y: 0.85,
          w: 8, h: 0.5,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          PoC: Planungsalgorithmus
        </Text>
        
        {/* Goal card - prominent */}
        <Shape type="roundRect" style={{
          x: 0.6, y: 1.5,
          w: 8.8, h: 1.0,
          backgroundColor: THEME.bgCard,
          rectRadius: 0.1,
          shadow: SHADOWS.card,
        }} />
        <Text style={{
          x: 0.85, y: 1.6,
          w: 1, h: 0.25,
          fontSize: 9, bold: true, fontFace: FONTS.BODY,
          color: THEME.accent,
        }}>
          ZIEL
        </Text>
        <Text style={{
          x: 0.85, y: 1.85,
          w: 8.3, h: 0.5,
          fontSize: 12, fontFace: FONTS.BODY,
          color: THEME.text,
        }}>
          {content.poc.goal}
        </Text>
        
        {/* Two columns */}
        <Shape type="roundRect" style={{
          x: 0.6, y: 2.7, w: 4.25, h: 2.4,
          backgroundColor: THEME.bgCard,
          rectRadius: 0.1,
          shadow: SHADOWS.card,
        }} />
        <Shape type="rect" style={{
          x: 0.6, y: 2.7, w: 4.25, h: 0.05,
          backgroundColor: THEME.accent,
        }} />
        <Text style={{
          x: 0.85, y: 2.85,
          w: 4, h: 0.25,
          fontSize: 10, bold: true, fontFace: FONTS.BODY,
          color: THEME.accent,
        }}>
          OPTIMIERUNGSLOGIK
        </Text>
        {content.poc.optimization.map((item, i) => (
          <React.Fragment key={i}>
            <Shape type="ellipse" style={{
              x: 0.85, y: 3.25 + i * 0.45,
              w: 0.12, h: 0.12,
              backgroundColor: THEME.accent,
            }} />
            <Text style={{
              x: 1.1, y: 3.2 + i * 0.45,
              w: 3.6, h: 0.35,
              fontSize: 10, fontFace: FONTS.BODY,
              color: THEME.textSecondary,
            }}>
              {item}
            </Text>
          </React.Fragment>
        ))}
        
        <Shape type="roundRect" style={{
          x: 5.15, y: 2.7, w: 4.25, h: 2.4,
          backgroundColor: THEME.bgCard,
          rectRadius: 0.1,
          shadow: SHADOWS.card,
        }} />
        <Shape type="rect" style={{
          x: 5.15, y: 2.7, w: 4.25, h: 0.05,
          backgroundColor: THEME.accent,
        }} />
        <Text style={{
          x: 5.4, y: 2.85,
          w: 4, h: 0.25,
          fontSize: 10, bold: true, fontFace: FONTS.BODY,
          color: THEME.accent,
        }}>
          DATENBASIS
        </Text>
        {content.poc.dataInputs.map((item, i) => (
          <React.Fragment key={i}>
            <Shape type="ellipse" style={{
              x: 5.4, y: 3.25 + i * 0.45,
              w: 0.12, h: 0.12,
              backgroundColor: THEME.accent,
            }} />
            <Text style={{
              x: 5.65, y: 3.2 + i * 0.45,
              w: 3.6, h: 0.35,
              fontSize: 10, fontFace: FONTS.BODY,
              color: THEME.textSecondary,
            }}>
              {item}
            </Text>
          </React.Fragment>
        ))}
      </Slide>

      {/* ============================================
          SLIDE 9: MVP FEATURES - Modern card grid
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="03" title="Highlights" />
        
        <Text style={{
          x: 0.6, y: 0.85,
          w: 8, h: 0.5,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          MVP: Kernfunktionen
        </Text>
        
        {/* 3x2 feature grid */}
        {content.mvp.coreFeatures.map((feature, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const cardW = 2.85;
          const cardH = 1.45;
          const x = 0.6 + col * (cardW + 0.22);
          const y = 1.5 + row * (cardH + 0.2);
          
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y, w: cardW, h: cardH,
                backgroundColor: THEME.bgCard,
                rectRadius: 0.1,
                shadow: SHADOWS.card,
              }} />
              
              {/* Feature number */}
              <Text style={{
                x: x + 0.15, y: y + 0.12,
                w: 0.8, h: 0.4,
                fontSize: 20, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.accent,
              }}>
                {feature.num}
              </Text>
              
              {/* Title */}
              <Text style={{
                x: x + 0.15, y: y + 0.55,
                w: cardW - 0.3, h: 0.35,
                fontSize: 12, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.text,
              }}>
                {feature.title}
              </Text>
              
              {/* Description */}
              <Text style={{
                x: x + 0.15, y: y + 0.9,
                w: cardW - 0.3, h: 0.4,
                fontSize: 9, fontFace: FONTS.BODY,
                color: THEME.textSecondary,
              }}>
                {feature.desc}
              </Text>
            </React.Fragment>
          );
        })}
      </Slide>

      {/* ============================================
          SLIDE 10: MVP EPICS - Development roadmap
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="03" title="Highlights" />
        
        <Text style={{
          x: 0.6, y: 0.85,
          w: 8, h: 0.5,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          MVP: Entwicklungs-Epics
        </Text>
        
        {/* 3x2 epic grid with top accent */}
        {content.mvp.epics.map((epic, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const cardW = 2.85;
          const cardH = 1.45;
          const x = 0.6 + col * (cardW + 0.22);
          const y = 1.5 + row * (cardH + 0.2);
          
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y, w: cardW, h: cardH,
                backgroundColor: THEME.bgCard,
                rectRadius: 0.1,
                shadow: SHADOWS.card,
              }} />
              
              {/* Top accent line */}
              <Shape type="rect" style={{
                x, y, w: cardW, h: 0.05,
                backgroundColor: THEME.accent,
              }} />
              
              {/* Title */}
              <Text style={{
                x: x + 0.15, y: y + 0.2,
                w: cardW - 0.3, h: 0.35,
                fontSize: 13, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.text,
              }}>
                {epic.title}
              </Text>
              
              {/* Description */}
              <Text style={{
                x: x + 0.15, y: y + 0.6,
                w: cardW - 0.3, h: 0.7,
                fontSize: 10, fontFace: FONTS.BODY,
                color: THEME.textSecondary,
              }}>
                {epic.desc}
              </Text>
            </React.Fragment>
          );
        })}
      </Slide>

      {/* ============================================
          SLIDE 11: BUSINESS CASE - Impactful ROI
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="04" title="Business Case" />
        
        <Text style={{
          x: 0.6, y: 0.85,
          w: 8, h: 0.5,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          ROI: Online-Terminierung
        </Text>
        
        {/* Left - Description card */}
        <Shape type="roundRect" style={{
          x: 0.6, y: 1.5, w: 4.2, h: 3.5,
          backgroundColor: THEME.bgCard,
          rectRadius: 0.12,
          shadow: SHADOWS.card,
        }} />
        
        <Text style={{
          x: 0.85, y: 1.7,
          w: 3.7, h: 0.7,
          fontSize: 11, fontFace: FONTS.BODY,
          color: THEME.textSecondary,
        }}>
          {content.businessCase.description}
        </Text>
        
        <Text style={{
          x: 0.85, y: 2.5,
          w: 3, h: 0.25,
          fontSize: 9, bold: true, fontFace: FONTS.BODY,
          color: THEME.accent,
        }}>
          KUNDENANGABEN
        </Text>
        
        {content.businessCase.customerInputs.map((input, i) => (
          <React.Fragment key={i}>
            <Shape type="ellipse" style={{
              x: 0.85, y: 2.9 + i * 0.4,
              w: 0.15, h: 0.15,
              backgroundColor: THEME.accent,
            }} />
            <Text style={{
              x: 1.15, y: 2.85 + i * 0.4,
              w: 3.4, h: 0.3,
              fontSize: 11, fontFace: FONTS.BODY,
              color: THEME.text,
            }}>
              {input}
            </Text>
          </React.Fragment>
        ))}
        
        {/* Right - BIG ROI Card */}
        <Shape type="roundRect" style={{
          x: 5.1, y: 1.5, w: 4.4, h: 3.5,
          backgroundColor: THEME.accent,
          rectRadius: 0.12,
          shadow: SHADOWS.elevated,
        }} />
        
        {/* The big number */}
        <Text style={{
          x: 5.3, y: 1.7,
          w: 4, h: 1.2,
          fontSize: 52, bold: true, fontFace: FONTS.METRIC,
          color: THEME.textOnAccent,
        }}>
          260.000€
        </Text>
        
        <Text style={{
          x: 5.3, y: 2.85,
          w: 4, h: 0.35,
          fontSize: 14, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.textOnAccent,
        }}>
          jährliche Einsparung
        </Text>
        
        {/* Divider */}
        <Shape type="rect" style={{
          x: 5.3, y: 3.35, w: 4, h: 0.02,
          backgroundColor: 'rgba(0,0,0,0.2)',
        }} />
        
        {/* Breakdown */}
        <Text style={{
          x: 5.3, y: 3.55,
          w: 2, h: 0.25,
          fontSize: 10, fontFace: FONTS.BODY,
          color: THEME.textOnAccent,
        }}>
          1h Ersparnis/Fahrzeug
        </Text>
        <Text style={{
          x: 7.3, y: 3.55,
          w: 2, h: 0.25,
          fontSize: 10, fontFace: FONTS.BODY,
          color: THEME.textOnAccent,
          align: 'right',
        }}>
          8.000 Fahrzeuge
        </Text>
        
        <Text style={{
          x: 5.3, y: 3.9,
          w: 2, h: 0.25,
          fontSize: 10, fontFace: FONTS.BODY,
          color: THEME.textOnAccent,
        }}>
          32,40€ Stundenlohn
        </Text>
        <Text style={{
          x: 7.3, y: 3.9,
          w: 2, h: 0.25,
          fontSize: 10, fontFace: FONTS.BODY,
          color: THEME.textOnAccent,
          align: 'right',
        }}>
          = 4 Mitarbeiter
        </Text>
      </Slide>

      {/* ============================================
          SLIDE 12: CLOSING - Memorable finale
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        
        {/* Large diagonal accent - creates dramatic closure */}
        <Shape type="rect" style={{
          x: -1, y: 3, w: 12, h: 4,
          backgroundColor: 'rgba(255,85,10,0.06)',
          rotate: -5,
        }} />
        
        {/* Section subtitle */}
        <Text style={{
          x: 0.6, y: 1.5,
          w: 6, h: 0.5,
          fontSize: 20, fontFace: FONTS.DISPLAY,
          color: THEME.textSecondary,
        }}>
          {content.closing.title}
        </Text>
        
        {/* Main thank you - HERO */}
        <Text style={{
          x: 0.6, y: 2.1,
          w: 8, h: 1.0,
          fontSize: 52, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.accent,
          shadow: SHADOWS.text,
        }}>
          Vielen Dank.
        </Text>
        
        {/* CTA */}
        <Text style={{
          x: 0.6, y: 3.3,
          w: 7, h: 0.6,
          fontSize: 14, fontFace: FONTS.BODY,
          color: THEME.textSecondary,
        }}>
          {content.closing.cta}
        </Text>
        
        {/* Orange accent bar */}
        <Shape type="rect" style={{
          x: 0.6, y: 4.1, w: 2.5, h: 0.08,
          backgroundColor: THEME.accent,
        }} />
        
        {/* Company branding */}
        <Text style={{
          x: 0.6, y: 5.0,
          w: 3, h: 0.3,
          fontSize: 11, fontFace: FONTS.BODY,
          color: THEME.textMuted,
        }}>
          {content.company}
        </Text>
        
        {/* Decorative accent shape in corner */}
        <Shape type="rect" style={{
          x: 8.5, y: 4.2, w: 1.5, h: 1.5,
          backgroundColor: THEME.accent,
          shadow: SHADOWS.elevated,
          rotate: 15,
        }} />
      </Slide>

    </Presentation>
  );
};

// ===========================================
// MAIN GENERATOR
// ===========================================

async function generateMagnumOpus() {
  const outputDir = path.join(process.cwd(), 'output');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('Generating AVEMO Fahrersoftware - Magnum Opus v2...\n');
  console.log('Design System:');
  console.log('  Typography: Montserrat (display) + Source Sans Pro (body)');
  console.log('  Shadows: Elevated cards with diffuse shadows');
  console.log('  Composition: Asymmetric layouts with geometric accents');
  console.log('  Atmosphere: Layered backgrounds with subtle gradients\n');
  
  try {
    const buffer = await render(<MagnumOpusV2 />);
    const filePath = path.join(outputDir, 'fahrersoftware-magnum-opus.pptx');
    fs.writeFileSync(filePath, buffer as Buffer);
    console.log(`  Generated: fahrersoftware-magnum-opus.pptx`);
    console.log('\nDone! Presentation saved to ./output/');
  } catch (error) {
    console.error('Error generating presentation:', error);
  }
}

generateMagnumOpus().catch(console.error);
