import { useEditor } from '@/hooks/UseWorkflowEditor'
import React, { useEffect } from 'react'

export default function LogList() {
  const { state } = useEditor()

  useEffect(() => {
    console.log(state.editor.logs)
  }, [state.editor.logs])


  return (
    <div>log-list</div>
  )
}
