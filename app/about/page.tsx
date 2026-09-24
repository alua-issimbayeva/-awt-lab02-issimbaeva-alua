export default function AboutPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">About this project</h1>
      <p>
        This catalog is the semester project for the Advanced Web Technologies
        course. It lists every course in the program with its description,
        credits, and likes.
      </p>
      <p>
        It is built with Next.js and the App Router: Server Components load the
        data, and a single Client Component handles the like button. The course
        data comes from a mock module that simulates a backend.
      </p>
    </div>
  );
}
