"use client"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold text-center">My Mobile App</h1>
        <Button className="w-full max-w-xs h-12 text-lg" onClick={() => alert("Button clicked!")}>
          Click Me
        </Button>
      </div>
    </main>
  )
}

