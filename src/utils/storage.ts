/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, List, UserProfile } from '../types';

// Anchor date from system metadata: 2026-06-23
export const TODAY_STR = '2026-06-23';
export const YESTERDAY_STR = '2026-06-22';
export const TOMORROW_STR = '2026-06-24';

export const INITIAL_LISTS: List[] = [
  { id: 'list-work', name: 'Projeto Web', color: 'purple', icon: 'Briefcase' },
  { id: 'list-personal', name: 'Estilo de Vida', color: 'blue', icon: 'Heart' },
  { id: 'list-studies', name: 'Estudos', color: 'yellow', icon: 'BookOpen' },
  { id: 'list-health', name: 'Saúde & Bem-estar', color: 'green', icon: 'Activity' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Dashboard design for admin',
    description: 'Projetar a interface administrativa principal, focando em gráficos de performance e tabelas de usuários.',
    completed: false,
    color: 'pink',
    dueDate: TODAY_STR,
    tags: ['High', 'On Track'],
    listId: 'list-work',
    priority: 'High',
    status: 'In Progress',
    attachments: [
      { id: 'att-1', name: 'Developer Document.pdf', size: '2.5 MB', type: 'pdf' },
      { id: 'att-2', name: 'Mobile application brief.doc', size: '1.8 MB', type: 'doc' }
    ],
    important: true,
    createdAt: YESTERDAY_STR,
  },
  {
    id: 'task-2',
    title: 'Konom web application',
    description: 'Reunião de alinhamento com a equipe Konom para definir as entregas da sprint.',
    completed: false,
    color: 'purple',
    dueDate: TOMORROW_STR,
    tags: ['Low', 'Meeting'],
    listId: 'list-work',
    priority: 'Low',
    status: 'To Do',
    attachments: [],
    important: false,
    createdAt: YESTERDAY_STR,
  },
  {
    id: 'task-3',
    title: 'Research and development',
    description: 'Analizar as novas ferramentas de build para otimização do tempo de compilação da plataforma.',
    completed: false,
    color: 'green',
    dueDate: TODAY_STR,
    tags: ['Medium', 'At Risk'],
    listId: 'list-work',
    priority: 'Medium',
    status: 'In Progress',
    attachments: [],
    important: true,
    createdAt: YESTERDAY_STR,
  },
  {
    id: 'task-4',
    title: 'Exame de próstata (Consulta de Rotina)',
    description: 'Exame urológico de prevenção anual recomendado pelo médico.',
    completed: false,
    color: 'green',
    dueDate: TODAY_STR,
    tags: ['Saúde', 'Prevenção'],
    listId: 'list-health',
    priority: 'High',
    status: 'To Do',
    attachments: [],
    important: true,
    createdAt: YESTERDAY_STR,
  },
  {
    id: 'task-5',
    title: 'Agendar exames cardiológicos',
    description: 'Entrar em contato com o laboratório para marcar o ecocardiograma e teste ergométrico.',
    completed: false,
    color: 'green',
    dueDate: TODAY_STR,
    tags: ['Saúde'],
    listId: 'list-health',
    priority: 'High',
    status: 'To Do',
    attachments: [],
    important: false,
    createdAt: YESTERDAY_STR,
  },
  {
    id: 'task-6',
    title: 'Exame de próstata anterior',
    description: 'Retirar os resultados do exame laboratorial do ano passado.',
    completed: true,
    color: 'green',
    dueDate: YESTERDAY_STR,
    tags: ['Saúde', 'Histórico'],
    listId: 'list-health',
    priority: 'Medium',
    status: 'Completed',
    attachments: [
      { id: 'att-3', name: 'Resultado_Exame_Prostata_2025.pdf', size: '1.2 MB', type: 'pdf' }
    ],
    important: false,
    createdAt: YESTERDAY_STR,
  },
  {
    id: 'task-7',
    title: 'Fazer exames de sangue',
    description: 'Ir em jejum de 12 horas realizar o hemograma completo e taxas.',
    completed: true,
    color: 'green',
    dueDate: YESTERDAY_STR,
    tags: ['Saúde'],
    listId: 'list-health',
    priority: 'High',
    status: 'Completed',
    attachments: [],
    important: false,
    createdAt: YESTERDAY_STR,
  }
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Samuel Mitt Silva',
  email: 'samuelmittsilva@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
};

export const getStoredData = () => {
  if (typeof window === 'undefined') {
    return { tasks: INITIAL_TASKS, lists: INITIAL_LISTS, profile: DEFAULT_PROFILE, theme: 'light' };
  }

  const tasks = localStorage.getItem('taskflow_tasks');
  const lists = localStorage.getItem('taskflow_lists');
  const profile = localStorage.getItem('taskflow_profile');
  const theme = localStorage.getItem('taskflow_theme');

  return {
    tasks: tasks ? JSON.parse(tasks) : INITIAL_TASKS,
    lists: lists ? JSON.parse(lists) : INITIAL_LISTS,
    profile: profile ? JSON.parse(profile) : DEFAULT_PROFILE,
    theme: theme || 'light',
  };
};

export const saveStoredData = (tasks: Task[], lists: List[], profile: UserProfile, theme: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  localStorage.setItem('taskflow_lists', JSON.stringify(lists));
  localStorage.setItem('taskflow_profile', JSON.stringify(profile));
  localStorage.setItem('taskflow_theme', theme);
};
