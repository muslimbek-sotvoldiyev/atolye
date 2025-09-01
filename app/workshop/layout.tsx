import type React from "react"
// import { ReduxProvider } from "@/components/providers/redux-provider"
import WorkshopLayoutClient from "@/components/WorkshopLayoutClient"

export default function WorkshopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <ReduxProvider>
      <WorkshopLayoutClient>
        {children}
      </WorkshopLayoutClient>
    // </ReduxProvider>
  )
}