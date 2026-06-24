/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, Paperclip, Star, MoreHorizontal, CheckCircle2, Circle, 
  Flag, Edit, Trash2, CheckCircle
} from 'lucide-react';
import { Task, List } from '../types';
import { TODAY_STR, TOMORROW_STR, YESTERDAY_STR } from '../utils/storage';

interface TaskCardProps {
  key?: string;
  task: Task;
  list?: List;
  onToggleComplete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onSelectTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

export default function TaskCard({
  task,
  list,
  onToggleComplete,
  onToggleImportant,
  onSelectTask,
  onDeleteTask,
  onEditTask
}: TaskCardProps) {
  const [showOptions, setShowOptions] = React.useState(false);

  const getDueDateLabel = (dateStr: string) => {
    if (dateStr === TODAY_STR) return 'Hoje';
    if (dateStr === TOMORROW_STR) return 'Amanhã';
    if (dateStr === YESTERDAY_STR) return 'Ontem';
    
    // Format YYYY-MM-DD to DD/MM/YYYY
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const isOverdue = !task.completed && task.dueDate < TODAY_STR;

  // Custom pill styling for tags
  const getTagStyle = (tag: string) => {
    const t = tag.toLowerCase();
    if (t === 'high' || t === 'urgente' || t === 'at risk') {
      return 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800';
    }
    if (t === 'medium' || t === 'em andamento') {
      return 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    }
    if (t === 'low' || t === 'on track') {
      return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    }
    if (t === 'meeting' || t === 'reunião') {
      return 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
    }
    // Default pastel style
    return 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300 border-stone-300 dark:border-zinc-700';
  };

  // Color mappings for special colored cards (like the solid green background card in reference)
  const getCardBg = () => {
    if (task.completed) return 'bg-gray-50/60 dark:bg-zinc-900/40 opacity-85';
    
    switch (task.color) {
      case 'purple': return 'bg-purple-50/30 dark:bg-purple-950/10';
      case 'blue': return 'bg-blue-50/30 dark:bg-blue-950/10';
      case 'yellow': return 'bg-amber-50/30 dark:bg-amber-950/10';
      case 'green': return 'bg-emerald-50/30 dark:bg-emerald-950/10';
      case 'pink': return 'bg-pink-50/30 dark:bg-pink-950/10';
      case 'red': return 'bg-red-50/30 dark:bg-red-950/10';
      default: return 'bg-white dark:bg-zinc-900';
    }
  };

  const getBorderColor = () => {
    if (task.completed) return 'border-gray-200 dark:border-zinc-800';
    
    switch (task.color) {
      case 'purple': return 'border-purple-100 dark:border-purple-900/30 hover:border-purple-200';
      case 'blue': return 'border-blue-100 dark:border-blue-900/30 hover:border-blue-200';
      case 'yellow': return 'border-amber-100 dark:border-amber-900/30 hover:border-amber-200';
      case 'green': return 'border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200';
      case 'pink': return 'border-pink-100 dark:border-pink-900/30 hover:border-pink-200';
      case 'red': return 'border-red-100 dark:border-red-900/30 hover:border-red-200';
      default: return 'border-gray-100 dark:border-zinc-800 hover:border-blue-200';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -1 }}
      className={`relative w-full rounded-xl p-4 border ${getBorderColor()} ${getCardBg()} shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col gap-3.5`}
      id={`task-card-${task.id}`}
    >
      {/* Top Row: Checkbox, Title, and Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(task.id);
            }}
            className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer"
            id={`task-checkbox-${task.id}`}
          >
            {task.completed ? (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800" />
            )}
            <style>{`
              #task-checkbox-${task.id} {
                border-color: ${task.completed ? '#2563EB' : '#D1D5DB'};
                background-color: ${task.completed ? '#EFF6FF' : 'transparent'};
              }
              .dark #task-checkbox-${task.id} {
                border-color: ${task.completed ? '#3B82F6' : '#4B5563'};
                background-color: ${task.completed ? '#1E3A8A' : 'transparent'};
              }
            `}</style>
          </button>
          
          <div 
            onClick={() => onSelectTask(task)}
            className="cursor-pointer flex-1 min-w-0 group"
          >
            <h4 className={`font-sans font-semibold text-sm tracking-tight leading-snug dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
              task.completed ? 'line-through text-gray-400 dark:text-zinc-500' : 'text-gray-800'
            }`}>
              {task.title}
            </h4>
            {task.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 font-sans font-normal leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 self-start">
          <button
            onClick={() => onToggleImportant(task.id)}
            className="p-1 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Star className={`w-3.5 h-3.5 ${task.important ? 'fill-amber-400 text-amber-500' : 'text-gray-300 dark:text-zinc-600'}`} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              id={`task-options-btn-${task.id}`}
            >
              <MoreHorizontal className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500" />
            </button>
            
            {showOptions && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowOptions(false)} 
                />
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-zinc-800 border border-gray-150 dark:border-zinc-700 rounded-lg py-1 shadow-md z-20">
                  <button
                    onClick={() => {
                      onEditTask(task);
                      setShowOptions(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-2 text-gray-700 dark:text-zinc-300"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => {
                      onDeleteTask(task.id);
                      setShowOptions(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 text-red-600 dark:text-red-400 border-t border-gray-100 dark:border-zinc-700"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Excluir</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Middle Row: Tags & Priority badges */}
      {( (task.tags && task.tags.length > 0) || task.priority ) && (
        <div className="flex flex-wrap gap-1.5 items-center">
          {task.tags && task.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getTagStyle(tag)}`}
            >
              {tag}
            </span>
          ))}
          {task.priority && (
            <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full border ${
              task.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/10 dark:text-red-300 dark:border-red-900/30' :
              task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/10 dark:text-amber-300 dark:border-amber-900/30' :
              'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/10 dark:text-emerald-300 dark:border-emerald-900/30'
            }`}>
              {task.priority === 'High' ? 'High Priority' : task.priority === 'Medium' ? 'Medium' : 'Low'}
            </span>
          )}
        </div>
      )}

      {/* Bottom Row: Due date, Attachments, and Category/List badge */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-800 text-xs text-gray-400 dark:text-zinc-500">
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 text-[11px] font-medium ${
            isOverdue 
              ? 'text-red-500' 
              : 'text-gray-400 dark:text-zinc-500'
          }`}>
            <Calendar className="w-3 h-3" />
            <span>{getDueDateLabel(task.dueDate)}</span>
          </span>

          {task.attachments && task.attachments.length > 0 && (
            <span className="flex items-center gap-1 text-[11px]">
              <Paperclip className="w-3.5 h-3.5" />
              <span>{task.attachments.length}</span>
            </span>
          )}
        </div>

        {/* List Indicator */}
        {list && (
          <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-700">
            {list.name}
          </span>
        )}
      </div>
    </motion.div>
  );
}
