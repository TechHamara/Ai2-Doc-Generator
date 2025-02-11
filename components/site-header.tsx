import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Menu } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="https://placekitten.com/32/32" alt="Docs Generator Logo" width={32} height={32} />
            <span className="hidden font-bold sm:inline-block">Docs Generator</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/">Home</Link>
            <Link href="/extensions">Extensions</Link>
            <Link href="/about">About</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button className="w-full" asChild>
              <Link href="https://example.com">Main Website</Link>
            </Button>
          </div>
          <nav className="flex items-center space-x-2">
            <Link href="https://youtube.com">
              <Button variant="ghost" size="icon">
                <Image src="https://placekitten.com/24/24" alt="YouTube" width={24} height={24} />
                <span className="sr-only">YouTube</span>
              </Button>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

