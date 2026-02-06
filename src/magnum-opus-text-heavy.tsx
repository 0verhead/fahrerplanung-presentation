/**
 * AVEMO Fahrersoftware - Magnum Opus TEXT-HEAVY Version
 * 
 * This version mirrors the text density of the original fahrerplanung.pptx
 * for easier presenting by reading content directly.
 * 
 * Maintains modern design (Montserrat, shadows, depth) but with:
 * - Full sentences and paragraphs
 * - Detailed bullet points
 * - More content per slide
 * - Technical details inline
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

import { SLIDE, RADIUS } from './theme/layout';

// ===========================================
// DESIGN SYSTEM (Same as v2)
// ===========================================

const FONTS = {
  DISPLAY: 'Montserrat',
  BODY: 'Source Sans Pro',
  METRIC: 'Montserrat',
};

const THEME = {
  bg: '#0d0d0f',
  bgAlt: '#141418',
  bgCard: '#1a1a1f',
  text: '#ffffff',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  textOnAccent: '#000000',
  accent: '#ff550a',
  border: '#2d2d35',
  warning: '#f59e0b',
};

const SHADOWS = {
  card: {
    type: 'outer' as const,
    blur: 12,
    offset: 6,
    angle: 50,
    color: '000000',
    opacity: 0.4,
  },
  elevated: {
    type: 'outer' as const,
    blur: 20,
    offset: 10,
    angle: 50,
    color: '000000',
    opacity: 0.5,
  },
};

// ===========================================
// COMPREHENSIVE TEXT CONTENT
// Based on original fahrerplanung.pptx
// ===========================================

const content = {
  title: {
    main: 'Fahrersoftware',
    sub: 'Vorstellung in der Geschäftsführerrunde',
    company: 'AVEMO Group',
  },
  
  agenda: [
    { num: '01', title: 'Aktuelle Situation', desc: 'Welche manuellen Aufwände entstehen bei der Fahrerplanung in der AVEMO Group?' },
    { num: '02', title: 'Die Zukunft', desc: 'Vision und Ziele mit der neuen Fahrersoftware' },
    { num: '03', title: 'Highlights', desc: 'PoC Planungsalgorithmus, Konzept & MVP für ersten Standort' },
    { num: '04', title: 'Business Case', desc: 'ROI-Berechnung und Einsparungspotenziale' },
  ],

  // Slide 3: Aktuelle Situation - Isolierte Standorte
  situation1: {
    title: 'Aktuelle Situation in der AVEMO Group',
    subtitle: 'Welche manuellen Aufwände entstehen bei der Fahrerplanung?',
    points: [
      {
        title: 'Isolierte Standorte',
        bullets: [
          'Jeder Standort hat seinen eigenen Fahrdienst und organisiert sich selbst mit diversen Listen',
          'Es werden keine Synergien zwischen den Standorten genutzt',
          'Fahrten werden mit viel Aufwand koordiniert und es gibt keinerlei Automatismus',
        ],
      },
      {
        title: 'Manuelle Prozesse',
        bullets: [
          'Einplanung erfolgt in Outlook und Excel',
          'Man muss in mehreren Listen die gleichen Inhalte eintragen',
          'Manuelle Fahrerabrechnungen und Weiterbelastungen an Kunden',
        ],
      },
    ],
  },

  // Slide 4: Dokumentenprobleme
  situation2: {
    title: 'Dokumenten- und Abrechnungsprobleme',
    points: [
      {
        title: 'Dokumentenprobleme',
        bullets: [
          'Unterlagen, welche vom Kunden unterschrieben wurden, sind manchmal unvollständig',
          'Dokumente gehen teilweise verloren',
          'Werden zu spät in der Dispo abgegeben',
          'Die Dispo hat den Mehraufwand um die Unterlagen nachzuhalten',
          'Erneutes Einscannen und Versenden an den Kunden erforderlich',
        ],
      },
      {
        title: 'Folgen',
        bullets: [
          'Dadurch entsteht eine verspätete Faktura an den Kunden',
          'Leerlaufzeiten der einzelnen Fahrer sind nicht messbar',
          'Kein Reporting über Effizienz möglich',
        ],
      },
    ],
  },

  // Slide 5: Fahrer-Dienstleister
  situation3: {
    title: 'Externe Fahrer-Dienstleister (FDL)',
    intro: 'Der Einsatz bzw. die Einplanung von Fahrer-Dienstleister (FDL) erfolgt durch das Auslieferungsmanagement (ALM).',
    bullets: [
      'Der Mitarbeiter wählt den FDL und entscheidet somit über die Erteilung des Auftrages',
      'Alle Dokumente und Infos für die Auslieferung müssen z.B. per Outlook übermittelt werden',
      'Abrechnung der FDL ist nicht nachvollziehbar und nicht standardisiert',
      'Keine zentrale Übersicht über Kosten und Auslastung externer Dienstleister',
      'Fehlende Qualitätskontrolle bei externen Fahrern',
    ],
  },

  // Slide 6: Die Zukunft
  future: {
    title: 'Die Zukunft mit der Fahrersoftware',
    subtitle: 'Eine Software. Alle Standorte.',
    benefits: [
      {
        title: 'Synergien schaffen',
        desc: 'Wir schaffen Synergien zwischen den verschiedenen Fahrdiensten/gruppenübergreifend',
      },
      {
        title: 'Effizienz steigern',
        desc: 'Steigerung der Effizienz innerhalb der Fahrerteams. Es besteht ein großes Einsparpotential und wir können zusätzlich mehr Fahrten abbilden.',
      },
      {
        title: 'Kapazitäten schaffen',
        desc: 'Schaffung freier Kapazitäten ohne neues Personal einstellen zu müssen beim Verkauf höherer Stückzahlen und/oder Aufbau neuer GK-Teams.',
      },
      {
        title: 'Professioneller Auftritt',
        desc: 'Wir schaffen einen professionellen Auftritt vor dem Kunden durch moderne Technologie und transparente Kommunikation.',
      },
    ],
  },

  // Slide 7: PoC Details
  poc: {
    title: 'PoC: Planungsalgorithmus',
    goal: 'Nachweis, dass ein automatisierter Tagesplan für einen vollständigen Monat erstellt werden kann, der:',
    goalPoints: [
      'Interne Fahrer optimal auslastet',
      'Gleichzeitig die Gesamtkosten minimiert',
    ],
    optimization: {
      title: 'Optimierungslogik',
      points: [
        'Maximale Auslastung interner Fahrer (Arbeitszeiten, Verfügbarkeit, Qualifikationen)',
        'Minimierung der Gesamtkosten unter Berücksichtigung von Fahrzeiten und externen Ressourcen',
        'Externe Dienstleister nur bei fehlenden Kapazitäten oder besserer Wirtschaftlichkeit',
        'Qualifikation, Zeitfenster und Standort werden automatisch berücksichtigt',
      ],
    },
    data: {
      title: 'Datenbasis',
      points: [
        'Fahrtenkatalog (ABA, AB, BA) aus GeNesys',
        'Fahrerprofil mit Verfügbarkeit aus KDV',
        'Routing-Provider für Fahrzeitberechnung',
        'Kostenmodelle für interne und externe Ressourcen',
      ],
    },
  },

  // Slide 8: MVP Overview
  mvp: {
    title: 'MVP: Version für ersten Standort',
    sections: [
      {
        num: '1',
        title: 'End-to-End-Prozesse',
        points: [
          'Auftragsübernahme aus GeNesys',
          'Automatisierte Fahrtenplanung',
          'Fahrtenabwicklung in der Fahrer-App',
          'Übergabe- und Rücknahmeprotokolle (Fotos, Checklisten, Signatur)',
          'Einfaches Reporting & Abrechnung',
        ],
      },
      {
        num: '2',
        title: 'Produktive Nutzung für alle Rollen',
        points: [
          'Disposition: Planung und Übersicht',
          'Interne Fahrer: App mit geführten Prozessen',
          'Externe Dienstleister: Portal für Auftragsannahme',
          'Administration: Stammdaten und Konfiguration',
        ],
      },
    ],
  },

  // Slide 9: MVP Features Detail
  mvpFeatures: {
    title: 'MVP: Kernfunktionen im Detail',
    features: [
      {
        num: '3',
        title: 'Automatisierte Planung',
        points: [
          'Optimierung nach interner Auslastung und Gesamtkosten',
          'Berücksichtigung von Qualifikationen, Verfügbarkeiten, Arbeitszeitgrenzen',
          'Routing-Integration für Fahrtzeitberechnung',
          'Notwendige Schnittstellen: GeNesys, KDV, Routing-Provider',
        ],
      },
      {
        num: '4',
        title: 'Fahrer-App & Digitale Durchführung',
        points: [
          'Tages-/Wochenübersicht für Fahrer',
          'Geführte Schritt-für-Schritt-Prozesse je Fahrtart',
          'Digitale Übergabe-/Rücknahmeprotokolle mit Fotos & Unterschrift',
          'Offline-fähige Datenerfassung',
        ],
      },
    ],
  },

  // Slide 10: MVP Epics
  mvpEpics: {
    title: 'MVP: Entwicklungs-Epics',
    epics: [
      {
        title: 'Authentifizierung & Rollen',
        points: [
          'Benutzerverwaltung für Dispo, Fahrer, Dienstleister und Admins',
          'Login, Passwort-Reset, E-Mail-Verifizierung',
          'Rollen & Berechtigung pro Standort',
        ],
      },
      {
        title: 'Fahrer- & Dienstleister-Management',
        points: [
          'Verwaltung interner Fahrer (Qualifikation, Zeiten, Status)',
          'Verwaltung externer Dienstleister mit Kapazitäten & Kostenmodellen',
          'Import relevanter Personaldaten aus KDV',
        ],
      },
      {
        title: 'Monitoring & Benachrichtigungen',
        points: [
          'Live-Status aller Fahrten inkl. Historie',
          'Benachrichtigungen für Fahrer & Dienstleister bei Änderungen',
          'E-Mail-Benachrichtigungen an Kunden',
        ],
      },
    ],
  },

  // Slide 11: Business Case
  businessCase: {
    title: 'Business Case: Online-Terminierung',
    intro: 'Der Kunde wird per Mail aufgefordert sein Neufahrzeug zu terminieren über eine Online-Terminierung.',
    customerInputs: {
      title: 'Was muss der Kunde angeben:',
      points: ['Wunschtermin', 'Wunschkennzeichen', 'Zieladresse'],
    },
    process: 'Der Vorgang wird dann vom Auslieferungsteam bearbeitet und der Kunde erhält eine Terminbestätigung.',
    calculation: {
      title: 'ROI-Berechnung',
      lines: [
        'Zeitersparnis: 1 Stunde pro Fahrzeug',
        'Fahrzeuge pro Jahr: 8.000',
        'Eingesparte Stunden: 8.000 h/Jahr',
        'Stundenlohn: 32,40 €',
      ],
      amount: '260.000 €',
      label: 'jährliche Einsparung',
      fte: 'Entspricht ca. 4 Vollzeit-Mitarbeitern',
    },
  },

  closing: {
    title: 'Nächste Schritte',
    cta: 'Gemeinsam die Fahrzeugdisposition der AVEMO Group transformieren.',
    thanks: 'Vielen Dank.',
  },
};

// ===========================================
// HELPER COMPONENTS
// ===========================================

const AtmosphericBackground = () => (
  <>
    <Shape type="rect" style={{
      x: 7, y: -1, w: 5, h: 8,
      backgroundColor: 'rgba(255,85,10,0.04)',
      rotate: 15,
    }} />
    <Shape type="ellipse" style={{
      x: -2, y: -2, w: 6, h: 6,
      backgroundColor: 'rgba(255,85,10,0.03)',
    }} />
    <Shape type="rect" style={{
      x: 0, y: 0, w: SLIDE.WIDTH, h: 0.04,
      backgroundColor: THEME.accent,
    }} />
  </>
);

const SectionLabel = ({ num, title }: { num: string; title: string }) => (
  <>
    <Text style={{
      x: 0.5, y: 0.35,
      w: 0.35, h: 0.25,
      fontSize: 10, bold: true, fontFace: FONTS.DISPLAY,
      color: THEME.accent,
    }}>
      {num}
    </Text>
    <Text style={{
      x: 0.85, y: 0.35,
      w: 3, h: 0.25,
      fontSize: 10, fontFace: FONTS.BODY,
      color: THEME.textSecondary,
    }}>
      {title.toUpperCase()}
    </Text>
  </>
);

const SlideTitle = ({ children, y = 0.7 }: { children: string; y?: number }) => (
  <Text style={{
    x: 0.5, y,
    w: 9, h: 0.5,
    fontSize: 24, bold: true, fontFace: FONTS.DISPLAY,
    color: THEME.text,
  }}>
    {children}
  </Text>
);

const BulletPoint = ({ x, y, text, fontSize = 10 }: { x: number; y: number; text: string; fontSize?: number }) => (
  <>
    <Shape type="ellipse" style={{
      x, y: y + 0.08,
      w: 0.12, h: 0.12,
      backgroundColor: THEME.accent,
    }} />
    <Text style={{
      x: x + 0.22, y,
      w: 4.2, h: 0.35,
      fontSize, fontFace: FONTS.BODY,
      color: THEME.textSecondary,
    }}>
      {text}
    </Text>
  </>
);

// ===========================================
// TEXT-HEAVY PRESENTATION
// ===========================================

const MagnumOpusTextHeavy = () => {
  return (
    <Presentation layout="16x9" title="Fahrersoftware - AVEMO Group (Text-Heavy)" author="AVEMO Group">
      
      {/* SLIDE 1: TITLE */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        
        <Shape type="rect" style={{
          x: 6.5, y: 1.2, w: 4, h: 3.5,
          backgroundColor: THEME.accent,
          shadow: SHADOWS.elevated,
          rotate: -3,
        }} />
        
        <Text style={{
          x: 0.5, y: 1.8,
          w: 6.5, h: 1.4,
          fontSize: 52, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          {content.title.main}
        </Text>
        
        <Text style={{
          x: 0.5, y: 3.3,
          w: 5.5, h: 0.5,
          fontSize: 16, fontFace: FONTS.BODY,
          color: THEME.textSecondary,
        }}>
          {content.title.sub}
        </Text>
        
        <Shape type="rect" style={{
          x: 0.5, y: 3.9, w: 1.2, h: 0.05,
          backgroundColor: THEME.accent,
        }} />
        
        <Text style={{
          x: 0.5, y: 4.8,
          w: 3, h: 0.3,
          fontSize: 11, fontFace: FONTS.BODY,
          color: THEME.textMuted,
        }}>
          {content.title.company}
        </Text>
      </Slide>

      {/* SLIDE 2: AGENDA */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        
        <Text style={{
          x: 0.5, y: 0.4,
          w: 4, h: 0.5,
          fontSize: 28, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          Agenda
        </Text>
        
        {content.agenda.map((item, i) => (
          <React.Fragment key={i}>
            <Text style={{
              x: 0.5, y: 1.15 + i * 1.1,
              w: 0.6, h: 0.5,
              fontSize: 28, bold: true, fontFace: FONTS.METRIC,
              color: THEME.accent,
            }}>
              {item.num}
            </Text>
            <Text style={{
              x: 1.2, y: 1.15 + i * 1.1,
              w: 4, h: 0.35,
              fontSize: 16, bold: true, fontFace: FONTS.DISPLAY,
              color: THEME.text,
            }}>
              {item.title}
            </Text>
            <Text style={{
              x: 1.2, y: 1.5 + i * 1.1,
              w: 8, h: 0.4,
              fontSize: 11, fontFace: FONTS.BODY,
              color: THEME.textSecondary,
            }}>
              {item.desc}
            </Text>
          </React.Fragment>
        ))}
        
        <Shape type="rect" style={{
          x: 9.1, y: 1.15, w: 0.06, h: 3.8,
          backgroundColor: THEME.accent,
        }} />
      </Slide>

      {/* SLIDE 3: AKTUELLE SITUATION - ISOLIERTE STANDORTE */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="01" title="Aktuelle Situation" />
        <SlideTitle>{content.situation1.title}</SlideTitle>
        
        <Text style={{
          x: 0.5, y: 1.2,
          w: 9, h: 0.3,
          fontSize: 12, fontFace: FONTS.BODY,
          color: THEME.textSecondary,
        }}>
          {content.situation1.subtitle}
        </Text>
        
        {content.situation1.points.map((section, i) => {
          const x = 0.5 + i * 4.7;
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y: 1.6, w: 4.5, h: 3.3,
                backgroundColor: THEME.bgCard,
                rectRadius: 0.1,
                shadow: SHADOWS.card,
              }} />
              <Shape type="rect" style={{
                x, y: 1.6, w: 0.05, h: 3.3,
                backgroundColor: THEME.accent,
              }} />
              <Text style={{
                x: x + 0.2, y: 1.75,
                w: 4.1, h: 0.35,
                fontSize: 14, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.text,
              }}>
                {section.title}
              </Text>
              {section.bullets.map((bullet, j) => (
                <React.Fragment key={j}>
                  <Shape type="ellipse" style={{
                    x: x + 0.2, y: 2.25 + j * 0.75,
                    w: 0.1, h: 0.1,
                    backgroundColor: THEME.accent,
                  }} />
                  <Text style={{
                    x: x + 0.4, y: 2.2 + j * 0.75,
                    w: 3.9, h: 0.7,
                    fontSize: 10, fontFace: FONTS.BODY,
                    color: THEME.textSecondary,
                  }}>
                    {bullet}
                  </Text>
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        })}
      </Slide>

      {/* SLIDE 4: DOKUMENTENPROBLEME */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="01" title="Aktuelle Situation" />
        <SlideTitle>{content.situation2.title}</SlideTitle>
        
        {content.situation2.points.map((section, i) => {
          const x = 0.5 + i * 4.7;
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y: 1.3, w: 4.5, h: 3.8,
                backgroundColor: THEME.bgCard,
                rectRadius: 0.1,
                shadow: SHADOWS.card,
              }} />
              <Shape type="rect" style={{
                x, y: 1.3, w: 4.5, h: 0.04,
                backgroundColor: THEME.accent,
              }} />
              <Text style={{
                x: x + 0.2, y: 1.45,
                w: 4.1, h: 0.35,
                fontSize: 13, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.text,
              }}>
                {section.title}
              </Text>
              {section.bullets.map((bullet, j) => (
                <React.Fragment key={j}>
                  <Shape type="ellipse" style={{
                    x: x + 0.2, y: 1.95 + j * 0.6,
                    w: 0.1, h: 0.1,
                    backgroundColor: THEME.accent,
                  }} />
                  <Text style={{
                    x: x + 0.4, y: 1.9 + j * 0.6,
                    w: 3.9, h: 0.55,
                    fontSize: 10, fontFace: FONTS.BODY,
                    color: THEME.textSecondary,
                  }}>
                    {bullet}
                  </Text>
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        })}
      </Slide>

      {/* SLIDE 5: FAHRER-DIENSTLEISTER */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="01" title="Aktuelle Situation" />
        <SlideTitle>{content.situation3.title}</SlideTitle>
        
        <Shape type="roundRect" style={{
          x: 0.5, y: 1.3, w: 9, h: 0.8,
          backgroundColor: THEME.bgCard,
          rectRadius: 0.08,
          shadow: SHADOWS.card,
        }} />
        <Text style={{
          x: 0.7, y: 1.5,
          w: 8.6, h: 0.5,
          fontSize: 11, fontFace: FONTS.BODY,
          color: THEME.text,
        }}>
          {content.situation3.intro}
        </Text>
        
        <Shape type="roundRect" style={{
          x: 0.5, y: 2.3, w: 9, h: 2.8,
          backgroundColor: THEME.bgCard,
          rectRadius: 0.1,
          shadow: SHADOWS.card,
        }} />
        <Shape type="rect" style={{
          x: 0.5, y: 2.3, w: 0.05, h: 2.8,
          backgroundColor: THEME.warning,
        }} />
        <Text style={{
          x: 0.7, y: 2.45,
          w: 8.6, h: 0.3,
          fontSize: 12, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.warning,
        }}>
          Probleme mit externen Dienstleistern
        </Text>
        
        {content.situation3.bullets.map((bullet, i) => (
          <React.Fragment key={i}>
            <Shape type="ellipse" style={{
              x: 0.7, y: 2.9 + i * 0.45,
              w: 0.1, h: 0.1,
              backgroundColor: THEME.warning,
            }} />
            <Text style={{
              x: 0.95, y: 2.85 + i * 0.45,
              w: 8.3, h: 0.4,
              fontSize: 10, fontFace: FONTS.BODY,
              color: THEME.textSecondary,
            }}>
              {bullet}
            </Text>
          </React.Fragment>
        ))}
      </Slide>

      {/* SLIDE 6: DIE ZUKUNFT */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="02" title="Die Zukunft" />
        
        <Text style={{
          x: 0.5, y: 0.7,
          w: 9, h: 0.5,
          fontSize: 24, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.text,
        }}>
          {content.future.title}
        </Text>
        <Text style={{
          x: 0.5, y: 1.15,
          w: 9, h: 0.35,
          fontSize: 16, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.accent,
        }}>
          {content.future.subtitle}
        </Text>
        
        {content.future.benefits.map((benefit, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 0.5 + col * 4.7;
          const y = 1.65 + row * 1.65;
          
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y, w: 4.5, h: 1.5,
                backgroundColor: THEME.bgCard,
                rectRadius: 0.1,
                shadow: SHADOWS.card,
              }} />
              <Shape type="ellipse" style={{
                x: x + 0.15, y: y + 0.15,
                w: 0.4, h: 0.4,
                backgroundColor: THEME.accent,
              }} />
              <Text style={{
                x: x + 0.23, y: y + 0.2,
                w: 0.3, h: 0.3,
                fontSize: 12, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.textOnAccent,
                align: 'center',
              }}>
                {i + 1}
              </Text>
              <Text style={{
                x: x + 0.7, y: y + 0.18,
                w: 3.6, h: 0.35,
                fontSize: 13, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.text,
              }}>
                {benefit.title}
              </Text>
              <Text style={{
                x: x + 0.15, y: y + 0.65,
                w: 4.2, h: 0.75,
                fontSize: 10, fontFace: FONTS.BODY,
                color: THEME.textSecondary,
              }}>
                {benefit.desc}
              </Text>
            </React.Fragment>
          );
        })}
      </Slide>

      {/* SLIDE 7: POC DETAILS */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="03" title="Highlights" />
        <SlideTitle>{content.poc.title}</SlideTitle>
        
        {/* Goal Card */}
        <Shape type="roundRect" style={{
          x: 0.5, y: 1.25, w: 9, h: 1.1,
          backgroundColor: THEME.bgCard,
          rectRadius: 0.1,
          shadow: SHADOWS.card,
        }} />
        <Text style={{
          x: 0.7, y: 1.35,
          w: 1, h: 0.25,
          fontSize: 9, bold: true, fontFace: FONTS.BODY,
          color: THEME.accent,
        }}>
          ZIEL
        </Text>
        <Text style={{
          x: 0.7, y: 1.6,
          w: 8.6, h: 0.35,
          fontSize: 11, fontFace: FONTS.BODY,
          color: THEME.text,
        }}>
          {content.poc.goal}
        </Text>
        <Text style={{
          x: 0.9, y: 1.95,
          w: 4, h: 0.25,
          fontSize: 10, fontFace: FONTS.BODY,
          color: THEME.textSecondary,
        }}>
          • {content.poc.goalPoints[0]}  • {content.poc.goalPoints[1]}
        </Text>
        
        {/* Two columns */}
        <Shape type="roundRect" style={{
          x: 0.5, y: 2.5, w: 4.35, h: 2.6,
          backgroundColor: THEME.bgCard,
          rectRadius: 0.1,
          shadow: SHADOWS.card,
        }} />
        <Shape type="rect" style={{
          x: 0.5, y: 2.5, w: 4.35, h: 0.04,
          backgroundColor: THEME.accent,
        }} />
        <Text style={{
          x: 0.7, y: 2.6,
          w: 4, h: 0.25,
          fontSize: 10, bold: true, fontFace: FONTS.BODY,
          color: THEME.accent,
        }}>
          {content.poc.optimization.title.toUpperCase()}
        </Text>
        {content.poc.optimization.points.map((point, i) => (
          <React.Fragment key={i}>
            <Shape type="ellipse" style={{
              x: 0.7, y: 2.95 + i * 0.55,
              w: 0.08, h: 0.08,
              backgroundColor: THEME.accent,
            }} />
            <Text style={{
              x: 0.9, y: 2.9 + i * 0.55,
              w: 3.8, h: 0.5,
              fontSize: 9, fontFace: FONTS.BODY,
              color: THEME.textSecondary,
            }}>
              {point}
            </Text>
          </React.Fragment>
        ))}
        
        <Shape type="roundRect" style={{
          x: 5.15, y: 2.5, w: 4.35, h: 2.6,
          backgroundColor: THEME.bgCard,
          rectRadius: 0.1,
          shadow: SHADOWS.card,
        }} />
        <Shape type="rect" style={{
          x: 5.15, y: 2.5, w: 4.35, h: 0.04,
          backgroundColor: THEME.accent,
        }} />
        <Text style={{
          x: 5.35, y: 2.6,
          w: 4, h: 0.25,
          fontSize: 10, bold: true, fontFace: FONTS.BODY,
          color: THEME.accent,
        }}>
          {content.poc.data.title.toUpperCase()}
        </Text>
        {content.poc.data.points.map((point, i) => (
          <React.Fragment key={i}>
            <Shape type="ellipse" style={{
              x: 5.35, y: 2.95 + i * 0.55,
              w: 0.08, h: 0.08,
              backgroundColor: THEME.accent,
            }} />
            <Text style={{
              x: 5.55, y: 2.9 + i * 0.55,
              w: 3.8, h: 0.5,
              fontSize: 9, fontFace: FONTS.BODY,
              color: THEME.textSecondary,
            }}>
              {point}
            </Text>
          </React.Fragment>
        ))}
      </Slide>

      {/* SLIDE 8: MVP OVERVIEW */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="03" title="Highlights" />
        <SlideTitle>{content.mvp.title}</SlideTitle>
        
        {content.mvp.sections.map((section, i) => {
          const x = 0.5 + i * 4.7;
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y: 1.25, w: 4.5, h: 3.8,
                backgroundColor: THEME.bgCard,
                rectRadius: 0.1,
                shadow: SHADOWS.card,
              }} />
              <Text style={{
                x: x + 0.15, y: 1.35,
                w: 0.4, h: 0.4,
                fontSize: 18, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.accent,
              }}>
                {section.num}.
              </Text>
              <Text style={{
                x: x + 0.55, y: 1.4,
                w: 3.8, h: 0.35,
                fontSize: 13, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.text,
              }}>
                {section.title}
              </Text>
              {section.points.map((point, j) => (
                <React.Fragment key={j}>
                  <Shape type="ellipse" style={{
                    x: x + 0.2, y: 1.95 + j * 0.55,
                    w: 0.1, h: 0.1,
                    backgroundColor: THEME.accent,
                  }} />
                  <Text style={{
                    x: x + 0.4, y: 1.9 + j * 0.55,
                    w: 3.9, h: 0.5,
                    fontSize: 10, fontFace: FONTS.BODY,
                    color: THEME.textSecondary,
                  }}>
                    {point}
                  </Text>
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        })}
      </Slide>

      {/* SLIDE 9: MVP FEATURES DETAIL */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="03" title="Highlights" />
        <SlideTitle>{content.mvpFeatures.title}</SlideTitle>
        
        {content.mvpFeatures.features.map((feature, i) => {
          const x = 0.5 + i * 4.7;
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y: 1.25, w: 4.5, h: 3.8,
                backgroundColor: THEME.bgCard,
                rectRadius: 0.1,
                shadow: SHADOWS.card,
              }} />
              <Text style={{
                x: x + 0.15, y: 1.35,
                w: 0.4, h: 0.4,
                fontSize: 18, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.accent,
              }}>
                {feature.num}.
              </Text>
              <Text style={{
                x: x + 0.55, y: 1.4,
                w: 3.8, h: 0.35,
                fontSize: 13, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.text,
              }}>
                {feature.title}
              </Text>
              {feature.points.map((point, j) => (
                <React.Fragment key={j}>
                  <Shape type="ellipse" style={{
                    x: x + 0.2, y: 1.95 + j * 0.6,
                    w: 0.1, h: 0.1,
                    backgroundColor: THEME.accent,
                  }} />
                  <Text style={{
                    x: x + 0.4, y: 1.9 + j * 0.6,
                    w: 3.9, h: 0.55,
                    fontSize: 10, fontFace: FONTS.BODY,
                    color: THEME.textSecondary,
                  }}>
                    {point}
                  </Text>
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        })}
      </Slide>

      {/* SLIDE 10: MVP EPICS */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="03" title="Highlights" />
        <SlideTitle>{content.mvpEpics.title}</SlideTitle>
        
        {content.mvpEpics.epics.map((epic, i) => {
          const cardW = 2.95;
          const x = 0.5 + i * (cardW + 0.15);
          return (
            <React.Fragment key={i}>
              <Shape type="roundRect" style={{
                x, y: 1.25, w: cardW, h: 3.8,
                backgroundColor: THEME.bgCard,
                rectRadius: 0.1,
                shadow: SHADOWS.card,
              }} />
              <Shape type="rect" style={{
                x, y: 1.25, w: cardW, h: 0.04,
                backgroundColor: THEME.accent,
              }} />
              <Text style={{
                x: x + 0.15, y: 1.4,
                w: cardW - 0.3, h: 0.4,
                fontSize: 11, bold: true, fontFace: FONTS.DISPLAY,
                color: THEME.text,
              }}>
                {epic.title}
              </Text>
              {epic.points.map((point, j) => (
                <React.Fragment key={j}>
                  <Shape type="ellipse" style={{
                    x: x + 0.15, y: 1.95 + j * 0.85,
                    w: 0.08, h: 0.08,
                    backgroundColor: THEME.accent,
                  }} />
                  <Text style={{
                    x: x + 0.3, y: 1.9 + j * 0.85,
                    w: cardW - 0.45, h: 0.8,
                    fontSize: 9, fontFace: FONTS.BODY,
                    color: THEME.textSecondary,
                  }}>
                    {point}
                  </Text>
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        })}
      </Slide>

      {/* SLIDE 11: BUSINESS CASE */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        <SectionLabel num="04" title="Business Case" />
        <SlideTitle>{content.businessCase.title}</SlideTitle>
        
        {/* Left - Description */}
        <Shape type="roundRect" style={{
          x: 0.5, y: 1.25, w: 4.2, h: 3.9,
          backgroundColor: THEME.bgCard,
          rectRadius: 0.1,
          shadow: SHADOWS.card,
        }} />
        
        <Text style={{
          x: 0.7, y: 1.4,
          w: 3.8, h: 0.7,
          fontSize: 10, fontFace: FONTS.BODY,
          color: THEME.textSecondary,
        }}>
          {content.businessCase.intro}
        </Text>
        
        <Text style={{
          x: 0.7, y: 2.15,
          w: 3.8, h: 0.25,
          fontSize: 9, bold: true, fontFace: FONTS.BODY,
          color: THEME.accent,
        }}>
          {content.businessCase.customerInputs.title}
        </Text>
        
        {content.businessCase.customerInputs.points.map((point, i) => (
          <React.Fragment key={i}>
            <Shape type="ellipse" style={{
              x: 0.7, y: 2.5 + i * 0.35,
              w: 0.1, h: 0.1,
              backgroundColor: THEME.accent,
            }} />
            <Text style={{
              x: 0.9, y: 2.45 + i * 0.35,
              w: 3.5, h: 0.3,
              fontSize: 10, fontFace: FONTS.BODY,
              color: THEME.text,
            }}>
              {point}
            </Text>
          </React.Fragment>
        ))}
        
        <Text style={{
          x: 0.7, y: 3.65,
          w: 3.8, h: 0.6,
          fontSize: 9, fontFace: FONTS.BODY,
          color: THEME.textSecondary,
        }}>
          {content.businessCase.process}
        </Text>
        
        {/* Right - ROI */}
        <Shape type="roundRect" style={{
          x: 5, y: 1.25, w: 4.5, h: 3.9,
          backgroundColor: THEME.accent,
          rectRadius: 0.12,
          shadow: SHADOWS.elevated,
        }} />
        
        <Text style={{
          x: 5.2, y: 1.35,
          w: 4.1, h: 0.25,
          fontSize: 10, bold: true, fontFace: FONTS.BODY,
          color: THEME.textOnAccent,
        }}>
          {content.businessCase.calculation.title.toUpperCase()}
        </Text>
        
        {content.businessCase.calculation.lines.map((line, i) => (
          <Text key={i} style={{
            x: 5.2, y: 1.65 + i * 0.35,
            w: 4.1, h: 0.3,
            fontSize: 10, fontFace: FONTS.BODY,
            color: THEME.textOnAccent,
          }}>
            {line}
          </Text>
        ))}
        
        <Shape type="rect" style={{
          x: 5.2, y: 3.15, w: 4.1, h: 0.02,
          backgroundColor: 'rgba(0,0,0,0.2)',
        }} />
        
        <Text style={{
          x: 5.2, y: 3.25,
          w: 4.1, h: 0.4,
          fontSize: 32, bold: true, fontFace: FONTS.METRIC,
          color: THEME.textOnAccent,
        }}>
          {content.businessCase.calculation.amount}
        </Text>
        
        <Text style={{
          x: 5.2, y: 3.7,
          w: 4.1, h: 0.3,
          fontSize: 14, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.textOnAccent,
        }}>
          {content.businessCase.calculation.label}
        </Text>
        
        <Text style={{
          x: 5.2, y: 4.05,
          w: 4.1, h: 0.25,
          fontSize: 10, fontFace: FONTS.BODY,
          color: THEME.textOnAccent,
        }}>
          {content.businessCase.calculation.fte}
        </Text>
      </Slide>

      {/* SLIDE 12: CLOSING */}
      <Slide style={{ backgroundColor: THEME.bg }}>
        <AtmosphericBackground />
        
        <Shape type="rect" style={{
          x: -1, y: 3, w: 12, h: 4,
          backgroundColor: 'rgba(255,85,10,0.06)',
          rotate: -5,
        }} />
        
        <Text style={{
          x: 0.5, y: 1.5,
          w: 6, h: 0.5,
          fontSize: 20, fontFace: FONTS.DISPLAY,
          color: THEME.textSecondary,
        }}>
          {content.closing.title}
        </Text>
        
        <Text style={{
          x: 0.5, y: 2.1,
          w: 8, h: 1.0,
          fontSize: 48, bold: true, fontFace: FONTS.DISPLAY,
          color: THEME.accent,
        }}>
          {content.closing.thanks}
        </Text>
        
        <Text style={{
          x: 0.5, y: 3.3,
          w: 7, h: 0.6,
          fontSize: 14, fontFace: FONTS.BODY,
          color: THEME.textSecondary,
        }}>
          {content.closing.cta}
        </Text>
        
        <Shape type="rect" style={{
          x: 0.5, y: 4.1, w: 2.5, h: 0.06,
          backgroundColor: THEME.accent,
        }} />
        
        <Text style={{
          x: 0.5, y: 4.8,
          w: 3, h: 0.3,
          fontSize: 11, fontFace: FONTS.BODY,
          color: THEME.textMuted,
        }}>
          {content.title.company}
        </Text>
        
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

async function generateTextHeavy() {
  const outputDir = path.join(process.cwd(), 'output');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('Generating AVEMO Fahrersoftware - Text-Heavy Version...\n');
  console.log('This version includes:');
  console.log('  - Full sentences and paragraphs');
  console.log('  - Detailed bullet points with complete explanations');
  console.log('  - More content per slide for easier presenting');
  console.log('  - Same modern design (Montserrat, shadows, depth)\n');
  
  try {
    const buffer = await render(<MagnumOpusTextHeavy />);
    const filePath = path.join(outputDir, 'fahrersoftware-text-heavy.pptx');
    fs.writeFileSync(filePath, buffer as Buffer);
    console.log(`  Generated: fahrersoftware-text-heavy.pptx`);
    console.log('\nDone! Presentation saved to ./output/');
  } catch (error) {
    console.error('Error generating presentation:', error);
  }
}

generateTextHeavy().catch(console.error);
