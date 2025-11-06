import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import MobileBottomNav from '@/components/ui/mobile-bottom-nav'
import { ClipboardList, PieChart, LineChart, Calendar } from 'lucide-react'
import useCheckRole from '@/hooks/useCheckRole'
import { useNavigate } from 'react-router'
// Section title provided by ChartCard; no direct use here
import { MiniDonut, MiniLeaveStacked, MiniLine } from '@/components/dashboard/Charts'
import StatCard, { type Stat } from '@/components/dashboard/StatCard'
import ChartCard from '@/components/dashboard/ChartCard'

const dummyMyTasks = [
  { id: 'T-1021', name: 'Sửa lỗi màn hình đăng nhập', due: 'Hôm nay', status: 'Đang làm' },
  { id: 'T-1022', name: 'Thiết kế component Card', due: 'Ngày mai', status: 'Chờ review' },
]

export default function DashboardMobile() {
  const { isManagerPermission, isDirectorPermission } = useCheckRole()
  const isManagerOrDirector = isManagerPermission || isDirectorPermission
  const navigate = useNavigate()

  return (
    <div className="flex h-dvh flex-col bg-background">
      <div className="flex-1 space-y-4 overflow-auto p-3 pb-24">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Xin chào, chúc bạn một ngày hiệu quả!</p>
          {isDirectorPermission ? (
            <Badge variant="secondary">Director</Badge>
          ) : isManagerPermission ? (
            <Badge variant="secondary">Manager</Badge>
          ) : (
            <Badge>Worker</Badge>
          )}
        </div>

        <ChartCard
          title="Tiến độ tuần"
          icon={<LineChart className="h-4 w-4" />}
          badgeText="Tuần 45"
          contentClassName="p-3"
          onClick={() => navigate('/mobile/assignments')}
        >
          <MiniLine className="h-14 w-full sm:h-16" />
        </ChartCard>

        <div className="grid w-full gap-3 [grid-template-columns:repeat(auto-fit,minmax(120px,1fr))]">
          <StatCard dense stat={{ label: 'Cần làm hôm nay', value: '5' } as Stat} />
          <StatCard
            dense
            stat={{ label: 'Đã hoàn thành tuần này', value: '14', positive: true } as Stat}
          />
        </div>

        {isManagerOrDirector && (
          <>
            <ChartCard
              title="Trạng thái dự án"
              icon={<PieChart className="h-4 w-4" />}
              contentClassName="p-3"
              onClick={() => navigate('/mobile/assignments')}
            >
              <div className="mt-2 flex items-center gap-3">
                <MiniDonut className="h-14 w-14 sm:h-16 sm:w-16" />
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Đúng tiến
                    độ: 60%
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-600" /> Chậm: 25%
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-gray-300" /> Tạm dừng: 15%
                  </div>
                </div>
              </div>
            </ChartCard>
            <ChartCard
              title="Lịch nghỉ (tuần)"
              icon={<Calendar className="h-4 w-4" />}
              badgeText="Duyệt vs Chờ"
              contentClassName="p-3"
              onClick={() => navigate('/mobile/leaves')}
            >
              <MiniLeaveStacked className="h-20 w-full sm:h-24" />
              <div className="mt-1 flex items-center gap-4 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500" /> Đã duyệt
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-sm bg-amber-500" /> Chờ duyệt
                </div>
              </div>
            </ChartCard>
          </>
        )}

        <Card className="w-full">
          <CardContent className="p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <ClipboardList className="h-4 w-4" /> Công việc của tôi
            </div>
            {/* Mobile list (stacked) */}
            <div className="space-y-2 sm:hidden">
              {dummyMyTasks.map((t) => (
                <div key={t.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t.id}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{t.status}</Badge>
                      <span className="text-[11px] text-muted-foreground">{t.due}</span>
                    </div>
                  </div>
                  <div className="mt-1 text-sm font-medium">{t.name}</div>
                </div>
              ))}
            </div>
            {/* Table for >= sm screens */}
            <div className="-mx-3 hidden overflow-x-auto px-3 sm:block">
              <Table className="min-w-[520px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Hạn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyMyTasks.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.id}</TableCell>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{t.status}</Badge>
                          <span className="text-xs text-muted-foreground">{t.due}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <MobileBottomNav />
    </div>
  )
}
