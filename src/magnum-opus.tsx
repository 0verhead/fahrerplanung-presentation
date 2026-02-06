/**
 * AVEMO Fahrersoftware - Magnum Opus Presentation
 * 
 * A comprehensive, executive-level presentation for the Geschäftsführerrunde.
 * Design: AVEMO brand language with modern, clean aesthetics.
 * 
 * Based on the complete content from fahrerplanung.pptx
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
  BLUE,
  CORE,
} from './theme/colors';

import { typography, FONTS } from './theme/typography';
import { shadows } from './theme/shadows';

// ===========================================
// AVEMO EXECUTIVE THEME
// Warm dark background with orange accents
// ===========================================

const THEME = {
  // Backgrounds
  bg: '#1a1816',           // Warm charcoal (AVEMO dark)
  bgAlt: '#252220',        // Slightly lighter
  bgCard: '#2d2a27',       // Card background
  bgAccent: ORANGE[500],   // #ff550a
  
  // Text
  text: '#ffffff',
  textSecondary: '#a8a5a2',
  textMuted: '#6b6865',
  textOnAccent: '#000000',
  
  // Accents
  accent: ORANGE[500],
  accentLight: ORANGE[400],
  border: '#3d3a37',
  
  // Status colors
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
};

// ===========================================
// COMPREHENSIVE CONTENT DATA
// Extracted and structured from original presentation
// ===========================================

const content = {
  // Title
  title: 'Fahrersoftware',
  subtitle: 'Vorstellung in der Geschäftsführerrunde',
  company: 'AVEMO Group',
  
  // Agenda items
  agenda: [
    { num: '01', title: 'Aktuelle Situation', desc: 'Herausforderungen in der AVEMO Group' },
    { num: '02', title: 'Die Zukunft', desc: 'Vision mit der Fahrersoftware' },
    { num: '03', title: 'Highlights', desc: 'PoC, Konzept & MVP' },
    { num: '04', title: 'Business Case', desc: 'ROI und Einsparungen' },
  ],
  
  // Section 01: Current Situation - Problems
  problems: {
    section: '01',
    title: 'Aktuelle Situation',
    subtitle: 'Welche manuellen Aufwände entstehen bei der Fahrerplanung?',
    
    mainIssues: [
      {
        title: 'Isolierte Standorte',
        points: [
          'Jeder Standort hat seinen eigenen Fahrdienst',
          'Es werden keine Synergien genutzt',
          'Keine standortübergreifende Koordination',
        ],
      },
      {
        title: 'Manuelle Prozesse',
        points: [
          'Einplanung erfolgt in Outlook und Excel',
          'Gleiche Inhalte in mehreren Listen eintragen',
          'Manuelle Fahrerabrechnungen und Weiterbelastungen',
        ],
      },
      {
        title: 'Fehlende Transparenz',
        points: [
          'Kein Reporting möglich',
          'Keine KPIs für effizienten Fahrereinsatz',
          'Stundenabrechnung auf Vertrauensbasis',
        ],
      },
      {
        title: 'Dokumentenprobleme',
        points: [
          'Unterlagen unvollständig oder verloren',
          'Verspätete Abgabe in der Dispo',
          'Erneutes Einscannen erforderlich',
        ],
      },
    ],
    
    criticalIssues: [
      { icon: '!', text: 'Leerlaufzeiten nicht messbar und nicht ausgenutzt' },
      { icon: '!', text: 'Keine Abstimmung zwischen Standorten im Rhein-Main-Gebiet' },
      { icon: '!', text: 'Kompetente Fahrer nicht optimal eingesetzt' },
      { icon: '!', text: 'Schlechte Updates an Kunden über Lieferstatus' },
    ],
  },
  
  // Key Metrics - Pain Points
  painMetrics: [
    { value: '30', unit: 'Tage', label: 'bis Fahrzeug ausgeliefert wird', highlight: true },
    { value: '2,5h', unit: '', label: 'Leerlaufzeit pro Tag bei H&B', highlight: false },
    { value: '11', unit: 'MA', label: 'Auslieferungssteuerung', highlight: false },
    { value: '3,5h', unit: '', label: 'pro Fahrzeug Bearbeitungszeit', highlight: false },
  ],
  
  operationalData: [
    { label: 'Fahrzeuge pro Jahr', value: '8.000+' },
    { label: 'Fahrzeuge pro Tag', value: '~25' },
    { label: 'Fahrzeuge pro Person', value: '2,3' },
    { label: 'Minuten pro Vorgang', value: '5-10' },
  ],
  
  // Section 02: The Future - Vision
  vision: {
    section: '02',
    title: 'Die Zukunft mit der Fahrersoftware',
    tagline: 'Eine Software. Alle Standorte.',
    
    benefits: [
      { 
        title: 'Synergien schaffen',
        desc: 'Gruppenübergreifende Vernetzung der Fahrdienste',
        icon: '1',
      },
      { 
        title: 'Effizienz steigern',
        desc: 'Großes Einsparpotential und mehr Fahrten abbilden',
        icon: '2',
      },
      { 
        title: 'Kapazitäten schaffen',
        desc: 'Ohne neues Personal bei höheren Stückzahlen',
        icon: '3',
      },
      { 
        title: 'Professioneller Auftritt',
        desc: 'Innovatives Image vor dem Kunden',
        icon: '4',
      },
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
  
  // Section 04: Highlights - PoC
  poc: {
    section: '04',
    title: 'PoC: Planungsalgorithmus',
    
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
  
  // Section 04: MVP Features
  mvp: {
    section: '04',
    title: 'MVP: Version für ersten Standort',
    
    coreFeatures: [
      {
        num: '01',
        title: 'Web-Backoffice',
        desc: 'Dispo-Planung, Fahrtenliste, Monitoring',
      },
      {
        num: '02',
        title: 'Fahrer-App',
        desc: 'Tagesübersicht, Protokolle, Offline-fähig',
      },
      {
        num: '03',
        title: 'Automatisierte Planung',
        desc: 'Optimierung nach Verfügbarkeit & Kosten',
      },
      {
        num: '04',
        title: 'Externe Dienstleister',
        desc: 'Portal für Zuweisung & Annahme',
      },
      {
        num: '05',
        title: 'Live-Monitoring',
        desc: 'Status & Historie aller Fahrten',
      },
      {
        num: '06',
        title: 'Basis-Reporting',
        desc: 'Dashboards & Excel-Exporte',
      },
    ],
    
    epics: [
      { title: 'Authentifizierung', desc: 'Benutzerverwaltung, Rollen, Sicherheit' },
      { title: 'Fahrer-Management', desc: 'Qualifikation, Zeiten, Import aus KDV' },
      { title: 'Auftragsdaten', desc: 'ABA/AB/BA, GeNesys-Integration' },
      { title: 'Disposition', desc: 'Automatische Zuordnung, 7-Tage-Ansicht' },
      { title: 'Fahrer-App', desc: 'Flows, Protokolle, Offline-Sync' },
      { title: 'Monitoring', desc: 'Live-Status, Benachrichtigungen' },
    ],
  },
  
  // Business Case
  businessCase: {
    section: '05',
    title: 'Business Case',
    subtitle: 'Online-Terminierung für Neufahrzeuge',
    
    description: 'Der Kunde wird per Mail aufgefordert, sein Neufahrzeug online zu terminieren',
    
    customerInputs: [
      'Wunschtermin',
      'Wunschkennzeichen',
      'Zieladresse',
    ],
    
    savings: {
      timePerVehicle: '1 Stunde',
      vehiclesPerYear: '8.000',
      hoursPerYear: '8.000',
      hourlyRate: '32,40 €',
      totalSavings: '260.000 €',
      fteEquivalent: '4 Mitarbeiter',
    },
  },
  
  // Closing
  closing: {
    title: 'Nächste Schritte',
    cta: 'Gemeinsam die Fahrzeugdisposition der AVEMO Group transformieren.',
  },
};

// ===========================================
// HELPER COMPONENTS
// ===========================================

const SectionLabel = ({ num, title, y = SLIDE.MARGIN.TOP }: { num: string; title: string; y?: number }) => (
  <>
    <Text style={{
      x: SLIDE.MARGIN.LEFT, y,
      w: 0.5, h: 0.35,
      fontSize: 12, bold: true, fontFace: FONTS.DISPLAY,
      color: THEME.accent,
    }}>
      {num}
    </Text>
    <Text style={{
      x: SLIDE.MARGIN.LEFT + 0.5, y,
      w: 3, h: 0.35,
      fontSize: 12, bold: true, fontFace: FONTS.BODY,
      color: THEME.textSecondary,
    }}>
      {title.toUpperCase()}
    </Text>
  </>
);

// ===========================================
// MAGNUM OPUS PRESENTATION
// ===========================================

const MagnumOpus = () => {
  return (
    <Presentation layout="16x9" title="Fahrersoftware - AVEMO Group" author="AVEMO Group">
      
      {/* ============================================
          SLIDE 1: TITLE
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        {/* Top accent bar */}
        <Shape type="rect" style={{
          x: 0, y: 0, w: SLIDE.WIDTH, h: 0.06,
          backgroundColor: THEME.accent,
        }} />
        
        {/* Main title */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 1.6,
          w: 8, h: 1.2,
          fontSize: 64, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          {content.title}
        </Text>
        
        {/* Subtitle */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 2.9,
          w: 7, h: 0.5,
          fontSize: 20, fontFace: FONTS.BODY,
          color: THEME.textSecondary,
        }}>
          {content.subtitle}
        </Text>
        
        {/* Orange accent line */}
        <Shape type="rect" style={{
          x: SLIDE.MARGIN.LEFT, y: 3.6, w: 1.5, h: 0.06,
          backgroundColor: THEME.accent,
        }} />
        
        {/* Company attribution */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.HEIGHT - 0.7,
          w: 3, h: 0.35,
          fontSize: 11, fontFace: FONTS.BODY,
          color: THEME.textMuted,
        }}>
          {content.company}
        </Text>
      </Slide>

      {/* ============================================
          SLIDE 2: AGENDA
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.MARGIN.TOP,
          w: 4, h: 0.5,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          Agenda
        </Text>
        
        <Shape type="rect" style={{
          x: SLIDE.MARGIN.LEFT, y: 1.0, w: 1, h: 0.04,
          backgroundColor: THEME.accent,
        }} />
        
        {content.agenda.map((item, i) => (
          <React.Fragment key={i}>
            {/* Number */}
            <Text style={{
              x: SLIDE.MARGIN.LEFT, y: 1.5 + i * 0.95,
              w: 0.6, h: 0.5,
              fontSize: 24, bold: true, fontFace: FONTS.DISPLAY,
              color: THEME.accent,
            }}>
              {item.num}
            </Text>
            {/* Title */}
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.8, y: 1.5 + i * 0.95,
              w: 4, h: 0.4,
              fontSize: 18, bold: true, fontFace: FONTS.BODY,
              color: THEME.text,
            }}>
              {item.title}
            </Text>
            {/* Description */}
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.8, y: 1.9 + i * 0.95,
              w: 5, h: 0.35,
              fontSize: 12, fontFace: FONTS.BODY,
              color: THEME.textSecondary,
            }}>
              {item.desc}
            </Text>
          </React.Fragment>
        ))}
      </Slide>

      {/* ============================================
          SLIDE 3: CURRENT SITUATION - PROBLEMS OVERVIEW
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <SectionLabel num="01" title="Aktuelle Situation" />
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.85,
          w: 8, h: 0.6,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          Herausforderungen in der Fahrerplanung
        </Text>
        
        {/* 2x2 Problem cards */}
        {content.problems.mainIssues.map((issue, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = SLIDE.MARGIN.LEFT + col * 4.6;
          const y = 1.6 + row * 1.8;
          
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y, w: 4.4, h: 1.6,
                backgroundColor: THEME.bgCard,
                rectRadius: RADIUS.S,
              }} />
              {/* Orange accent */}
              <Shape type="rect" style={{
                x, y: y + 0.15, w: 0.05, h: 1.3,
                backgroundColor: THEME.accent,
              }} />
              {/* Title */}
              <Text style={{
                x: x + 0.25, y: y + 0.2,
                w: 4, h: 0.4,
                fontSize: 16, bold: true, fontFace: FONTS.BODY,
                color: THEME.text,
              }}>
                {issue.title}
              </Text>
              {/* Points */}
              {issue.points.slice(0, 2).map((point, j) => (
                <Text key={j} style={{
                  x: x + 0.25, y: y + 0.65 + j * 0.4,
                  w: 4, h: 0.35,
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
          SLIDE 4: KEY PAIN METRICS
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <SectionLabel num="01" title="Aktuelle Situation" />
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.85,
          w: 8, h: 0.6,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          Die Zahlen sprechen für sich
        </Text>
        
        {/* Large hero metric */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 1.6,
          w: 3, h: 1.5,
          fontSize: 96, bold: true, fontFace: FONTS.METRIC,
          color: THEME.accent,
        }}>
          30
        </Text>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 3.1,
          w: 3, h: 0.5,
          fontSize: 24, bold: true, fontFace: FONTS.BODY,
          color: THEME.text,
        }}>
          Tage
        </Text>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 3.6,
          w: 4, h: 0.4,
          fontSize: 14, fontFace: FONTS.BODY,
          color: THEME.textSecondary,
        }}>
          bis ein Fahrzeug ausgeliefert wird
        </Text>
        
        {/* Vertical divider */}
        <Shape type="rect" style={{
          x: 5, y: 1.6, w: 0.02, h: 2.5,
          backgroundColor: THEME.border,
        }} />
        
        {/* Secondary metrics */}
        {[
          { value: '2,5h', label: 'Leerlaufzeit pro Tag' },
          { value: '8.000', label: 'Fahrzeuge pro Jahr' },
          { value: '3,5h', label: 'pro Fahrzeug Bearbeitung' },
        ].map((m, i) => (
          <React.Fragment key={i}>
            <Text style={{
              x: 5.5, y: 1.6 + i * 0.9,
              w: 2.5, h: 0.6,
              fontSize: 32, bold: true, fontFace: FONTS.METRIC,
              color: THEME.text,
            }}>
              {m.value}
            </Text>
            <Text style={{
              x: 5.5, y: 2.1 + i * 0.9,
              w: 4, h: 0.3,
              fontSize: 11, fontFace: FONTS.BODY,
              color: THEME.textSecondary,
            }}>
              {m.label}
            </Text>
          </React.Fragment>
        ))}
      </Slide>

      {/* ============================================
          SLIDE 5: CRITICAL ISSUES
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <SectionLabel num="01" title="Aktuelle Situation" />
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.85,
          w: 8, h: 0.6,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          Kritische Schwachstellen
        </Text>
        
        {/* Issue cards */}
        {content.problems.criticalIssues.map((issue, i) => (
          <React.Fragment key={i}>
            <Shape type="roundRect" style={{
              x: SLIDE.MARGIN.LEFT, y: 1.5 + i * 0.9,
              w: 9, h: 0.75,
              backgroundColor: THEME.bgCard,
              rectRadius: RADIUS.XS,
            }} />
            {/* Warning icon */}
            <Shape type="roundRect" style={{
              x: SLIDE.MARGIN.LEFT + 0.15, y: 1.65 + i * 0.9,
              w: 0.45, h: 0.45,
              backgroundColor: THEME.warning,
              rectRadius: 0.1,
            }} />
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.25, y: 1.68 + i * 0.9,
              w: 0.3, h: 0.4,
              fontSize: 14, bold: true, fontFace: FONTS.BODY,
              color: THEME.bg,
              align: 'center',
            }}>
              !
            </Text>
            {/* Issue text */}
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.8, y: 1.7 + i * 0.9,
              w: 8, h: 0.4,
              fontSize: 13, fontFace: FONTS.BODY,
              color: THEME.text,
            }}>
              {issue.text}
            </Text>
          </React.Fragment>
        ))}
      </Slide>

      {/* ============================================
          SLIDE 6: THE FUTURE - VISION
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <SectionLabel num="02" title="Die Zukunft" />
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.85,
          w: 9, h: 0.6,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          Eine Software. Alle Standorte.
        </Text>
        
        {/* Benefits - 2x2 grid */}
        {content.vision.benefits.map((benefit, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = SLIDE.MARGIN.LEFT + col * 4.6;
          const y = 1.5 + row * 1.7;
          
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y, w: 4.4, h: 1.5,
                backgroundColor: THEME.bgCard,
                rectRadius: RADIUS.S,
              }} />
              {/* Number circle */}
              <Shape type="ellipse" style={{
                x: x + 0.2, y: y + 0.2,
                w: 0.4, h: 0.4,
                backgroundColor: THEME.accent,
              }} />
              <Text style={{
                x: x + 0.28, y: y + 0.26,
                w: 0.25, h: 0.3,
                fontSize: 12, bold: true, fontFace: FONTS.BODY,
                color: THEME.textOnAccent,
                align: 'center',
              }}>
                {benefit.icon}
              </Text>
              {/* Title */}
              <Text style={{
                x: x + 0.8, y: y + 0.25,
                w: 3.4, h: 0.4,
                fontSize: 15, bold: true, fontFace: FONTS.BODY,
                color: THEME.text,
              }}>
                {benefit.title}
              </Text>
              {/* Description */}
              <Text style={{
                x: x + 0.2, y: y + 0.8,
                w: 4, h: 0.5,
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
          SLIDE 7: OUTCOMES
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <SectionLabel num="02" title="Die Zukunft" />
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.85,
          w: 6, h: 0.6,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          Erwartete Ergebnisse
        </Text>
        
        {/* Outcomes in 2 columns */}
        {content.vision.outcomes.map((outcome, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = SLIDE.MARGIN.LEFT + col * 4.6;
          const y = 1.5 + row * 0.7;
          
          return (
            <React.Fragment key={i}>
              <Shape type="ellipse" style={{
                x, y: y + 0.08,
                w: 0.2, h: 0.2,
                backgroundColor: THEME.accent,
              }} />
              <Text style={{
                x: x + 0.4, y,
                w: 4, h: 0.4,
                fontSize: 14, fontFace: FONTS.BODY,
                color: THEME.text,
              }}>
                {outcome}
              </Text>
            </React.Fragment>
          );
        })}
        
        {/* Highlight box */}
        <Shape type="roundRect" style={{
          x: SLIDE.MARGIN.LEFT, y: 3.8,
          w: 9, h: 1.3,
          backgroundColor: THEME.accent,
          rectRadius: RADIUS.S,
        }} />
        <Text style={{
          x: SLIDE.MARGIN.LEFT + 0.3, y: 4,
          w: 8.4, h: 0.4,
          fontSize: 14, bold: true, fontFace: FONTS.BODY,
          color: THEME.textOnAccent,
        }}>
          Professioneller Auftritt vor Kunde
        </Text>
        <Text style={{
          x: SLIDE.MARGIN.LEFT + 0.3, y: 4.4,
          w: 8.4, h: 0.5,
          fontSize: 12, fontFace: FONTS.BODY,
          color: THEME.textOnAccent,
        }}>
          Innovatives Image durch moderne Technologie und transparente Kommunikation
        </Text>
      </Slide>

      {/* ============================================
          SLIDE 8: POC - PLANUNGSALGORITHMUS
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <SectionLabel num="04" title="Highlights" />
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.85,
          w: 8, h: 0.6,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          PoC: Planungsalgorithmus
        </Text>
        
        {/* Goal card */}
        <Shape type="roundRect" style={{
          x: SLIDE.MARGIN.LEFT, y: 1.5,
          w: 9, h: 1,
          backgroundColor: THEME.bgCard,
          rectRadius: RADIUS.S,
        }} />
        <Text style={{
          x: SLIDE.MARGIN.LEFT + 0.2, y: 1.6,
          w: 1, h: 0.3,
          fontSize: 10, bold: true, fontFace: FONTS.BODY,
          color: THEME.accent,
        }}>
          ZIEL
        </Text>
        <Text style={{
          x: SLIDE.MARGIN.LEFT + 0.2, y: 1.9,
          w: 8.6, h: 0.5,
          fontSize: 13, fontFace: FONTS.BODY,
          color: THEME.text,
        }}>
          {content.poc.goal}
        </Text>
        
        {/* Two columns */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 2.8,
          w: 4, h: 0.3,
          fontSize: 11, bold: true, fontFace: FONTS.BODY,
          color: THEME.accent,
        }}>
          OPTIMIERUNGSLOGIK
        </Text>
        {content.poc.optimization.map((item, i) => (
          <React.Fragment key={i}>
            <Shape type="ellipse" style={{
              x: SLIDE.MARGIN.LEFT, y: 3.2 + i * 0.5,
              w: 0.15, h: 0.15,
              backgroundColor: THEME.accent,
            }} />
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.3, y: 3.15 + i * 0.5,
              w: 4, h: 0.35,
              fontSize: 11, fontFace: FONTS.BODY,
              color: THEME.textSecondary,
            }}>
              {item}
            </Text>
          </React.Fragment>
        ))}
        
        <Text style={{
          x: 5.5, y: 2.8,
          w: 4, h: 0.3,
          fontSize: 11, bold: true, fontFace: FONTS.BODY,
          color: THEME.accent,
        }}>
          DATENBASIS
        </Text>
        {content.poc.dataInputs.map((item, i) => (
          <React.Fragment key={i}>
            <Shape type="ellipse" style={{
              x: 5.5, y: 3.2 + i * 0.5,
              w: 0.15, h: 0.15,
              backgroundColor: THEME.accent,
            }} />
            <Text style={{
              x: 5.8, y: 3.15 + i * 0.5,
              w: 3.7, h: 0.35,
              fontSize: 11, fontFace: FONTS.BODY,
              color: THEME.textSecondary,
            }}>
              {item}
            </Text>
          </React.Fragment>
        ))}
      </Slide>

      {/* ============================================
          SLIDE 9: MVP FEATURES
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <SectionLabel num="04" title="Highlights" />
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.85,
          w: 8, h: 0.6,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          MVP: Kernfunktionen
        </Text>
        
        {/* 3x2 feature grid */}
        {content.mvp.coreFeatures.map((feature, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const cardW = 2.9;
          const x = SLIDE.MARGIN.LEFT + col * (cardW + SPACING.M);
          const y = 1.5 + row * 1.7;
          
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y, w: cardW, h: 1.5,
                backgroundColor: THEME.bgCard,
                rectRadius: RADIUS.S,
              }} />
              <Text style={{
                x: x + 0.15, y: y + 0.15,
                w: 1, h: 0.4,
                fontSize: 18, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.accent,
              }}>
                {feature.num}
              </Text>
              <Text style={{
                x: x + 0.15, y: y + 0.55,
                w: cardW - 0.3, h: 0.4,
                fontSize: 13, bold: true, fontFace: FONTS.BODY,
                color: THEME.text,
              }}>
                {feature.title}
              </Text>
              <Text style={{
                x: x + 0.15, y: y + 0.95,
                w: cardW - 0.3, h: 0.4,
                fontSize: 10, fontFace: FONTS.BODY,
                color: THEME.textSecondary,
              }}>
                {feature.desc}
              </Text>
            </React.Fragment>
          );
        })}
      </Slide>

      {/* ============================================
          SLIDE 10: MVP EPICS
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <SectionLabel num="04" title="Highlights" />
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.85,
          w: 8, h: 0.6,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          MVP: Entwicklungs-Epics
        </Text>
        
        {/* 3x2 epic grid */}
        {content.mvp.epics.map((epic, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const cardW = 2.9;
          const x = SLIDE.MARGIN.LEFT + col * (cardW + SPACING.M);
          const y = 1.5 + row * 1.7;
          
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y, w: cardW, h: 1.5,
                backgroundColor: THEME.bgAlt,
                borderColor: THEME.border,
                borderWidth: 1,
                rectRadius: RADIUS.S,
              }} />
              {/* Top accent line */}
              <Shape type="rect" style={{
                x, y, w: cardW, h: 0.05,
                backgroundColor: THEME.accent,
              }} />
              <Text style={{
                x: x + 0.15, y: y + 0.2,
                w: cardW - 0.3, h: 0.4,
                fontSize: 13, bold: true, fontFace: FONTS.BODY,
                color: THEME.text,
              }}>
                {epic.title}
              </Text>
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
          SLIDE 11: BUSINESS CASE
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <SectionLabel num="05" title="Business Case" />
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.85,
          w: 8, h: 0.6,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          ROI: Online-Terminierung
        </Text>
        
        {/* Left side - Description */}
        <Shape type="roundRect" style={{
          x: SLIDE.MARGIN.LEFT, y: 1.5,
          w: 4.3, h: 3.6,
          backgroundColor: THEME.bgCard,
          rectRadius: RADIUS.M,
        }} />
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT + 0.25, y: 1.7,
          w: 3.8, h: 0.8,
          fontSize: 12, fontFace: FONTS.BODY,
          color: THEME.textSecondary,
        }}>
          {content.businessCase.description}
        </Text>
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT + 0.25, y: 2.5,
          w: 3, h: 0.3,
          fontSize: 10, bold: true, fontFace: FONTS.BODY,
          color: THEME.accent,
        }}>
          KUNDENANGABEN
        </Text>
        
        {content.businessCase.customerInputs.map((input, i) => (
          <React.Fragment key={i}>
            <Shape type="ellipse" style={{
              x: SLIDE.MARGIN.LEFT + 0.25, y: 2.9 + i * 0.4,
              w: 0.15, h: 0.15,
              backgroundColor: THEME.accent,
            }} />
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.55, y: 2.85 + i * 0.4,
              w: 3.5, h: 0.3,
              fontSize: 11, fontFace: FONTS.BODY,
              color: THEME.text,
            }}>
              {input}
            </Text>
          </React.Fragment>
        ))}
        
        {/* Right side - Numbers */}
        <Shape type="roundRect" style={{
          x: 5.2, y: 1.5,
          w: 4.3, h: 3.6,
          backgroundColor: THEME.accent,
          rectRadius: RADIUS.M,
        }} />
        
        {/* Big savings number */}
        <Text style={{
          x: 5.4, y: 1.8,
          w: 3.9, h: 1,
          fontSize: 48, bold: true, fontFace: FONTS.METRIC,
          color: THEME.textOnAccent,
        }}>
          260.000€
        </Text>
        <Text style={{
          x: 5.4, y: 2.8,
          w: 3.9, h: 0.4,
          fontSize: 14, bold: true, fontFace: FONTS.BODY,
          color: THEME.textOnAccent,
        }}>
          jährliche Einsparung
        </Text>
        
        {/* Breakdown */}
        <Shape type="rect" style={{
          x: 5.4, y: 3.4, w: 3.9, h: 0.02,
          backgroundColor: 'rgba(0,0,0,0.2)',
        }} />
        
        <Text style={{
          x: 5.4, y: 3.6,
          w: 2, h: 0.3,
          fontSize: 10, fontFace: FONTS.BODY,
          color: THEME.textOnAccent,
        }}>
          1h Ersparnis/Fahrzeug
        </Text>
        <Text style={{
          x: 7.4, y: 3.6,
          w: 2, h: 0.3,
          fontSize: 10, fontFace: FONTS.BODY,
          color: THEME.textOnAccent,
          align: 'right',
        }}>
          8.000 Fahrzeuge
        </Text>
        
        <Text style={{
          x: 5.4, y: 4,
          w: 2, h: 0.3,
          fontSize: 10, fontFace: FONTS.BODY,
          color: THEME.textOnAccent,
        }}>
          32,40€ Stundenlohn
        </Text>
        <Text style={{
          x: 7.4, y: 4,
          w: 2, h: 0.3,
          fontSize: 10, fontFace: FONTS.BODY,
          color: THEME.textOnAccent,
          align: 'right',
        }}>
          = 4 Mitarbeiter
        </Text>
      </Slide>

      {/* ============================================
          SLIDE 12: CLOSING
          ============================================ */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        {/* Large question */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 1.5,
          w: 8, h: 0.6,
          fontSize: 24, fontFace: FONTS.DISPLAY,
          color: THEME.textSecondary,
        }}>
          {content.closing.title}
        </Text>
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 2.2,
          w: 8, h: 1,
          fontSize: 42, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.accent,
        }}>
          Vielen Dank.
        </Text>
        
        {/* CTA */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 3.5,
          w: 7, h: 0.8,
          fontSize: 14, fontFace: FONTS.BODY,
          color: THEME.textSecondary,
        }}>
          {content.closing.cta}
        </Text>
        
        {/* Orange accent line */}
        <Shape type="rect" style={{
          x: SLIDE.MARGIN.LEFT, y: 4.5, w: 2, h: 0.06,
          backgroundColor: THEME.accent,
        }} />
        
        {/* Company */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.HEIGHT - 0.7,
          w: 3, h: 0.35,
          fontSize: 11, fontFace: FONTS.BODY,
          color: THEME.textMuted,
        }}>
          {content.company}
        </Text>
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
  
  console.log('Generating AVEMO Fahrersoftware - Magnum Opus...\n');
  
  try {
    const buffer = await render(<MagnumOpus />);
    const filePath = path.join(outputDir, 'fahrersoftware-magnum-opus.pptx');
    fs.writeFileSync(filePath, buffer as Buffer);
    console.log(`  Generated: fahrersoftware-magnum-opus.pptx`);
    console.log('\nDone! Presentation saved to ./output/');
  } catch (error) {
    console.error('Error generating presentation:', error);
  }
}

generateMagnumOpus().catch(console.error);
