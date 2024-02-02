import { createContext, useState, useContext} from 'react';
import { useRouter } from 'next/router';
import useLogin from '@/utils/useLogin';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { auth } from '@/utils/firebase';
import { signOut } from 'firebase/auth';
import { ChildrenProps } from '@/types/common';



const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: false,
    email: '',
    token: '',
    refreshToken: '',
    login: async (email, password) => { },
    logout: () => { },
    invalidCredentials: false,
    loading: false,
});

export const AuthProvider: React.FC<ChildrenProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [invalidCredentials, setInvalidCredentials] = useState(false);
    const [loading, setLoading] = useState(false);

    const mutation = useLogin({
        setIsAuthenticated,
        setEmail,
        setToken,
        setRefreshToken,
        setInvalidCredentials,
    });

    const router = useRouter();

    const login = async (email: string, password: string) => {
        try {
            setInvalidCredentials(false);
            setLoading(true);
            await (mutation.mutateAsync as unknown as (data: { email: string; password: string; returnSecureToken: boolean }) => Promise<void>)({ email, password, returnSecureToken: true });
            toast.success('Login Successful');
            router.push('/dashboard');
        } catch (error) {
            console.log(error);
            toast.error(String(error) || 'Login Failed');
        }
    };

    const logout = () => {
        signOut(auth).then(() => {
            setIsAuthenticated(false);
            setEmail('');
            setToken('');
            setRefreshToken('');
            setLoading(false);
            Cookies.remove('admin');
            router.push('/');
            console.log('Successfully logged out');
        }).catch((error) => {
            console.log('An error occurred', error);
        });
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                email,
                token,
                refreshToken,
                invalidCredentials,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
