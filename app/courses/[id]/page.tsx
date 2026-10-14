import { notFound } from "next/navigation";
import { EnrollForm } from "@/components/EnrollForm";
import LikeButton from "@/components/LikeButton";
import { getCourse } from "@/lib/courses";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p>{course.description}</p>
      <p>Credits: {course.credits}</p>
      <LikeButton courseId={course.id} initialLikes={course.likes} />
      <h2 className="mt-6 mb-2 text-xl font-semibold">Enroll in this course</h2>
      <EnrollForm courseId={course.id} />
    </div>
  );
}
