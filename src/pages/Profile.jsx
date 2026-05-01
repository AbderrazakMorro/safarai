import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Editable fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }
      setUser(user);

      const meta = user.user_metadata || {};
      setFirstName(meta.first_name || '');
      setLastName(meta.last_name || '');
      setPhone(meta.phone || '');
      setBio(meta.bio || '');
      setAvatarUrl(meta.avatar_url || '');
      setAvatarPreview(meta.avatar_url || '');
      setLoading(false);
    };
    load();
  }, [navigate]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    setAvatarPreview(URL.createObjectURL(file));

    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });

      if (uploadErr) {
        // If bucket doesn't exist, fall back to base64 data URL
        console.warn('Storage upload failed, using data URL fallback:', uploadErr.message);
        const reader = new FileReader();
        reader.onload = (ev) => {
          setAvatarUrl(ev.target.result);
          setAvatarPreview(ev.target.result);
        };
        reader.readAsDataURL(file);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      setAvatarUrl(publicUrl);
      setAvatarPreview(publicUrl);
    } catch (err) {
      console.error('Avatar upload error:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // 1. Update Supabase Auth metadata
      const { error: authErr } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          phone,
          bio,
          avatar_url: avatarUrl
        }
      });
      if (authErr) throw authErr;

      // 2. Sync to public.users table (best-effort)
      await supabase.from('users').update({
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const memberSince = user ? new Date(user.created_at).getFullYear() : '';
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">

      {/* Profile Header Banner */}
      <section className="relative bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 rounded-2xl p-8 md:p-12 mb-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-900/20 rounded-full -ml-12 -mb-12 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-4 border-white/40 shadow-xl overflow-hidden bg-white/20 flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white/80">{initials}</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-9 h-9 bg-white text-teal-700 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-lg">photo_camera</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-headline">
              {firstName} {lastName}
            </h1>
            <p className="text-white/70 text-sm mt-1">{user?.email}</p>
            <span className="inline-block mt-3 px-4 py-1 bg-white/15 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20">
              Member since {memberSince}
            </span>
          </div>
        </div>
      </section>

      {/* Alerts */}
      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">check_circle</span>{success}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">error</span>{error}
        </div>
      )}

      {/* Form */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm p-8 md:p-10 space-y-8">
        <h2 className="text-xl font-bold text-on-surface font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">First Name</label>
            <input
              type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/20 focus:outline-none text-on-surface placeholder:text-stone-400 transition-all"
              placeholder="Your first name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Last Name</label>
            <input
              type="text" value={lastName} onChange={e => setLastName(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/20 focus:outline-none text-on-surface placeholder:text-stone-400 transition-all"
              placeholder="Your last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Email Address</label>
          <input
            type="email" value={user?.email || ''} readOnly
            className="w-full px-5 py-3.5 rounded-xl bg-stone-100 border border-outline-variant/10 text-stone-400 cursor-not-allowed"
          />
          <p className="text-[11px] text-stone-400 ml-1">Email cannot be changed from here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Phone Number</label>
            <input
              type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/20 focus:outline-none text-on-surface placeholder:text-stone-400 transition-all"
              placeholder="+212 600 000 000"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Bio</label>
            <input
              type="text" value={bio} onChange={e => setBio(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/20 focus:outline-none text-on-surface placeholder:text-stone-400 transition-all"
              placeholder="Travel enthusiast 🌍"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3.5 bg-gradient-to-r from-teal-700 to-teal-600 text-white font-bold rounded-full shadow-lg shadow-teal-900/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <><span className="material-symbols-outlined text-lg animate-spin">progress_activity</span> Saving...</>
            ) : (
              <><span className="material-symbols-outlined text-lg">save</span> Save Changes</>
            )}
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="mt-8 bg-surface-container-lowest rounded-2xl border border-red-200/30 p-8 md:p-10">
        <h2 className="text-lg font-bold text-red-600 font-headline flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined">warning</span>
          Danger Zone
        </h2>
        <p className="text-sm text-stone-500 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button className="px-6 py-2.5 text-sm font-bold text-red-600 border border-red-300 rounded-full hover:bg-red-50 transition-colors">
          Delete Account
        </button>
      </section>
    </div>
  );
}
