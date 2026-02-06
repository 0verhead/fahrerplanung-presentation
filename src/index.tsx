/**
 * AVEMO Fahrersoftware Presentation Generator
 * Generates 5 sophisticated PowerPoint presentations using react-pptx-extended
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
  ShadowProps,
} from 'react-pptx-extended';
import { AVEMO, AVEMO_HEX } from './theme/colors';
import { shadows } from './theme/shadows';
import { typography } from './theme/typography';
import { gradients, createRadialGradientSvg, createLinearGradientSvg } from './utils/gradient';

// ============================================
// CONTENT DATA
// ============================================

const content = {
  title: 'Fahrersoftware',
  subtitle: 'Die Zukunft der Fahrzeugdisposition',
  tagline: 'Eine Software für alle Standorte',
  
  problems: [
    { title: 'Isolierte Standorte', desc: 'Keine Vernetzung zwischen den Niederlassungen' },
    { title: 'Manuelle Prozesse', desc: 'Excel, Outlook & Kalender führen zu Chaos' },
    { title: 'Fehlende Daten', desc: 'Keine KPIs, keine Optimierung möglich' },
    { title: 'Hohe Leerlaufzeit', desc: '2,5 Stunden täglich pro Fahrzeug' },
    { title: 'Lange Wartezeit', desc: '30 Tage durchschnittlich auf Fahrzeuge' },
  ],
  
  solutions: [
    { title: 'Synergien nutzen', desc: 'Vernetzung aller Standorte' },
    { title: 'Effizienz steigern', desc: 'Optimierte Fahrzeugnutzung' },
    { title: 'Automatisierung', desc: 'Weniger manuelle Arbeit' },
    { title: 'Kosteneinsparung', desc: '260.000 € jährlich' },
  ],
  
  features: [
    { num: '01', title: 'Planungsalgorithmus', desc: 'Optimierte Tourenplanung' },
    { num: '02', title: 'Driver App', desc: 'Intuitive Bedienung' },
    { num: '03', title: 'Web-Backoffice', desc: 'Moderne Oberfläche' },
    { num: '04', title: 'Externe Dienstleister', desc: 'Nahtlose Integration' },
    { num: '05', title: 'Monitoring', desc: 'Echtzeit-Übersicht' },
    { num: '06', title: 'Reporting', desc: 'Automatisierte Reports' },
  ],
  
  closing: {
    question: 'Bereit für die Zukunft?',
    cta: 'Gemeinsam gestalten wir die digitale Transformation Ihrer Fahrzeugdisposition.',
  },
};

// ============================================
// DESIGN 1: CINEMATIC DARK
// ============================================

const CinematicDark = () => (
  <Presentation layout="16x9" title="Fahrersoftware - Cinematic" author="AVEMO Group">
    {/* Slide 1: Title */}
    <Slide style={{ backgroundColor: AVEMO.darkBg }}>
      {/* Orange glow circle */}
      <Shape
        type="ellipse"
        style={{
          x: 7, y: -1, w: 8, h: 8,
          backgroundColor: 'rgba(255, 121, 50, 0.15)',
        }}
      />
      {/* Top accent bar */}
      <Shape
        type="rect"
        style={{
          x: 0, y: 0, w: '100%', h: 0.12,
          backgroundColor: AVEMO.orange,
        }}
      />
      {/* Main title */}
      <Text style={{
        x: 0.8, y: 2.2, w: 10, h: 1.5,
        ...typography.display,
        color: AVEMO.white,
      }}>
        {content.title}
      </Text>
      {/* Subtitle */}
      <Text style={{
        x: 0.8, y: 3.8, w: 8, h: 0.8,
        ...typography.subtitle,
        color: AVEMO.orange,
        bold: true,
      }}>
        {content.subtitle}
      </Text>
      {/* Glass card */}
      <Shape
        type="roundRect"
        style={{
          x: 0.8, y: 4.8, w: 7, h: 1.2,
          backgroundColor: 'rgba(26, 26, 26, 0.7)',
          borderColor: AVEMO.orange,
          borderWidth: 1.5,
          rectRadius: 0.15,
          shadow: shadows.glass,
        }}
      />
      <Text style={{
        x: 1, y: 5.1, w: 6.6, h: 0.7,
        ...typography.bodyLarge,
        color: AVEMO.white,
      }}>
        {content.tagline}
      </Text>
    </Slide>

    {/* Slide 2: Problem */}
    <Slide style={{ backgroundColor: AVEMO.darkBg }}>
      {/* Left panel */}
      <Shape
        type="rect"
        style={{
          x: 0, y: 0, w: 4.5, h: '100%',
          backgroundColor: '#141414',
        }}
      />
      <Text style={{
        x: 0.5, y: 0.8, w: 3.5, h: 0.5,
        ...typography.sectionLabel,
        color: AVEMO.orange,
      }}>
        DAS PROBLEM
      </Text>
      <Text style={{
        x: 0.5, y: 1.4, w: 3.8, h: 1,
        ...typography.heading,
        color: AVEMO.white,
      }}>
        Aktuelle Herausforderungen
      </Text>
      {/* Problem cards */}
      {content.problems.slice(0, 4).map((problem, i) => (
        <React.Fragment key={i}>
          <Shape
            type="roundRect"
            style={{
              x: 0.5, y: 2.8 + i * 1.05, w: 3.8, h: 0.9,
              backgroundColor: 'rgba(34, 34, 34, 0.8)',
              borderColor: AVEMO.orange,
              borderWidth: 1,
              rectRadius: 0.1,
              shadow: shadows.subtle,
            }}
          />
          <Text style={{
            x: 0.7, y: 2.9 + i * 1.05, w: 3.4, h: 0.35,
            ...typography.cardTitle,
            color: AVEMO.white,
          }}>
            {problem.title}
          </Text>
          <Text style={{
            x: 0.7, y: 3.25 + i * 1.05, w: 3.4, h: 0.35,
            ...typography.caption,
            color: '#AAAAAA',
          }}>
            {problem.desc}
          </Text>
        </React.Fragment>
      ))}
      {/* Right side - big stat */}
      <Text style={{
        x: 5, y: 2.5, w: 7.5, h: 1.8,
        fontSize: 120,
        bold: true,
        fontFace: 'Arial Black',
        color: AVEMO.orange,
        align: 'center',
      }}>
        30 Tage
      </Text>
      <Text style={{
        x: 5, y: 4.5, w: 7.5, h: 0.6,
        ...typography.bodyLarge,
        color: AVEMO.white,
        align: 'center',
      }}>
        durchschnittliche Wartezeit auf Fahrzeuge
      </Text>
    </Slide>

    {/* Slide 3: Solution */}
    <Slide style={{ backgroundColor: AVEMO.darkBg }}>
      {/* Diagonal accent */}
      <Shape
        type="rect"
        style={{
          x: -2, y: 4.5, w: 18, h: 3,
          backgroundColor: 'rgba(255, 121, 50, 0.15)',
          rotate: -12,
        }}
      />
      <Text style={{
        x: 0.8, y: 0.8, w: 5, h: 0.5,
        ...typography.sectionLabel,
        color: AVEMO.orange,
      }}>
        DIE LÖSUNG
      </Text>
      <Text style={{
        x: 0.8, y: 1.4, w: 10, h: 1,
        ...typography.title,
        color: AVEMO.white,
      }}>
        {content.tagline}
      </Text>
      {/* Benefit items */}
      {content.solutions.map((solution, i) => (
        <React.Fragment key={i}>
          {/* Orange accent bar */}
          <Shape
            type="rect"
            style={{
              x: 0.8 + (i % 2) * 6, y: 2.8 + Math.floor(i / 2) * 1.8, w: 0.08, h: 1.2,
              backgroundColor: AVEMO.orange,
            }}
          />
          <Text style={{
            x: 1.1 + (i % 2) * 6, y: 2.85 + Math.floor(i / 2) * 1.8, w: 5, h: 0.5,
            ...typography.cardTitle,
            fontSize: 22,
            color: AVEMO.white,
          }}>
            {solution.title}
          </Text>
          <Text style={{
            x: 1.1 + (i % 2) * 6, y: 3.35 + Math.floor(i / 2) * 1.8, w: 5, h: 0.5,
            ...typography.body,
            color: '#BBBBBB',
          }}>
            {solution.desc}
          </Text>
        </React.Fragment>
      ))}
    </Slide>

    {/* Slide 4: MVP Features */}
    <Slide style={{ backgroundColor: AVEMO.darkBg }}>
      <Text style={{
        x: 0.8, y: 0.6, w: 6, h: 0.4,
        ...typography.label,
        color: AVEMO.orange,
      }}>
        MINIMUM VIABLE PRODUCT
      </Text>
      <Text style={{
        x: 0.8, y: 1.1, w: 10, h: 0.8,
        ...typography.title,
        fontSize: 40,
        color: AVEMO.white,
      }}>
        Die Kernfunktionen
      </Text>
      {/* Feature cards in 3x2 grid */}
      {content.features.map((feature, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <React.Fragment key={i}>
            <Shape
              type="roundRect"
              style={{
                x: 0.8 + col * 4, y: 2.2 + row * 2.2, w: 3.6, h: 1.8,
                backgroundColor: 'rgba(26, 26, 26, 0.6)',
                borderColor: AVEMO.orange,
                borderWidth: 1.5,
                rectRadius: 0.12,
                shadow: shadows.glass,
              }}
            />
            <Text style={{
              x: 1 + col * 4, y: 2.35 + row * 2.2, w: 1, h: 0.5,
              ...typography.featureNumber,
              color: AVEMO.orange,
            }}>
              {feature.num}
            </Text>
            <Text style={{
              x: 1 + col * 4, y: 2.9 + row * 2.2, w: 3.2, h: 0.8,
              ...typography.cardTitle,
              color: AVEMO.white,
            }}>
              {feature.title}
            </Text>
            <Text style={{
              x: 1 + col * 4, y: 3.5 + row * 2.2, w: 3.2, h: 0.4,
              ...typography.caption,
              color: '#999999',
            }}>
              {feature.desc}
            </Text>
          </React.Fragment>
        );
      })}
    </Slide>

    {/* Slide 5: Closing */}
    <Slide style={{ backgroundColor: AVEMO.darkBg }}>
      {/* Large orange glow */}
      <Shape
        type="ellipse"
        style={{
          x: 6, y: -2, w: 12, h: 14,
          backgroundColor: 'rgba(255, 121, 50, 0.12)',
        }}
      />
      <Text style={{
        x: 0.8, y: 2.3, w: 10, h: 0.8,
        ...typography.title,
        color: AVEMO.white,
      }}>
        Bereit für die
      </Text>
      <Text style={{
        x: 0.8, y: 3.2, w: 10, h: 1.5,
        ...typography.display,
        color: AVEMO.orange,
      }}>
        Zukunft?
      </Text>
      <Text style={{
        x: 0.8, y: 5, w: 7, h: 1,
        ...typography.body,
        fontSize: 18,
        color: '#CCCCCC',
      }}>
        {content.closing.cta}
      </Text>
      {/* Orange accent line */}
      <Shape
        type="rect"
        style={{
          x: 0.8, y: 6.3, w: 2.5, h: 0.06,
          backgroundColor: AVEMO.orange,
        }}
      />
    </Slide>
  </Presentation>
);

