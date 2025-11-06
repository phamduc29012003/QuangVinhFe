import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SectionTitle from '@/components/dashboard/SectionTitle'
import StatCard, { type Stat } from '@/components/dashboard/StatCard'
import { MiniBar, MiniDonut, MiniLeaveStacked, MiniLine } from '@/components/dashboard/Charts'
import ChartCard from '@/components/dashboard/ChartCard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import {
  Users,
  CheckSquare,
  ClipboardList,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
} from 'lucide-react'
import useCheckRole from '@/hooks/useCheckRole'

// Stat type moved to shared component

const kpiForManagerDirector: Stat[] = [
  {
    label: 'Dự án đang chạy',
    value: '12',
    delta: '+2 tuần qua',
    positive: true,
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    label: 'Công việc hoàn thành',
    value: '324',
    delta: '+8%',
    positive: true,
    icon: <CheckSquare className="h-5 w-5" />,
  },
  {
    label: 'Đang tồn đọng',
    value: '19',
    delta: '-3%',
    positive: false,
    icon: <Clock className="h-5 w-5" />,
  },
  {
    label: 'Nhân sự hoạt động',
    value: '58',
    delta: '+3',
    positive: true,
    icon: <Users className="h-5 w-5" />,
  },
]

const kpiForWorker: Stat[] = [
  {
    label: 'Cần làm hôm nay',
    value: '5',
    delta: '2 quá hạn',
    positive: false,
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    label: 'Đã hoàn thành tuần này',
    value: '14',
    delta: '+3',
    positive: true,
    icon: <CheckSquare className="h-5 w-5" />,
  },
]

const dummyMyTasks = [
  {
    id: 'T-1021',
    name: 'Sửa lỗi màn hình đăng nhập',
    project: 'PWA Core',
    due: 'Hôm nay',
    status: 'Đang làm',
    priority: 'Cao',
  },
  {
    id: 'T-1022',
    name: 'Thiết kế component Card',
    project: 'UI Kit',
    due: 'Ngày mai',
    status: 'Chờ review',
    priority: 'Trung bình',
  },
  {
    id: 'T-1023',
    name: 'Viết test cho API',
    project: 'Backend',
    due: 'Trong 3 ngày',
    status: 'Mới',
    priority: 'Thấp',
  },
]

const dummyOverdue = [
  { id: 'T-990', name: 'Tối ưu hiệu năng bảng', owner: 'Quang', days: 2 },
  { id: 'T-981', name: 'Cập nhật tài liệu quy trình', owner: 'Linh', days: 1 },
]

export default function DashboardWeb() {
  const { isManagerPermission, isDirectorPermission } = useCheckRole()
  const navigate = useNavigate()

  const isManagerOrDirector = isManagerPermission || isDirectorPermission

  const kpis = useMemo(
    () => (isManagerOrDirector ? kpiForManagerDirector : kpiForWorker),
    [isManagerOrDirector]
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Bảng điều khiển</h2>
          <p className="text-sm text-muted-foreground">Tổng quan tình hình và công việc</p>
        </div>
        <div className="flex items-center gap-2">
          {isDirectorPermission && <Badge variant="secondary">Director</Badge>}
          {!isDirectorPermission && isManagerPermission && (
            <Badge variant="secondary">Manager</Badge>
          )}
          {!isManagerPermission && !isDirectorPermission && <Badge>Worker</Badge>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </div>

      {isManagerOrDirector ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartCard
              title="Tiến độ công việc theo tuần"
              icon={<LineChart className="h-4 w-4" />}
              badgeText="Tuần 45"
              onClick={() => navigate('/assignments')}
            >
              <MiniLine />
            </ChartCard>
          </div>

          <ChartCard
            title="Tỉ lệ trạng thái dự án"
            icon={<PieChart className="h-4 w-4" />}
            badgeText="12 dự án"
            onClick={() => navigate('/assignments')}
          >
            <div className="flex items-center gap-4">
              <MiniDonut />
              <div className="space-y-2 text-sm">
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

          <div className="lg:col-span-2">
            <ChartCard
              title="Lịch nghỉ nhân sự (tuần)"
              icon={<Calendar className="h-4 w-4" />}
              badgeText="Đã duyệt vs Chờ duyệt"
              onClick={() => navigate('/personnel/leaves')}
            >
              <MiniLeaveStacked />
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500" /> Đã duyệt
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-sm bg-amber-500" /> Chờ duyệt
                </div>
              </div>
            </ChartCard>
          </div>

          <div className="lg:col-span-2">
            <ChartCard
              title="Năng suất đội nhóm"
              icon={<BarChart3 className="h-4 w-4" />}
              badgeText="Tháng này"
              onClick={() => navigate('/assignments')}
            >
              <MiniBar />
            </ChartCard>
          </div>

          <Card>
            <CardContent className="p-4">
              <SectionTitle title="Việc quá hạn" icon={<Clock className="h-4 w-4" />} />
              <Separator className="my-3" />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Phụ trách</TableHead>
                    <TableHead className="text-right">Số ngày</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyOverdue.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.id}</TableCell>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>{t.owner}</TableCell>
                      <TableCell className="text-right">{t.days}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartCard
              title="Tiến độ tuần của tôi"
              icon={<LineChart className="h-4 w-4" />}
              badgeText="Tuần 45"
              onClick={() => navigate('/assignments')}
            >
              <MiniLine />
            </ChartCard>
          </div>
          <ChartCard title="Phân bổ thời gian" icon={<PieChart className="h-4 w-4" />}>
            <div className="mt-2 flex items-center gap-4">
              <MiniDonut />
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Thực thi:
                  60%
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-600" /> Review: 25%
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-gray-300" /> Họp: 15%
                </div>
              </div>
            </div>
          </ChartCard>

          <Card className="lg:col-span-3">
            <CardContent className="p-4">
              <SectionTitle
                title="Công việc của tôi"
                icon={<ClipboardList className="h-4 w-4" />}
              />
              <Separator className="my-3" />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Dự án</TableHead>
                    <TableHead>Hạn</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Độ ưu tiên</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyMyTasks.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.id}</TableCell>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>{t.project}</TableCell>
                      <TableCell>{t.due}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{t.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>{t.priority}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
