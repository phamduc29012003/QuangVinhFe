import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import type { IProjectAssignment } from '@/types/project'
import { useNavigate } from 'react-router'
import { Users, CheckCircle2, User } from 'lucide-react'

interface ProjectCardProps {
  project: IProjectAssignment
  onView?: (project: IProjectAssignment) => void
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate()

  const handleView = () => {
    navigate(`/assignments/${project.taskGroupId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate">{project.name}</span>
          {project.memberIds?.length > 0 ? (
            <Badge variant="secondary">{project.memberIds.length} thành viên</Badge>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          {/* Owner */}
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Chủ sở hữu:</span>
            <span className="font-medium">{project.owner?.name || '—'}</span>
          </div>

          {/* Members */}
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Thành viên:</span>
            <span className="font-medium">{project.memberIds?.length || 0} người</span>
          </div>

          {/* Tasks */}
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Số task:</span>
            <span className="font-medium">{project.taskIds?.length || 0}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={handleView}>
            Xem chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectCard
