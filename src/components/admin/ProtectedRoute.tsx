import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checking, setChecking] = useState(isSupabaseConfigured);
  const [authorized, setAuthorized] = useState<boolean>(() => {
    return localStorage.getItem('wsd_admin_authenticated') === 'true';
  });
  const location = useLocation();

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setChecking(false);
      return;
    }

    const client = supabase;
    let isMounted = true;

    // Check live Supabase Auth session
    client.auth.getSession().then(({ data: { session }, error }) => {
      if (!isMounted) return;
      if (error || !session) {
        localStorage.removeItem('wsd_admin_authenticated');
        localStorage.removeItem('wsd_admin_email');
        setAuthorized(false);
      } else {
        localStorage.setItem('wsd_admin_authenticated', 'true');
        localStorage.setItem('wsd_admin_email', session.user.email || 'admin@watsnaydouch.org');
        setAuthorized(true);
      }
      setChecking(false);
    });

    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session) {
        localStorage.setItem('wsd_admin_authenticated', 'true');
        localStorage.setItem('wsd_admin_email', session.user.email || 'admin@watsnaydouch.org');
        setAuthorized(true);
      } else {
        localStorage.removeItem('wsd_admin_authenticated');
        localStorage.removeItem('wsd_admin_email');
        setAuthorized(false);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-stone-500">
        <Loader2 className="w-8 h-8 animate-spin text-amber-700 mb-3" />
        <p className="text-sm font-battambang">កំពុងផ្ទៀងផ្ទាត់សិទ្ធិអ្នកគ្រប់គ្រង...</p>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

