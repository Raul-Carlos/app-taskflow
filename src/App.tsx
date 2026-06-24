/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, SlidersHorizontal, Grid, Star, Sparkles, 
  Menu, CheckCircle, Bell, Heart, Briefcase, ChevronRight, Activity, Calendar
} from 'lucide-react';
import { Task, List, UserProfile, TaskStatus, Priority } from './types';
import { 
  getStoredData, saveStoredData, TODAY_STR, TOMORROW_STR, YESTERDAY_STR 
} from './utils/storage';
import Sidebar from './components/Sidebar';
import TaskCard from './components/TaskCard';
import NewTaskModal from './components/NewTaskModal';
import TaskDetailsModal from './components/TaskDetailsModal';
import ListDetails from './components/ListDetails';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ name: '', email: '', avatar: '' });
  const [darkMode, setDarkMode] = useState(false);
  
  // Navigation states
  const [activeView, setActiveView] = useState<string>('schedule'); // 'schedule' | 'finished' | 'important' | listId
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'yesterday' | 'today' | 'tomorrow'>('all');

  // Load Initial Data
  useEffect(() => {
    const data = getStoredData();
    setTasks(data.tasks);
    setLists(data.lists);
    setProfile(data.profile);
    const theme = data.theme;
    setDarkMode(theme === 'dark');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Save changes to LocalStorage helper
  const updateDataAndStore = (newTasks: Task[], newLists: List[], newProfile: UserProfile, themeStr: string) => {
    setTasks(newTasks);
    setLists(newLists);
    setProfile(newProfile);
    saveStoredData(newTasks, newLists, newProfile, themeStr);
  };

  const toggleDarkMode = () => {
    const target = !darkMode;
    setDarkMode(target);
    const themeStr = target ? 'dark' : 'light';
    if (target) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    updateDataAndStore(tasks, lists, profile, themeStr);
  };

  // Task Operations
  const handleToggleComplete = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextStatus: TaskStatus = t.completed ? 'To Do' : 'Completed';
        return { 
          ...t, 
          completed: !t.completed,
          status: nextStatus 
        };
      }
      return t;
    });
    // Update active details modal if open
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({
        ...selectedTask,
        completed: !selectedTask.completed,
        status: selectedTask.completed ? 'To Do' : 'Completed'
      });
    }
    updateDataAndStore(updated, lists, profile, darkMode ? 'dark' : 'light');
  };

  const handleToggleImportant = (taskId: string) => {
    const updated = tasks.map((t) => t.id === taskId ? { ...t, important: !t.important } : t);
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, important: !selectedTask.important });
    }
    updateDataAndStore(updated, lists, profile, darkMode ? 'dark' : 'light');
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return { 
          ...t, 
          status: newStatus,
          completed: newStatus === 'Completed'
        };
      }
      return t;
    });
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ 
        ...selectedTask, 
        status: newStatus,
        completed: newStatus === 'Completed'
      });
    }
    updateDataAndStore(updated, lists, profile, darkMode ? 'dark' : 'light');
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setSelectedTask(null);
    updateDataAndStore(updated, lists, profile, darkMode ? 'dark' : 'light');
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'> & { id?: string }) => {
    let updatedTasks: Task[];
    if (taskData.id) {
      // Edit existing task
      updatedTasks = tasks.map((t) => {
        if (t.id === taskData.id) {
          return {
            ...t,
            ...taskData,
          } as Task;
        }
        return t;
      });
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: TODAY_STR,
      };
      updatedTasks = [newTask, ...tasks];
    }
    updateDataAndStore(updatedTasks, lists, profile, darkMode ? 'dark' : 'light');
    setTaskToEdit(null);
  };

  // List Operations
  const handleAddList = (name: string, color: string, icon: string) => {
    const newList: List = {
      id: `list-${Date.now()}`,
      name,
      color,
      icon
    };
    const updatedLists = [...lists, newList];
    updateDataAndStore(tasks, updatedLists, profile, darkMode ? 'dark' : 'light');
    setActiveView(newList.id); // auto navigate to new list
  };

  const handleDeleteList = (listId: string) => {
    const updatedLists = lists.filter((l) => l.id !== listId);
    // Delete all tasks in that list
    const updatedTasks = tasks.filter((t) => t.listId !== listId);
    setActiveView('schedule');
    updateDataAndStore(updatedTasks, updatedLists, profile, darkMode ? 'dark' : 'light');
  };

  const handleUpdateListName = (listId: string, newName: string) => {
    const updatedLists = lists.map((l) => l.id === listId ? { ...l, name: newName } : l);
    updateDataAndStore(tasks, updatedLists, profile, darkMode ? 'dark' : 'light');
  };

  const handleResetData = () => {
    localStorage.clear();
    const data = getStoredData();
    setTasks(data.tasks);
    setLists(data.lists);
    setProfile(data.profile);
    setDarkMode(false);
    document.documentElement.classList.remove('dark');
  };

  // Filter Tasks for the selected view
  const getFilteredTasks = () => {
    let currentTasks = [...tasks];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      currentTasks = currentTasks.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    if (activeView === 'finished') {
      return currentTasks.filter((t) => t.completed);
    }

    if (activeView === 'important') {
      return currentTasks.filter((t) => t.important);
    }

    if (activeView !== 'schedule') {
      // It's a specific custom list
      return currentTasks.filter((t) => t.listId === activeView);
    }

    // Schedule screen filters (Screen 1 "Schedule")
    if (scheduleFilter === 'yesterday') {
      return currentTasks.filter((t) => t.dueDate === YESTERDAY_STR);
    }
    if (scheduleFilter === 'today') {
      return currentTasks.filter((t) => t.dueDate === TODAY_STR);
    }
    if (scheduleFilter === 'tomorrow') {
      return currentTasks.filter((t) => t.dueDate === TOMORROW_STR);
    }

    return currentTasks;
  };

  const filteredTasks = getFilteredTasks();

  // Statistics counters
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const todoCount = tasks.filter((t) => t.status === 'To Do').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const inReviewCount = tasks.filter((t) => t.status === 'In Review').length;

  const activeList = lists.find((l) => l.id === activeView);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
        lists={lists}
        activeView={activeView}
        setActiveView={setActiveView}
        onAddList={handleAddList}
        onResetData={handleResetData}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Container */}
      <main className="pb-16 max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Render List Details View if activeView is a custom list */}
        {activeView !== 'schedule' && activeView !== 'finished' && activeView !== 'important' && activeList ? (
          <ListDetails
            list={activeList}
            tasks={tasks}
            onGoBack={() => setActiveView('schedule')}
            onToggleComplete={handleToggleComplete}
            onToggleImportant={handleToggleImportant}
            onSelectTask={setSelectedTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={(task) => {
              setTaskToEdit(task);
              setIsNewTaskOpen(true);
            }}
            onOpenNewTask={() => {
              setTaskToEdit(null);
              setIsNewTaskOpen(true);
            }}
            onDeleteList={handleDeleteList}
            onUpdateListName={handleUpdateListName}
          />
        ) : (
          /* Main Dashboard Views (Schedule / Finished / Important) */
          <div className="pt-8">
            
            {/* Header: Screen 1 "Schedule" styled with avatar left, title, search and counters */}
            <div className="flex items-center justify-between gap-4 mb-6" id="dashboard-header">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="w-9 h-9 rounded-full border border-gray-200 dark:border-zinc-800 overflow-hidden hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-2xs bg-white dark:bg-zinc-900"
                id="sidebar-toggle-btn"
              >
                <img 
                  src={profile.avatar} 
                  alt="Samuel" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>

              <h1 className="font-sans font-bold text-lg sm:text-xl text-gray-800 dark:text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>
                  {activeView === 'schedule' ? 'TaskFlow' : 
                   activeView === 'finished' ? 'Concluídas' : 'Importantes'}
                </span>
              </h1>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTaskToEdit(null);
                    setIsNewTaskOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                  id="header-add-task-btn"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Nova Tarefa</span>
                </button>
              </div>
            </div>

            {/* Quick stats pills (Fidelity with Reference Image 2: "Complete 65", "To Do 45") */}
            <div className="flex flex-wrap gap-1.5 mb-6 justify-center sm:justify-start" id="stats-pills">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-sans text-[11px] font-medium">
                <span>Total</span>
                <span className="bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400 text-[10px] px-1.5 py-0.2 rounded-full font-mono ml-1">{totalCount}</span>
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/30 dark:border-emerald-900/20 font-sans text-[11px] font-medium">
                <span>Complete</span>
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono ml-1">{completedCount}</span>
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/30 dark:border-blue-900/20 font-sans text-[11px] font-medium">
                <span>To Do</span>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono ml-1">{todoCount}</span>
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100/30 dark:border-amber-900/20 font-sans text-[11px] font-medium">
                <span>In Progress</span>
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono ml-1">{inProgressCount}</span>
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-100/30 dark:border-purple-900/20 font-sans text-[11px] font-medium">
                <span>In Review</span>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono ml-1">{inReviewCount}</span>
              </span>
            </div>

            {/* Interactive Search Bar */}
            <div className="relative mb-6" id="search-bar">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Procurar tarefa por título ou tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950/30 font-sans text-xs shadow-2xs"
              />
            </div>

            {/* Schedule Horizontal Filter (Yesterday, Today, Tomorrow, All) from Wireframe Screen 1 */}
            {activeView === 'schedule' && (
              <div className="flex gap-1.5 mb-8 overflow-x-auto pb-1.5 scrollbar-none" id="schedule-tabs">
                <button
                  onClick={() => setScheduleFilter('all')}
                  className={`px-4 py-1.5 rounded-full font-sans font-semibold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                    scheduleFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50'
                  }`}
                >
                  Todas as datas
                </button>
                <button
                  onClick={() => setScheduleFilter('yesterday')}
                  className={`px-4 py-1.5 rounded-full font-sans font-semibold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                    scheduleFilter === 'yesterday'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50'
                  }`}
                >
                  Ontem
                </button>
                <button
                  onClick={() => setScheduleFilter('today')}
                  className={`px-4 py-1.5 rounded-full font-sans font-semibold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                    scheduleFilter === 'today'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50'
                  }`}
                >
                  Hoje
                </button>
                <button
                  onClick={() => setScheduleFilter('tomorrow')}
                  className={`px-4 py-1.5 rounded-full font-sans font-semibold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                    scheduleFilter === 'tomorrow'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50'
                  }`}
                >
                  Amanhã
                </button>
              </div>
            )}

            {/* Task Cards Stack */}
            <div className="space-y-8" id="tasks-timeline-container">
              
              {/* If Schedule and "All Dates" are selected, we organize by Ontem, Hoje, Amanhã just like wireframe Screen 1! */}
              {activeView === 'schedule' && scheduleFilter === 'all' ? (
                <>
                  {/* Ontem Section */}
                  <div className="space-y-4">
                    <h3 className="font-sans font-bold text-sm tracking-tight text-gray-800 dark:text-zinc-200 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-400" />
                      <span>Ontem</span>
                    </h3>
                    {filteredTasks.filter((t) => t.dueDate === YESTERDAY_STR).length === 0 ? (
                      <p className="text-xs text-gray-400 dark:text-zinc-500 font-sans py-2 pl-2 border-l border-gray-200 dark:border-zinc-850">
                        Nenhuma tarefa registrada para ontem.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {filteredTasks.filter((t) => t.dueDate === YESTERDAY_STR).map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            list={lists.find((l) => l.id === task.listId)}
                            onToggleComplete={handleToggleComplete}
                            onToggleImportant={handleToggleImportant}
                            onSelectTask={setSelectedTask}
                            onDeleteTask={handleDeleteTask}
                            onEditTask={(task) => {
                              setTaskToEdit(task);
                              setIsNewTaskOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hoje Section */}
                  <div className="space-y-4 pt-4">
                    <h3 className="font-sans font-bold text-sm tracking-tight text-gray-800 dark:text-zinc-200 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>Hoje</span>
                    </h3>
                    {filteredTasks.filter((t) => t.dueDate === TODAY_STR).length === 0 ? (
                      <p className="text-xs text-gray-400 dark:text-zinc-500 font-sans py-2 pl-2 border-l border-gray-200 dark:border-zinc-850">
                        Nenhuma tarefa agendada para hoje. Aproveite seu dia!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {filteredTasks.filter((t) => t.dueDate === TODAY_STR).map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            list={lists.find((l) => l.id === task.listId)}
                            onToggleComplete={handleToggleComplete}
                            onToggleImportant={handleToggleImportant}
                            onSelectTask={setSelectedTask}
                            onDeleteTask={handleDeleteTask}
                            onEditTask={(task) => {
                              setTaskToEdit(task);
                              setIsNewTaskOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Amanhã Section */}
                  <div className="space-y-4 pt-4">
                    <h3 className="font-sans font-bold text-sm tracking-tight text-gray-800 dark:text-zinc-200 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span>Amanhã</span>
                    </h3>
                    {filteredTasks.filter((t) => t.dueDate === TOMORROW_STR).length === 0 ? (
                      <p className="text-xs text-gray-400 dark:text-zinc-500 font-sans py-2 pl-2 border-l border-gray-200 dark:border-zinc-850">
                        Nenhuma tarefa planejada para amanhã ainda.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {filteredTasks.filter((t) => t.dueDate === TOMORROW_STR).map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            list={lists.find((l) => l.id === task.listId)}
                            onToggleComplete={handleToggleComplete}
                            onToggleImportant={handleToggleImportant}
                            onSelectTask={setSelectedTask}
                            onDeleteTask={handleDeleteTask}
                            onEditTask={(task) => {
                              setTaskToEdit(task);
                              setIsNewTaskOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Other tasks section (future / past) */}
                  {filteredTasks.filter((t) => t.dueDate !== YESTERDAY_STR && t.dueDate !== TODAY_STR && t.dueDate !== TOMORROW_STR).length > 0 && (
                    <div className="space-y-4 pt-4">
                      <h3 className="font-sans font-bold text-sm tracking-tight text-gray-800 dark:text-zinc-200 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Outras Datas</span>
                      </h3>
                      <div className="space-y-3">
                        {filteredTasks.filter((t) => t.dueDate !== YESTERDAY_STR && t.dueDate !== TODAY_STR && t.dueDate !== TOMORROW_STR).map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            list={lists.find((l) => l.id === task.listId)}
                            onToggleComplete={handleToggleComplete}
                            onToggleImportant={handleToggleImportant}
                            onSelectTask={setSelectedTask}
                            onDeleteTask={handleDeleteTask}
                            onEditTask={(task) => {
                              setTaskToEdit(task);
                              setIsNewTaskOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Filtered Date list view / Finished / Important */
                <div className="space-y-4">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl p-8">
                      <p className="text-xs font-sans text-gray-400 dark:text-zinc-500 mb-3">Nenhuma tarefa corresponde ao filtro atual.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setScheduleFilter('all');
                        }}
                        className="text-[11px] font-semibold px-3 py-1.5 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                      >
                        Limpar Filtros
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTasks.map((task) => (
                        <TaskCard
                           key={task.id}
                           task={task}
                           list={lists.find((l) => l.id === task.listId)}
                           onToggleComplete={handleToggleComplete}
                           onToggleImportant={handleToggleImportant}
                           onSelectTask={setSelectedTask}
                           onDeleteTask={handleDeleteTask}
                           onEditTask={(task) => {
                             setTaskToEdit(task);
                             setIsNewTaskOpen(true);
                           }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Floating Action Button '+' from wireframe Screen 1 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setTaskToEdit(null);
                setIsNewTaskOpen(true);
              }}
              className="fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all z-30 flex items-center justify-center cursor-pointer"
              id="dashboard-fab"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </div>
        )}
      </main>

      {/* New / Edit Task Bottom-Sheet Modal */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => {
          setIsNewTaskOpen(false);
          setTaskToEdit(null);
        }}
        lists={lists}
        selectedListId={activeView}
        onSaveTask={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Task Details High-Fidelity Modal */}
      <TaskDetailsModal
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        list={selectedTask ? lists.find((l) => l.id === selectedTask.listId) : undefined}
        onToggleComplete={handleToggleComplete}
        onDeleteTask={handleDeleteTask}
        onEditTask={(task) => {
          setTaskToEdit(task);
          setIsNewTaskOpen(true);
        }}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
