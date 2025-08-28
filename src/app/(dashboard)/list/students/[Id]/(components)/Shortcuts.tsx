import Link from 'next/link'
import React from 'react'

export default function Shortcuts() {
  return (
    <div className="bg-white p-4 rounded-md">
      <h1 className="font-semibold text-xl">Shortcuts</h1>
      <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
        <Link
          className="p-2 rounded-md bg-mySkyLight"
          href={`/list/lessons?classId=${2}`}
        >
          Student &apos;s Lessons
        </Link>
        <Link
          className="p-2 rounded-md bg-myPurpleLight"
          href={`/list/teachers?classId=${2}`}
        >
          Student &apos;s Teachers
        </Link>
        <Link
          className="p-2 rounded-md bg-pink-50"
          href={`/list/exams?classId=${2}`}
        >
          Student &apos;s Exams
        </Link>
        <Link
          className="p-2 rounded-md bg-mySkyLight"
          href={`/list/assignments?classId=${2}`}
        >
          Student &apos;s Assignments
        </Link>
        <Link
          className="p-2 rounded-md bg-myYellowLight"
          href={`/list/results?studentId=${'student2'}`}
        >
          Student &apos;s Results
        </Link>
      </div>
    </div>
  );
}
