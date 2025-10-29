import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import type { IProjectAssignment } from '@/types/Assignment'
import { useNavigate } from 'react-router'

interface ProjectCardProps {
  project: IProjectAssignment
  onView?: (project: IProjectAssignment) => void
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate()
  const handleView = () => {
    navigate(`/assignments/${1}`)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate">{project.name}</span>
          {project.value ? <Badge variant="secondary">{project.value}</Badge> : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{project.description || '—'}</p>
        <div className="mt-4 flex justify-end">
          <Button className="cursor-pointer" size="sm" variant="outline" onClick={handleView}>
            Xem chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectCard
