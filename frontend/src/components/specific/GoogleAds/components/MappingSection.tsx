import React, { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiOutlineViewGrid, HiOutlineCollection } from 'react-icons/hi';
import { Project, Category, Group, SelectOption } from '../../../../types';
import { googleAdsService } from '../../../../api/services/googleAdsService';
import SearchableSelect from '../../../common/SearchableSelect/SearchableSelect';

interface Props {
    project: Project;
    isLinkingCustomer: boolean;
}

const MappingSection: React.FC<Props> = ({ project, isLinkingCustomer }) => {
    const { data: campaignData, isLoading: isLoadingCampaigns } = useQuery({
        queryKey: ['google-ads-campaigns', project.id, project.linked_customer_id],
        queryFn: () => googleAdsService.getCampaigns(project.id),
        enabled: !!project.linked_customer_id && !isLinkingCustomer,
        staleTime: 1000 * 60 * 5,
    });

    const campaignOptions: SelectOption[] = campaignData?.campaigns.map(c => ({
        id: c.id,
        name: `${c.name} (${c.status})`
    })) || [];

    const sortedCategories = useMemo(() => {
        return [...project.categories].sort((a, b) => a.name.localeCompare(b.name));
    }, [project.categories]);

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <HiOutlineViewGrid className="text-teal-600" />
                Campaign & Ad Group Mapping
            </h3>

            {isLoadingCampaigns || isLinkingCustomer ? (
                <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
                    Loading Campaigns...
                </div>
            ) : (
                <div className="grid gap-6">
                    {sortedCategories.map(category => (
                        <CategoryMapper
                            key={category.id}
                            projectId={project.id}
                            category={category}
                            campaignOptions={campaignOptions}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Helper: Semantic Label Badge ---
const getLabelStyle = (label: string): string => {
    // Semantic Color Mapping
    if (label.includes("Trending Up")) return "bg-green-50 text-green-700 border-green-200";
    if (label.includes("Trending Down")) return "bg-red-50 text-red-700 border-red-200";
    if (label.includes("Stable")) return "bg-slate-50 text-slate-600 border-slate-200";
    if (label.includes("Hot Next Month")) return "bg-orange-50 text-orange-700 border-orange-200";
    if (label.includes("Volatile")) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (label.includes("Hidden Gem")) return "bg-purple-50 text-purple-700 border-purple-200";
    if (label.includes("High Cost")) return "bg-rose-50 text-rose-700 border-rose-200";
    if (label.includes("Low Data")) return "bg-gray-100 text-gray-500 border-gray-200";

    // Default / Unknown Labels (Fallback)
    return "bg-indigo-50 text-indigo-700 border-indigo-200";
};

const LabelBadge: React.FC<{ label: string }> = ({ label }) => {
    const colorClass = getLabelStyle(label);

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border mr-1.5 mb-1 tracking-wide whitespace-nowrap ${colorClass}`}>
            {label}
        </span>
    );
};

const CategoryMapper: React.FC<{ projectId: string, category: Category, campaignOptions: SelectOption[] }> = ({ projectId, category, campaignOptions }) => {
    const queryClient = useQueryClient();

    const linkCampaignMutation = useMutation({
        mutationFn: (campaignId: string) => googleAdsService.linkCategoryToCampaign(category.id, campaignId),

        onMutate: async (newCampaignId) => {
            await queryClient.cancelQueries({ queryKey: ['project', projectId] });
            await queryClient.removeQueries({ queryKey: ['google-ads-adgroups', category.id] });

            const previousProject = queryClient.getQueryData<Project>(['project', projectId]);
            if (previousProject) {
                queryClient.setQueryData<Project>(['project', projectId], {
                    ...previousProject,
                    categories: previousProject.categories.map(cat => {
                        if (cat.id === category.id) {
                            return {
                                ...cat,
                                google_campaign_id: newCampaignId,
                                groups: cat.groups.map(grp => ({ ...grp, google_ad_group_id: null }))
                            };
                        }
                        return cat;
                    })
                });
            }

            return { previousProject };
        },
        onError: (_err, _newVal, context) => {
            if (context?.previousProject) {
                queryClient.setQueryData(['project', projectId], context.previousProject);
            }
            alert("Failed to link campaign.");
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['project', projectId] });
            await queryClient.invalidateQueries({ queryKey: ['google-ads-adgroups', category.id] });
        }
    });

    const currentOption = campaignOptions.find(c => c.id === category.google_campaign_id) || null;

    const sortedGroups = useMemo(() => {
        return [...category.groups].sort((a, b) => a.name.localeCompare(b.name));
    }, [category.groups]);

    // ▼▼▼ FIX: Deterministic Sort for Labels ▼▼▼
    const sortedLabels = useMemo(() => {
        if (!category.applied_labels) return [];
        return [...category.applied_labels].sort();
    }, [category.applied_labels]);

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">

                {/* ▼▼▼ Category Name & Labels (INLINE) ▼▼▼ */}
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-gray-800 text-lg">{category.name}</span>

                    {sortedLabels.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            {sortedLabels.map((label, idx) => (
                                <LabelBadge key={idx} label={label} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 w-96">
                    <span className="text-sm text-gray-600 whitespace-nowrap font-medium">Map to Campaign:</span>
                    <div className="flex-1">
                        <SearchableSelect
                            instanceId={`campaign-select-${category.id}`}
                            value={currentOption}
                            onChange={(opt) => {
                                if (!opt) return;
                                if (category.google_campaign_id && opt.id !== category.google_campaign_id) {
                                    const hasAdGroupLinks = category.groups.some(grp => grp.google_ad_group_id);
                                    if (hasAdGroupLinks) {
                                        if(!confirm("Changing campaign will reset ad group links. Continue?")) return;
                                    }
                                }
                                linkCampaignMutation.mutate(opt.id);
                            }}
                            options={campaignOptions}
                            placeholder="Select Campaign..."
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white">
                {category.google_campaign_id ? (
                    <div className="space-y-4">
                        {sortedGroups.map(group => (
                            <GroupMapper
                                key={group.id}
                                projectId={projectId}
                                categoryId={category.id}
                                currentCampaignId={category.google_campaign_id!}
                                group={group}
                                isParentLinking={linkCampaignMutation.isPending}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-400 text-sm italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        Link a Campaign above to map Ad Groups
                    </div>
                )}
            </div>
        </div>
    );
};

interface GroupMapperProps {
    projectId: string;
    categoryId: string;
    currentCampaignId: string;
    group: Group;
    isParentLinking: boolean;
}

const GroupMapper: React.FC<GroupMapperProps> = ({ projectId, categoryId, currentCampaignId, group, isParentLinking }) => {
    const queryClient = useQueryClient();

    const { data: adGroupData, isLoading } = useQuery({
        queryKey: ['google-ads-adgroups', categoryId, currentCampaignId],
        queryFn: () => googleAdsService.getAdGroups(categoryId),
        staleTime: 1000 * 60 * 5,
        enabled: !!currentCampaignId && !isParentLinking
    });

    const linkAdGroupMutation = useMutation({
        mutationFn: (adGroupId: string) => googleAdsService.linkGroupToAdGroup(group.id, adGroupId),
        onMutate: async (newAdGroupId) => {
            await queryClient.cancelQueries({ queryKey: ['project', projectId] });
            const previousProject = queryClient.getQueryData<Project>(['project', projectId]);

            if (previousProject) {
                queryClient.setQueryData<Project>(['project', projectId], {
                    ...previousProject,
                    categories: previousProject.categories.map(cat => {
                        if (cat.id === categoryId) {
                            return {
                                ...cat,
                                groups: cat.groups.map(grp =>
                                    grp.id === group.id ? { ...grp, google_ad_group_id: newAdGroupId } : grp
                                )
                            };
                        }
                        return cat;
                    })
                });
            }
            return { previousProject };
        },
        onError: (_err, _newVal, context) => {
            if (context?.previousProject) {
                queryClient.setQueryData(['project', projectId], context.previousProject);
            }
            alert("Failed to link ad group.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        }
    });

    const adGroupOptions: SelectOption[] = adGroupData?.ad_groups.map(ag => ({
        id: ag.id,
        name: `${ag.name} (${ag.status})`
    })) || [];

    const currentOption = adGroupOptions.find(ag => ag.id === group.google_ad_group_id) || null;

    // ▼▼▼ FIX: Deterministic Sort for Labels ▼▼▼
    const sortedLabels = useMemo(() => {
        if (!group.applied_labels) return [];
        return [...group.applied_labels].sort();
    }, [group.applied_labels]);

    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-3 rounded transition-colors">
            {/* ▼▼▼ Group Name & Labels (INLINE) ▼▼▼ */}
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex items-center gap-2 min-w-0">
                    <HiOutlineCollection className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 font-medium truncate">{group.name}</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap">({group.keywords.length} keywords)</span>
                </div>

                {sortedLabels.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {sortedLabels.map((label, idx) => (
                            <LabelBadge key={idx} label={label} />
                        ))}
                    </div>
                )}
            </div>

            <div className="w-80 flex-shrink-0">
                {isLoading || isParentLinking ? (
                    <div className="h-[38px] w-full bg-gray-100 rounded animate-pulse border border-gray-200" />
                ) : (
                    <SearchableSelect
                        instanceId={`adgroup-select-${group.id}`}
                        value={currentOption}
                        onChange={(opt) => {
                            if (opt) linkAdGroupMutation.mutate(opt.id);
                        }}
                        options={adGroupOptions}
                        placeholder="Select Ad Group..."
                    />
                )}
            </div>
        </div>
    );
};

export default MappingSection;