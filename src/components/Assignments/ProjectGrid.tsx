import { Card, CardContent, CardHeader } from '../ui/card'
import type { IProjectAssignment } from '@/types/Assignment'
import { ProjectCard } from './ProjectCard'

interface ProjectGridProps {
  projects: IProjectAssignment[]
  loading?: boolean
  onView?: (project: IProjectAssignment) => void
}

export const ProjectGrid = ({ projects, loading, onView }: ProjectGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card key={idx} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects?.map((p, idx) => (
        <ProjectCard key={p.value || p.name || idx} project={p} onView={onView} />
      ))}
    </div>
  )
}

export default ProjectGrid
