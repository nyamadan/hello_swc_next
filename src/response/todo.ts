export interface Todo {
  id: string;
  content: string;
  completed: boolean;
}

export interface GetTodosResponse extends Array<Todo> {}
export interface GetTodoResponse extends Todo {}
