import { apiClient } from '../apiClient';
import {
    CustomerListResponse,
    CampaignListResponse,
    AdGroupListResponse
} from '../../types';

export const googleAdsService = {
    // 1. Fetch Customers (Accounts)
    getCustomers: async () => {
        return apiClient.get<CustomerListResponse>('/api/v1/users/me/google-ads/customers');
    },

    // 2. Link Project -> Customer
    linkProjectToCustomer: async (projectId: string, customerId: string) => {
        return apiClient.put(`/api/v1/projects/${projectId}/link-customer`, { customer_id: customerId });
    },

    // 3. Fetch Campaigns (for a Project)
    getCampaigns: async (projectId: string) => {
        return apiClient.get<CampaignListResponse>(`/api/v1/projects/${projectId}/google-ads/campaigns`);
    },

    // 4. Link Category -> Campaign
    linkCategoryToCampaign: async (categoryId: string, campaignId: string) => {
        return apiClient.put(`/api/v1/projects/categories/${categoryId}/link-campaign`, { campaign_id: campaignId });
    },

    // 5. Fetch Ad Groups (for a Category's linked Campaign)
    getAdGroups: async (categoryId: string) => {
        return apiClient.get<AdGroupListResponse>(`/api/v1/projects/categories/${categoryId}/google-ads/ad-groups`);
    },

    // 6. Link Group -> Ad Group
    linkGroupToAdGroup: async (groupId: string, adGroupId: string) => {
        return apiClient.put(`/api/v1/projects/groups/${groupId}/link-ad-group`, { ad_group_id: adGroupId });
    }
};