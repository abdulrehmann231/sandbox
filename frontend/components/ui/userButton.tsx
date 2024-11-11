"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "@/lib/types"
import { useClerk } from "@clerk/nextjs"
import { LogOut, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import Avatar from "./avatar"

export default function UserButton({ userData }: { userData: User }) {
  if (!userData) return null

  const { signOut } = useClerk()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar name={userData.name} avatarUrl={userData.avatarUrl} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <div className="py-1.5 px-2 w-full">
          <div className="font-medium">{userData.name}</div>
          <div className="text-sm w-full overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
            {userData.email}
          </div>
        </div>

        <DropdownMenuSeparator />
        <div className="py-1.5 px-2 w-full flex flex-col items-start text-sm">
          <div className="flex items-center">
            <Sparkles className={`h-4 w-4 mr-2 text-indigo-500`} />
            AI Usage: {userData.generations}/1000
          </div>
          <div className="rounded-full w-full mt-2 h-2 overflow-hidden bg-secondary">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{
                width: `${(userData.generations * 100) / 1000}%`,
              }}
            />
          </div>
        </div>
        <DropdownMenuSeparator />

        {/* <DropdownMenuItem className="cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" />
          <span>Edit Profile</span>
        </DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={() => signOut(() => router.push("/"))}
          className="!text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
