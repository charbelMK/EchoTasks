import { createClient } from '@/utils/supabase/server'
import { User, Mail, Shield } from 'lucide-react'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Your account details and preferences.</p>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <Mail className="h-4 w-4 mr-2" /> Email
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <User className="h-4 w-4 mr-2" /> Full Name
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {profile?.full_name || 'Not set'}
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <Shield className="h-4 w-4 mr-2" /> Role
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 uppercase">
                                {profile?.role || 'User'}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Settings</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-4">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Notification Preferences</h4>
                        <p className="text-xs text-gray-500 mb-3">Manage how you receive updates.</p>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="email_updates"
                                    name="email_updates"
                                    type="checkbox"
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    defaultChecked
                                    disabled
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="email_updates" className="font-medium text-gray-700">Email Updates</label>
                                <p className="text-gray-500">Receive emails about project milestones and updates.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Security</h4>
                        <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                            Change Password via Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
