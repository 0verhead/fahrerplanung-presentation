/**
 * AVEMO Fahrersoftware Presentation Generator
 * 
 * 5 Distinctive Business Presentation Designs:
 * 1. Executive Black - Dark mode, boardroom-ready
 * 2. Clean White - Swiss design, editorial clarity  
 * 3. Data-Forward - Dashboard-inspired, metric-centric
 * 4. Split Composition - Magazine editorial, asymmetric
 * 5. Warm Professional - AVEMO Fleet style with blue accent
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
  GRID,
  SPACING,
  RADIUS,
  CARDS,
} from './theme/layout';

import {
  GRAY,
  ORANGE,
  BLUE,
  CORE,
  THEME_DARK,
  THEME_LIGHT,
  THEME_WARM,
  THEME_DATA,
} from './theme/colors';

import { typography, FONTS } from './theme/typography';
import { shadows } from './theme/shadows';

// ===========================================
// CONTENT DATA
// ===========================================

const content = {
  title: 'Fahrersoftware',
  subtitle: 'Die Zukunft der Fahrzeugdisposition',
  tagline: 'Eine Software. Alle Standorte.',
  
  problems: [
    { title: 'Isolierte Standorte', desc: 'Keine Vernetzung zwischen Niederlassungen' },
    { title: 'Manuelle Prozesse', desc: 'Excel, Outlook & Kalender erzeugen Chaos' },
    { title: 'Fehlende Transparenz', desc: 'Keine Echtzeit-KPIs oder Optimierung' },
    { title: 'Hohe Leerlaufzeit', desc: '2,5 Stunden pro Fahrzeug pro Tag' },
  ],
  
  solutions: [
    { title: 'Standort-Synergien', desc: 'Vernetzung aller Niederlassungen' },
    { title: 'Effizienzsteigerung', desc: 'Optimierte Fahrzeugnutzung' },
    { title: 'Automatisierung', desc: 'Reduzierung manueller Arbeit' },
    { title: 'Kosteneinsparung', desc: 'Signifikante ROI-Verbesserung' },
  ],
  
  metrics: {
    savings: { value: '260.000', unit: '€', label: 'jährliche Einsparung' },
    waitTime: { value: '30', unit: 'Tage', label: 'Wartezeit reduziert' },
    efficiency: { value: '40', unit: '%', label: 'Effizienzsteigerung' },
  },
  
  features: [
    { num: '01', title: 'Touren-Planung', desc: 'Intelligente Routenoptimierung' },
    { num: '02', title: 'Driver App', desc: 'Intuitive mobile Bedienung' },
    { num: '03', title: 'Web-Backoffice', desc: 'Zentrale Verwaltung' },
    { num: '04', title: 'API-Integration', desc: 'Nahtlose Systemanbindung' },
    { num: '05', title: 'Live-Monitoring', desc: 'Echtzeit-Flottenübersicht' },
    { num: '06', title: 'Analytics', desc: 'Automatisierte Berichte' },
  ],
  
  closing: {
    question: 'Bereit für die Zukunft?',
    cta: 'Lassen Sie uns gemeinsam Ihre Fahrzeugdisposition transformieren.',
  },
};

// ===========================================
// DESIGN 1: EXECUTIVE BLACK
// Dark mode, maximum contrast, boardroom-ready
// ===========================================

const ExecutiveBlack = () => {
  const T = THEME_DARK;
  
  return (
    <Presentation layout="16x9" title="Fahrersoftware - Executive" author="AVEMO Group">
      {/* Slide 1: Title */}
      <Slide style={{ backgroundColor: T.bg }}>
        {/* Thin orange accent line at top */}
        <Shape type="rect" style={{
          x: 0, y: 0, w: SLIDE.WIDTH, h: 0.04,
          backgroundColor: T.accent,
        }} />
        
        {/* Main title */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 1.8,
          w: 7, h: 1,
          ...typography.hero,
          color: T.text,
        }}>
          {content.title}
        </Text>
        
        {/* Subtitle */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 2.9,
          w: 6, h: 0.6,
          ...typography.lead,
          color: T.textSecondary,
        }}>
          {content.subtitle}
        </Text>
        
        {/* Tagline with orange accent */}
        <Shape type="rect" style={{
          x: SLIDE.MARGIN.LEFT, y: 3.8, w: 0.04, h: 0.5,
          backgroundColor: T.accent,
        }} />
        <Text style={{
          x: SLIDE.MARGIN.LEFT + 0.2, y: 3.85,
          w: 5, h: 0.4,
          ...typography.body,
          color: T.textMuted,
        }}>
          {content.tagline}
        </Text>
        
        {/* AVEMO attribution */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.HEIGHT - 0.6,
          w: 3, h: 0.3,
          ...typography.caption,
          color: T.textMuted,
        }}>
          AVEMO Group
        </Text>
      </Slide>

      {/* Slide 2: Problem Statement */}
      <Slide style={{ backgroundColor: T.bg }}>
        {/* Section label */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.MARGIN.TOP,
          w: 3, h: 0.3,
          ...typography.overline,
          color: T.accent,
        }}>
          DAS PROBLEM
        </Text>
        
        {/* Title */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.9,
          w: 8, h: 0.6,
          ...typography.h1,
          color: T.text,
        }}>
          Aktuelle Herausforderungen
        </Text>
        
        {/* Problem cards - 2x2 grid */}
        {content.problems.map((problem, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = SLIDE.MARGIN.LEFT + col * 4.6;
          const y = 1.8 + row * 1.5;
          
          return (
            <React.Fragment key={i}>
              {/* Card background */}
              <Shape type="roundRect" style={{
                x, y, w: 4.3, h: 1.3,
                backgroundColor: T.bgAlt,
                rectRadius: RADIUS.S,
              }} />
              {/* Orange left accent */}
              <Shape type="rect" style={{
                x, y: y + 0.15, w: 0.04, h: 1,
                backgroundColor: T.accent,
              }} />
              {/* Title */}
              <Text style={{
                x: x + 0.2, y: y + 0.2,
                w: 3.9, h: 0.4,
                ...typography.h3,
                color: T.text,
              }}>
                {problem.title}
              </Text>
              {/* Description */}
              <Text style={{
                x: x + 0.2, y: y + 0.65,
                w: 3.9, h: 0.5,
                ...typography.bodySmall,
                color: T.textSecondary,
              }}>
                {problem.desc}
              </Text>
            </React.Fragment>
          );
        })}
      </Slide>

      {/* Slide 3: Big Metric */}
      <Slide style={{ backgroundColor: T.bg }}>
        {/* Large metric */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 1.2,
          w: 6, h: 1.6,
          ...typography.metricLarge,
          fontSize: 96,
          color: T.accent,
        }}>
          {content.metrics.waitTime.value}
        </Text>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 2.8,
          w: 3, h: 0.5,
          ...typography.metricUnit,
          color: T.text,
        }}>
          {content.metrics.waitTime.unit}
        </Text>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 3.4,
          w: 5, h: 0.4,
          ...typography.body,
          color: T.textSecondary,
        }}>
          durchschnittliche Wartezeit auf Fahrzeuge
        </Text>
        
        {/* Secondary metrics */}
        <Shape type="rect" style={{
          x: 6.5, y: 1.5, w: 0.02, h: 2.5,
          backgroundColor: T.border,
        }} />
        
        <Text style={{
          x: 7, y: 1.5, w: 2.5, h: 0.8,
          ...typography.metric,
          color: T.text,
        }}>
          2,5h
        </Text>
        <Text style={{
          x: 7, y: 2.3, w: 2.5, h: 0.4,
          ...typography.bodySmall,
          color: T.textSecondary,
        }}>
          Leerlaufzeit pro Tag
        </Text>
        
        <Text style={{
          x: 7, y: 3.2, w: 2.5, h: 0.8,
          ...typography.metric,
          color: T.text,
        }}>
          100%
        </Text>
        <Text style={{
          x: 7, y: 4, w: 2.5, h: 0.4,
          ...typography.bodySmall,
          color: T.textSecondary,
        }}>
          manuelle Prozesse
        </Text>
      </Slide>

      {/* Slide 4: Solution */}
      <Slide style={{ backgroundColor: T.bg }}>
        {/* Section label */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.MARGIN.TOP,
          w: 3, h: 0.3,
          ...typography.overline,
          color: T.accent,
        }}>
          DIE LÖSUNG
        </Text>
        
        {/* Title */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.9,
          w: 8, h: 0.6,
          ...typography.h1,
          color: T.text,
        }}>
          {content.tagline}
        </Text>
        
        {/* Benefits list */}
        {content.solutions.map((solution, i) => (
          <React.Fragment key={i}>
            <Shape type="rect" style={{
              x: SLIDE.MARGIN.LEFT, y: 1.8 + i * 0.85, w: 0.04, h: 0.6,
              backgroundColor: T.accent,
            }} />
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.25, y: 1.8 + i * 0.85,
              w: 4, h: 0.35,
              ...typography.h3,
              color: T.text,
            }}>
              {solution.title}
            </Text>
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.25, y: 2.15 + i * 0.85,
              w: 4, h: 0.3,
              ...typography.bodySmall,
              color: T.textSecondary,
            }}>
              {solution.desc}
            </Text>
          </React.Fragment>
        ))}
        
        {/* Key metric on right */}
        <Text style={{
          x: 6, y: 2,
          w: 3.5, h: 1,
          ...typography.metric,
          fontSize: 56,
          color: T.accent,
        }}>
          260K€
        </Text>
        <Text style={{
          x: 6, y: 3,
          w: 3.5, h: 0.4,
          ...typography.body,
          color: T.textSecondary,
        }}>
          jährliche Einsparung
        </Text>
      </Slide>

      {/* Slide 5: Features */}
      <Slide style={{ backgroundColor: T.bg }}>
        {/* Section label */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.MARGIN.TOP,
          w: 5, h: 0.3,
          ...typography.overline,
          color: T.accent,
        }}>
          MINIMUM VIABLE PRODUCT
        </Text>
        
        {/* Title */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.9,
          w: 6, h: 0.5,
          ...typography.h1,
          color: T.text,
        }}>
          Die Kernfunktionen
        </Text>
        
        {/* 3x2 feature grid */}
        {content.features.map((feature, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const cardW = (SLIDE.CONTENT.WIDTH - SPACING.M * 2) / 3;
          const x = SLIDE.MARGIN.LEFT + col * (cardW + SPACING.M);
          const y = 1.7 + row * 1.7;
          
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y, w: cardW, h: 1.5,
                backgroundColor: T.bgAlt,
                rectRadius: RADIUS.S,
              }} />
              <Text style={{
                x: x + 0.2, y: y + 0.15,
                w: 1, h: 0.4,
                ...typography.featureNum,
                color: T.accent,
              }}>
                {feature.num}
              </Text>
              <Text style={{
                x: x + 0.2, y: y + 0.55,
                w: cardW - 0.4, h: 0.4,
                ...typography.h4,
                color: T.text,
              }}>
                {feature.title}
              </Text>
              <Text style={{
                x: x + 0.2, y: y + 0.95,
                w: cardW - 0.4, h: 0.35,
                ...typography.bodySmall,
                color: T.textSecondary,
              }}>
                {feature.desc}
              </Text>
            </React.Fragment>
          );
        })}
      </Slide>

      {/* Slide 6: Closing */}
      <Slide style={{ backgroundColor: T.bg }}>
        {/* Question */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 1.8,
          w: 8, h: 0.6,
          ...typography.h1,
          color: T.textSecondary,
        }}>
          Bereit für die
        </Text>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 2.5,
          w: 8, h: 1,
          ...typography.hero,
          color: T.accent,
        }}>
          Zukunft?
        </Text>
        
        {/* CTA */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 3.8,
          w: 6, h: 0.8,
          ...typography.body,
          color: T.textSecondary,
        }}>
          {content.closing.cta}
        </Text>
        
        {/* Orange line */}
        <Shape type="rect" style={{
          x: SLIDE.MARGIN.LEFT, y: 4.8, w: 2, h: 0.04,
          backgroundColor: T.accent,
        }} />
      </Slide>
    </Presentation>
  );
};

