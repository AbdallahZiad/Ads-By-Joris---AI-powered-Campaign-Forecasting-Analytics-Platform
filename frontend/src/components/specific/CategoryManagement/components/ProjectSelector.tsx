import React, { useState, useEffect, useRef } from 'react';
import { HiSelector, HiPlus, HiFolder, HiCheck, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectMetadata } from '../../../../types';

interface Props {
    projects: ProjectMetadata[];
    currentProjectId: string | null;
    onSelect: (id: string) => void;
    onCreate: (title: string) => void;
    onRename: (id: string, newTitle: string) => void;
    onDelete: (id: string) => void; // ▼▼▼ NEW PROP
}

const ProjectSelector: React.FC<Props> = ({ projects, currentProjectId, onSelect, onCreate, onRename, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    // Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const editInputRef = useRef<HTMLInputElement>(null);

    // Deletion State
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const currentProject = projects.find(p => p.id === currentProjectId);

    useEffect(() => {
        if (currentProject) {
            setEditTitle(currentProject.title);
        }
    }, [currentProject]);

    useEffect(() => {
        if (isEditing && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [isEditing]);

    const handleCreate = () => {
        if (!newTitle.trim()) return;
        onCreate(newTitle);
        setNewTitle('');
        setIsCreating(false);
        setIsOpen(false);
    };

    const handleRename = () => {
        if (currentProjectId && editTitle.trim() !== '' && editTitle !== currentProject?.title) {
            onRename(currentProjectId, editTitle);
        }
        setIsEditing(false);
    };

    const toggleDropdown = () => {
        if (!isEditing) setIsOpen(!isOpen);
    };

    const handleDelete = (id: string) => {
        onDelete(id);
        setDeleteConfirmId(null);
        // If we deleted the current project, the parent component handles selection logic
        // but we might want to close the dropdown if it feels right, or keep it open.
        // Keeping it open feels more "admin-like".
    };

    return (
        <div className="relative w-80 z-20">
            {/* Main Trigger */}
            <div className="flex items-center w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:border-teal-500 transition-colors">

                <div
                    className="flex-1 flex items-center justify-between px-4 py-3 min-w-0 cursor-pointer"
                    onClick={toggleDropdown}
                >
                    <div className="flex items-center gap-2 overflow-hidden w-full">
                        <div className="p-1.5 bg-teal-50 text-teal-600 rounded-md shrink-0">
                            <HiFolder size={18} />
                        </div>

                        {isEditing ? (
                            <input
                                ref={editInputRef}
                                type="text"
                                className="w-full text-sm font-bold text-gray-800 outline-none bg-transparent border-b-2 border-teal-500 pb-0.5"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleRename();
                                    if (e.key === 'Escape') {
                                        setEditTitle(currentProject?.title || '');
                                        setIsEditing(false);
                                    }
                                }}
                                onBlur={handleRename}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <div className="text-left truncate w-full">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Current Project</p>
                                <p className="text-sm font-bold text-gray-800 truncate">
                                    {currentProject ? currentProject.title : "Select a Project"}
                                </p>
                            </div>
                        )}
                    </div>
                    {!isEditing && <HiSelector className="text-gray-400 shrink-0 ml-2" />}
                </div>

                {currentProjectId && !isEditing && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditTitle(currentProject?.title || '');
                            setIsEditing(true);
                            setIsOpen(false);
                        }}
                        className="p-3 text-gray-400 hover:text-teal-600 border-l border-gray-100 transition-colors z-10"
                        title="Rename Project"
                    >
                        <HiPencil size={16} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => { setIsOpen(false); setIsCreating(false); setDeleteConfirmId(null); }}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden"
                        >
                            <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
                                {projects.map(proj => {
                                    const isConfirming = deleteConfirmId === proj.id;

                                    return (
                                        <div key={proj.id} className="relative group/item">
                                            {isConfirming ? (
                                                // ▼▼▼ CONFIRMATION STATE ▼▼▼
                                                <div className="flex items-center justify-between px-3 py-2.5 bg-red-50 rounded-lg animate-in fade-in duration-200">
                                                    <span className="text-xs font-semibold text-red-600">Delete this project?</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                                                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded"
                                                        >
                                                            <HiX size={14} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(proj.id); }}
                                                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-100 rounded"
                                                        >
                                                            <HiTrash size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // ▼▼▼ NORMAL STATE ▼▼▼
                                                <button
                                                    onClick={() => { onSelect(proj.id); setIsOpen(false); }}
                                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                                                        proj.id === currentProjectId
                                                            ? 'bg-teal-50 text-teal-700 font-medium'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <span className="truncate pr-8">{proj.title}</span>

                                                    <div className="absolute right-3 flex items-center">
                                                        {/* Checkmark (Visible if active, hidden on hover if not checking) */}
                                                        {proj.id === currentProjectId && (
                                                            <HiCheck className="group-hover/item:hidden text-teal-600" />
                                                        )}

                                                        {/* Trash Icon (Visible on Hover) */}
                                                        <div
                                                            className="hidden group-hover/item:flex p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded cursor-pointer transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeleteConfirmId(proj.id);
                                                            }}
                                                            title="Delete Project"
                                                        >
                                                            <HiTrash size={16} />
                                                        </div>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-100 p-2 bg-gray-50">
                                {isCreating ? (
                                    <div className="flex gap-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
                                            placeholder="Project Name..."
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                        />
                                        <button
                                            onClick={handleCreate}
                                            className="p-1.5 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                                        >
                                            <HiPlus size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsCreating(true)}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-teal-700 font-medium hover:bg-teal-100 rounded-lg transition-colors"
                                    >
                                        <HiPlus size={16} /> Create New Project
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectSelector;