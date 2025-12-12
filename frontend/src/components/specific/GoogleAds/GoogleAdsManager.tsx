import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { HiArrowRight, HiOutlineTemplate, HiSparkles, HiRefresh } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Import Query hooks
import PageLayout from '../../common/PageLayout/PageLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { useProject } from '../../../contexts/ProjectContext';
import { useProjectSync } from '../CategoryManagement/hooks/useProjectSync';
import ProjectSelector from '../CategoryManagement/components/ProjectSelector';
import { googleAdsService } from '../../../api/services/googleAdsService'; // Import Service

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

    // --- AUTO-LINKING MUTATION ---
    const autoLinkMutation = useMutation({
        mutationFn: (projectId: string) => googleAdsService.autoLinkProject(projectId),
        onSuccess: async (data) => {
            // 1. Refresh the project tree to show new links
            await queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] });

            // 2. Also refresh dropdown caches so they know about the new campaign contexts
            await queryClient.invalidateQueries({ queryKey: ['google-ads-campaigns'] });
            await queryClient.invalidateQueries({ queryKey: ['google-ads-adgroups'] });

            // 3. User Feedback
            alert(`Auto-Linking Complete!\n\nMatched ${data.categories_matched} Categories\nMatched ${data.groups_matched} Groups`);
        },
        onError: (error: any) => {
            console.error("Auto-link failed", error);
            alert("Auto-linking failed. Please ensure your project is linked to a valid Customer Account.");
        }
    });

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

    // --- STATE 1: UNLINKED (Sales Page) ---
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

    // --- STATE 2: LINKED (Dashboard) ---
    return (
        <PageLayout className="h-full flex flex-col bg-gray-50">

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    <div className="flex justify-between items-start mb-8">
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

                        {/* ▼▼▼ NEW: Auto-Link Button (Right Side) ▼▼▼ */}
                        {/* Only show if project is active and customer is linked */}
                        {activeProject && activeProject.linked_customer_id && (
                            <button
                                onClick={handleAutoLink}
                                disabled={autoLinkMutation.isPending}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all
                                    ${autoLinkMutation.isPending
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-teal-600 hover:border-teal-200'}
                                `}
                                title="Automatically match categories and groups using AI"
                            >
                                {autoLinkMutation.isPending ? (
                                    <>
                                        <HiRefresh className="animate-spin" size={18} />
                                        <span>Matching...</span>
                                    </>
                                ) : (
                                    <>
                                        <HiSparkles className={autoLinkMutation.isPending ? "" : "text-teal-500"} size={18} />
                                        <span>Auto-Match with AI</span>
                                    </>
                                )}
                            </button>
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