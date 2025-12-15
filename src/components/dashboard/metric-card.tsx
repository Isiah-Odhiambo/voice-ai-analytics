interface MetricCardProps {
  title: string
  value: string | number
  suffix?: string
}

export function MetricCard({ title, value, suffix = '' }: MetricCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-xl border p-3 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <p className="text-lg sm:text-2xl font-bold mt-1">{value}{suffix}</p>
    </div>
  )
}
