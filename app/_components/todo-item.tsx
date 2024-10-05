'use client'

import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import { Pencil, Trash } from 'lucide-react'
import { toast } from 'sonner'

import { CreateTodoType, TodoType } from '@/lib/types/todo'
import { deleteTodo, updateTodo } from '@/lib/actions/todo'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CommandItem } from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/responsive-dialog'
import { Spinner } from '@/components/ui/spinner'
import { TodoForm } from '@/app/_components/todo-form'

export function TodoItem({
  item: _item,
  index,
  onEdit,
}: {
  item: TodoType
  index: number
  onEdit?: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [item, setItem] = React.useState<TodoType | undefined>(_item)

  const updateData = useMutation({
    mutationFn: (data: CreateTodoType) => updateTodo(item?.id || '', data),
  })
  const deleteData = useMutation({
    mutationFn: (id: string) => deleteTodo(id),
  })

  if (!item) return null

  return (
    <CommandItem
      value={item.name + index}
      className="flex items-center justify-between"
    >
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={Boolean(item.status)}
          onCheckedChange={(value) => {
            setItem(
              (prev) =>
                ({
                  ...prev,
                  status: Number(value),
                }) as TodoType
            )

            toast.promise(
              updateData.mutateAsync({
                ...item,
                status: Number(value),
              }),
              {
                loading: 'Loading...',
                success: (data) => {
                  return `Update todo successfully`
                },
                error: 'Error',
              }
            )
          }}
          id={item.id + '-' + index}
        />
        <label
          title={item.name}
          htmlFor={item.id + '-' + index}
          className={cn(
            'line-clamp-3 text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            item.status ? 'line-through' : ''
          )}
        >
          {item.name}
        </label>
      </div>
      <div className="flex items-center space-x-3">
        {item.status ? (
          <Badge
            variant={'default'}
            className="bg-green-500 hover:bg-green-600"
          >
            Completed
          </Badge>
        ) : (
          <Badge variant={'destructive'}>Incomplete</Badge>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size={'icon'} variant={'outline'} className="rounded-full">
              <Pencil className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update todo</DialogTitle>
            </DialogHeader>
            <div className="p-3 md:p-0">
              <TodoForm
                defaultValues={item}
                onSubmitSuccess={(value) => {
                  setOpen(false)
                  setItem(
                    (prev) =>
                      ({
                        ...prev,
                        ...value,
                      }) as TodoType
                  )
                }}
              />
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size={'icon'}
              variant={'outline'}
              className="rounded-full hover:border-destructive hover:text-destructive"
            >
              {deleteData.isPending ? (
                <Spinner size={'sm'} />
              ) : (
                <Trash className="size-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                todo and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setItem(undefined)

                  toast.promise(deleteData.mutateAsync(item.id), {
                    loading: 'Loading...',
                    success: (data) => {
                      return `Delete todo successfully`
                    },
                    error: 'Error',
                  })
                }}
                className="bg-destructive hover:bg-destructive"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CommandItem>
  )
}
