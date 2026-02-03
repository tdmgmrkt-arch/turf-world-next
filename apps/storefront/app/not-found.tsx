import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="mt-6 text-primary hover:underline">
        Go Home
      </Link>
    </div>
  );
}
