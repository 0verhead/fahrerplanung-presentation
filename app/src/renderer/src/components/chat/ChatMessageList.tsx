/**
 * ChatMessageList — Renders the list of chat messages
 */

import type { ChatMessage } from '../../../../shared/types/ai'
import { ChatMessageItem } from './ChatMessageItem'

interface ChatMessageListProps {
  messages: ChatMessage[]
}

export function ChatMessageList({ messages }: ChatMessageListProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} />
      ))}
    </div>
  )
}
