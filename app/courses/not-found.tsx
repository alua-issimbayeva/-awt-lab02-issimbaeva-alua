import Link from "next/link";

export default function CourseNotFound() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Course not found</h1>
      <p>We couldn&apos;t find a course with that id.</p>
      <Link href="/courses" className="underline">
        Back to all courses
      </Link>
    </div>
  );
}