// ===========================================
// DESIGN 2: CLEAN WHITE
// Swiss design, editorial clarity, light mode
// ===========================================

const CleanWhite = () => {
  const T = THEME_LIGHT;
  
  return (
    <Presentation layout="16x9" title="Fahrersoftware - Clean" author="AVEMO Group">
      {/* Slide 1: Title */}
      <Slide style={{ backgroundColor: T.bg }}>
        {/* Left gray panel */}
        <Shape type="rect" style={{
          x: 0, y: 0, w: 4, h: SLIDE.HEIGHT,
          backgroundColor: T.bgAlt,
        }} />
        
        {/* Orange dot */}
        <Shape type="ellipse" style={{
          x: SLIDE.MARGIN.LEFT, y: 1.8, w: 0.15, h: 0.15,
          backgroundColor: T.accent,
        }} />
        
        {/* Title */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 2.1,
          w: 8, h: 1,
          ...typography.hero,
          color: T.text,
        }}>
          {content.title}
        </Text>
        
        {/* Subtitle */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 3.2,
          w: 6, h: 0.5,
          ...typography.lead,
          color: T.textSecondary,
        }}>
          {content.subtitle}
        </Text>
        
        {/* Orange underline */}
        <Shape type="rect" style={{
          x: SLIDE.MARGIN.LEFT, y: 3.9, w: 1.5, h: 0.04,
          backgroundColor: T.accent,
        }} />
      </Slide>

      {/* Slide 2: Problem */}
      <Slide style={{ backgroundColor: T.bg }}>
        {/* Title */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.MARGIN.TOP,
          w: 6, h: 0.6,
          ...typography.h1,
          color: T.text,
        }}>
          Aktuelle Situation
        </Text>
        
        {/* Orange underline */}
        <Shape type="rect" style={{
          x: SLIDE.MARGIN.LEFT, y: 1.05, w: 1, h: 0.04,
          backgroundColor: T.accent,
        }} />
        
        {/* Problem cards - vertical list */}
        {content.problems.map((problem, i) => (
          <React.Fragment key={i}>
            {/* Number circle */}
            <Shape type="ellipse" style={{
              x: SLIDE.MARGIN.LEFT, y: 1.4 + i * 1,
              w: 0.35, h: 0.35,
              backgroundColor: i === 0 ? T.accent : T.bgAlt,
            }} />
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.08, y: 1.47 + i * 1,
              w: 0.2, h: 0.25,
              fontSize: 12, bold: true, fontFace: FONTS.BODY,
              color: i === 0 ? T.bg : T.textMuted,
              align: 'center',
            }}>
              {String(i + 1)}
            </Text>
            
            {/* Card */}
            <Shape type="roundRect" style={{
              x: 1, y: 1.3 + i * 1, w: 8.5, h: 0.8,
              backgroundColor: T.bg,
              borderColor: T.border,
              borderWidth: 1,
              rectRadius: RADIUS.XS,
              shadow: shadows.subtle,
            }} />
            <Text style={{
              x: 1.2, y: 1.4 + i * 1,
              w: 3, h: 0.3,
              ...typography.h4,
              color: T.text,
            }}>
              {problem.title}
            </Text>
            <Text style={{
              x: 1.2, y: 1.7 + i * 1,
              w: 8, h: 0.3,
              ...typography.bodySmall,
              color: T.textSecondary,
            }}>
              {problem.desc}
            </Text>
          </React.Fragment>
        ))}
      </Slide>

      {/* Slide 3: Solution */}
      <Slide style={{ backgroundColor: T.bg }}>
        {/* Orange right panel */}
        <Shape type="rect" style={{
          x: 6.5, y: 0, w: 3.5, h: SLIDE.HEIGHT,
          backgroundColor: T.accent,
        }} />
        
        {/* Left content */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.MARGIN.TOP,
          w: 5, h: 0.3,
          ...typography.overline,
          color: T.accent,
        }}>
          UNSERE LÖSUNG
        </Text>
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.9,
          w: 5.5, h: 0.8,
          ...typography.h1,
          color: T.text,
        }}>
          {content.tagline}
        </Text>
        
        {content.solutions.map((solution, i) => (
          <React.Fragment key={i}>
            <Shape type="ellipse" style={{
              x: SLIDE.MARGIN.LEFT, y: 2 + i * 0.85,
              w: 0.25, h: 0.25,
              backgroundColor: T.accent,
            }} />
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.4, y: 2 + i * 0.85,
              w: 5, h: 0.35,
              ...typography.h4,
              color: T.text,
            }}>
              {solution.title}
            </Text>
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.4, y: 2.35 + i * 0.85,
              w: 5, h: 0.3,
              ...typography.bodySmall,
              color: T.textSecondary,
            }}>
              {solution.desc}
            </Text>
          </React.Fragment>
        ))}
        
        {/* White text on orange */}
        <Text style={{
          x: 6.8, y: 2,
          w: 2.9, h: 1.5,
          ...typography.body,
          fontSize: 16,
          color: CORE.white,
        }}>
          Transformieren Sie Ihre Fahrzeugdisposition mit moderner Technologie.
        </Text>
      </Slide>

      {/* Slide 4: Features */}
      <Slide style={{ backgroundColor: T.bg }}>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.MARGIN.TOP,
          w: 5, h: 0.3,
          ...typography.overline,
          color: T.accent,
        }}>
          MINIMUM VIABLE PRODUCT
        </Text>
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.85,
          w: 6, h: 0.5,
          ...typography.h1,
          color: T.text,
        }}>
          Die Kernfunktionen
        </Text>
        
        {/* 3x2 cards */}
        {content.features.map((feature, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const cardW = 2.85;
          const x = SLIDE.MARGIN.LEFT + col * (cardW + SPACING.M);
          const y = 1.6 + row * 1.55;
          
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y, w: cardW, h: 1.4,
                backgroundColor: T.bg,
                borderColor: T.border,
                borderWidth: 1,
                rectRadius: RADIUS.S,
                shadow: shadows.soft,
              }} />
              {/* Top orange bar */}
              <Shape type="rect" style={{
                x, y, w: cardW, h: 0.05,
                backgroundColor: T.accent,
              }} />
              <Text style={{
                x: x + 0.15, y: y + 0.15,
                w: 1, h: 0.3,
                ...typography.label,
                color: T.accent,
              }}>
                {feature.num}
              </Text>
              <Text style={{
                x: x + 0.15, y: y + 0.5,
                w: cardW - 0.3, h: 0.35,
                ...typography.h4,
                color: T.text,
              }}>
                {feature.title}
              </Text>
              <Text style={{
                x: x + 0.15, y: y + 0.9,
                w: cardW - 0.3, h: 0.35,
                ...typography.caption,
                color: T.textSecondary,
              }}>
                {feature.desc}
              </Text>
            </React.Fragment>
          );
        })}
      </Slide>

      {/* Slide 5: Big Stat */}
      <Slide style={{ backgroundColor: T.bg }}>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 1.5,
          w: 5, h: 1.5,
          ...typography.metricLarge,
          fontSize: 96,
          color: T.text,
        }}>
          {content.metrics.savings.value}
        </Text>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 3,
          w: 2, h: 0.6,
          ...typography.h1,
          color: T.accent,
        }}>
          {content.metrics.savings.unit}
        </Text>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 3.7,
          w: 5, h: 0.4,
          ...typography.body,
          color: T.textSecondary,
        }}>
          {content.metrics.savings.label}
        </Text>
        
        {/* Vertical divider */}
        <Shape type="rect" style={{
          x: 5.5, y: 1.5, w: 0.02, h: 2.5,
          backgroundColor: T.border,
        }} />
        
        {/* Secondary metrics */}
        <Text style={{
          x: 6, y: 1.5, w: 3, h: 0.8,
          ...typography.metric,
          color: T.text,
        }}>
          {content.metrics.waitTime.value}
        </Text>
        <Text style={{
          x: 6, y: 2.2, w: 3, h: 0.3,
          ...typography.bodySmall,
          color: T.textSecondary,
        }}>
          {content.metrics.waitTime.label}
        </Text>
        
        <Text style={{
          x: 6, y: 3, w: 3, h: 0.8,
          ...typography.metric,
          color: T.text,
        }}>
          {content.metrics.efficiency.value}%
        </Text>
        <Text style={{
          x: 6, y: 3.7, w: 3, h: 0.3,
          ...typography.bodySmall,
          color: T.textSecondary,
        }}>
          {content.metrics.efficiency.label}
        </Text>
      </Slide>

      {/* Slide 6: Closing */}
      <Slide style={{ backgroundColor: T.bg }}>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 2,
          w: 8, h: 0.6,
          ...typography.h1,
          color: T.textSecondary,
        }}>
          Bereit für die
        </Text>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 2.7,
          w: 8, h: 1,
          ...typography.hero,
          color: T.text,
        }}>
          Zukunft?
        </Text>
        
        <Shape type="rect" style={{
          x: SLIDE.MARGIN.LEFT, y: 3.9, w: 2, h: 0.05,
          backgroundColor: T.accent,
        }} />
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 4.2,
          w: 6, h: 0.6,
          ...typography.body,
          color: T.textSecondary,
        }}>
          {content.closing.cta}
        </Text>
      </Slide>
    </Presentation>
  );
};

