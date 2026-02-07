import { useCallback, useRef, useState } from 'react'

interface ResizeHandleProps {
  onResize: (delta: number) => void
  orientation?: 'vertical' | 'horizontal'
  className?: string
}

/**
 * ResizeHandle — A draggable handle for resizing panels.
 * Features smooth cursor changes, hover states, and active drag indicators.
 */
export function ResizeHandle({
  onResize,
  orientation = 'vertical',
  className = ''
}: ResizeHandleProps): React.JSX.Element {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const lastPosRef = useRef(0)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      setIsDragging(true)
      lastPosRef.current = orientation === 'vertical' ? e.clientX : e.clientY

      const handleMouseMove = (moveEvent: MouseEvent): void => {
        const currentPos = orientation === 'vertical' ? moveEvent.clientX : moveEvent.clientY
        const delta = currentPos - lastPosRef.current
        lastPosRef.current = currentPos
        onResize(delta)
      }

      const handleMouseUp = (): void => {
        setIsDragging(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = orientation === 'vertical' ? 'col-resize' : 'row-resize'
      document.body.style.userSelect = 'none'
    },
    [onResize, orientation]
  )

  const isVertical = orientation === 'vertical'

  return (
    <div
      className={`
        group relative flex-shrink-0 select-none
        ${isVertical ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'}
        ${className}
      `}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="separator"
      aria-orientation={orientation}
      tabIndex={0}
      onKeyDown={(e) => {
        // Keyboard accessibility: arrow keys to resize
        const step = e.shiftKey ? 50 : 10
        if (isVertical) {
          if (e.key === 'ArrowLeft') onResize(-step)
          if (e.key === 'ArrowRight') onResize(step)
        } else {
          if (e.key === 'ArrowUp') onResize(-step)
          if (e.key === 'ArrowDown') onResize(step)
        }
      }}
    >
      {/* Background track */}
      <div
        className={`
          absolute transition-all duration-150
          ${isVertical ? 'inset-y-0 -left-0.5 w-1.5' : 'inset-x-0 -top-0.5 h-1.5'}
          ${isDragging ? 'bg-accent/30' : isHovered ? 'bg-accent/20' : 'bg-transparent'}
        `}
      />

      {/* Visible handle line */}
      <div
        className={`
          absolute transition-all duration-150
          ${isVertical ? 'inset-y-0 left-0 w-px' : 'inset-x-0 top-0 h-px'}
          ${isDragging ? 'bg-accent' : isHovered ? 'bg-accent/60' : 'bg-border'}
        `}
      />

      {/* Center grip indicator — appears on hover */}
      <div
        className={`
          absolute flex items-center justify-center transition-opacity duration-200
          ${isVertical ? 'inset-y-0 -left-1.5 w-4' : 'inset-x-0 -top-1.5 h-4'}
          ${isHovered || isDragging ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <div
          className={`
            flex gap-0.5
            ${isVertical ? 'flex-col' : 'flex-row'}
          `}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`
                rounded-full bg-accent/80 transition-transform duration-200
                ${isVertical ? 'h-1 w-0.5' : 'h-0.5 w-1'}
                ${isDragging ? 'scale-110' : ''}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
