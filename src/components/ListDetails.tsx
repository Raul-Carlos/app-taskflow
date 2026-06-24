/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, MoreVertical, Plus, Trash2, Edit2, 
  CheckCircle, Circle, CheckCircle2, Star, Calendar, Paperclip
} from 'lucide-react';
import { List, Task } from '../types';
import TaskCard from './TaskCard';

interface ListDetailsProps {
  list: List;
  tasks: Task[];
  onGoBack: () => void;
  onToggleComplete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onSelectTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onOpenNewTask: () => void;
  onDeleteList: (listId: string) => void;
  onUpdateListName: (listId: string, newName: string) => void;
}

export default function ListDetails({
  list,
  tasks,
  onGoBack,
  onToggleComplete,
  onToggleImportant,
  onSelectTask,
  onDeleteTask,
  onEditTask,
  onOpenNewTask,
  onDeleteList,
  onUpdateListName
}: ListDetailsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(list.name);

  const listTasks = tasks.filter((t) => t.listId === list.id);
  const pendingTasks = listTasks.filter((t) => !t.completed);
  const completedTasks = listTasks.filter((t) => t.completed);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNameValue.trim()) return;
    onUpdateListName(list.id, editNameValue.trim());
    setIsEditingName(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6" id="list-details-view">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-zinc-800">
        <button
          onClick={onGoBack}
          className="p-2 rounded-lg border border-gray-200 dark:border-zinc-850 hover:bg-gray-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs transition-colors cursor-pointer"
          id="back-to-schedule-btn"
        >
          <ChevronLeft className="w-4 h-4 dark:text-zinc-100" />
        </button>

        {isEditingName ? (
          <form onSubmit={handleSaveName} className="flex-1 max-w-sm mx-4 flex gap-2">
            <input
              type="text"
              value={editNameValue}
              onChange={(e) => setEditNameValue(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 font-sans font-semibold text-sm bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-sans font-bold text-xs hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Salvar
            </button>
          </form>
        ) : (
          <h2 className="font-sans font-bold text-lg dark:text-zinc-100 tracking-tight text-gray-800 text-center flex-1 truncate mx-4">
            {list.name}
          </h2>
        )}

        {/* List settings dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg border border-gray-200 dark:border-zinc-850 hover:bg-gray-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs transition-colors cursor-pointer"
            id="list-actions-menu-btn"
          >
            <MoreVertical className="w-4 h-4 dark:text-zinc-100" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 border border-gray-150 dark:border-zinc-750 rounded-lg py-1 shadow-md z-20">
                <button
                  onClick={() => {
                    setIsEditingName(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-2 text-gray-700 dark:text-zinc-200"
                >
                  <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>Renomear Lista</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Deseja realmente excluir a lista "${list.name}" e todas as suas ${listTasks.length} tarefas?`)) {
                      onDeleteList(list.id);
                      onGoBack();
                    }
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 text-red-600 dark:text-red-400 border-t border-gray-100 dark:border-zinc-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Lista</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Grid count stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">A fazer</span>
            <h4 className="font-sans font-bold text-xl dark:text-zinc-100 text-gray-800 mt-1">{pendingTasks.length}</h4>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-sans font-semibold text-xs">
            P
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Concluídas</span>
            <h4 className="font-sans font-bold text-xl dark:text-zinc-100 text-gray-800 mt-1">{completedTasks.length}</h4>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-sans font-semibold text-xs">
            ✓
          </div>
        </div>
      </div>

      {/* Task Sections */}
      <div className="space-y-8 pb-24">
        {/* Pending Section ("A fazer") */}
        <div className="space-y-4">
          <h3 className="font-sans font-bold text-sm tracking-tight text-gray-800 dark:text-zinc-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>A fazer</span>
          </h3>

          {pendingTasks.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-zinc-900 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl shadow-2xs">
              <p className="text-xs text-gray-400 dark:text-zinc-500 font-sans mb-3">Tudo em dia por aqui!</p>
              <button
                onClick={onOpenNewTask}
                className="text-xs font-bold px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
              >
                + Criar Nova Tarefa
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onToggleImportant={onToggleImportant}
                  onSelectTask={onSelectTask}
                  onDeleteTask={onDeleteTask}
                  onEditTask={onEditTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Completed Section ("Concluídas") */}
        <div className="space-y-4">
          <h3 className="font-sans font-bold text-sm tracking-tight text-gray-800 dark:text-zinc-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Concluídas</span>
          </h3>

          {completedTasks.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400 dark:text-zinc-500 font-sans">
              Nenhuma tarefa concluída nesta lista ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onToggleImportant={onToggleImportant}
                  onSelectTask={onSelectTask}
                  onDeleteTask={onDeleteTask}
                  onEditTask={onEditTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button "+ Nova Tarefa" from wireframe Screen 2 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenNewTask}
        className="fixed bottom-6 right-6 px-4 py-2.5 rounded-full bg-blue-600 text-white font-sans font-bold text-xs shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all z-30 flex items-center gap-1.5 cursor-pointer"
        id="list-details-fab"
      >
        <Plus className="w-4 h-4" />
        <span>Nova Tarefa</span>
      </motion.button>
    </div>
  );
}
