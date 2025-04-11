export interface User {
  id: string;
  name: string;
  pfp: string;
  online: boolean;
  isCurrentUser?: boolean; // Add this optional property
}

export interface Group {
  id: number;
  name: string;
  pfp: string;
  members: User[];
}

export interface Message {
  sender: string;
  text?: string;
  file?: { name: string; size: string };
  timestamp: string;
  date: string;
}
export interface ITask {
  _id: string;
  title: string;
  subtasks: string[];
  color: string;
  user: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string[]; // Add this property to match the server model
}