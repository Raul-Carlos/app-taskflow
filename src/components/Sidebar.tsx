/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, CheckCircle, Bookmark, Moon, Sun, Settings, 
  Calendar, X, Briefcase, Heart, BookOpen, Activity, Plus, RefreshCw
} from 'lucide-react';
import { List, UserProfile } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  lists: List[];
  activeView: string; // 'schedule' | 'finished' | 'important' | string (listId)
  setActiveView: (view: string) => void;
  onAddList: (name: string, color: string, icon: string) => void;
  onResetData: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  profile,
  lists,
  activeView,
  setActiveView,
  onAddList,
  onResetData,
  darkMode,
  toggleDarkMode
}: SidebarProps) {
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListColor, setNewListColor] = useState('purple');
  const [newListIcon, setNewListIcon] = useState('Briefcase');

  const listColors = ['purple', 'blue', 'yellow', 'green', 'pink', 'red'];
  const listIcons = [
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Heart', icon: Heart },
    { name: 'BookOpen', icon: BookOpen },
    { name: 'Activity', icon: Activity },
  ];

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    onAddList(newListName, newListColor, newListIcon);
    setNewListName('');
    setShowAddList(false);
  };

  const menuItems = [
    { id: 'schedule', label: 'TaskFlow', icon: Calendar, color: 'text-sky-500' },
    { id: 'finished', label: 'Concluídas', icon: CheckCircle, color: 'text-emerald-500' },
    { id: 'important', label: 'Importantes', icon: Bookmark, color: 'text-amber-500' },
  ];

  const getListIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-4 h-4" />;
      case 'Heart': return <Heart className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  const getListDotColor = (color: string) => {
    switch (color) {
      case 'purple': return 'bg-purple-400';
      case 'blue': return 'bg-blue-400';
      case 'yellow': return 'bg-amber-400';
      case 'green': return 'bg-emerald-400';
      case 'pink': return 'bg-pink-400';
      case 'red': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs z-40"
            id="sidebar-backdrop"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-800 z-50 p-6 flex flex-col justify-between overflow-y-auto"
            id="sidebar-drawer"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-800 overflow-hidden">
                    <img 
                      src={profile.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-sm text-gray-800 dark:text-zinc-100 tracking-tight leading-none mb-1">
                      {profile.name}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 font-sans">
                      {profile.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                  id="close-sidebar-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Navigation Menu */}
              <div className="space-y-1 mb-8">
                <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest px-2 mb-2 mt-4">
                  Menu
                </p>
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900'
                      }`}
                      id={`menu-item-${item.id}`}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-zinc-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                {/* Theme Action in list */}
                <button
                  onClick={toggleDarkMode}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                  id="menu-item-theme"
                >
                  <div className="flex items-center gap-3">
                    {darkMode ? (
                      <Sun className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-indigo-500" />
                    )}
                    <span>Tema</span>
                  </div>
                  <span className="text-[10px] bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-gray-500">
                    {darkMode ? 'Escuro' : 'Claro'}
                  </span>
                </button>
              </div>

              {/* Task Lists Section */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 mb-2">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                    Projetos
                  </p>
                  <button
                    onClick={() => setShowAddList(!showAddList)}
                    className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-md transition-colors cursor-pointer"
                    id="toggle-add-list-btn"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Create List Inline Form */}
                <AnimatePresence>
                  {showAddList && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleCreateList}
                      className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-3.5 space-y-3 shadow-xs mb-3"
                      id="add-list-form"
                    >
                      <input
                        type="text"
                        placeholder="Nome da Lista..."
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/50 dark:bg-zinc-800 dark:text-white"
                        autoFocus
                      />
                      
                      {/* Color Selector */}
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {listColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setNewListColor(color)}
                            className={`w-4 h-4 rounded-full border border-white dark:border-zinc-900 transition-transform cursor-pointer ${
                              color === 'purple' ? 'bg-purple-400' :
                              color === 'blue' ? 'bg-blue-400' :
                              color === 'yellow' ? 'bg-amber-400' :
                              color === 'green' ? 'bg-emerald-400' :
                              color === 'pink' ? 'bg-pink-400' : 'bg-red-400'
                            } ${newListColor === color ? 'scale-125 ring-2 ring-blue-500 ring-offset-1' : 'hover:scale-110'}`}
                          />
                        ))}
                      </div>

                      {/* Icon Selector */}
                      <div className="flex gap-2 justify-center">
                        {listIcons.map((item) => {
                          const IconComp = item.icon;
                          const isSelected = newListIcon === item.name;
                          return (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => setNewListIcon(item.name)}
                              className={`p-1 rounded-md border cursor-pointer ${
                                isSelected 
                                  ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800' 
                                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700'
                              }`}
                            >
                              <IconComp className="w-3.5 h-3.5" />
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-1.5 rounded-lg bg-blue-600 text-white font-sans font-bold text-xs hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        Salvar Lista
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Lists Navigation */}
                <div className="space-y-0.5">
                  {lists.map((list) => {
                    const isActive = activeView === list.id;
                    return (
                      <button
                        key={list.id}
                        onClick={() => {
                          setActiveView(list.id);
                          onClose();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-medium'
                            : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900'
                        }`}
                        id={`list-item-${list.id}`}
                      >
                        <span className="flex items-center gap-3 truncate">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getListDotColor(list.color)}`} />
                          <span className="truncate">{list.name}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 space-y-3">
              <button
                onClick={() => {
                  if (confirm('Deseja realmente redefinir o TaskFlow com os dados iniciais? Todas as alterações serão perdidas.')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 text-red-600 dark:text-red-400 font-sans font-semibold text-xs hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors"
                id="reset-data-btn"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resetar Aplicativo</span>
              </button>

              <div className="text-center font-sans text-[10px] text-gray-400 dark:text-zinc-500">
                TaskFlow v1.0.0 • Made for Samuel
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
