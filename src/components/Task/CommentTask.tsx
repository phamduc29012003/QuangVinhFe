import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'

const MOCK_COMMENTS = [
  {
    id: 'c1',
    userId: 'u3',
    userName: 'Charlie',
    avatar: '/photo_2025-09-26_12-28-52 (2).jpg',
    content: 'Chỗ ước lượng t có thể làm nhanh hơn.',
    date: '2025-10-29T11:23:00Z',
  },
  {
    id: 'c2',
    userId: 'u1',
    userName: 'Alice',
    avatar: '/photo_2025-09-26_12-28-52 (3).jpg',
    content: 'OK để t lên CI trước.',
    date: '2025-10-29T12:20:00Z',
  },
  {
    id: 'c3',
    userId: 'u2',
    userName: 'Bob',
    avatar: 'photo_2025-09-26_12-28-52.jpg',
    content: 'OK để t lên CI trước.',
    date: '2025-10-29T13:20:00Z',
  },
  {
    id: 'c4',
    userId: 'u3',
    userName: 'Charlie',
    avatar: '/photo_2025-09-26_12-28-53.jpg',
    content: 'OK để t lên CI trước.',
    date: '2025-10-29T14:20:00Z',
  },
  {
    id: 'c5',
    userId: 'u1',
    userName: 'Alice',
    avatar: '/photo_2025-09-26_12-28-54.jpg',
    content: 'OK để t lên CI trước.',
    date: '2025-10-29T15:20:00Z',
  },
]

export const CommentTask = () => {
  const [commentInput, setCommentInput] = useState('')
  const [comments, setComments] = useState(MOCK_COMMENTS)

  console.log('comments', setComments)

  const handleNavigate = (userId: string) => {
    console.log('Navigate to user:', userId)
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Bình luận ({comments.length})</h3>
          </div>

          {/* Comment Input */}
          <div className="flex gap-3 mb-6 pb-6 border-b border-gray-100">
            <Avatar className="w-9 h-9 shrink-0">
              <AvatarImage src="/photo_2025-09-26_12-28-52 (2).jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Viết bình luận..."
                className="resize-none min-h-[44px] text-sm border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                rows={1}
              />
              <Button
                size="icon"
                disabled={!commentInput.trim()}
                className="shrink-0 bg-gray-900 hover:bg-gray-800"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <Avatar
                  onClick={() => handleNavigate(c.userId)}
                  className="w-9 h-9 shrink-0 cursor-pointer"
                >
                  <AvatarImage src={c.avatar} alt={c.userName} />
                  <AvatarFallback>{c.userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span
                      onClick={() => handleNavigate(c.userId)}
                      className="font-medium text-sm text-gray-900 cursor-pointer hover:text-blue-600"
                    >
                      {c.userName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(c.date).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
