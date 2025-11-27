import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AssignmentsSheet from '@/components/Assignments/Sheet'
import ProjectGrid from '@/components/Assignments/ProjectGrid'
import { useGetProjectList } from '@/hooks/assignments/useGetProjectList'
import { useCreateProject } from '@/hooks/assignments/useCreateProject'
import type { IProject } from '@/types/project'
import PaginationControl from '@/components/common/PaginationControl'

const ProjectAssignment = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const itemsPerPage = 9

  const { projectsAssignments, total, totalPages, isFetching } = useGetProjectList({
    statuses: null,
    ownerIds: [],
    offset: (currentPage - 1) * itemsPerPage,
    limit: itemsPerPage,
  })

  const { createProjectMutation } = useCreateProject()
  const [open, setOpen] = useState(false)

  const onCreate = (data: IProject) => {
    createProjectMutation.mutate(data)
  }

  // Calculate total pages: use API's totalPages if available, otherwise calculate from total
  const calculatedTotalPages = totalPages > 0 ? totalPages : Math.ceil(total / itemsPerPage)

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Dự án</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Tìm kiếm dự án..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:w-64"
          />
          <Button onClick={() => setOpen(true)}>Tạo dự án</Button>
          <AssignmentsSheet
            open={open}
            setOpen={setOpen}
            onSubmit={onCreate}
            isSubmitting={isFetching}
          />
        </div>
      </div>

      <ProjectGrid projects={projectsAssignments} loading={isFetching} />

      {/* Pagination */}
      <PaginationControl
        currentPage={currentPage}
        totalPages={calculatedTotalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default ProjectAssignment
