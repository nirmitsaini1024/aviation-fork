import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"

export default function DeleteConfirmation({
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone. This will permanently delete the item.",
  triggerText = "Delete",
  confirmText = "Delete",
  cancelText = "Cancel",
}) {
  const [open, setOpen] = useState(false)

  
  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="gap-2 flex justify-start w-full">
          <Trash2 className="h-4 w-4 text-red-700" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md backdrop-blur-sm">
        <div className="fixed inset-0 -z-10" />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-700">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button variant="destructive" onClick={()=>{
            onConfirm();
            setOpen(false)
          }}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