// ============================================
// DESIGN 2: MINIMAL GLASS
// ============================================

const MinimalGlass = () => (
  <Presentation layout="16x9" title="Fahrersoftware - Minimal" author="AVEMO Group">
    {/* Slide 1: Title */}
    <Slide style={{ backgroundColor: AVEMO.white }}>
      {/* Subtle gray shape */}
      <Shape
        type="rect"
        style={{
          x: -1, y: -1, w: 7, h: 9,
          backgroundColor: AVEMO.grayLight,
        }}
      />
      {/* Glass card */}
      <Shape
        type="roundRect"
        style={{
          x: 1, y: 2, w: 8, h: 3.5,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#E0E0E0',
          borderWidth: 1,
          rectRadius: 0.2,
          shadow: shadows.float,
        }}
      />
      {/* Orange dot */}
      <Shape
        type="ellipse"
        style={{
          x: 1.5, y: 2.5, w: 0.3, h: 0.3,
          backgroundColor: AVEMO.orange,
        }}
      />
      <Text style={{
        x: 2, y: 2.4, w: 6, h: 0.4,
        ...typography.sectionLabel,
        color: AVEMO.grayMid,
      }}>
        {content.title}
      </Text>
      <Text style={{
        x: 1.5, y: 3.1, w: 7, h: 1.2,
        ...typography.title,
        fontSize: 48,
        color: AVEMO.black,
      }}>
        {content.subtitle}
      </Text>
      <Text style={{
        x: 1.5, y: 4.4, w: 6, h: 0.6,
        ...typography.bodyLarge,
        color: AVEMO.grayMid,
      }}>
        {content.tagline}
      </Text>
      {/* Orange line */}
      <Shape
        type="rect"
        style={{
          x: 1.5, y: 5.2, w: 1.5, h: 0.05,
          backgroundColor: AVEMO.orange,
        }}
      />
    </Slide>

    {/* Slide 2: Problem */}
    <Slide style={{ backgroundColor: AVEMO.white }}>
      <Text style={{
        x: 0.8, y: 0.6, w: 5, h: 0.5,
        ...typography.heading,
        color: AVEMO.black,
      }}>
        Aktuelle Situation
      </Text>
      {/* Orange underline */}
      <Shape
        type="rect"
        style={{
          x: 0.8, y: 1.15, w: 1.2, h: 0.06,
          backgroundColor: AVEMO.orange,
        }}
      />
      {/* Problem items */}
      {content.problems.map((problem, i) => (
        <React.Fragment key={i}>
          {/* Number circle */}
          <Shape
            type="ellipse"
            style={{
              x: 0.8, y: 1.6 + i * 1.1, w: 0.5, h: 0.5,
              backgroundColor: i === 0 ? AVEMO.orange : AVEMO.grayLight,
            }}
          />
          <Text style={{
            x: 0.95, y: 1.68 + i * 1.1, w: 0.3, h: 0.35,
            fontSize: 14,
            bold: true,
            color: i === 0 ? AVEMO.white : AVEMO.grayMid,
            align: 'center',
          }}>
            {String(i + 1)}
          </Text>
          {/* Card */}
          <Shape
            type="roundRect"
            style={{
              x: 1.5, y: 1.5 + i * 1.1, w: 11, h: 0.9,
              backgroundColor: AVEMO.white,
              borderColor: '#E8E8E8',
              borderWidth: 1,
              rectRadius: 0.1,
              shadow: shadows.subtle,
            }}
          />
          <Text style={{
            x: 1.7, y: 1.6 + i * 1.1, w: 3, h: 0.35,
            ...typography.cardTitle,
            color: AVEMO.black,
          }}>
            {problem.title}
          </Text>
          <Text style={{
            x: 1.7, y: 1.95 + i * 1.1, w: 10, h: 0.35,
            ...typography.cardDescription,
            color: AVEMO.grayMid,
          }}>
            {problem.desc}
          </Text>
        </React.Fragment>
      ))}
    </Slide>

    {/* Slide 3: Solution */}
    <Slide style={{ backgroundColor: AVEMO.white }}>
      {/* Orange panel */}
      <Shape
        type="rect"
        style={{
          x: 8, y: 0, w: 5.5, h: '100%',
          backgroundColor: AVEMO.orange,
        }}
      />
      <Text style={{
        x: 0.8, y: 0.8, w: 6, h: 0.4,
        ...typography.sectionLabel,
        color: AVEMO.orange,
      }}>
        Unsere Lösung
      </Text>
      <Text style={{
        x: 0.8, y: 1.4, w: 6, h: 1,
        ...typography.heading,
        fontSize: 36,
        color: AVEMO.black,
      }}>
        {content.tagline}
      </Text>
      {/* Solution items */}
      {content.solutions.map((solution, i) => (
        <React.Fragment key={i}>
          <Shape
            type="ellipse"
            style={{
              x: 0.8, y: 2.8 + i * 1.1, w: 0.5, h: 0.5,
              backgroundColor: AVEMO.orange,
            }}
          />
          <Text style={{
            x: 1.5, y: 2.85 + i * 1.1, w: 2.5, h: 0.4,
            ...typography.cardTitle,
            fontSize: 20,
            color: AVEMO.black,
          }}>
            {solution.title}
          </Text>
          <Text style={{
            x: 1.5, y: 3.25 + i * 1.1, w: 5, h: 0.4,
            ...typography.body,
            color: AVEMO.grayMid,
          }}>
            {solution.desc}
          </Text>
        </React.Fragment>
      ))}
      {/* White text on orange */}
      <Text style={{
        x: 8.5, y: 2.8, w: 4.5, h: 2,
        ...typography.subtitle,
        color: AVEMO.white,
      }}>
        Transformieren Sie Ihre Fahrzeugdisposition mit moderner Technologie
      </Text>
    </Slide>

    {/* Slide 4: MVP */}
    <Slide style={{ backgroundColor: AVEMO.white }}>
      <Text style={{
        x: 0.8, y: 0.6, w: 6, h: 0.4,
        ...typography.sectionLabel,
        color: AVEMO.orange,
      }}>
        Minimum Viable Product
      </Text>
      <Text style={{
        x: 0.8, y: 1.1, w: 10, h: 0.8,
        ...typography.title,
        fontSize: 40,
        color: AVEMO.black,
      }}>
        Die Kernfunktionen
      </Text>
      {/* Feature cards */}
      {content.features.map((feature, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <React.Fragment key={i}>
            <Shape
              type="roundRect"
              style={{
                x: 0.8 + col * 4.1, y: 2.3 + row * 2.2, w: 3.8, h: 1.9,
                backgroundColor: AVEMO.white,
                borderColor: '#DDDDDD',
                borderWidth: 1,
                rectRadius: 0.12,
                shadow: shadows.float,
              }}
            />
            {/* Orange accent bar */}
            <Shape
              type="rect"
              style={{
                x: 0.8 + col * 4.1, y: 2.3 + row * 2.2, w: 3.8, h: 0.08,
                backgroundColor: AVEMO.orange,
              }}
            />
            <Text style={{
              x: 1.1 + col * 4.1, y: 2.55 + row * 2.2, w: 0.8, h: 0.3,
              ...typography.label,
              color: AVEMO.orange,
            }}>
              {feature.num}
            </Text>
            <Text style={{
              x: 1.1 + col * 4.1, y: 2.9 + row * 2.2, w: 3.2, h: 0.8,
              ...typography.cardTitle,
              fontSize: 20,
              color: AVEMO.black,
            }}>
              {feature.title}
            </Text>
          </React.Fragment>
        );
      })}
    </Slide>

    {/* Slide 5: Closing */}
    <Slide style={{ backgroundColor: AVEMO.white }}>
      {/* Subtle orange dots */}
      {[[2, 1], [10, 5], [11, 0.5], [1, 6]].map(([x, y], i) => (
        <Shape
          key={i}
          type="ellipse"
          style={{
            x, y, w: 0.3, h: 0.3,
            backgroundColor: 'rgba(255, 121, 50, 0.3)',
          }}
        />
      ))}
      <Text style={{
        x: 0.8, y: 2.6, w: 10, h: 0.8,
        ...typography.heading,
        fontSize: 36,
        color: AVEMO.grayMid,
      }}>
        Bereit für die
      </Text>
      <Text style={{
        x: 0.8, y: 3.3, w: 10, h: 1.2,
        ...typography.display,
        fontSize: 72,
        color: AVEMO.black,
      }}>
        Zukunft?
      </Text>
      {/* Orange underline */}
      <Shape
        type="rect"
        style={{
          x: 0.8, y: 4.6, w: 3, h: 0.08,
          backgroundColor: AVEMO.orange,
        }}
      />
      <Text style={{
        x: 0.8, y: 5.1, w: 8, h: 0.8,
        ...typography.body,
        fontSize: 18,
        color: AVEMO.grayMid,
      }}>
        {content.closing.cta}
      </Text>
    </Slide>
  </Presentation>
);

