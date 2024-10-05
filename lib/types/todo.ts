import { z } from "zod";
import { todoSchema } from "../validations/todo";

export type CreateTodoType = z.infer<typeof todoSchema>;

export type TodoType = CreateTodoType & {
  id: string;
};
