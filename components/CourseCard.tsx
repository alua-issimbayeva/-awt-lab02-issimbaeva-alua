import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  credits: number;
  likes: number;
};

export default function CourseCard({
  id,
  title,
  description,
  credits,
  likes,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`} className="block h-full">
      <Card className="h-full hover:shadow-md hover:border-blue-300 hover:ring-blue-300 transition">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <p className="text-muted-foreground">{description}</p>
          <div className="mt-auto flex items-center justify-between">
            <span>{credits} credits</span>
            <Button variant="ghost" size="sm">
              ❤ {likes}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
