import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, ListTodo, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useTranslation } from "@/lib/i18n";
interface Stats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

interface StatsDisplayProps {
  stats: Stats;
}

export default function StatsDisplay({ stats }: StatsDisplayProps) {
  const { t } = useTranslation();
  const statCards = [
    {
      title: t('allTasks'),
      value: stats.total,
      icon: ListTodo,
      color: "text-blue-500",
    },
    {
      title: t('completed'),
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      title: t('pending'),
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title:  t('overdue'),
      value: stats.overdue,
      icon: AlertTriangle,
      color: "text-red-500",
    },
  ];

  const chartData = [
    { name: t('completed'), value: stats.completed, color: "hsl(142.1 76.2% 36.3%)" },
    { name: t('pending'), value: stats.pending, color: "hsl(47.9 95.8% 53.1%)" },
    { name: t('overdue'), value: stats.overdue, color: "hsl(0 84.2% 60.2%)" },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="text-lg"> {/* Increased text size */}
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium text-muted-foreground"> {/* Increased text size */}
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold mt-2"> {/* Increased text size */}
                    {stat.value}
                  </h3>
                </div>
                <stat.icon className={cn("h-10 w-10", stat.color)} /> {/* Increased icon size */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.total > 0 && (
        <Card className="text-lg"> {/* Increased text size */}
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4"> {/* Increased text size */}
              {t('tasksDistribution')}</h3>
            <div className="h-[400px] w-full"> {/* Increased chart height */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}