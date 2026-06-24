/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'image' | 'other';
}

export type Priority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  color: string; // e.g., 'blue', 'red', 'purple', 'green', 'pink', 'yellow'
  dueDate: string; // YYYY-MM-DD
  tags: string[]; // e.g., 'On Track', 'At Risk', 'Meeting'
  listId: string;
  priority: Priority;
  status: TaskStatus;
  attachments: Attachment[];
  important: boolean;
  createdAt: string;
}

export interface List {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}
