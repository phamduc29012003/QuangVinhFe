import { useParams } from 'react-router'

export const DetailTask = () => {
  const { id } = useParams()
  console.log('id', id)
  return (
    <div>
      <h1>Detail Task</h1>
    </div>
  )
}