// ===========================================
// DESIGN 3: DATA-FORWARD
// Dashboard-inspired, metric-centric
// ===========================================

const DataForward = () => {
  const T = THEME_DATA;
  
  return (
    <Presentation layout="16x9" title="Fahrersoftware - Data" author="AVEMO Group">
      {/* Slide 1: Title with metrics */}
      <Slide style={{ backgroundColor: T.bg }}>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 1.5,
          w: 9, h: 1,
          ...typography.hero,
          color: T.text,
        }}>
          {content.title}
        </Text>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 2.6,
          w: 5, h: 0.5,
          ...typography.lead,
          color: T.textSecondary,
        }}>
          {content.subtitle}
        </Text>
        
        {/* Metric cards row */}
        {[
          { val: '260K€', label: 'Einsparung/Jahr' },
          { val: '30', label: 'Tage schneller' },
          { val: '+40%', label: 'Effizienz' },
        ].map((m, i) => (
          <React.Fragment key={i}>
            <Shape type="roundRect" style={{
              x: SLIDE.MARGIN.LEFT + i * 3.1, y: 3.6,
              w: 2.9, h: 1.4,
              backgroundColor: T.card,
              rectRadius: RADIUS.S,
              shadow: shadows.dataCard,
            }} />
            <Text style={{
              x: SLIDE.MARGIN.LEFT + i * 3.1 + 0.2, y: 3.75,
              w: 2.5, h: 0.7,
              ...typography.metricSmall,
              color: T.accent,
            }}>
              {m.val}
            </Text>
            <Text style={{
              x: SLIDE.MARGIN.LEFT + i * 3.1 + 0.2, y: 4.5,
              w: 2.5, h: 0.3,
              ...typography.caption,
              color: T.textSecondary,
            }}>
              {m.label}
            </Text>
          </React.Fragment>
        ))}
      </Slide>

      {/* Slide 2: Problem metrics */}
      <Slide style={{ backgroundColor: T.bg }}>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.MARGIN.TOP,
          w: 5, h: 0.3,
          ...typography.overline,
          color: T.accent,
        }}>
          AKTUELLE KENNZAHLEN
        </Text>
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.85,
          w: 8, h: 0.5,
          ...typography.h1,
          color: T.text,
        }}>
          Die Herausforderungen in Zahlen
        </Text>
        
        {/* 2x2 metric cards */}
        {[
          { val: '5', unit: 'Standorte', label: 'arbeiten isoliert' },
          { val: '100%', unit: '', label: 'manuelle Prozesse' },
          { val: '2,5h', unit: '', label: 'Leerlauf pro Tag' },
          { val: '30', unit: 'Tage', label: 'durchschn. Wartezeit' },
        ].map((m, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = SLIDE.MARGIN.LEFT + col * 4.6;
          const y = 1.6 + row * 1.6;
          
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y, w: 4.4, h: 1.4,
                backgroundColor: T.card,
                rectRadius: RADIUS.S,
                shadow: shadows.dataCard,
              }} />
              <Text style={{
                x: x + 0.25, y: y + 0.2,
                w: 2.5, h: 0.7,
                ...typography.metric,
                color: T.accent,
              }}>
                {m.val}
              </Text>
              <Text style={{
                x: x + 0.25 + 2.2, y: y + 0.35,
                w: 1.5, h: 0.4,
                ...typography.label,
                color: T.textMuted,
              }}>
                {m.unit}
              </Text>
              <Text style={{
                x: x + 0.25, y: y + 0.95,
                w: 3.8, h: 0.3,
                ...typography.bodySmall,
                color: T.textSecondary,
              }}>
                {m.label}
              </Text>
            </React.Fragment>
          );
        })}
      </Slide>

      {/* Slide 3: Solution with metrics */}
      <Slide style={{ backgroundColor: T.bg }}>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.MARGIN.TOP,
          w: 3, h: 0.3,
          ...typography.overline,
          color: T.accent,
        }}>
          DIE LÖSUNG
        </Text>
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.85,
          w: 5, h: 0.5,
          ...typography.h1,
          color: T.text,
        }}>
          {content.tagline}
        </Text>
        
        {/* Main card */}
        <Shape type="roundRect" style={{
          x: SLIDE.MARGIN.LEFT, y: 1.6,
          w: 5.5, h: 3.5,
          backgroundColor: T.card,
          rectRadius: RADIUS.M,
          shadow: shadows.soft,
        }} />
        
        {content.solutions.map((s, i) => (
          <React.Fragment key={i}>
            <Shape type="ellipse" style={{
              x: SLIDE.MARGIN.LEFT + 0.25, y: 1.85 + i * 0.8,
              w: 0.2, h: 0.2,
              backgroundColor: T.accent,
            }} />
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.55, y: 1.8 + i * 0.8,
              w: 4.5, h: 0.35,
              ...typography.h4,
              color: T.text,
            }}>
              {s.title}
            </Text>
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.55, y: 2.15 + i * 0.8,
              w: 4.5, h: 0.3,
              ...typography.caption,
              color: T.textSecondary,
            }}>
              {s.desc}
            </Text>
          </React.Fragment>
        ))}
        
        {/* Right metrics panel */}
        <Shape type="roundRect" style={{
          x: 6.2, y: 1.6,
          w: 3.3, h: 3.5,
          backgroundColor: T.card,
          rectRadius: RADIUS.M,
          shadow: shadows.soft,
        }} />
        <Text style={{
          x: 6.4, y: 1.8,
          w: 2.9, h: 0.3,
          ...typography.overline,
          color: T.accent,
        }}>
          ERWARTETE ERGEBNISSE
        </Text>
        
        {[
          { label: 'ROI', val: '< 12 Mo.' },
          { label: 'Effizienz', val: '+40%' },
          { label: 'Transparenz', val: '100%' },
        ].map((m, i) => (
          <React.Fragment key={i}>
            <Text style={{
              x: 6.4, y: 2.3 + i * 0.9,
              w: 2, h: 0.25,
              ...typography.caption,
              color: T.textMuted,
            }}>
              {m.label}
            </Text>
            <Text style={{
              x: 6.4, y: 2.55 + i * 0.9,
              w: 2.5, h: 0.5,
              ...typography.h2,
              color: T.text,
            }}>
              {m.val}
            </Text>
          </React.Fragment>
        ))}
      </Slide>

      {/* Slide 4: Features */}
      <Slide style={{ backgroundColor: T.bg }}>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.MARGIN.TOP,
          w: 5, h: 0.3,
          ...typography.overline,
          color: T.accent,
        }}>
          MVP FUNKTIONEN
        </Text>
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.85,
          w: 6, h: 0.5,
          ...typography.h1,
          color: T.text,
        }}>
          Module im Überblick
        </Text>
        
        {/* 3x2 module cards */}
        {content.features.map((f, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const cardW = 2.85;
          const x = SLIDE.MARGIN.LEFT + col * (cardW + SPACING.M);
          const y = 1.6 + row * 1.5;
          
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y, w: cardW, h: 1.35,
                backgroundColor: T.card,
                rectRadius: RADIUS.S,
                shadow: shadows.dataCard,
              }} />
              <Text style={{
                x: x + 0.15, y: y + 0.15,
                w: cardW - 0.3, h: 0.25,
                ...typography.overline,
                fontSize: 9,
                color: T.accent,
              }}>
                MODULE {f.num}
              </Text>
              <Text style={{
                x: x + 0.15, y: y + 0.5,
                w: cardW - 0.3, h: 0.4,
                ...typography.h4,
                color: T.text,
              }}>
                {f.title}
              </Text>
              <Text style={{
                x: x + 0.15, y: y + 0.95,
                w: cardW - 0.3, h: 0.3,
                ...typography.caption,
                color: T.textSecondary,
              }}>
                {f.desc}
              </Text>
            </React.Fragment>
          );
        })}
      </Slide>

      {/* Slide 5: Closing */}
      <Slide style={{ backgroundColor: T.bg }}>
        {/* Central card */}
        <Shape type="roundRect" style={{
          x: 2, y: 1.3,
          w: 6, h: 3,
          backgroundColor: T.card,
          rectRadius: RADIUS.M,
          shadow: shadows.medium,
        }} />
        
        <Text style={{
          x: 2.3, y: 1.6,
          w: 5.4, h: 0.3,
          ...typography.overline,
          color: T.accent,
        }}>
          NÄCHSTE SCHRITTE
        </Text>
        
        <Text style={{
          x: 2.3, y: 2.1,
          w: 5.4, h: 0.8,
          ...typography.h1,
          color: T.text,
        }}>
          {content.closing.question}
        </Text>
        
        <Text style={{
          x: 2.3, y: 3,
          w: 5.4, h: 0.8,
          ...typography.body,
          color: T.textSecondary,
        }}>
          {content.closing.cta}
        </Text>
      </Slide>
    </Presentation>
  );
};

