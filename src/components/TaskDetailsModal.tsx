/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Calendar, Paperclip, Flag, User, Tag, Trash2, Edit, CheckSquare,
  FileText, ExternalLink, Briefcase, ChevronRight, CheckCircle2, Circle
} from 'lucide-react';
import { Task, List, TaskStatus, Priority } from '../types';
import { TODAY_STR } from '../utils/storage';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  list?: List;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
}

export default function TaskDetailsModal({
  isOpen,
  onClose,
  task,
  list,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onUpdateStatus
}: TaskDetailsModalProps) {
  if (!task) return null;

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'High': return 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100/30 dark:border-red-950';
      case 'Medium': return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100/30 dark:border-amber-950';
      case 'Low': return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100/30 dark:border-emerald-950';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500 text-white border-emerald-600';
      case 'In Progress': return 'bg-blue-600 text-white border-blue-700';
      case 'In Review': return 'bg-purple-600 text-white border-purple-700';
      case 'To Do': return 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700';
    }
  };

  // Mock team avatars for "Assigned for" from Image 3
  const avatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64&q=80'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
            id="task-details-backdrop"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed inset-x-4 bottom-4 top-4 md:inset-y-12 md:max-w-2xl md:mx-auto bg-[#FBFBFB] dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl z-50 overflow-y-auto flex flex-col justify-between"
            id="task-details-modal"
          >
            <div>
              {/* Back & Close Row */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={onClose}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-sans font-bold text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-850 active:scale-98 transition-all shadow-2xs cursor-pointer"
                  id="back-to-list-btn"
                >
                  <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                  <span>Voltar</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onEditTask(task);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white hover:bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 transition-colors cursor-pointer"
                    title="Editar tarefa"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Deseja excluir esta tarefa?')) {
                        onDeleteTask(task.id);
                        onClose();
                      }
                    }}
                    className="p-1.5 rounded-lg border border-red-200 dark:border-red-950 bg-red-50 hover:bg-red-100 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                    title="Excluir tarefa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white hover:bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Header Title section */}
              <h1 className="font-sans font-bold text-lg dark:text-zinc-150 tracking-tight text-gray-800 mb-5">
                Detalhes da Atividade
              </h1>

              {/* Client Project Card Row */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-150 dark:border-zinc-850 mb-5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm dark:text-zinc-100 text-gray-800 leading-tight">
                    {list ? list.name : 'Sem Categoria'}
                  </h3>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-sans">
                    TaskFlow Application Suite
                  </p>
                </div>
              </div>

              {/* Task Title banner */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-855 mb-6">
                <h2 className="font-sans font-bold text-base dark:text-zinc-100 text-gray-850 leading-snug">
                  {task.title}
                </h2>
                {task.description && (
                  <p className="text-xs text-gray-500 dark:text-zinc-400 font-sans mt-1.5">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Start Date & Due Date columns */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3.5 rounded-xl border border-gray-150 dark:border-zinc-850 bg-white dark:bg-zinc-950 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase">Criado em</span>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-zinc-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-sans font-bold text-xs">
                      {task.createdAt.split('-').reverse().join('/')}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-gray-150 dark:border-zinc-850 bg-white dark:bg-zinc-950 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase">Prazo final</span>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-zinc-300">
                    <Calendar className="w-4 h-4 text-red-400" />
                    <span className="font-sans font-bold text-xs">
                      {task.dueDate.split('-').reverse().join('/')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status details row */}
              <div className="py-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                <div className="relative">
                  <select
                    value={task.status}
                    onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 font-sans font-bold text-xs bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="To Do">A Fazer</option>
                    <option value="In Progress">Em Andamento</option>
                    <option value="In Review">Em Revisão</option>
                    <option value="Completed">Concluída</option>
                  </select>
                </div>
              </div>

              {/* Assigned For Row */}
              <div className="py-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Equipe Designada</span>
                <div className="flex -space-x-1.5">
                  {avatars.map((avatar, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border border-white dark:border-zinc-900 overflow-hidden">
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full border border-white dark:border-zinc-900 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-sans font-bold text-gray-500">
                    +2
                  </div>
                </div>
              </div>

              {/* Priority Row */}
              <div className="py-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prioridade</span>
                <span className={`px-3 py-1 rounded-full border text-[10px] font-bold font-sans ${getPriorityColor(task.priority)}`}>
                  {task.priority === 'Low' ? 'Baixa' : task.priority === 'Medium' ? 'Média' : 'Alta'}
                </span>
              </div>

              {/* Tags Row */}
              <div className="py-3 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tags da Atividade</span>
                <div className="flex flex-wrap gap-1">
                  {task.tags && task.tags.length > 0 ? (
                    task.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-blue-200 bg-blue-50/50 text-blue-600 dark:text-blue-400">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-zinc-500 font-sans">Sem tags atribuídas</span>
                  )}
                </div>
              </div>

              {/* Attachments (Image 3 Style) */}
              <div className="py-3 border-t border-b border-gray-100 dark:border-zinc-800">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Anexos</h4>
                {task.attachments && task.attachments.length > 0 ? (
                  <div className="space-y-2.5">
                    {task.attachments.map((att) => (
                      <div 
                        key={att.id} 
                        className="p-2.5 rounded-xl border border-gray-150 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-zinc-900 text-gray-500">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-sans font-bold text-xs dark:text-zinc-100 text-gray-800 leading-tight truncate max-w-[200px]">
                              {att.name}
                            </h5>
                            <p className="text-[9px] text-gray-400 dark:text-zinc-500 font-sans mt-0.5">
                              {att.size} • {att.type.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => alert(`Simulando download do arquivo: ${att.name}`)}
                          className="p-1.5 rounded-md border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 text-gray-500 cursor-pointer transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 dark:bg-zinc-900/40 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
                    <p className="text-xs text-gray-400 dark:text-zinc-500 font-sans">Nenhum documento anexado</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 flex gap-3">
              <button
                onClick={() => {
                  onToggleComplete(task.id);
                  onClose();
                }}
                className={`w-full py-2.5 rounded-lg font-sans font-bold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5 ${
                  task.completed 
                    ? 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <CheckSquare className="w-4.5 h-4.5" />
                <span>{task.completed ? 'Marcar como Pendente' : 'Marcar como Concluída'}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
