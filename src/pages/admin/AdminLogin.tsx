import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Lock, Mail, KeyRound, ArrowLeft, ShieldAlert } from 'lucide-react';

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
      if (email === 'admin@watsnaydouch.org' && password === 'temple123') {
        localStorage.setItem('wsd_admin_authenticated', 'true');
        localStorage.setItem('wsd_admin_email', email);
        navigate('/admin');
        return;
      } else if (password.length >= 6) {
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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 font-battambang">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ត្រឡប់ក្រោយ</span>
        </Link>

        <div className="text-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center mx-auto mb-3 border border-gray-200">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-koulen text-2xl text-gray-800 tracking-wide">
            ចូលផ្ទាំងគ្រប់គ្រង
          </h1>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 font-battambang">
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
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 pl-10 text-sm focus:border-gray-500 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 font-battambang">
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
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 pl-10 text-sm focus:border-gray-500 focus:outline-none"
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-gray-600 hover:bg-gray-700 active:scale-98 text-white py-2.5 text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 min-h-[42px]"
          >
            {loading ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'ចូលប្រព័ន្ធ'}
          </button>
        </form>

        {!isSupabaseConfigured && (
          <div className="mt-6 p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-500 font-battambang">
            <span>គណនីគំរូ៖ admin@watsnaydouch.org / temple123</span>
          </div>
        )}
      </div>
    </div>
  );
};
