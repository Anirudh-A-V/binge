// import { useMutation } from 'react-query';
// import Cookies from 'js-cookie';
// import { auth } from "./firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";

// const signInWithEmail = async (formData) => {
//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
//         const user = userCredential.user;

//         // @ts-ignore
//         console.log("user", user.accessToken);
//         const admin = {
//             email: user.email,
//             // @ts-ignore
//             token: user.accessToken,
//             localId: user.uid,
//             refreshToken: user.refreshToken,
//         }

//         Cookies.set('admin', JSON.stringify(admin));

//         return admin;
//     } catch (error) {
//         const errorMessage = error?.message;
//         console.log("error message", errorMessage);
//         throw error; // Rethrow the error to be caught by the caller
//     }
// }

// const useLogin = ({
//     setIsAuthenticated,
//     setEmail,
//     setToken,
//     setRefreshToken,
//     setInvalidCredentials
// }) => {
//     return useMutation((formData) => signInWithEmail(formData), {
//         onSuccess: (data) => {
//             setIsAuthenticated(true);
//             setEmail(data.email);
//             setToken(data.accessToken);
//             setRefreshToken(data.refreshToken);
//         },
//         onError: () => {
//             setInvalidCredentials(true);
//         },
//     });
// };

// export default useLogin;

import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import Cookies from 'js-cookie';
import { auth } from './firebase';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

const signInWithEmail = async (formData: SignInWithEmailFormData): Promise<Admin> => {
    try {
        const userCredential: UserCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        const admin: Admin = {
            email: user.email || "",
            // @ts-ignore
            token: user.accessToken,
            localId: user.uid,
            refreshToken: user.refreshToken,
        };

        Cookies.set('admin', JSON.stringify(admin));

        return admin;
    } catch (error: any) {
        const errorMessage = error?.message;
        console.log('error message', errorMessage);
        throw error; // Rethrow the error to be caught by the caller
    }
};

const useLogin = ({
    setIsAuthenticated,
    setEmail,
    setToken,
    setRefreshToken,
    setInvalidCredentials,
}: {
    setIsAuthenticated: (value: boolean) => void;
    setEmail: (value: string) => void;
    setToken: (value: string) => void;
    setRefreshToken: (value: string) => void;
    setInvalidCredentials: (value: boolean) => void;
}): UseMutationResult<Admin, Error, SignInWithEmailFormData> => {
    const queryClient = useQueryClient();

    return useMutation<Admin, Error, SignInWithEmailFormData>((formData) => signInWithEmail(formData), {
        onSuccess: (data) => {
            setIsAuthenticated(true);
            setEmail(data.email);
            setToken(data.token);
            setRefreshToken(data.refreshToken);
            queryClient.invalidateQueries('someQueryKey'); // Invalidate relevant queries after successful login
        },
        onError: () => {
            setInvalidCredentials(true);
        },
    });
};

export default useLogin;
