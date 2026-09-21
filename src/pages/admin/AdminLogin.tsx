import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Lock, Mail, KeyRound, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // If Supabase is configured, use official Supabase Auth
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          localStorage.setItem('wsd_admin_authenticated', 'true');
          localStorage.setItem('wsd_admin_email', data.user.email || email);
          navigate('/admin');
          return;
        }
      } catch (err) {
        console.error('Supabase login error:', err);
        setErrorMsg('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ប្រព័ន្ធផ្ទៀងផ្ទាត់');
      }
    } else {
      // Local demo mode for development/preview when Supabase credentials are pending
      if (email === 'admin@watsnaydouch.org' && password === 'temple123') {
        localStorage.setItem('wsd_admin_authenticated', 'true');
        localStorage.setItem('wsd_admin_email', email);
        navigate('/admin');
        return;
      } else if (password.length >= 6) {
        // Allow developer login with email and any 6+ char password in local sandbox
        localStorage.setItem('wsd_admin_authenticated', 'true');
        localStorage.setItem('wsd_admin_email', email);
        navigate('/admin');
        return;
      } else {
        setErrorMsg('សូមបញ្ចូលអ៊ីមែល និងលេខកូដសម្ងាត់យ៉ាងតិច ៦ ខ្ទង់');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ត្រឡប់ទៅគេហទំព័រដើម</span>
        </Link>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-koulen text-2xl text-stone-900 tracking-wide">
            ចូលផ្ទាំងគ្រប់គ្រង (Admin Login)
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-battambang">
            សម្រាប់គណៈកម្មការ និងអ្នកគ្រប់គ្រងទីតាំងផ្លូវការរបស់វត្ត
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 font-battambang">
              អ៊ីមែល (Email)
            </label>
            <div className="relative">
              <input
                id="admin-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@watsnaydouch.org"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 pl-10 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 font-battambang">
              លេខសម្ងាត់ (Password)
            </label>
            <div className="relative">
              <input
                id="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 pl-10 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white py-3 text-sm font-semibold shadow-md transition active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'ចូលប្រព័ន្ធ (Sign In)'}
          </button>
        </form>

        {!isSupabaseConfigured && (
          <div className="mt-6 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed font-battambang">
            <span className="font-semibold block mb-0.5">គណនីគ្រប់គ្រងទូទៅ (Default Admin):</span>
            <p>អ៊ីមែល៖ <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">admin@watsnaydouch.org</code></p>
            <p>លេខសម្ងាត់៖ <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">temple123</code></p>
          </div>
        )}
      </div>
    </div>
  );
};
