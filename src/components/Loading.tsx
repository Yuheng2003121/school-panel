import { Loader } from 'lucide-react'
import React from 'react'

export default function Loading() {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <Loader className='animate-spin size-8'/>
    </div>
  )
}
