import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AssignmentsSheet from '@/components/Assignments/Sheet'
import ProjectGrid from '@/components/Assignments/ProjectGrid'
import { useGetProjectList } from '@/hooks/assignments/useGetProjectList'
import { useCreateProject } from '@/hooks/assignments/useCreateProject'
import { useForm } from 'react-hook-form'
import type { IProjectAssignment } from '@/types/Assignment'
import { queryClient } from '@/lib/queryClient'
import { projectsAssignmentsKey } from '@/constants/assignments/assignment'

const DUMMY_PROJECTS: IProjectAssignment[] = [
  {
    name: 'Quản lý bán hàng',
    description: 'Hệ thống quản lý đơn hàng và kho cho SME',
    value: 'Active',
  },
  {
    name: 'Nội bộ HR',
    description: 'Quy trình tuyển dụng, chấm công và phúc lợi',
    value: 'Planning',
  },
  {
    name: 'Portal khách hàng',
    description: 'Trang portal tra cứu hợp đồng và hỗ trợ',
    value: 'Paused',
  },
]

const ProjectAssignment = () => {
  // Toggle dummy mode: true = dùng dữ liệu mock, false = gọi API thật
  const USE_DUMMY = true

  const { projectsAssignments, isLoading } = useGetProjectList()
  const { createProjectMutation } = useCreateProject()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dummyProjects, setDummyProjects] = useState<IProjectAssignment[]>(DUMMY_PROJECTS)

  const { reset } = useForm<IProjectAssignment>()

  const filteredProjects = useMemo(() => {
    const sourceList = USE_DUMMY ? dummyProjects : projectsAssignments || []
    if (!search.trim()) return sourceList
    const q = search.toLowerCase()
    return sourceList.filter((p: IProjectAssignment) => {
      return (
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.value?.toLowerCase().includes(q)
      )
    })
  }, [USE_DUMMY, dummyProjects, projectsAssignments, search])

  const onCreate = (data: IProjectAssignment) => {
    if (USE_DUMMY) {
      setDummyProjects((prev) => [{ ...data }, ...prev])
      reset()
      setOpen(false)
      return
    }

    createProjectMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: projectsAssignmentsKey.getAll })
        reset()
        setOpen(false)
      },
    })
  }

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
            isSubmitting={!USE_DUMMY && createProjectMutation.isPending}
          />
        </div>
      </div>

      <ProjectGrid projects={filteredProjects} loading={!USE_DUMMY && isLoading} />
    </div>
  )
}

export default ProjectAssignment
