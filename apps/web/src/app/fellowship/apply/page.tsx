export const dynamic = "force-dynamic"

export default function FellowshipApplicationPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Fellowship Application</h1>
      <p className="text-muted-foreground mb-6">Apply for specialized fellowship in agricultural engineering</p>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <p className="text-muted-foreground">
          The fellowship application system is currently under development. Please check back later or contact the
          administrator for more information.
        </p>
      </div>
    </div>
  )
}
