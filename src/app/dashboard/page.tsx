import { db } from '@/db'
import { interviews } from '@/db/schema'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export default async function DashboardPage() {
  const allInterviews = await db.select().from(interviews)

  const totalInterviews = allInterviews.length
  const avgDuration = totalInterviews > 0
    ? Math.round(allInterviews.reduce((sum, i) => sum + i.duration, 0) / totalInterviews / 1000)
    : 0
  const completedCount = allInterviews.filter(i => i.completionStatus === 'completed').length
  const completionRate = totalInterviews > 0
    ? Math.round((completedCount / totalInterviews) * 100)
    : 0

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'pending': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Interview Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalInterviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgDuration}s</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Interviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          {allInterviews.length === 0 ? (
            <p className="text-muted-foreground">No interviews yet.</p>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {allInterviews.map((interview) => (
                  <Link
                    key={interview.id}
                    href={`/interview/${interview.callId}`}
                    className="block"
                  >
                    <Card className="hover:bg-accent transition-colors cursor-pointer">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-mono text-sm">{interview.callId}</p>
                            <p className="text-sm text-muted-foreground">
                              {interview.participantId || 'No participant ID'}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={getStatusVariant(interview.completionStatus)}>
                              {interview.completionStatus}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {Math.round(interview.duration / 1000)}s
                            </span>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
