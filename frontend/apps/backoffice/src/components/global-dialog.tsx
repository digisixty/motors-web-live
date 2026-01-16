"use client"

import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDialog } from "@/contexts/dialog-context"
import { cn } from "@/lib/utils"

export function GlobalDialog() {
  const { isDialogOpen, dialogContent, closeDialog } = useDialog()

  // Handle escape key to close dialog
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDialogOpen && dialogContent?.closable !== false) {
        closeDialog()
      }
    }

    if (isDialogOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isDialogOpen, dialogContent?.closable, closeDialog])

  if (!dialogContent) return null

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      if (!open && dialogContent.closable !== false) {
        closeDialog()
      }
    }}>
      <DialogContent
        showCloseButton={dialogContent.closable !== false}
        className={cn(
          dialogContent.title?.includes("Select Image") && "sm:max-w-[90vw] max-h-[90vh]"
        )}
      >
        {dialogContent.title && (
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
          </DialogHeader>
        )}
        {dialogContent.body}
      </DialogContent>
    </Dialog>
  )
}