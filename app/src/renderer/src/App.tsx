function App(): React.JSX.Element {
  return (
    <div className="bg-atmosphere relative flex h-full items-center justify-center overflow-hidden">
      {/* Subtle noise texture */}
      <div className="bg-noise pointer-events-none absolute inset-0" />

      {/* Decorative geometric accent — diagonal amber strip */}
      <div
        className="pointer-events-none absolute -right-20 top-1/4 h-[200px] w-[600px] rotate-[-15deg] opacity-[0.04]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--accent-default) 40%, var(--accent-bright) 60%, transparent 100%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
        {/* Label */}
        <span className="text-label tracking-widest">Presentation Studio</span>

        {/* Title */}
        <h1 className="text-display-hero text-gradient-accent">Encore</h1>

        {/* Subtitle */}
        <p className="max-w-md font-body text-lg text-text-secondary">
          AI-powered presentations with distinctive design. Built on React-PPTX and the Vercel AI
          SDK.
        </p>

        {/* Status pill */}
        <div className="mt-2 flex items-center gap-2 rounded-full border border-border bg-surface-raised px-4 py-2 shadow-md">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-success" />
          <span className="text-sm font-medium text-text-secondary">Design system initialized</span>
        </div>

        {/* Color swatches preview */}
        <div className="mt-6 flex gap-2">
          {[
            { bg: 'bg-surface-ground', label: 'Ground' },
            { bg: 'bg-surface-base', label: 'Base' },
            { bg: 'bg-surface-raised', label: 'Raised' },
            { bg: 'bg-surface-overlay', label: 'Overlay' },
            { bg: 'bg-surface-elevated', label: 'Elevated' },
            { bg: 'bg-accent', label: 'Accent' }
          ].map(({ bg, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className={`h-8 w-8 rounded-lg border border-border shadow-sm ${bg} transition-normal hover:scale-110`}
              />
              <span className="text-[10px] text-text-disabled">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
