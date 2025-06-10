import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Package, AlertTriangle } from "lucide-react"
import type { Activity } from "@/types"

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "add":
        return <TrendingUp className="h-4 w-4 text-pink-600" />
      case "update":
        return <Package className="h-4 w-4 text-pink-500" />
      case "delete":
        return <AlertTriangle className="h-4 w-4 text-pink-700" />
      default:
        return <Package className="h-4 w-4 text-pink-500" />
    }
  }

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case "add":
        return "bg-pink-100"
      case "update":
        return "bg-pink-50"
      case "delete":
        return "bg-pink-200"
      default:
        return "bg-pink-50"
    }
  }

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className={`p-2 rounded-full ${getActivityBgColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.item}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
