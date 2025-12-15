import { ScrollArea } from '@/components/ui/scroll-area'
import type { ExtractedVariables } from '@/lib/types'

interface QuestionAnalyticsProps {
  extractedVariables: (ExtractedVariables | null)[]
}

// Process extracted variables for analytics
function processExtractedVariables(variables: (ExtractedVariables | null)[]) {
  let womanYes = 0
  let womanNo = 0
  const recentAnswers: { food: string; reason?: string }[] = []
  let totalFoodLength = 0
  let totalReasonLength = 0
  let foodCount = 0

  variables.forEach((vars) => {
    if (!vars) return

    if (vars.is_woman === true) {
      womanYes++
      if (vars.favorite_food) {
        const food = vars.favorite_food.trim()
        const reason = vars.food_reason?.trim()
        recentAnswers.push({ food, reason })
        totalFoodLength += food.length
        totalReasonLength += reason?.length || 0
        foodCount++
      }
    } else if (vars.is_woman === false) {
      womanNo++
    }
  })

  // Average response length (food + reason combined)
  const avgResponseLength = foodCount > 0
    ? Math.round((totalFoodLength + totalReasonLength) / foodCount)
    : 0

  return { womanYes, womanNo, recentAnswers, avgResponseLength, foodCount }
}

export function QuestionAnalytics({ extractedVariables }: QuestionAnalyticsProps) {
  const { womanYes, womanNo, recentAnswers, avgResponseLength, foodCount } = processExtractedVariables(extractedVariables)
  const total = womanYes + womanNo
  const hasData = total > 0

  if (!hasData) {
    return (
      <div className="bg-card text-card-foreground rounded-xl border p-3 shadow-sm mb-8">
        <p className="text-sm font-semibold">Question Analytics</p>
        <p className="text-muted-foreground text-xs mt-1">No questions analyzed yet.</p>
      </div>
    )
  }

  const yesPercent = Math.round((womanYes / total) * 100)
  const noPercent = 100 - yesPercent

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
      {/* Are you a woman? */}
      <div className="bg-card text-card-foreground rounded-xl border p-3 shadow-sm">
        <p className="text-sm font-semibold mb-2">Are you a woman?</p>
        <div className="h-3 bg-muted rounded-full overflow-hidden flex mb-2">
          {yesPercent > 0 && (
            <div className="h-full bg-emerald-500" style={{ width: `${yesPercent}%` }} />
          )}
          {noPercent > 0 && (
            <div className="h-full bg-slate-400" style={{ width: `${noPercent}%` }} />
          )}
        </div>
        <div className="flex justify-between text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Yes: {womanYes} ({yesPercent}%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            <span>No: {womanNo} ({noPercent}%)</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Total: {total} responses</p>
      </div>

      {/* What's your favorite food and why? */}
      <div className="bg-card text-card-foreground rounded-xl border p-3 shadow-sm">
        <p className="text-sm font-semibold mb-2">What&apos;s your favorite food and why?</p>
        {recentAnswers.length === 0 ? (
          <p className="text-xs text-muted-foreground">No responses yet (only asked to women)</p>
        ) : (
          <>
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>{foodCount} responses</span>
              <span>Avg: {avgResponseLength} chars</span>
            </div>
            <ScrollArea className="h-[80px]">
              <div className="space-y-1 pr-4">
                {recentAnswers.slice(0, 5).map((answer, i) => (
                  <div key={i} className="text-xs border-l-2 border-muted pl-2">
                    <span className="font-medium">{answer.food}</span>
                    {answer.reason && (
                      <span className="text-muted-foreground"> - {answer.reason}</span>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  )
}
