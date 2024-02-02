interface AuthContextProps {
    isAuthenticated: boolean;
    email: string;
    token: string;
    refreshToken: string;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    invalidCredentials: boolean;
    loading: boolean;
}

interface Admin {
    email: string;
    token: string;
    localId: string;
    refreshToken: string;
}

interface SignInWithEmailFormData {
    email: string;
    password: string;
}