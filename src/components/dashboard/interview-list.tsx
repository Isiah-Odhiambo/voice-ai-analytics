'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { FilterButtons, type FilterOption } from '@/components/ui/filter-buttons'
import { CopyButton } from '@/components/ui/copy-button'
import type { Interview } from '@/lib/types'

interface InterviewListProps {
  interviews: Interview[]
}

type FilterType = 'all' | 'woman' | 'not-woman'

const FILTER_OPTIONS: FilterOption<FilterType>[] = [
  { value: 'all', label: 'All' },
  { value: 'woman', label: 'Woman' },
  { value: 'not-woman', label: 'Not woman' },
]

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function InterviewList({ interviews }: InterviewListProps) {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredInterviews = interviews.filter((interview) => {
    if (filter === 'all') return true
    const isWoman = interview.extractedVariables?.is_woman
    if (filter === 'woman') return isWoman === true
    if (filter === 'not-woman') return isWoman === false
    return true
  })

  return (
    <div className="bg-card text-card-foreground rounded-xl border p-3 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold">Recent Interviews</p>
        <FilterButtons options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
      </div>
      {filteredInterviews.length === 0 ? (
        <p className="text-muted-foreground text-xs">
          {filter === 'all' ? 'No interviews yet.' : 'No interviews match this filter.'}
        </p>
      ) : (
        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          <div className="min-w-[500px] space-y-2 pr-2">
            {filteredInterviews.map((interview) => {
              const vars = interview.extractedVariables
              const isWoman = vars?.is_woman
              const favoriteFood = vars?.favorite_food
              const foodReason = vars?.food_reason

              return (
                <Link
                  key={interview.id}
                  href={`/interview/${interview.callId}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-2 rounded-lg border hover:bg-accent transition-colors">
                    {/* Left side */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Participant ID & Date */}
                      <div className="min-w-[100px]">
                        <p className="font-medium text-xs">
                          {interview.participantId || 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(interview.createdAt)}
                        </p>
                      </div>

                      {/* Woman badge */}
                      {isWoman !== undefined && (
                        <Badge
                          variant={isWoman ? 'default' : 'secondary'}
                          className="shrink-0 text-xs"
                        >
                          {isWoman ? 'Woman' : 'Not woman'}
                        </Badge>
                      )}

                      {/* Favorite food & reason */}
                      {favoriteFood && (
                        <div className="min-w-0 flex-1">
                          <p className="text-xs capitalize truncate">
                            {favoriteFood}
                          </p>
                          {foodReason && (
                            <p className="text-xs text-muted-foreground truncate">
                              {foodReason}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-xs text-muted-foreground">
                        {Math.round(interview.duration / 1000)}s
                      </span>
                      <CopyButton text={interview.callId} label="Call ID" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
