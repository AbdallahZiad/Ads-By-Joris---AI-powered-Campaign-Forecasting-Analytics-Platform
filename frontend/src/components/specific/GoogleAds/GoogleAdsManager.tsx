import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { HiCheckCircle, HiLightningBolt, HiTrendingUp, HiTag, HiArrowRight } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import PageLayout from '../../common/PageLayout/PageLayout';
import { useAuth } from '../../../contexts/AuthContext';

const GoogleAdsManager: React.FC = () => {
    const { user } = useAuth();
    const isLinked = user?.is_google_ads_linked;

    // --- GOOGLE ADS LINKING HOOK ---
    // Moved from Sidebar to here
    const linkGoogleAds = useGoogleLogin({
        flow: 'auth-code',
        ux_mode: 'redirect',
        redirect_uri: 'http://localhost:8080',
        scope: 'https://www.googleapis.com/auth/adwords',
        select_account: true,
    });

    // --- LINKED STATE (Success) ---
    if (isLinked) {
        return (
            <PageLayout className="flex items-center justify-center h-full p-6">
                <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HiCheckCircle size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Google Ads Connected
                    </h1>
                    <p className="text-gray-500 text-lg mb-8">
                        Your account is successfully linked. We are now syncing your campaigns and metrics.
                    </p>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 inline-block text-left w-full max-w-md">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Active Integrations</h3>
                        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <FcGoogle size={24} />
                                <div>
                                    <p className="font-medium text-gray-900">Google Ads</p>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Sync Active
                                    </p>
                                </div>
                            </div>
                            <button className="text-sm text-gray-400 hover:text-gray-600" onClick={() => linkGoogleAds()}>
                                Reconnect
                            </button>
                        </div>
                    </div>
                </div>
            </PageLayout>
        );
    }

    // --- UNLINKED STATE (Sales Page) ---
    return (
        <PageLayout className="flex flex-col items-center justify-center min-h-full p-6">
            <div className="max-w-4xl w-full text-center">

                {/* Hero */}
                <div className="mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                        <FcGoogle size={48} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Supercharge your Campaigns
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Connect your Google Ads account to unlock AI-driven insights, automated labeling, and predictive performance analysis.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                            <HiLightningBolt size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Smart Management</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Visualize your campaign hierarchy and identify optimization opportunities instantly.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center mb-4">
                            <HiTag size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Auto-Labeling</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Automatically tag and categorize trending keywords and campaigns based on performance.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center mb-4">
                            <HiTrendingUp size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Predictive Analysis</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Forecast future performance using our advanced AI models on your historical data.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="flex justify-center">
                    <button
                        onClick={() => linkGoogleAds()}
                        className="group flex items-center gap-3 px-8 py-4 bg-gray-900 text-white text-lg font-bold rounded-xl shadow-xl hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <FcGoogle size={24} />
                        <span>Link Google Ads Account</span>
                        <HiArrowRight className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                </div>

                <p className="mt-6 text-xs text-gray-400">
                    We only request permissions necessary to analyze and report on your campaigns.
                </p>
            </div>
        </PageLayout>
    );
};

export default GoogleAdsManager;