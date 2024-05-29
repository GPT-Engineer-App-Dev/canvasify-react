import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

// EXAMPLE TYPES SECTION
// DO NOT USE TYPESCRIPT AND SHOULD ALWAYS BE

Foo // table: foos
    id: number
    title: string

Bar // table: bars
    id: number
    foo_id: number // foreign key to Foo
	
*/

// Example hook for models

export const useFoo = ()=> useQuery({
    queryKey: ['foo'],
    queryFn: fromSupabase(supabase.from('foo')),
})
export const useAddFoo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newFoo)=> fromSupabase(supabase.from('foo').insert([{ title: newFoo.title }])),
        onSuccess: ()=> {
            queryClient.invalidateQueries('foo');
        },
    });
};

export const useBar = ()=> useQuery({
    queryKey: ['bar'],
    queryFn: fromSupabase(supabase.from('bar')),
})
export const useAddBar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newBar)=> fromSupabase(supabase.from('bar').insert([{ foo_id: newBar.foo_id }])),
        onSuccess: ()=> {
            queryClient.invalidateQueries('bar');
        },
    });
};


// Example code for authentication context and hook

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    return useContext(AuthContext);
};

function useProvideAuth() {
    const [user, setUser] = useState(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        const user = supabase.auth.user();
        setUser(user);

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            queryClient.invalidateQueries('user');
        });

        return () => {
            authListener.unsubscribe();
        };
    }, []);

    const login = async ({ email, password }) => {
        const { error, user } = await supabase.auth.signIn({ email, password });
        if (error) throw new Error(error.message);
        setUser(user);
        queryClient.invalidateQueries('user');
        return user;
    };

    const register = async ({ email, password }) => {
        const { error, user } = await supabase.auth.signUp({ email, password });
        if (error) throw new Error(error.message);
        setUser(user);
        queryClient.invalidateQueries('user');
        return user;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
        setUser(null);
        queryClient.invalidateQueries('user');
    };

    return {
        user,
        login,
        register,
        logout,
    };
}
