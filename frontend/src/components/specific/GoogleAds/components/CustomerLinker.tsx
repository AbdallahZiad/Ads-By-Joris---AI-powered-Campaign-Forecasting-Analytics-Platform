import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiOutlineOfficeBuilding, HiCheck, HiExclamation } from 'react-icons/hi';
import { googleAdsService } from '../../../../api/services/googleAdsService';
import { Project, SelectOption } from '../../../../types';
import SearchableSelect from '../../../common/SearchableSelect/SearchableSelect';
import { useToast } from '../../../../hooks/useToast'; // ▼▼▼ Import

interface Props {
    activeProject: Project;
    onLinkingStateChange: (isLinking: boolean) => void;
}

const CustomerLinker: React.FC<Props> = ({ activeProject, onLinkingStateChange }) => {
    const queryClient = useQueryClient();
    const toast = useToast(); // ▼▼▼ Initialize

    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['google-ads-customers'],
        queryFn: googleAdsService.getCustomers,
    });

    const customerOptions: SelectOption[] = data?.customers.map(c => ({
        id: c.id,
        name: `${c.descriptive_name} (${c.id}) ${c.is_manager ? '[MCC]' : ''}`
    })) || [];

    useEffect(() => {
        if (activeProject.linked_customer_id) {
            const linkedCustomer = customerOptions.find(c => c.id === activeProject.linked_customer_id);
            if (linkedCustomer) {
                setSelectedOption(linkedCustomer);
            } else {
                setSelectedOption({
                    id: activeProject.linked_customer_id,
                    name: `Account ID: ${activeProject.linked_customer_id}`
                });
            }
            setIsEditing(false);
        } else {
            setSelectedOption(null);
            setIsEditing(true);
        }
    }, [activeProject.linked_customer_id, data]);

    const linkCustomerMutation = useMutation({
        mutationFn: (customerId: string) => googleAdsService.linkProjectToCustomer(activeProject.id, customerId),

        onMutate: async (newCustomerId) => {
            onLinkingStateChange(true);

            await queryClient.cancelQueries({ queryKey: ['project', activeProject.id] });
            await queryClient.removeQueries({ queryKey: ['google-ads-campaigns'] });
            await queryClient.removeQueries({ queryKey: ['google-ads-adgroups'] });

            const previousProject = queryClient.getQueryData<Project>(['project', activeProject.id]);

            if (previousProject) {
                queryClient.setQueryData<Project>(['project', activeProject.id], {
                    ...previousProject,
                    linked_customer_id: newCustomerId,
                    categories: previousProject.categories.map(cat => ({
                        ...cat,
                        google_campaign_id: null,
                        groups: cat.groups.map(grp => ({
                            ...grp,
                            google_ad_group_id: null
                        }))
                    }))
                });
            }

            return { previousProject };
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['project', activeProject.id] });
            setIsEditing(false);
        },
        onError: (_err, _newVal, context) => {
            if (context?.previousProject) {
                queryClient.setQueryData(['project', activeProject.id], context.previousProject);
            }
            // ▼▼▼ FIX: Toast error ▼▼▼
            toast.error("Failed to link customer account. Please try again.");
        },
        onSettled: () => {
            onLinkingStateChange(false);
        }
    });

    const handleSave = () => {
        if (!selectedOption) return;

        if (activeProject.linked_customer_id && activeProject.linked_customer_id !== selectedOption.id) {
            const hasDownstreamLinks = activeProject.categories.some(cat =>
                cat.google_campaign_id || cat.groups.some(grp => grp.google_ad_group_id)
            );

            if (hasDownstreamLinks) {
                if (!window.confirm("Warning: Changing the Customer Account will RESET all Campaign and Ad Group links in this project. Are you sure?")) {
                    return;
                }
            }
        }

        linkCustomerMutation.mutate(selectedOption.id);
    };

    return (
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <HiOutlineOfficeBuilding size={24} />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800">Google Ads Customer Account</h2>
                        <p className="text-sm text-gray-500">
                            Select the ad account this project belongs to.
                        </p>
                    </div>
                </div>

                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-teal-600 font-medium hover:text-teal-700 underline"
                    >
                        Change Account
                    </button>
                )}
            </div>

            {!isEditing && selectedOption ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-800 rounded-lg border border-green-200">
                    <HiCheck className="text-green-600" />
                    <span className="font-medium text-sm">Linked to:</span>
                    <span className="font-bold text-sm">{selectedOption.name}</span>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex gap-4 items-start">
                        <div className="flex-1">
                            <SearchableSelect
                                instanceId="customer-select"
                                value={selectedOption}
                                onChange={setSelectedOption}
                                options={customerOptions}
                                placeholder="Select a Google Ads Account..."
                                isLoading={isLoading}
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={!selectedOption || linkCustomerMutation.isPending}
                            className="px-6 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 disabled:opacity-50 transition-colors shadow-sm h-[38px]"
                        >
                            {linkCustomerMutation.isPending ? 'Linking...' : 'Save & Link'}
                        </button>
                        {activeProject.linked_customer_id && (
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    const original = customerOptions.find(c => c.id === activeProject.linked_customer_id);
                                    if (original) setSelectedOption(original);
                                }}
                                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium h-[38px]"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    {activeProject.linked_customer_id && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-orange-600 font-medium">
                            <HiExclamation />
                            <span>Warning: Changing this will reset all downstream mappings.</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomerLinker;