/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Calendar, Tag, Flag, Briefcase, Plus, Paperclip, Trash2 } from 'lucide-react';
import { Task, List, Priority, TaskStatus, Attachment } from '../types';
import { TODAY_STR } from '../utils/storage';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: List[];
  selectedListId?: string;
  onSaveTask: (taskData: Omit<Task, 'id' | 'createdAt'> & { id?: string }) => void;
  taskToEdit?: Task | null;
}

const PRESET_TAGS = ['High', 'Medium', 'Low', 'On Track', 'At Risk', 'Meeting', 'Saúde', 'Prevenção', 'Estudos'];

const COLORS = [
  { name: 'blue', class: 'bg-blue-400 border-blue-600' },
  { name: 'red', class: 'bg-red-400 border-red-600' },
  { name: 'purple', class: 'bg-purple-400 border-purple-600' },
  { name: 'green', class: 'bg-emerald-400 border-emerald-600' },
  { name: 'pink', class: 'bg-pink-400 border-pink-600' },
  { name: 'yellow', class: 'bg-yellow-400 border-amber-600' }
];

export default function NewTaskModal({
  isOpen,
  onClose,
  lists,
  selectedListId,
  onSaveTask,
  taskToEdit
}: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('purple');
  const [dueDate, setDueDate] = useState(TODAY_STR);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [listId, setListId] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [important, setImportant] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setColor(taskToEdit.color);
      setDueDate(taskToEdit.dueDate);
      setSelectedTags(taskToEdit.tags || []);
      setListId(taskToEdit.listId);
      setPriority(taskToEdit.priority || 'Medium');
      setStatus(taskToEdit.status || 'To Do');
      setImportant(taskToEdit.important || false);
      setAttachments(taskToEdit.attachments || []);
    } else {
      // Reset to defaults
      setTitle('');
      setDescription('');
      setColor('purple');
      setDueDate(TODAY_STR);
      setSelectedTags([]);
      setListId(selectedListId && selectedListId !== 'schedule' && selectedListId !== 'finished' && selectedListId !== 'important' ? selectedListId : (lists[0]?.id || ''));
      setPriority('Medium');
      setStatus('To Do');
      setImportant(false);
      setAttachments([]);
    }
  }, [taskToEdit, isOpen, selectedListId, lists]);

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTag.trim()) return;
    const formattedTag = customTag.trim();
    if (!selectedTags.includes(formattedTag)) {
      setSelectedTags([...selectedTags, formattedTag]);
    }
    setCustomTag('');
  };

  const handleSimulateAttachment = () => {
    const names = [
      'Documento de Especificação.pdf',
      'Briefing_Do_App.doc',
      'Layout_Final_V2.png',
      'Plano_De_Acao_TaskFlow.xlsx',
      'Exame_Laboratorio_Sanguineo.pdf'
    ];
    const sizes = ['1.2 MB', '2.4 MB', '4.5 MB', '850 KB', '3.1 MB'];
    const randomIdx = Math.floor(Math.random() * names.length);
    const randomName = names[randomIdx];
    const extension = randomName.split('.').pop() || 'pdf';
    
    const newAttachment: Attachment = {
      id: `att-${Date.now()}`,
      name: randomName,
      size: sizes[randomIdx],
      type: extension === 'pdf' ? 'pdf' : extension === 'doc' ? 'doc' : extension === 'png' ? 'image' : 'other'
    };
    setAttachments([...attachments, newAttachment]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      id: taskToEdit?.id,
      title: title.trim(),
      description: description.trim(),
      completed: taskToEdit ? taskToEdit.completed : false,
      color,
      dueDate,
      tags: selectedTags,
      listId,
      priority,
      status,
      attachments,
      important
    });
    onClose();
  };

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
            id="new-task-backdrop"
          />

          {/* Dialog Body (Bottom-sheet styled for mobile/centered for desktop) */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 max-h-[92vh] sm:max-h-[85vh] sm:bottom-6 sm:top-6 sm:max-w-xl sm:mx-auto bg-[#FBFBFB] dark:bg-zinc-900 border-t sm:border border-gray-150 dark:border-zinc-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-xl z-50 overflow-y-auto flex flex-col justify-between"
            id="new-task-modal"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800 mb-6">
                <div>
                  <h3 className="font-sans font-bold text-lg dark:text-zinc-100 tracking-tight text-gray-850">
                    {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
                  </h3>
                  <p className="text-[11px] text-gray-400 dark:text-zinc-500 font-sans">
                    {taskToEdit ? 'Atualize os dados da sua tarefa' : 'Crie uma nova atividade para organizar seu dia'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
                  id="close-new-task-btn"
                >
                  <X className="w-4 h-4 dark:text-zinc-100" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Task Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    Nome da Tarefa
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Reunião de alinhamento"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 font-sans text-xs bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-300 dark:placeholder-zinc-650"
                    id="new-task-title-input"
                  />
                </div>

                {/* Task Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    Descrição (Opcional)
                  </label>
                  <textarea
                    placeholder="Adicione detalhes sobre essa atividade..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 font-sans text-xs bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-300 dark:placeholder-zinc-650"
                  />
                </div>

                {/* Grid of details: List, Priority, Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select List */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Lista de Destino</span>
                    </label>
                    <select
                      value={listId}
                      onChange={(e) => setListId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 font-sans text-xs bg-white dark:bg-zinc-900 text-gray-850 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {lists.map((list) => (
                        <option key={list.id} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Deadline Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Prazo de Entrega</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 font-mono text-xs text-gray-850 dark:text-zinc-100 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Priority Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1">
                      <Flag className="w-3.5 h-3.5" />
                      <span>Prioridade</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['Low', 'Medium', 'High'] as Priority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`py-1.5 rounded-lg border font-sans font-semibold text-xs transition-colors cursor-pointer ${
                            priority === p
                              ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                              : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50'
                          }`}
                        >
                          {p === 'Low' ? 'Baixa' : p === 'Medium' ? 'Média' : 'Alta'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Status</span>
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as TaskStatus)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 font-sans text-xs bg-white dark:bg-zinc-900 text-gray-850 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="To Do">A fazer</option>
                      <option value="In Progress">Em andamento</option>
                      <option value="In Review">Em revisão</option>
                      <option value="Completed">Concluída</option>
                    </select>
                  </div>
                </div>

                {/* Color Selector ("Cor") */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    Cor Visual
                  </label>
                  <div className="flex gap-2.5 justify-start items-center">
                    {COLORS.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setColor(c.name)}
                        className={`w-8 h-8 rounded-full border border-gray-200 dark:border-zinc-800 transition-transform relative ${c.class} ${
                          color === c.name ? 'scale-110 ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
                        }`}
                      >
                        {color === c.name && (
                          <Check className="w-3.5 h-3.5 text-zinc-950 absolute inset-0 m-auto font-black" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags Grid / Pills */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Tags</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="Nova tag"
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        className="px-2 py-0.5 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[11px] font-sans focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 dark:text-zinc-100"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomTag}
                        className="p-1 rounded-md border border-gray-200 dark:border-zinc-800 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Tag Choice Pills */}
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-white dark:bg-zinc-950 border border-gray-150 dark:border-zinc-800 max-h-24 overflow-y-auto">
                    {PRESET_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-colors flex items-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 text-blue-600 dark:text-blue-400'
                              : 'bg-gray-50 dark:bg-zinc-900 border-gray-100 dark:border-zinc-850 text-gray-500 dark:text-zinc-400 hover:bg-gray-100'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                          <span>{tag}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Attachments */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Anexos ({attachments.length})</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleSimulateAttachment}
                      className="text-[11px] font-sans font-bold px-2.5 py-1 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      + Simular Anexo
                    </button>
                  </div>

                  {attachments.length > 0 && (
                    <div className="space-y-1.5 max-h-24 overflow-y-auto">
                      {attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-2 rounded-lg border border-gray-150 dark:border-zinc-850 bg-white dark:bg-zinc-950 text-xs text-gray-700 dark:text-zinc-300"
                        >
                          <span className="truncate max-w-[80%] font-mono text-[11px]">
                            {att.name} ({att.size})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Important Checkbox */}
                <div className="flex items-center gap-2 pt-1.5">
                  <input
                    type="checkbox"
                    id="important"
                    checked={important}
                    onChange={(e) => setImportant(e.target.checked)}
                    className="w-4 h-4 rounded border border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor="important"
                    className="text-xs font-semibold text-gray-600 dark:text-zinc-300 cursor-pointer"
                  >
                    Marcar como Importante (Favorito ⭐)
                  </label>
                </div>
              </form>
            </div>

            {/* Bottom Form Actions */}
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 font-sans font-bold text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-98 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs shadow-xs active:scale-98 transition-all cursor-pointer"
                id="save-task-btn"
              >
                {taskToEdit ? 'Salvar Alterações' : 'Criar Tarefa'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
