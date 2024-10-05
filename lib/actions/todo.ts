import { AxiosRequestConfig } from 'axios'

import { api } from '../axios'
import { CreateTodoType, TodoType } from '../types/todo'

export function findTodo(configs?: AxiosRequestConfig) {
  return api.get<TodoType[]>('/todo', configs)
}

export function createTodo(data: CreateTodoType) {
  return api.post('/todo', data)
}

export function updateTodo(id: string, data: CreateTodoType) {
  return api.put('/todo/' + id, data)
}

export function deleteTodo(id: string) {
  return api.delete('/todo/' + id)
}
