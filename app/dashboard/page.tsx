import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getDashboardData } from "@/lib/dashboard-data"
import DashboardClient from "./dashboard-client"

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")
  const data = await getDashboardData(session.user.id)
  return <DashboardClient userName={session.user.name} data={data} />
}
