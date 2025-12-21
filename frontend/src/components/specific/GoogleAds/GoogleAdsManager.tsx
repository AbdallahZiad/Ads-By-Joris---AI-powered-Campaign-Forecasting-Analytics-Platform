import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { HiArrowRight, HiOutlineTemplate, HiSparkles, HiRefresh, HiLightningBolt, HiTrash } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PageLayout from '../../common/PageLayout/PageLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { useProject } from '../../../contexts/ProjectContext';
import { useProjectSync } from '../CategoryManagement/hooks/useProjectSync';
import ProjectSelector from '../CategoryManagement/components/ProjectSelector';
import { googleAdsService } from '../../../api/services/googleAdsService';
import { Project, LabelingReport } from '../../../types';
import { useTaskPoller } from '../../../hooks/useTaskPoller'; // Poller Import

// Components
import CustomerLinker from './components/CustomerLinker';
import MappingSection from './components/MappingSection';

const GoogleAdsManager: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { currentProjectId, setCurrentProjectId } = useProject();

    // State to coordinate the race condition for manual linking
    const [isLinkingCustomer, setIsLinkingCustomer] = useState(false);

    const {
        projects,
        activeProject,
        isLoadingActive,
        createProject,
        updateProject,
        deleteProject
    } = useProjectSync(currentProjectId);

    const isLinked = user?.is_google_ads_linked;

    // --- TASK POLLER: Labeling ---
    const labelingPoller = useTaskPoller<LabelingReport>({
        onSuccess: async (data) => {
            // Refresh project data to show new labels
            await queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] });
            alert(`Analysis & Labeling Complete!\n\nAdded Labels to:\n• ${data.categories.count} Categories\n• ${data.groups.count} Groups\n• ${data.keywords.count} Keywords\n\nSynced to Google Ads: ${data.synced_to_google ? "Yes ✅" : "No ❌"}`);
        },
        onError: (err) => {
            console.error("Labeling task failed:", err);
            alert(`Labeling failed: ${err}`);
        }
    });

    // --- MUTATION: Auto-Linking ---
    const autoLinkMutation = useMutation({
        mutationFn: (projectId: string) => googleAdsService.autoLinkProject(projectId),
        onSuccess: async (data: { categories_matched: number, groups_matched: number }) => {
            await queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] });
            await queryClient.invalidateQueries({ queryKey: ['google-ads-campaigns'] });
            await queryClient.invalidateQueries({ queryKey: ['google-ads-adgroups'] });
            alert(`Auto-Linking Complete!\n\nMatched ${data.categories_matched} Categories\nMatched ${data.groups_matched} Groups`);
        },
        onError: (error: any) => {
            console.error("Auto-link failed", error);
            alert("Auto-linking failed. Please ensure your project is linked to a valid Customer Account.");
        }
    });

    // --- MUTATION: Apply Labels (Initiate Async Task) ---
    const applyLabelsMutation = useMutation({
        mutationFn: (projectId: string) => googleAdsService.applyLabels(projectId),
        onSuccess: (data) => {
            // Start Polling with the returned task_id
            labelingPoller.startPolling(data.task_id);
        },
        onError: (err) => {
            console.error(err);
            alert("Failed to start labeling task. Please check network connection.");
        }
    });

    // --- MUTATION: Remove Labels ---
    const removeLabelsMutation = useMutation({
        mutationFn: (projectId: string) => googleAdsService.removeLabels(projectId),

        // Optimistic Update
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['project', currentProjectId] });
            const previousProject = queryClient.getQueryData<Project>(['project', currentProjectId]);

            if (previousProject) {
                queryClient.setQueryData<Project>(['project', currentProjectId], {
                    ...previousProject,
                    categories: previousProject.categories.map(cat => ({
                        ...cat,
                        applied_labels: [],
                        groups: cat.groups.map(grp => ({
                            ...grp,
                            applied_labels: []
                        }))
                    }))
                });
            }

            return { previousProject };
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] });
        },
        onError: (_err, _newVal, context) => {
            if (context?.previousProject) {
                queryClient.setQueryData(['project', currentProjectId], context.previousProject);
            }
            alert("Failed to clear labels.");
        }
    });

    const isAnyActionPending = autoLinkMutation.isPending || applyLabelsMutation.isPending || removeLabelsMutation.isPending || labelingPoller.isLoading;

    const linkGoogleAds = useGoogleLogin({
        flow: 'auth-code',
        ux_mode: 'redirect',
        redirect_uri: 'http://localhost:8080',
        scope: 'https://www.googleapis.com/auth/adwords',
        select_account: true,
    });

    const handleCreateProject = async (title: string) => {
        try {
            const newProj = await createProject({ title });
            setCurrentProjectId(newProj.id);
        } catch (e) {
            console.error("Failed to create project");
        }
    };

    const handleRenameProject = async (id: string, title: string) => {
        try {
            await updateProject({ id, title });
        } catch (e) {
            console.error("Failed to rename project");
        }
    };

    const handleDeleteProject = async (id: string) => {
        try {
            await deleteProject(id);
            if (id === currentProjectId) setCurrentProjectId(null);
        } catch (e) {
            console.error("Failed to delete project");
        }
    };

    const handleAutoLink = () => {
        if (currentProjectId) {
            if (window.confirm("This will use AI to automatically match your Categories and Groups to Google Ads Campaigns and Ad Groups based on name similarity.\n\nContinue?")) {
                autoLinkMutation.mutate(currentProjectId);
            }
        }
    };

    // --- STATE 1: UNLINKED ---
    if (!isLinked) {
        return (
            <PageLayout className="flex flex-col items-center justify-center min-h-full p-6 bg-gray-50">
                <div className="max-w-4xl w-full text-center">
                    <div className="mb-12">
                        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                            <FcGoogle size={48} />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Supercharge your Campaigns
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Connect your Google Ads account to map your categories, sync keywords, and analyze performance.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => linkGoogleAds()}
                            className="group flex items-center gap-3 px-8 py-4 bg-teal-600 text-white text-lg font-bold rounded-xl shadow-xl hover:bg-teal-700 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <FcGoogle size={24} />
                            <span>Link Google Ads Account</span>
                            <HiArrowRight className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    // --- STATE 2: LINKED ---
    return (
        <PageLayout className="h-full flex flex-col bg-gray-50">

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    <div className="flex justify-between items-center mb-8">
                        {/* LEFT: Title & Selector */}
                        <div className="flex items-center gap-6">
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Ads Manager</h1>
                            <div className="h-10 w-px bg-gray-300" />
                            <ProjectSelector
                                projects={projects}
                                currentProjectId={currentProjectId}
                                onSelect={setCurrentProjectId}
                                onCreate={handleCreateProject}
                                onRename={handleRenameProject}
                                onDelete={handleDeleteProject}
                            />
                        </div>

                        {/* RIGHT: Action Toolbar */}
                        {activeProject && activeProject.linked_customer_id && (
                            <div className="flex items-center gap-3">
                                {/* 1. Auto-Link */}
                                <button
                                    onClick={handleAutoLink}
                                    disabled={isAnyActionPending}
                                    className={`
                                        flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border
                                        ${autoLinkMutation.isPending
                                        ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                        : isAnyActionPending
                                            ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-teal-500 hover:text-teal-600 hover:shadow-md hover:-translate-y-0.5'}
                                    `}
                                >
                                    {autoLinkMutation.isPending ? (
                                        <HiRefresh className="animate-spin" size={18} />
                                    ) : (
                                        <HiSparkles className="text-teal-500" size={18} />
                                    )}
                                    <span>Auto-Link</span>
                                </button>

                                {/* 2. Analyze & Sync */}
                                <button
                                    onClick={() => applyLabelsMutation.mutate(currentProjectId!)}
                                    disabled={isAnyActionPending}
                                    className={`
                                        flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-all
                                        ${applyLabelsMutation.isPending || labelingPoller.isLoading
                                        ? 'bg-teal-800 cursor-not-allowed opacity-80'
                                        : isAnyActionPending
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-teal-600 hover:bg-teal-700 hover:-translate-y-0.5 hover:shadow-md'}
                                    `}
                                >
                                    {applyLabelsMutation.isPending || labelingPoller.isLoading ? (
                                        <HiRefresh className="animate-spin" size={18} />
                                    ) : (
                                        <HiLightningBolt size={18} />
                                    )}
                                    <span>{labelingPoller.isLoading ? "Labeling..." : "Analyze & Sync Labels"}</span>
                                </button>

                                <div className="h-6 w-px bg-gray-200 mx-2" />

                                {/* 3. Clear Labels */}
                                <button
                                    onClick={() => {
                                        if(confirm("Are you sure you want to remove all [Joris] labels from your Google Ads entities?")) {
                                            removeLabelsMutation.mutate(currentProjectId!);
                                        }
                                    }}
                                    disabled={isAnyActionPending}
                                    className={`
                                        flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors border border-transparent
                                        ${isAnyActionPending
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100'}
                                    `}
                                    title="Remove all AI-generated labels"
                                >
                                    <HiTrash size={16} />
                                    <span>Clear Labels</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {isLoadingActive ? (
                        <div className="flex items-center justify-center h-64 text-gray-400">
                            Loading Project Data...
                        </div>
                    ) : !currentProjectId ? (
                        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-200 rounded-2xl bg-white text-gray-400">
                            <FcGoogle size={48} className="mb-4 opacity-50 grayscale" />
                            <p className="text-lg font-medium">No Project Selected</p>
                            <p className="text-sm">Select a project above to start mapping campaigns.</p>
                        </div>
                    ) : activeProject ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                            <CustomerLinker
                                activeProject={activeProject}
                                onLinkingStateChange={setIsLinkingCustomer}
                            />

                            {activeProject.categories.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                                    <HiOutlineTemplate className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900">This project is empty</h3>
                                    <p className="mt-1 text-sm text-gray-500 mb-6">
                                        You need to create categories and groups before you can map them to Google Ads.
                                    </p>
                                    <button
                                        onClick={() => navigate('/planner')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
                                    >
                                        Go to Planner
                                        <HiArrowRight className="ml-2 -mr-1 h-4 w-4" />
                                    </button>
                                </div>
                            ) : activeProject.linked_customer_id ? (
                                <MappingSection
                                    project={activeProject}
                                    isLinkingCustomer={isLinkingCustomer}
                                />
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500 shadow-sm">
                                    <p className="font-medium">Link a Customer Account above to enable Campaign Mapping.</p>
                                </div>
                            )}
                        </div>
                    ) : null}

                    <div className="h-20" />
                </div>
            </div>
        </PageLayout>
    );
};

export default GoogleAdsManager;