import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold">AWT Course Catalog</h1>
      <p>Browse the courses of the Advanced Web Technologies program.</p>
      <Link href="/courses" className="underline">
        Browse courses
      </Link>
    </div>
  );
}