// ===========================================
// DESIGN 4: SPLIT COMPOSITION
// Magazine editorial, asymmetric layouts
// ===========================================

const SplitComposition = () => {
  const T = THEME_LIGHT;
  
  return (
    <Presentation layout="16x9" title="Fahrersoftware - Editorial" author="AVEMO Group">
      {/* Slide 1: Bold split */}
      <Slide style={{ backgroundColor: CORE.black }}>
        {/* Large text */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 1.2,
          w: 9, h: 1.2,
          fontSize: 72, bold: true, fontFace: FONTS.DISPLAY,
          color: CORE.white,
        }}>
          FAHRER
        </Text>
        
        {/* Orange block with text */}
        <Shape type="rect" style={{
          x: 2.8, y: 2.5, w: 6.7, h: 1.3,
          backgroundColor: ORANGE[500],
        }} />
        <Text style={{
          x: 3, y: 2.6,
          w: 6.3, h: 1.1,
          fontSize: 64, bold: true, fontFace: FONTS.DISPLAY,
          color: CORE.black,
        }}>
          SOFTWARE
        </Text>
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 4.2,
          w: 6, h: 0.5,
          ...typography.lead,
          color: GRAY[500],
        }}>
          {content.subtitle}
        </Text>
      </Slide>

      {/* Slide 2: Split problem */}
      <Slide style={{ backgroundColor: CORE.white }}>
        {/* Left orange panel */}
        <Shape type="rect" style={{
          x: 0, y: 0, w: 3.5, h: SLIDE.HEIGHT,
          backgroundColor: ORANGE[500],
        }} />
        
        {/* Big number on orange */}
        <Text style={{
          x: 0.3, y: 1.8,
          w: 2.9, h: 1.5,
          fontSize: 96, bold: true, fontFace: FONTS.DISPLAY,
          color: CORE.black,
        }}>
          01
        </Text>
        <Text style={{
          x: 0.3, y: 3.5,
          w: 2.9, h: 0.4,
          ...typography.h3,
          color: CORE.black,
        }}>
          PROBLEM
        </Text>
        
        {/* Right content */}
        <Text style={{
          x: 4, y: SLIDE.MARGIN.TOP,
          w: 5.5, h: 0.5,
          ...typography.h2,
          color: T.text,
        }}>
          Aktuelle Herausforderungen
        </Text>
        
        {content.problems.map((p, i) => (
          <React.Fragment key={i}>
            <Shape type="rect" style={{
              x: 4, y: 1.15 + i * 1, w: 0.3, h: 0.03,
              backgroundColor: T.text,
            }} />
            <Text style={{
              x: 4.5, y: 1 + i * 1,
              w: 5, h: 0.35,
              ...typography.h4,
              color: T.text,
            }}>
              {p.title}
            </Text>
            <Text style={{
              x: 4.5, y: 1.35 + i * 1,
              w: 5, h: 0.3,
              ...typography.bodySmall,
              color: T.textSecondary,
            }}>
              {p.desc}
            </Text>
          </React.Fragment>
        ))}
      </Slide>

      {/* Slide 3: Centered solution */}
      <Slide style={{ backgroundColor: CORE.black }}>
        {/* White card */}
        <Shape type="rect" style={{
          x: 1.5, y: 1,
          w: 7, h: 3.6,
          backgroundColor: CORE.white,
          shadow: shadows.strong,
        }} />
        
        <Text style={{
          x: 1.8, y: 1.3,
          w: 6.4, h: 0.3,
          ...typography.overline,
          color: ORANGE[500],
        }}>
          DIE LÖSUNG
        </Text>
        
        <Text style={{
          x: 1.8, y: 1.8,
          w: 6.4, h: 0.6,
          ...typography.h1,
          color: CORE.black,
        }}>
          {content.tagline}
        </Text>
        
        {content.solutions.map((s, i) => (
          <React.Fragment key={i}>
            <Text style={{
              x: 1.8, y: 2.6 + i * 0.45,
              w: 2, h: 0.3,
              ...typography.h4,
              color: ORANGE[500],
            }}>
              {s.title}
            </Text>
            <Text style={{
              x: 3.8, y: 2.6 + i * 0.45,
              w: 4, h: 0.3,
              ...typography.bodySmall,
              color: GRAY[600],
            }}>
              {s.desc}
            </Text>
          </React.Fragment>
        ))}
      </Slide>

      {/* Slide 4: Features */}
      <Slide style={{ backgroundColor: CORE.white }}>
        {/* Large background text */}
        <Text style={{
          x: -0.5, y: 3.5,
          w: 12, h: 2.5,
          fontSize: 140, bold: true, fontFace: FONTS.DISPLAY,
          color: GRAY[100],
        }}>
          MVP
        </Text>
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.MARGIN.TOP,
          w: 5, h: 0.3,
          ...typography.overline,
          color: ORANGE[500],
        }}>
          MINIMUM VIABLE PRODUCT
        </Text>
        
        {content.features.map((f, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = SLIDE.MARGIN.LEFT + col * 3.1;
          const y = 1 + row * 2.1;
          
          return (
            <React.Fragment key={i}>
              <Text style={{
                x, y, w: 1, h: 0.7,
                fontSize: 36, bold: true, fontFace: FONTS.DISPLAY,
                color: ORANGE[500],
              }}>
                {f.num}
              </Text>
              <Text style={{
                x, y: y + 0.7,
                w: 2.8, h: 0.4,
                ...typography.h4,
                color: T.text,
              }}>
                {f.title}
              </Text>
              <Text style={{
                x, y: y + 1.1,
                w: 2.8, h: 0.3,
                ...typography.caption,
                color: T.textSecondary,
              }}>
                {f.desc}
              </Text>
            </React.Fragment>
          );
        })}
      </Slide>

      {/* Slide 5: Closing split */}
      <Slide style={{ backgroundColor: CORE.white }}>
        {/* Top black half */}
        <Shape type="rect" style={{
          x: 0, y: 0, w: SLIDE.WIDTH, h: SLIDE.HEIGHT / 2,
          backgroundColor: CORE.black,
        }} />
        
        {/* Bottom orange half */}
        <Shape type="rect" style={{
          x: 0, y: SLIDE.HEIGHT / 2, w: SLIDE.WIDTH, h: SLIDE.HEIGHT / 2,
          backgroundColor: ORANGE[500],
        }} />
        
        {/* Text spanning both */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.8,
          w: 8, h: 0.6,
          ...typography.h2,
          color: CORE.white,
        }}>
          Bereit für die
        </Text>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 1.5,
          w: 8, h: 1,
          ...typography.hero,
          color: CORE.white,
        }}>
          Zukunft?
        </Text>
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 3.3,
          w: 7, h: 0.8,
          ...typography.body,
          color: CORE.black,
        }}>
          {content.closing.cta}
        </Text>
      </Slide>
    </Presentation>
  );
};