// ============================================
// DESIGN 3: BOLD EDITORIAL
// ============================================

const BoldEditorial = () => (
  <Presentation layout="16x9" title="Fahrersoftware - Editorial" author="AVEMO Group">
    {/* Slide 1: Title */}
    <Slide style={{ backgroundColor: AVEMO.black }}>
      <Text style={{
        x: -0.2, y: 1.5, w: 14, h: 2,
        fontSize: 140,
        bold: true,
        fontFace: 'Arial Black',
        color: AVEMO.white,
      }}>
        FAHRER
      </Text>
      {/* Orange block */}
      <Shape
        type="rect"
        style={{
          x: 5.5, y: 3.3, w: 8, h: 1.8,
          backgroundColor: AVEMO.orange,
        }}
      />
      <Text style={{
        x: 5.7, y: 3.4, w: 7.5, h: 1.6,
        fontSize: 100,
        bold: true,
        fontFace: 'Arial Black',
        color: AVEMO.black,
      }}>
        SOFTWARE
      </Text>
      <Text style={{
        x: 0.8, y: 5.8, w: 8, h: 0.6,
        ...typography.subtitle,
        color: AVEMO.white,
      }}>
        {content.subtitle}
      </Text>
    </Slide>

    {/* Slide 2: Problem */}
    <Slide>
      {/* Split layout */}
      <Shape
        type="rect"
        style={{
          x: 0, y: 0, w: 4, h: '100%',
          backgroundColor: AVEMO.orange,
        }}
      />
      <Shape
        type="rect"
        style={{
          x: 4, y: 0, w: 9.5, h: '100%',
          backgroundColor: AVEMO.white,
        }}
      />
      {/* Left side */}
      <Text style={{
        x: 0.5, y: 2.5, w: 3, h: 2,
        fontSize: 120,
        bold: true,
        fontFace: 'Arial Black',
        color: AVEMO.black,
      }}>
        01
      </Text>
      <Text style={{
        x: 0.8, y: 5, w: 3, h: 0.5,
        ...typography.cardTitle,
        color: AVEMO.black,
      }}>
        PROBLEM
      </Text>
      {/* Right side */}
      <Text style={{
        x: 4.5, y: 0.8, w: 8, h: 0.6,
        ...typography.heading,
        color: AVEMO.black,
      }}>
        Aktuelle Herausforderungen
      </Text>
      {content.problems.map((problem, i) => (
        <React.Fragment key={i}>
          {/* Black accent line */}
          <Shape
            type="rect"
            style={{
              x: 4.5, y: 1.95 + i * 1, w: 0.4, h: 0.04,
              backgroundColor: AVEMO.black,
            }}
          />
          <Text style={{
            x: 5.1, y: 1.8 + i * 1, w: 7, h: 0.5,
            ...typography.cardTitle,
            fontSize: 22,
            color: AVEMO.black,
          }}>
            {problem.title}
          </Text>
        </React.Fragment>
      ))}
    </Slide>

    {/* Slide 3: Solution */}
    <Slide style={{ backgroundColor: AVEMO.black }}>
      {/* White block */}
      <Shape
        type="rect"
        style={{
          x: 2, y: 1.5, w: 9, h: 4.5,
          backgroundColor: AVEMO.white,
          shadow: shadows.dramatic,
        }}
      />
      <Text style={{
        x: 2.5, y: 1.8, w: 8, h: 0.4,
        ...typography.sectionLabel,
        color: AVEMO.orange,
      }}>
        DIE LÖSUNG
      </Text>
      <Text style={{
        x: 2.5, y: 2.4, w: 8, h: 1,
        ...typography.heading,
        fontSize: 36,
        color: AVEMO.black,
      }}>
        {content.tagline}
      </Text>
      {content.solutions.map((solution, i) => (
        <React.Fragment key={i}>
          <Text style={{
            x: 2.5, y: 3.5 + i * 0.6, w: 2.5, h: 0.4,
            ...typography.body,
            bold: true,
            color: AVEMO.orange,
          }}>
            {solution.title}
          </Text>
          <Text style={{
            x: 5, y: 3.5 + i * 0.6, w: 5.5, h: 0.4,
            ...typography.body,
            color: AVEMO.grayMid,
          }}>
            {solution.desc}
          </Text>
        </React.Fragment>
      ))}
    </Slide>

    {/* Slide 4: MVP */}
    <Slide style={{ backgroundColor: AVEMO.white }}>
      {/* Large background text */}
      <Text style={{
        x: -1, y: 4.5, w: 20, h: 3,
        fontSize: 200,
        bold: true,
        fontFace: 'Arial Black',
        color: '#F0F0F0',
      }}>
        MVP
      </Text>
      <Text style={{
        x: 0.8, y: 0.6, w: 6, h: 0.4,
        ...typography.sectionLabel,
        color: AVEMO.orange,
      }}>
        MINIMUM VIABLE PRODUCT
      </Text>
      {content.features.map((feature, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <React.Fragment key={i}>
            <Text style={{
              x: 0.8 + col * 4.1, y: 1.5 + row * 2.8, w: 1, h: 0.8,
              fontSize: 48,
              bold: true,
              fontFace: 'Arial Black',
              color: AVEMO.orange,
            }}>
              {feature.num}
            </Text>
            <Text style={{
              x: 0.8 + col * 4.1, y: 2.3 + row * 2.8, w: 3.8, h: 0.6,
              ...typography.cardTitle,
              fontSize: 20,
              color: AVEMO.black,
            }}>
              {feature.title}
            </Text>
            <Text style={{
              x: 0.8 + col * 4.1, y: 2.8 + row * 2.8, w: 3.8, h: 0.4,
              ...typography.cardDescription,
              color: AVEMO.grayMid,
            }}>
              {feature.desc}
            </Text>
          </React.Fragment>
        );
      })}
    </Slide>

    {/* Slide 5: Closing */}
    <Slide style={{ backgroundColor: AVEMO.black }}>
      {/* Diagonal orange */}
      <Shape
        type="rect"
        style={{
          x: 5, y: -3, w: 4, h: 14,
          backgroundColor: AVEMO.orange,
          rotate: -25,
        }}
      />
      <Text style={{
        x: 0.8, y: 2.5, w: 8, h: 0.8,
        ...typography.heading,
        fontSize: 36,
        color: AVEMO.white,
      }}>
        Bereit für
      </Text>
      <Text style={{
        x: 0.8, y: 3.3, w: 8, h: 1.2,
        ...typography.hero,
        fontSize: 60,
        color: AVEMO.orange,
      }}>
        die Zukunft?
      </Text>
      <Text style={{
        x: 0.8, y: 4.8, w: 7, h: 1,
        ...typography.body,
        color: AVEMO.grayMid,
      }}>
        {content.closing.cta}
      </Text>
    </Slide>
  </Presentation>
);

