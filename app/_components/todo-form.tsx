'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { CreateTodoType, TodoType } from '@/lib/types/todo'
import { createTodo, updateTodo } from '@/lib/actions/todo'
import { getErrorMessage } from '@/lib/utils/error-message'
import { todoSchema } from '@/lib/validations/todo'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

export function TodoForm({
  defaultValues,
  onSubmitSuccess,
}: {
  defaultValues?: TodoType
  onSubmitSuccess?: (values: CreateTodoType) => void
}) {
  const createData = useMutation({
    mutationFn: (data: CreateTodoType) => createTodo(data),
  })
  const updateData = useMutation({
    mutationFn: (data: CreateTodoType) =>
      updateTodo(defaultValues?.id || '', data),
  })

  const form = useForm<CreateTodoType>({
    resolver: zodResolver(todoSchema),
    defaultValues: defaultValues || {
      name: '',
      created_at: new Date(),
      update_at: new Date(),
      status: 0,
    },
  })

  async function onSubmit(values: CreateTodoType) {
    try {
      if (defaultValues) {
        values.update_at = new Date()

        await updateData.mutateAsync(values)
        toast.success('Update toto successfully')
      } else {
        await createData.mutateAsync(values)
        toast.success('Create toto successfully')
      }
      onSubmitSuccess?.(values)
      form.reset()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Create toto Error'))
      console.error('💥 error', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Toto</FormLabel>
              <FormControl>
                <Input placeholder="My todo" {...field} />
              </FormControl>
              <FormDescription>Enter your todo</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col md:items-end">
          <Button type="submit">
            {form.formState.isSubmitting && <Spinner className="mr-3" />}
            {defaultValues ? 'Update todo' : 'Create todo'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
