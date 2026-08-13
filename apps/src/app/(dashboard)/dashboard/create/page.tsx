'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { CheckCircle2, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function CreateQRWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    destinationUrl: '',
    type: 'WEBSITE'
  });

  const [createdQr, setCreatedQr] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchApi('/qr', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setCreatedQr(res.data);
      
      // Fetch preview
      const imgRes = await fetchApi(`/qr/${res.data.id}/image?format=png`);
      setPreviewImage(imgRes.data.image);
      
      setStep(4); // Success step
    } catch (err: any) {
      setError(err.message || 'Failed to create QR code');
      if (err.message === 'Unauthorized' || err.message?.includes('Unauthorized')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Create Dynamic QR</h1>
        <p className="text-slate-500 font-medium">Step {step} of 3</p>
      </div>

      <div className="glass-panel">
        <div className="p-8">
          {error && <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-sm font-medium text-red-600 border border-red-500/20">{error}</div>}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800">Choose QR Type</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {['WEBSITE', 'PRODUCT', 'PAYMENT', 'CUSTOM', 'CAMPAIGN', 'UPI'].map((type) => (
                  <div
                    key={type}
                    onClick={() => setFormData({ ...formData, type })}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                      formData.type === type
                        ? 'border-blue-400 bg-blue-500/10 shadow-inner'
                        : 'border-white/50 bg-white/40 hover:bg-white/60 hover:border-white/80 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">{type}</span>
                      {formData.type === type && <CheckCircle2 className="h-6 w-6 text-blue-600" />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNext}
                  className="glass-button-primary"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800">Configure Destination</h2>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700">Internal Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Summer Campaign 2026"
                  className="mt-2 block w-full glass-input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Destination URL</label>
                <input
                  type="url"
                  required
                  value={formData.destinationUrl}
                  onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                  placeholder="https://example.com/promotion"
                  className="mt-2 block w-full glass-input"
                />
                <p className="mt-3 text-xs font-medium text-slate-500">
                  You can change this URL later without the QR code changing.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={handleBack}
                  className="glass-button-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.name || !formData.destinationUrl}
                  className="glass-button-primary disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-[0_4px_14px_0_rgba(90,148,232,0.39)]"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800">Review & Create</h2>
              
              <div className="rounded-2xl bg-white/40 p-6 shadow-inner border border-white/50">
                <dl className="divide-y divide-white/50">
                  <div className="flex justify-between py-4 text-sm">
                    <dt className="text-slate-500 font-semibold">Name</dt>
                    <dd className="font-bold text-slate-800">{formData.name}</dd>
                  </div>
                  <div className="flex justify-between py-4 text-sm">
                    <dt className="text-slate-500 font-semibold">Type</dt>
                    <dd className="font-bold text-slate-800">{formData.type}</dd>
                  </div>
                  <div className="flex justify-between py-4 text-sm">
                    <dt className="text-slate-500 font-semibold">Destination</dt>
                    <dd className="font-bold text-slate-800 max-w-[60%] truncate text-right">{formData.destinationUrl}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={handleBack}
                  className="glass-button-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="glass-button-primary disabled:opacity-50 disabled:hover:-translate-y-0"
                >
                  {loading ? 'Creating...' : 'Generate Dynamic QR'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && createdQr && (
            <div className="text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 shadow-inner border border-green-500/20">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">QR Code Created!</h2>
              <p className="text-slate-500 font-medium text-lg">Your dynamic QR code is ready to be shared.</p>
              
              <div className="mx-auto mt-8 flex justify-center">
                {previewImage ? (
                  <img src={previewImage} alt="QR Code" className="h-64 w-64 rounded-2xl bg-white/80 p-4 shadow-lg border border-white/50 backdrop-blur-sm" />
                ) : (
                  <div className="flex h-64 w-64 items-center justify-center rounded-2xl border border-white/50 bg-white/40 shadow-inner backdrop-blur-sm">
                    <QrCode className="h-16 w-16 animate-pulse text-slate-300" />
                  </div>
                )}
              </div>

              <div className="mt-10 flex justify-center space-x-6">
                <Link
                  href={`/dashboard/edit/${createdQr.id}`}
                  className="glass-button-secondary"
                >
                  Customize Design
                </Link>
                <Link
                  href="/dashboard"
                  className="glass-button-primary"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
