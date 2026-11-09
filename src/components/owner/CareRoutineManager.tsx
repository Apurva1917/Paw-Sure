import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { CareTask, TaskCategory } from '../../types/pawsure';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, Plus, Compass, Utensils, Heart, Check, Trash2 } from 'lucide-react';

export const CareRoutineManager: React.FC = () => {
  const { tasks, helper } = usePawsure();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('walk');
  const [newTime, setNewTime] = useState('04:00 PM');
  const [newDuration, setNewDuration] = useState(30);
  const [newInstructions, setNewInstructions] = useState('');
  const [newPortion, setNewPortion] = useState('');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#EE8267]/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#EE8267]">
            Care Routine & Protocols
          </span>
          <h1 className="font-heading text-xl font-bold text-[#38223A]">
            Daily Schedule & Verification Rules
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configured for caregiver Sunita Sharma. Evidence requirements enforce verified care.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#EE8267] text-white text-xs font-bold hover:bg-[#E26D50] shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Routine Task</span>
        </button>
      </div>

      {/* Routine Cards List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#FFF0E6] text-[#EE8267]">
                  {task.category === 'walk' ? (
                    <Compass className="w-5 h-5" />
                  ) : task.category === 'food' ? (
                    <Utensils className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-600">
                      {task.scheduledTime}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500">{task.estimatedDurationMins} mins</span>
                    <StatusBadge status={task.status} size="sm" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-[#38223A]">
                    {task.title}
                  </h3>
                </div>
              </div>

              <div className="text-right sm:self-center text-xs">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Assigned Sitter</span>
                <span className="font-semibold text-[#38223A]">{task.assignedHelperName}</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 bg-[#FFF9F3] p-3 rounded-2xl">
              {task.instructions}
            </p>

            <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2 pt-2 border-t border-gray-100">
              <span>Target: <strong>{task.portionOrDistance || 'Standard protocol'}</strong></span>
              <span>
                Verification: <strong>{task.securityCodeRequired ? 'Code + Photo Required' : 'GPS / Photo Required'}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#38223A]">
              Add Routine Task
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Afternoon Garden Brushing"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  >
                    <option value="walk">Walk</option>
                    <option value="food">Meal</option>
                    <option value="potty">Potty Check</option>
                    <option value="medication">Medication</option>
                    <option value="play">Play / Grooming</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Specific handling guidelines for caregiver..."
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Portion / Distance Target</label>
                <input
                  type="text"
                  placeholder="e.g. 1.5 km or 1 cup kibble"
                  value={newPortion}
                  onChange={(e) => setNewPortion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-2xl border border-gray-300 text-xs font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Task "${newTitle || 'Custom Task'}" added to care schedule!`);
                  setShowAddModal(false);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-[#EE8267] text-white text-xs font-bold hover:bg-[#E26D50]"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
