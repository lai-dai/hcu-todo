'use client'

import * as React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { debounce } from 'lodash'

import { findTodo } from '@/lib/actions/todo'
import { useSetState } from '@/lib/hooks/use-set-state'
import { Button } from '@/components/ui/button'
import { Center } from '@/components/ui/center'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/responsive-dialog'
import { Spinner } from '@/components/ui/spinner'
import { FacetedFilter } from '@/components/faceted-filter'
import { Message } from '@/components/message'
import { TodoForm } from '@/app/_components/todo-form'

import { TodoItem } from './todo-item'

export function TodoListView() {
  const [open, setOpen] = React.useState(false)
  const [filters, setFilters] = useSetState({
    search: '',
    status: -1, // all
    limit: 20,
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
          sortBy: 'created_at',
          order: 'desc',
          page: ctx.pageParam,
          limit: filters.limit,
          search: filters.search || undefined,
          status: filters.status < 0 ? undefined : filters.status,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length < filters.limit) return undefined
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
            <div className="p-3 md:p-0">
              <TodoForm
                onSubmitSuccess={() => {
                  searchData.refetch()
                  setOpen(false)
                }}
              />
            </div>
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
