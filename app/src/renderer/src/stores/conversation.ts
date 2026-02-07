/**
 * Conversation Store — Manages chat state with Zustand
 *
 * Handles:
 * - Message history
 * - Streaming state (text accumulation, tool calls)
 * - Step progress for multi-step agent loops
 * - Error state
 *
 * Syncs with main process via IPC for persistence.
 */

import { create } from 'zustand'
import type { AIStreamEvent, ChatMessage } from '../../../shared/types/ai'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Active tool call being displayed */
export interface ActiveToolCall {
  id: string
  name: string
  status: 'running' | 'complete'
}

/** Step progress information */
export interface StepProgress {
  current: number
  max: number
}

interface ConversationState {
  // Message state
  messages: ChatMessage[]
  isLoading: boolean

  // Streaming state
  isStreaming: boolean
  streamingText: string
  activeToolCalls: ActiveToolCall[]
  stepProgress: StepProgress | null

  // Error state
  error: string | null

  // Actions
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  clearMessages: () => void

  // Streaming actions
  startStreaming: () => void
  appendStreamingText: (delta: string) => void
  addToolCall: (toolCall: ActiveToolCall) => void
  updateToolCall: (toolCallId: string, status: 'running' | 'complete') => void
  removeToolCall: (toolCallId: string) => void
  setStepProgress: (progress: StepProgress | null) => void
  finishStreaming: (finalText: string) => void
  abortStreaming: () => void

  // Error handling
  setError: (error: string | null) => void
  clearError: () => void

  // Loading state (for initial load)
  setLoading: (loading: boolean) => void

  // Process stream event (convenience method that handles all event types)
  handleStreamEvent: (event: AIStreamEvent) => void

  // Load history from main process
  loadHistory: () => Promise<void>

  // Send message to main process
  sendMessage: (content: string) => void

  // Abort current generation
  abort: () => void

  // Clear history in main process
  clearHistory: () => Promise<void>
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useConversationStore = create<ConversationState>((set, get) => ({
  // Initial state
  messages: [],
  isLoading: true,
  isStreaming: false,
  streamingText: '',
  activeToolCalls: [],
  stepProgress: null,
  error: null,

  // Message actions
  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message]
    })),

  clearMessages: () => set({ messages: [] }),

  // Streaming actions
  startStreaming: () =>
    set({
      isStreaming: true,
      streamingText: '',
      activeToolCalls: [],
      stepProgress: null,
      error: null
    }),

  appendStreamingText: (delta) =>
    set((state) => ({
      streamingText: state.streamingText + delta
    })),

  addToolCall: (toolCall) =>
    set((state) => ({
      activeToolCalls: [...state.activeToolCalls, toolCall]
    })),

  updateToolCall: (toolCallId, status) =>
    set((state) => ({
      activeToolCalls: state.activeToolCalls.map((tc) =>
        tc.id === toolCallId ? { ...tc, status } : tc
      )
    })),

  removeToolCall: (toolCallId) =>
    set((state) => ({
      activeToolCalls: state.activeToolCalls.filter((tc) => tc.id !== toolCallId)
    })),

  setStepProgress: (progress) => set({ stepProgress: progress }),

  finishStreaming: (finalText) => {
    // Add assistant message if there's content
    if (finalText.trim()) {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: finalText,
        createdAt: new Date().toISOString()
      }
      set((s) => ({
        messages: [...s.messages, assistantMessage],
        isStreaming: false,
        streamingText: '',
        activeToolCalls: [],
        stepProgress: null
      }))
    } else {
      set({
        isStreaming: false,
        streamingText: '',
        activeToolCalls: [],
        stepProgress: null
      })
    }
  },

  abortStreaming: () =>
    set({
      isStreaming: false,
      streamingText: '',
      activeToolCalls: [],
      stepProgress: null
    }),

  // Error handling
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Process stream event
  handleStreamEvent: (event) => {
    const state = get()

    switch (event.type) {
      case 'text-delta':
        state.appendStreamingText(event.textDelta)
        break

      case 'tool-call-start':
        state.addToolCall({
          id: event.toolCallId,
          name: event.toolName,
          status: 'running'
        })
        break

      case 'tool-call-result':
        state.updateToolCall(event.toolCallId, 'complete')
        // Remove after a short delay
        setTimeout(() => {
          state.removeToolCall(event.toolCallId)
        }, 1000)
        break

      case 'step-start':
        state.setStepProgress({
          current: event.stepNumber,
          max: event.maxSteps
        })
        break

      case 'step-finish':
        // Update step progress
        set((s) => ({
          stepProgress: s.stepProgress
            ? { ...s.stepProgress, current: event.stepNumber }
            : { current: event.stepNumber, max: 10 }
        }))
        break

      case 'finish':
        state.finishStreaming(event.text)
        break

      case 'error':
        set({
          error: event.error,
          isStreaming: false,
          streamingText: '',
          activeToolCalls: [],
          stepProgress: null
        })
        break
    }
  },

  // Load history from main process
  loadHistory: async () => {
    try {
      const { messages } = await window.api.getHistory()
      set({ messages, isLoading: false })
    } catch (error) {
      console.error('Failed to load conversation history:', error)
      set({ isLoading: false })
    }
  },

  // Send message to main process
  sendMessage: (content) => {
    const state = get()

    // Clear any previous error
    state.clearError()

    // Add user message optimistically
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString()
    }
    state.addMessage(userMessage)

    // Start streaming state
    state.startStreaming()

    // Send to main process
    window.api.sendMessage(content)
  },

  // Abort current generation
  abort: () => {
    window.api.abort()
    get().abortStreaming()
  },

  // Clear history in main process
  clearHistory: async () => {
    await window.api.clearHistory()
    set({ messages: [], error: null })
  }
}))
