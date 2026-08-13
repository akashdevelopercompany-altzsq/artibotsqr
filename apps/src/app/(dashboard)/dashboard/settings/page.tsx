'use client';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Manage your account and application preferences.</p>
      </div>

      <div className="glass-panel p-8">
        <div className="max-w-2xl space-y-6">
          <h2 className="text-xl font-semibold text-slate-800">Profile Information</h2>
          <p className="text-sm text-slate-500">Update your account's profile information and email address.</p>
          
          <div className="space-y-4 pt-4 border-t border-white/50">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                disabled
                value="user@example.com"
                className="mt-2 block w-full glass-input opacity-70 cursor-not-allowed"
              />
            </div>
            
            <div className="pt-4">
              <button disabled className="glass-button-primary disabled:opacity-50">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-panel p-8 border border-red-500/20">
        <div className="max-w-2xl space-y-6">
          <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
          <p className="text-sm text-slate-500">Once you delete your account, there is no going back. Please be certain.</p>
          
          <div className="pt-4 border-t border-white/50">
            <button disabled className="glass-button-danger disabled:opacity-50">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
