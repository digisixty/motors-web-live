"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export interface DialogOptions {
  title?: string
  body: ReactNode
  closable?: boolean
}

interface DialogContextType {
  openDialog: (options: DialogOptions) => void
  closeDialog: () => void
  isDialogOpen: boolean
  dialogContent: DialogOptions | null
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<DialogOptions | null>(null)

  const openDialog = (options: DialogOptions) => {
    setDialogContent(options)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setDialogContent(null)
  }

  return (
    <DialogContext.Provider
      value={{
        openDialog,
        closeDialog,
        isDialogOpen,
        dialogContent,
      }}
    >
      {children}
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const context = useContext(DialogContext)
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider")
  }
  return context
}