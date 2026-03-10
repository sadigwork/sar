export default function NotFound() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-6">The fellowship application page you are looking for does not exist.</p>
      <a href="/dashboard" className="text-primary hover:underline">
        Return to Dashboard
      </a>
    </div>
  )
}