// ============================================
// DESIGN 4: ASYMMETRIC MODERN
// ============================================

const AsymmetricModern = () => (
  <Presentation layout="16x9" title="Fahrersoftware - Asymmetric" author="AVEMO Group">
    {/* Slide 1: Title */}
    <Slide style={{ backgroundColor: '#F8F9FA' }}>
      {/* Asymmetric orange shape */}
      <Shape
        type="roundRect"
        style={{
          x: 7, y: -1, w: 7, h: 10,
          backgroundColor: AVEMO.orange,
          rectRadius: 0.5,
        }}
      />
      <Text style={{
        x: 1, y: 2.5, w: 5.5, h: 1.2,
        ...typography.title,
        fontSize: 52,
        color: AVEMO.black,
      }}>
        {content.title}
      </Text>
      <Text style={{
        x: 1, y: 3.8, w: 5, h: 0.8,
        ...typography.bodyLarge,
        color: AVEMO.grayMid,
      }}>
        {content.subtitle}
      </Text>
      {/* Subtle line */}
      <Shape
        type="rect"
        style={{
          x: 1, y: 4.8, w: 2, h: 0.04,
          backgroundColor: AVEMO.orange,
        }}
      />
      {/* Content on orange */}
      <Text style={{
        x: 7.5, y: 3, w: 5.5, h: 2,
        ...typography.subtitle,
        color: AVEMO.white,
      }}>
        {content.tagline}
      </Text>
    </Slide>

    {/* Slide 2: Problem */}
    <Slide style={{ backgroundColor: AVEMO.white }}>
      {/* Header bar */}
      <Shape
        type="rect"
        style={{
          x: 0, y: 0, w: '100%', h: 1.5,
          backgroundColor: AVEMO.orange,
        }}
      />
      <Text style={{
        x: 0.8, y: 0.5, w: 10, h: 0.6,
        ...typography.heading,
        color: AVEMO.white,
      }}>
        Aktuelle Herausforderungen
      </Text>
      {/* Scattered cards */}
      {[
        { x: 0.8, y: 1.8 },
        { x: 4.5, y: 1.8 },
        { x: 8.2, y: 1.8 },
        { x: 2.6, y: 4 },
        { x: 6.3, y: 4 },
      ].map((pos, i) => (
        <React.Fragment key={i}>
          <Shape
            type="roundRect"
            style={{
              x: pos.x, y: pos.y, w: 3.5, h: 1.9,
              backgroundColor: '#F8F9FA',
              rectRadius: 0.15,
              shadow: shadows.float,
            }}
          />
          <Text style={{
            x: pos.x + 0.2, y: pos.y + 0.3, w: 3.1, h: 0.5,
            ...typography.cardTitle,
            color: AVEMO.black,
          }}>
            {content.problems[i]?.title || ''}
          </Text>
          <Text style={{
            x: pos.x + 0.2, y: pos.y + 0.9, w: 3.1, h: 0.8,
            ...typography.cardDescription,
            color: AVEMO.grayMid,
          }}>
            {content.problems[i]?.desc || ''}
          </Text>
        </React.Fragment>
      ))}
    </Slide>

    {/* Slide 3: Solution */}
    <Slide style={{ backgroundColor: '#F8F9FA' }}>
      {/* Main card */}
      <Shape
        type="roundRect"
        style={{
          x: 0.8, y: 0.8, w: 11.7, h: 6,
          backgroundColor: AVEMO.white,
          rectRadius: 0.2,
          shadow: shadows.float,
        }}
      />
      <Text style={{
        x: 1.3, y: 1.2, w: 6, h: 0.4,
        ...typography.sectionLabel,
        color: AVEMO.orange,
      }}>
        Die Lösung
      </Text>
      <Text style={{
        x: 1.3, y: 1.8, w: 10, h: 0.8,
        ...typography.heading,
        fontSize: 36,
        color: AVEMO.black,
      }}>
        {content.tagline}
      </Text>
      {content.solutions.map((solution, i) => (
        <React.Fragment key={i}>
          <Shape
            type="ellipse"
            style={{
              x: 1.3, y: 2.9 + i * 0.9, w: 0.4, h: 0.4,
              backgroundColor: AVEMO.orange,
            }}
          />
          <Text style={{
            x: 2, y: 2.9 + i * 0.9, w: 2.5, h: 0.4,
            ...typography.cardTitle,
            color: AVEMO.black,
          }}>
            {solution.title}
          </Text>
          <Text style={{
            x: 4.5, y: 2.9 + i * 0.9, w: 6, h: 0.4,
            ...typography.body,
            color: AVEMO.grayMid,
          }}>
            {solution.desc}
          </Text>
        </React.Fragment>
      ))}
    </Slide>

    {/* Slide 4: MVP */}
    <Slide style={{ backgroundColor: AVEMO.white }}>
      <Text style={{
        x: 0.8, y: 0.6, w: 8, h: 0.4,
        ...typography.sectionLabel,
        color: AVEMO.orange,
      }}>
        Minimum Viable Product
      </Text>
      <Text style={{
        x: 0.8, y: 1.1, w: 8, h: 0.7,
        ...typography.heading,
        fontSize: 36,
        color: AVEMO.black,
      }}>
        Die Kernfunktionen
      </Text>
      {/* Asymmetric pill layout */}
      {[
        { x: 0.8, y: 2.2 },
        { x: 4.5, y: 2.2 },
        { x: 0.8, y: 3.9 },
        { x: 4.5, y: 3.9 },
        { x: 8.2, y: 3.9 },
        { x: 4.5, y: 5.6 },
      ].map((pos, i) => (
        <Shape
          key={i}
          type="roundRect"
          style={{
            x: pos.x, y: pos.y, w: 3.3, h: 1.4,
            backgroundColor: i % 2 === 0 ? '#F8F9FA' : AVEMO.orange,
            rectRadius: 0.7,
            shadow: shadows.subtle,
          }}
        >
          <Text style={{
            x: pos.x + 0.3, y: pos.y + 0.45, w: 2.7, h: 0.6,
            ...typography.cardTitle,
            color: i % 2 === 0 ? AVEMO.black : AVEMO.white,
          }}>
            {content.features[i]?.title || ''}
          </Text>
        </Shape>
      ))}
    </Slide>

    {/* Slide 5: Closing */}
    <Slide>
      {/* Split horizontal */}
      <Shape
        type="rect"
        style={{
          x: 0, y: 0, w: '100%', h: 3.75,
          backgroundColor: AVEMO.black,
        }}
      />
      <Shape
        type="rect"
        style={{
          x: 0, y: 3.75, w: '100%', h: 3.75,
          backgroundColor: AVEMO.orange,
        }}
      />
      <Text style={{
        x: 0.8, y: 1, w: 10, h: 0.8,
        ...typography.heading,
        fontSize: 36,
        color: AVEMO.white,
      }}>
        Bereit für die
      </Text>
      <Text style={{
        x: 0.8, y: 1.8, w: 10, h: 1.2,
        ...typography.display,
        fontSize: 72,
        color: AVEMO.white,
      }}>
        Zukunft?
      </Text>
      <Text style={{
        x: 0.8, y: 4.3, w: 10, h: 1,
        ...typography.body,
        fontSize: 18,
        color: AVEMO.black,
      }}>
        {content.closing.cta}
      </Text>
    </Slide>
  </Presentation>
);

