import { SiteHeader } from "@/components/site-header"
import { InfoBanner } from "@/components/info-banner"
import { FileUpload } from "@/components/file-upload"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <SiteHeader />
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="my-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Generate Documentation</span>{" "}
            <span className="block text-primary xl:inline">with Ease</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Upload your code files and get comprehensive documentation in seconds. Support for multiple platforms and
            file types.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Multiple Platforms"
            description="Support for AppInventor and other platforms."
            icon="🌐"
          />
          <FeatureCard title="Fast Processing" description="Generate documentation in seconds." icon="⚡" />
          <FeatureCard title="Easy to Use" description="Simple interface for quick results." icon="🚀" />
        </div>
        <div className="my-8">
          <InfoBanner />
          <FileUpload />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ title, description, icon }) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2 text-2xl">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

