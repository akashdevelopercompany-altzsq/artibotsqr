'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditQRPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qr, setQr] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState('');
  
  // Basic info state
  const [name, setName] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  
  // Design state
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [margin, setMargin] = useState(4);

  useEffect(() => {
    async function loadQR() {
      try {
        const res = await fetchApi(`/qr/${id}`);
        setQr(res.data);
        setName(res.data.name || '');
        setDestinationUrl(res.data.destinationUrl || '');
        if (res.data.design) {
          setForegroundColor(res.data.design.foregroundColor || '#000000');
          setBackgroundColor(res.data.design.backgroundColor || '#ffffff');
          setMargin(res.data.design.margin || 4);
        }
        await updatePreview(res.data.id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadQR();
  }, [id]);

  const updatePreview = async (qrId: string) => {
    try {
      const imgRes = await fetchApi(`/qr/${qrId}/image?format=png`);
      setPreviewImage(imgRes.data.image);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save basic info
      await fetchApi(`/qr/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name, destinationUrl }),
      });
      
      // Update preview to reflect theoretical changes
      await updatePreview(id as string);
      
      // Optionally notify success here (we will just rely on the button text resetting for now)
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!qr) return <div>QR not found</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/qrs" className="rounded-full bg-white/40 p-2 shadow-sm border border-white/50 hover:bg-white/60 transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-500" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Customize QR: {qr.name}</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="glass-button-primary disabled:opacity-70 disabled:hover:-translate-y-0"
        >
          {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
          {saving ? 'Saving...' : 'Save Design'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Editor Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Basic Information</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700">QR Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 block w-full glass-input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Destination URL</label>
                <input
                  type="url"
                  required
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className="mt-2 block w-full glass-input"
                />
                <p className="mt-3 text-xs font-medium text-slate-500">
                  Changing this URL will instantly redirect all future scans to the new destination.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Styling Options</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Foreground Color</label>
                  <div className="mt-2 flex items-center space-x-3">
                    <input
                      type="color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="h-12 w-12 cursor-pointer rounded-xl border border-white/50 bg-white/40 p-1 shadow-inner"
                    />
                    <input
                      type="text"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="block w-full glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">Background Color</label>
                  <div className="mt-2 flex items-center space-x-3">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="h-12 w-12 cursor-pointer rounded-xl border border-white/50 bg-white/40 p-1 shadow-inner"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="block w-full glass-input"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Margin</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value))}
                  className="mt-4 w-full accent-blue-500"
                />
                <div className="mt-2 flex justify-between text-xs font-medium text-slate-500">
                  <span>No margin</span>
                  <span>{margin} modules</span>
                  <span>Large margin</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 glass-panel p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Live Preview</h3>
            
            <div className="flex justify-center rounded-2xl border border-white/50 bg-white/40 p-6 shadow-inner">
              {previewImage ? (
                <div className="relative">
                  {saving && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/50 backdrop-blur-sm">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  )}
                  {/* Note: In a real app we'd regenerate the image on the client instantly for live preview, but for this MVP we rely on the server snapshot. */}
                  <img src={previewImage} alt="QR Preview" className="h-56 w-56 rounded-xl shadow-sm border border-white/50" />
                </div>
              ) : (
                <div className="h-56 w-56 animate-pulse rounded-xl bg-white/50"></div>
              )}
            </div>

            <div className="mt-8 flex justify-center space-x-3">
              <a
                href={previewImage}
                download={`qr-${qr.shortCode}.png`}
                className="w-full glass-button-secondary text-center"
              >
                Download PNG
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
