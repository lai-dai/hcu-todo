'use client'

import * as React from 'react'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import debounce from 'lodash.debounce'
import { Pencil, Trash } from 'lucide-react'
import { toast } from 'sonner'

import { CreateTodoType, TodoType } from '@/lib/types/todo'
import { deleteTodo, findTodo, updateTodo } from '@/lib/actions/todo'
import { useSetState } from '@/lib/hooks/use-set-state'
import { getErrorMessage } from '@/lib/utils/error-message'
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
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/responsive-dialog'
import { TodoForm } from '@/components/todo-form'

import { FacetedFilter } from './faceted-flter'
import { Message } from './message'
import { Badge } from './ui/badge'
import { Center } from './ui/center'
import { Checkbox } from './ui/checkbox'
import { Spinner } from './ui/spinner'

export function TodoListView() {
  const [open, setOpen] = React.useState(false)
  const [filters, setFilters] = useSetState({
    search: '',
    status: -1,
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSetKey = React.useCallback(
    debounce((value: string) => {
      setFilters({ search: value })
    }, 600),
    []
  )

  const searchData = useInfiniteQuery({
    queryKey: ['search todo', filters],
    queryFn: (ctx) =>
      findTodo({
        params: {
          page: ctx.pageParam,
          limit: 20,
          sortBy: 'created_at',
          order: 'desc',
          search: filters.search || undefined,
          status: filters.status < 0 ? undefined : filters.status,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length < 20) return undefined
      return allPages.length + 1
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-x-3">
        <FacetedFilter
          value={String(filters.status)}
          title="Status"
          onValueChange={(status) => {
            setFilters({ status: status ? Number(status) : -1 })
          }}
          options={[
            {
              label: 'All',
              value: '-1',
            },
            {
              label: 'Completed',
              value: '1',
            },
            {
              label: 'Incomplete',
              value: '0',
            },
          ]}
        />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add new</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new todo</DialogTitle>
            </DialogHeader>
            <TodoForm
              onSubmitSuccess={() => {
                searchData.refetch()
                setOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Command shouldFilter={false} className="w-screen max-w-sm">
        <CommandInput
          defaultValue={filters.search}
          onValueChange={debounceSetKey}
          placeholder="Search todo"
        />

        {searchData.status === 'pending' ? (
          <Center className="py-3">
            <Spinner className="mx-auto size-5" />
          </Center>
        ) : searchData.status === 'error' ? (
          <Center className="py-3">
            <Message.Error>No results found</Message.Error>
          </Center>
        ) : (
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {searchData.data.pages
              .flatMap((item) => item.data)
              .map((item, index) => (
                <TodoItem
                  key={item.id}
                  item={item}
                  index={index}
                  onEdit={() => {
                    setOpen(true)
                  }}
                />
              ))}
          </CommandList>
        )}

        {searchData.hasNextPage && (
          <Button
            onClick={() => {
              searchData.fetchNextPage()
            }}
          >
            {searchData.isFetchingNextPage && (
              <Spinner size={'sm'} className="mr-2" />
            )}
            Load more
          </Button>
        )}
      </Command>
    </div>
  )
}

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
          className="line-clamp-3 text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
