// import { useAuth } from "@/context/authContext";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

// const withAuth = (WrappedComponent) => {
// 	return (props) => {
// 		const { isAuthenticated, logout } = useAuth();
// 		const [authenticated, setAuthenticated] = useState(isAuthenticated);
// 		const router = useRouter();

// 		useEffect(() => {
// 			if (!isAuthenticated) {
// 				const admin = Cookies.get("admin");
// 				const auth = getAuth();
// 				onAuthStateChanged(auth, async (user) => {
// 					console.log("user", user)
// 					if (user) {
// 						setAuthenticated(true);
// 						const token = await user.getIdToken(true);
// 						if (admin) {
// 							const adminDetails = JSON.parse(admin);
// 							adminDetails.token = token;
// 							Cookies.set("admin", JSON.stringify(adminDetails));
// 						} else {
// 							Cookies.set("admin", JSON.stringify({
// 								email: user.email,
// 								localId: user.uid,
// 								refreshToken: user.refreshToken,
// 								token,
// 							}));
// 						}
// 					} else {
// 						setAuthenticated(false);
// 						router.push("/");
// 					}
// 				});
// 			}
// 		}, [isAuthenticated, router]);

// 		if (!authenticated) {
// 			return (
// 				<div className="flex justify-center items-center h-screen w-full">
// 					<div className='custom-loader-prime-main'></div>
// 				</div>
// 			)
// 		}

// 		return (
// 			<WrappedComponent {...props} />
// 		);
// 	};
// };

// export default withAuth;

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getAuth, User, onAuthStateChanged } from "firebase/auth";
import { ChildrenProps } from "@/types/common";


const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return (props: ChildrenProps) => {
    const { isAuthenticated, logout } = useAuth();
    const [authenticated, setAuthenticated] = useState(isAuthenticated);
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        const admin = Cookies.get("admin");
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
          console.log("user", user);
          if (user) {
            setAuthenticated(true);
            const token = await user.getIdToken(true);
            if (admin) {
              const adminDetails = JSON.parse(admin);
              adminDetails.token = token;
              Cookies.set("admin", JSON.stringify(adminDetails));
            } else {
              Cookies.set("admin", JSON.stringify({
                email: user.email,
                localId: user.uid,
                refreshToken: user.refreshToken,
                token,
              }));
            }
          } else {
            setAuthenticated(false);
            router.push("/");
          }
        });

        // Cleanup the subscription on component unmount
        return () => unsubscribe();
      }
    }, [isAuthenticated, router]);

    if (!authenticated) {
      return (
        <div className="flex justify-center items-center h-screen w-full">
          <div className='custom-loader-prime-main'></div>
        </div>
      );
    }

    return (
      <WrappedComponent {...props} />
    );
  };
};

export default withAuth;
