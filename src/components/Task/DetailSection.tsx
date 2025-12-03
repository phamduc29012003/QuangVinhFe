import { TASK_PRIORITY_LABELS, TASK_TYPE_LABELS } from '@/constants/assignments/task'
import { ChevronDown } from 'lucide-react'

export const DetailSection = ({ projectAssignmentDetail }: { projectAssignmentDetail: any }) => {
  return (
    <div className="my-6 border-t pt-4 ">
      <details open className="group">
        <summary className="flex items-center gap-2 cursor-pointer list-none font-semibold text-sm text-gray-900 mb-4">
          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-0 -rotate-90" />
          Details
        </summary>

        <div className="space-y-3 ml-6">
          {/* Type */}
          <div className="flex items-start gap-3">
            <span className="text-sm text-gray-600 w-20 shrink-0">Type:</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" />
                </svg>
                {TASK_TYPE_LABELS[projectAssignmentDetail?.taskType || 1] || 'Không xác định'}
              </span>
            </div>
          </div>

          {/* Priority */}
          <div className="flex items-start gap-3">
            <span className="text-sm text-gray-600 w-20 shrink-0">Priority:</span>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                  (projectAssignmentDetail?.priority || 0) >= 3
                    ? 'bg-red-100 text-red-700'
                    : (projectAssignmentDetail?.priority || 0) >= 2
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8L10 2Z" />
                </svg>
                {TASK_PRIORITY_LABELS[projectAssignmentDetail?.priority || 0] || 'Không xác định'}
              </span>
            </div>
          </div>
        </div>
      </details>
    </div>
  )
}