// ============================================
// DESIGN 5: DASHBOARD TECH
// ============================================

const DashboardTech = () => (
  <Presentation layout="16x9" title="Fahrersoftware - Dashboard" author="AVEMO Group">
    {/* Slide 1: Title */}
    <Slide style={{ backgroundColor: AVEMO.dashboardBg }}>
      {/* Grid lines */}
      {[...Array(15)].map((_, i) => (
        <Shape
          key={i}
          type="rect"
          style={{
            x: i * 0.9, y: 0, w: 0.01, h: '100%',
            backgroundColor: 'rgba(26, 31, 46, 0.5)',
          }}
        />
      ))}
      {/* Main card */}
      <Shape
        type="roundRect"
        style={{
          x: 1, y: 1.5, w: 11, h: 4.5,
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          borderColor: AVEMO.orange,
          borderWidth: 2,
          rectRadius: 0.15,
          shadow: shadows.tech,
        }}
      />
      {/* Orange accent bar */}
      <Shape
        type="rect"
        style={{
          x: 1, y: 1.5, w: 0.2, h: 4.5,
          backgroundColor: AVEMO.orange,
        }}
      />
      <Text style={{
        x: 1.5, y: 1.8, w: 10, h: 1.2,
        ...typography.hero,
        fontSize: 64,
        color: AVEMO.white,
      }}>
        {content.title}
      </Text>
      <Text style={{
        x: 1.5, y: 3.2, w: 10, h: 0.6,
        ...typography.subtitle,
        color: AVEMO.grayMuted,
      }}>
        {content.subtitle}
      </Text>
      <Text style={{
        x: 1.5, y: 4.2, w: 10, h: 0.5,
        ...typography.bodyLarge,
        bold: true,
        color: AVEMO.orange,
      }}>
        {content.tagline}
      </Text>
      {/* Bottom stats */}
      {[
        { val: '260K€', label: 'Einsparung' },
        { val: '30', label: 'Tage gespart' },
        { val: '2.5h', label: 'Weniger Leerlauf' },
      ].map((stat, i) => (
        <React.Fragment key={i}>
          <Text style={{
            x: 1.5 + i * 3.5, y: 6.2, w: 3, h: 0.5,
            ...typography.heading,
            color: AVEMO.orange,
          }}>
            {stat.val}
          </Text>
          <Text style={{
            x: 1.5 + i * 3.5, y: 6.7, w: 3, h: 0.3,
            ...typography.label,
            color: AVEMO.grayMuted,
          }}>
            {stat.label}
          </Text>
        </React.Fragment>
      ))}
    </Slide>

    {/* Slide 2: Problem */}
    <Slide style={{ backgroundColor: AVEMO.dashboardBg }}>
      {/* Header */}
      <Shape
        type="rect"
        style={{
          x: 0, y: 0, w: '100%', h: 1.2,
          backgroundColor: AVEMO.dashboardCard,
        }}
      />
      <Text style={{
        x: 0.8, y: 0.35, w: 10, h: 0.5,
        ...typography.cardTitle,
        color: AVEMO.orange,
      }}>
        SYSTEM STATUS: PROBLEME ERKANNT
      </Text>
      {/* Problem cards */}
      {[
        { title: 'Standorte', val: '5', unit: 'Isoliert', status: 'CRITICAL' },
        { title: 'Prozesse', val: '100%', unit: 'Manuell', status: 'WARNING' },
        { title: 'Leerlauf', val: '2.5h', unit: 'Pro Tag', status: 'WARNING' },
        { title: 'Wartezeit', val: '30', unit: 'Tage', status: 'CRITICAL' },
      ].map((item, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <React.Fragment key={i}>
            <Shape
              type="roundRect"
              style={{
                x: 0.8 + col * 6, y: 1.6 + row * 2.8, w: 5.5, h: 2.4,
                backgroundColor: AVEMO.dashboardCard,
                borderColor: item.status === 'CRITICAL' ? AVEMO.orange : AVEMO.dashboardBorder,
                borderWidth: 1.5,
                rectRadius: 0.1,
              }}
            />
            <Text style={{
              x: 1.1 + col * 6, y: 1.8 + row * 2.8, w: 3, h: 0.3,
              ...typography.label,
              color: AVEMO.grayMuted,
            }}>
              {item.title}
            </Text>
            <Text style={{
              x: 1.1 + col * 6, y: 2.3 + row * 2.8, w: 3, h: 0.8,
              ...typography.stat,
              fontSize: 48,
              color: AVEMO.white,
            }}>
              {item.val}
            </Text>
            <Text style={{
              x: 1.1 + col * 6, y: 3.1 + row * 2.8, w: 3, h: 0.3,
              ...typography.label,
              color: AVEMO.grayMuted,
            }}>
              {item.unit}
            </Text>
            {/* Status indicator */}
            <Shape
              type="ellipse"
              style={{
                x: 5.3 + col * 6, y: 1.9 + row * 2.8, w: 0.4, h: 0.4,
                backgroundColor: item.status === 'CRITICAL' ? AVEMO.orange : '#FFC107',
              }}
            />
          </React.Fragment>
        );
      })}
    </Slide>

    {/* Slide 3: Solution */}
    <Slide style={{ backgroundColor: AVEMO.dashboardBg }}>
      {/* Header */}
      <Shape
        type="rect"
        style={{
          x: 0, y: 0, w: '100%', h: 1.2,
          backgroundColor: AVEMO.dashboardCard,
        }}
      />
      <Text style={{
        x: 0.8, y: 0.35, w: 10, h: 0.5,
        ...typography.cardTitle,
        color: AVEMO.orange,
      }}>
        SYSTEM UPGRADE: LÖSUNG BEREIT
      </Text>
      {/* Main card */}
      <Shape
        type="roundRect"
        style={{
          x: 0.8, y: 1.6, w: 7, h: 5.4,
          backgroundColor: AVEMO.dashboardCard,
          borderColor: AVEMO.orange,
          borderWidth: 2,
          rectRadius: 0.1,
        }}
      />
      <Text style={{
        x: 1.1, y: 1.9, w: 6, h: 0.8,
        ...typography.subtitle,
        color: AVEMO.white,
      }}>
        {content.tagline}
      </Text>
      {content.solutions.map((solution, i) => (
        <React.Fragment key={i}>
          <Shape
            type="ellipse"
            style={{
              x: 1.1, y: 2.9 + i * 0.9, w: 0.25, h: 0.25,
              backgroundColor: AVEMO.orange,
            }}
          />
          <Text style={{
            x: 1.5, y: 2.85 + i * 0.9, w: 2, h: 0.35,
            ...typography.body,
            bold: true,
            color: AVEMO.orange,
          }}>
            {solution.title}
          </Text>
          <Text style={{
            x: 3.2, y: 2.85 + i * 0.9, w: 4, h: 0.35,
            ...typography.body,
            color: AVEMO.grayMuted,
          }}>
            {solution.desc}
          </Text>
        </React.Fragment>
      ))}
      {/* Side panel */}
      <Shape
        type="roundRect"
        style={{
          x: 8, y: 1.6, w: 4.5, h: 5.4,
          backgroundColor: AVEMO.dashboardCard,
          rectRadius: 0.1,
        }}
      />
      <Text style={{
        x: 8.3, y: 1.9, w: 4, h: 0.4,
        ...typography.label,
        color: AVEMO.orange,
      }}>
        PROJEKTIERTE METRIKEN
      </Text>
      {[
        { label: 'ROI', value: '< 12 Monate' },
        { label: 'Effizienz', value: '+ 40%' },
        { label: 'Transparenz', value: '100%' },
      ].map((metric, i) => (
        <React.Fragment key={i}>
          <Text style={{
            x: 8.3, y: 2.5 + i * 1.1, w: 2, h: 0.3,
            ...typography.label,
            color: AVEMO.grayMuted,
          }}>
            {metric.label}
          </Text>
          <Text style={{
            x: 8.3, y: 2.85 + i * 1.1, w: 4, h: 0.5,
            ...typography.subtitle,
            color: AVEMO.white,
          }}>
            {metric.value}
          </Text>
        </React.Fragment>
      ))}
    </Slide>

    {/* Slide 4: MVP */}
    <Slide style={{ backgroundColor: AVEMO.dashboardBg }}>
      {/* Header */}
      <Shape
        type="rect"
        style={{
          x: 0, y: 0, w: '100%', h: 1.2,
          backgroundColor: AVEMO.dashboardCard,
        }}
      />
      <Text style={{
        x: 0.8, y: 0.35, w: 10, h: 0.5,
        ...typography.cardTitle,
        color: AVEMO.orange,
      }}>
        MODULE: MINIMUM VIABLE PRODUCT
      </Text>
      {/* Module cards */}
      {[
        { code: 'ALGORITHM', name: 'Planungs-Engine' },
        { code: 'MOBILE', name: 'Driver App' },
        { code: 'WEB', name: 'Backoffice' },
        { code: 'INTEGRATION', name: 'Externe APIs' },
        { code: 'MONITOR', name: 'Live-Dashboard' },
        { code: 'ANALYTICS', name: 'Reporting' },
      ].map((module, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <React.Fragment key={i}>
            <Shape
              type="roundRect"
              style={{
                x: 0.8 + col * 4.1, y: 1.6 + row * 2.8, w: 3.8, h: 2.4,
                backgroundColor: AVEMO.dashboardCard,
                borderColor: AVEMO.dashboardBorder,
                borderWidth: 1,
                rectRadius: 0.1,
              }}
            />
            <Text style={{
              x: 1 + col * 4.1, y: 1.8 + row * 2.8, w: 3.4, h: 0.3,
              ...typography.label,
              fontSize: 11,
              color: AVEMO.orange,
            }}>
              {module.code}
            </Text>
            <Text style={{
              x: 1 + col * 4.1, y: 2.4 + row * 2.8, w: 3.4, h: 0.8,
              ...typography.cardTitle,
              fontSize: 22,
              color: AVEMO.white,
            }}>
              {module.name}
            </Text>
            <Text style={{
              x: 3.4 + col * 4.1, y: 3.5 + row * 2.8, w: 0.8, h: 0.3,
              ...typography.caption,
              color: AVEMO.grayMuted,
            }}>
              {`M0${i + 1}`}
            </Text>
          </React.Fragment>
        );
      })}
    </Slide>

    {/* Slide 5: Closing */}
    <Slide style={{ backgroundColor: AVEMO.dashboardBg }}>
      {/* Central card */}
      <Shape
        type="roundRect"
        style={{
          x: 2, y: 1.5, w: 9.3, h: 4.5,
          backgroundColor: AVEMO.dashboardCard,
          borderColor: AVEMO.orange,
          borderWidth: 3,
          rectRadius: 0.15,
          shadow: shadows.tech,
        }}
      />
      <Text style={{
        x: 2.5, y: 2, w: 8, h: 0.5,
        ...typography.cardTitle,
        color: AVEMO.orange,
      }}>
        SYSTEM READY
      </Text>
      <Text style={{
        x: 2.5, y: 2.8, w: 8, h: 1,
        ...typography.title,
        color: AVEMO.white,
      }}>
        Bereit für die Zukunft?
      </Text>
      <Text style={{
        x: 2.5, y: 4, w: 8, h: 0.8,
        ...typography.body,
        color: AVEMO.grayMuted,
      }}>
        {content.closing.cta}
      </Text>
    </Slide>
  </Presentation>
);

// ============================================
// MAIN GENERATOR
// ============================================

async function generatePresentations() {
  const outputDir = path.join(process.cwd(), 'output');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const presentations = [
    { name: 'design-1-cinematic-dark', component: <CinematicDark /> },
    { name: 'design-2-minimal-glass', component: <MinimalGlass /> },
    { name: 'design-3-bold-editorial', component: <BoldEditorial /> },
    { name: 'design-4-asymmetric-modern', component: <AsymmetricModern /> },
    { name: 'design-5-dashboard-tech', component: <DashboardTech /> },
  ];
  
  console.log('Generating AVEMO Fahrersoftware presentations...\n');
  
  for (const { name, component } of presentations) {
    try {
      const buffer = await render(component);
      const filePath = path.join(outputDir, `${name}.pptx`);
      fs.writeFileSync(filePath, buffer as Buffer);
      console.log(`✓ Generated: ${name}.pptx`);
    } catch (error) {
      console.error(`✗ Error generating ${name}:`, error);
    }
  }
  
  console.log('\nDone! Presentations saved to ./output/');
}

// Run
generatePresentations().catch(console.error);