// ===========================================
// DESIGN 5: WARM PROFESSIONAL
// AVEMO Fleet style with blue accent
// ===========================================

const WarmProfessional = () => {
  const T = THEME_WARM;
  
  return (
    <Presentation layout="16x9" title="Fahrersoftware - Professional" author="AVEMO Group">
      {/* Slide 1: Clean title */}
      <Slide style={{ backgroundColor: T.bg }}>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 1.8,
          w: 7, h: 1,
          ...typography.hero,
          color: T.text,
        }}>
          {content.title}
        </Text>
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 2.9,
          w: 6, h: 0.5,
          ...typography.lead,
          color: T.textSecondary,
        }}>
          {content.subtitle}
        </Text>
        
        {/* Blue underline */}
        <Shape type="rect" style={{
          x: SLIDE.MARGIN.LEFT, y: 3.6, w: 1.5, h: 0.05,
          backgroundColor: T.accent,
        }} />
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 3.85,
          w: 5, h: 0.4,
          ...typography.body,
          color: T.textMuted,
        }}>
          {content.tagline}
        </Text>
      </Slide>

      {/* Slide 2: Problems */}
      <Slide style={{ backgroundColor: T.bg }}>
        {/* Blue header bar */}
        <Shape type="rect" style={{
          x: 0, y: 0, w: SLIDE.WIDTH, h: 1,
          backgroundColor: T.accent,
        }} />
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.35,
          w: 8, h: 0.4,
          ...typography.h2,
          color: CORE.white,
        }}>
          Aktuelle Herausforderungen
        </Text>
        
        {/* Problem cards */}
        {content.problems.map((p, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = SLIDE.MARGIN.LEFT + col * 4.6;
          const y = 1.4 + row * 1.6;
          
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y, w: 4.4, h: 1.4,
                backgroundColor: T.card,
                rectRadius: RADIUS.S,
                shadow: shadows.lightCard,
              }} />
              <Text style={{
                x: x + 0.2, y: y + 0.2,
                w: 4, h: 0.4,
                ...typography.h3,
                color: T.text,
              }}>
                {p.title}
              </Text>
              <Text style={{
                x: x + 0.2, y: y + 0.7,
                w: 4, h: 0.5,
                ...typography.bodySmall,
                color: T.textSecondary,
              }}>
                {p.desc}
              </Text>
            </React.Fragment>
          );
        })}
      </Slide>

      {/* Slide 3: Solution */}
      <Slide style={{ backgroundColor: T.bg }}>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.MARGIN.TOP,
          w: 3, h: 0.3,
          ...typography.overline,
          color: T.accent,
        }}>
          UNSERE LÖSUNG
        </Text>
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.9,
          w: 6, h: 0.5,
          ...typography.h1,
          color: T.text,
        }}>
          {content.tagline}
        </Text>
        
        {/* Main content card */}
        <Shape type="roundRect" style={{
          x: SLIDE.MARGIN.LEFT, y: 1.7,
          w: 5.5, h: 3.5,
          backgroundColor: T.card,
          rectRadius: RADIUS.M,
          shadow: shadows.soft,
        }} />
        
        {content.solutions.map((s, i) => (
          <React.Fragment key={i}>
            <Shape type="ellipse" style={{
              x: SLIDE.MARGIN.LEFT + 0.25, y: 2 + i * 0.8,
              w: 0.2, h: 0.2,
              backgroundColor: T.accent,
            }} />
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.55, y: 1.95 + i * 0.8,
              w: 4.5, h: 0.35,
              ...typography.h4,
              color: T.text,
            }}>
              {s.title}
            </Text>
            <Text style={{
              x: SLIDE.MARGIN.LEFT + 0.55, y: 2.3 + i * 0.8,
              w: 4.5, h: 0.3,
              ...typography.caption,
              color: T.textSecondary,
            }}>
              {s.desc}
            </Text>
          </React.Fragment>
        ))}
        
        {/* Right side metric */}
        <Shape type="roundRect" style={{
          x: 6.2, y: 1.7,
          w: 3.3, h: 3.5,
          backgroundColor: T.accent,
          rectRadius: RADIUS.M,
        }} />
        <Text style={{
          x: 6.4, y: 2.2,
          w: 2.9, h: 1,
          ...typography.metricLarge,
          fontSize: 64,
          color: CORE.white,
        }}>
          260K
        </Text>
        <Text style={{
          x: 6.4, y: 3.2,
          w: 2.9, h: 0.5,
          ...typography.h2,
          color: CORE.white,
        }}>
          Euro
        </Text>
        <Text style={{
          x: 6.4, y: 3.8,
          w: 2.9, h: 0.5,
          ...typography.body,
          color: 'rgba(255,255,255,0.8)',
        }}>
          jährliche Einsparung
        </Text>
      </Slide>

      {/* Slide 4: Features */}
      <Slide style={{ backgroundColor: T.bg }}>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.MARGIN.TOP,
          w: 5, h: 0.3,
          ...typography.overline,
          color: T.accent,
        }}>
          MINIMUM VIABLE PRODUCT
        </Text>
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 0.85,
          w: 6, h: 0.5,
          ...typography.h1,
          color: T.text,
        }}>
          Die Kernfunktionen
        </Text>
        
        {/* 3x2 cards */}
        {content.features.map((f, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const cardW = 2.85;
          const x = SLIDE.MARGIN.LEFT + col * (cardW + SPACING.M);
          const y = 1.6 + row * 1.5;
          
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y, w: cardW, h: 1.35,
                backgroundColor: T.card,
                rectRadius: RADIUS.S,
                shadow: shadows.lightCard,
              }} />
              <Text style={{
                x: x + 0.15, y: y + 0.15,
                w: 1, h: 0.35,
                ...typography.featureNum,
                color: T.accent,
              }}>
                {f.num}
              </Text>
              <Text style={{
                x: x + 0.15, y: y + 0.55,
                w: cardW - 0.3, h: 0.35,
                ...typography.h4,
                color: T.text,
              }}>
                {f.title}
              </Text>
              <Text style={{
                x: x + 0.15, y: y + 0.95,
                w: cardW - 0.3, h: 0.3,
                ...typography.caption,
                color: T.textSecondary,
              }}>
                {f.desc}
              </Text>
            </React.Fragment>
          );
        })}
      </Slide>

      {/* Slide 5: Closing */}
      <Slide style={{ backgroundColor: T.bg }}>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 1.8,
          w: 8, h: 0.6,
          ...typography.h1,
          color: T.textSecondary,
        }}>
          Bereit für die
        </Text>
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 2.5,
          w: 8, h: 1,
          ...typography.hero,
          color: T.text,
        }}>
          Zukunft?
        </Text>
        
        {/* Blue underline */}
        <Shape type="rect" style={{
          x: SLIDE.MARGIN.LEFT, y: 3.7, w: 2, h: 0.05,
          backgroundColor: T.accent,
        }} />
        
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: 4,
          w: 6, h: 0.8,
          ...typography.body,
          color: T.textSecondary,
        }}>
          {content.closing.cta}
        </Text>
        
        {/* Contact */}
        <Text style={{
          x: SLIDE.MARGIN.LEFT, y: SLIDE.HEIGHT - 0.6,
          w: 3, h: 0.3,
          ...typography.caption,
          color: T.textMuted,
        }}>
          AVEMO Group | avemo-group.de
        </Text>
      </Slide>
    </Presentation>
  );
};

// ===========================================
// MAIN GENERATOR
// ===========================================

async function generatePresentations() {
  const outputDir = path.join(process.cwd(), 'output');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const presentations = [
    { name: '01-executive-black', component: <ExecutiveBlack /> },
    { name: '02-clean-white', component: <CleanWhite /> },
    { name: '03-data-forward', component: <DataForward /> },
    { name: '04-split-composition', component: <SplitComposition /> },
    { name: '05-warm-professional', component: <WarmProfessional /> },
  ];
  
  console.log('Generating AVEMO Fahrersoftware presentations...\n');
  
  for (const { name, component } of presentations) {
    try {
      const buffer = await render(component);
      const filePath = path.join(outputDir, `${name}.pptx`);
      fs.writeFileSync(filePath, buffer as Buffer);
      console.log(`  Generated: ${name}.pptx`);
    } catch (error) {
      console.error(`  Error generating ${name}:`, error);
    }
  }
  
  console.log('\nDone! Presentations saved to ./output/');
}

generatePresentations().catch(console.error);
