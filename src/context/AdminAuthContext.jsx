import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
    const [adminLoggedIn, setAdminLoggedIn] = useState(false);
    const [adminLoading, setAdminLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const bootstrap = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!mounted) return;

                if (!session?.user) {
                    setAdminLoggedIn(false);
                    setAdminLoading(false);
                    return;
                }

                const isAdmin = await checkIsAdmin(session.user.id);
                if (!mounted) return;

                setAdminLoggedIn(isAdmin);
            } catch {
                if (mounted) setAdminLoggedIn(false);
            } finally {
                if (mounted) setAdminLoading(false);
            }
        };

        bootstrap();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;

            if (!session?.user) {
                setAdminLoggedIn(false);
                setAdminLoading(false);
                return;
            }

            const isAdmin = await checkIsAdmin(session.user.id);
            if (!mounted) return;
            setAdminLoggedIn(isAdmin);
            setAdminLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const checkIsAdmin = async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (error || !data) return false;
        return data.role === 'admin';
    };

    const adminLogin = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) {
                return { success: false, error: 'Credenciales incorrectas.' };
            }

            const userId = data?.user?.id;
            if (!userId) {
                return { success: false, error: 'No se pudo iniciar sesión.' };
            }

            const isAdmin = await checkIsAdmin(userId);
            if (!isAdmin) {
                await supabase.auth.signOut();
                setAdminLoggedIn(false);
                return { success: false, error: 'Acceso denegado: tu usuario no es administrador.' };
            }

            setAdminLoggedIn(true);
            return { success: true };
        } catch {
            return { success: false, error: 'No se pudo iniciar sesión.' };
        }
    };

    const adminLogout = async () => {
        await supabase.auth.signOut();
        setAdminLoggedIn(false);
    };

    return (
        <AdminAuthContext.Provider value={{ adminLoggedIn, adminLoading, adminLogin, adminLogout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    return useContext(AdminAuthContext);
}
