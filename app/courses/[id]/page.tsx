import { notFound } from "next/navigation";
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
      <LikeButton initialLikes={course.likes} />
    </div>
  );
}
