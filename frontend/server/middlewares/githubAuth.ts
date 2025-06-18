import { GitHubManager } from "@/lib/github"
import { AppBindings } from "@/lib/server/types"
import { createMiddleware } from "hono/factory"
import { db } from "../db"

export interface GithubAppBindings extends AppBindings {
  Variables: AppBindings["Variables"] & {
    manager: GitHubManager
  }
}
export const githubAuth = createMiddleware<GithubAppBindings>(
  async (c, next) => {
    const clerkUser = c.get("user")
    const dbUser = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, clerkUser.id),
    })
    if (!dbUser?.githubToken) {
      return c.json(
        { success: false, message: "GitHub authentication required" },
        403
      )
    }
    try {
      const manager = new GitHubManager({ token: dbUser.githubToken })
      await manager.init()
      c.set("manager", manager)
      return next()
    } catch (error) {
      return c.json(
        { success: false, message: "GitHub authentication failed" },
        403
      )
    }
  }
)
