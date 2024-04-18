import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import API from "../../services/api";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContextProvider = ({ children }: React.PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = SecureStore.getItem("access_token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // const { token } = await dummyLogin();
      const {
        data: { token },
      } = await API.post("auth/login", {
        email,
        password,
      });
      SecureStore.setItem("access_token", token);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      console.log("Error while trying to sign in", err);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsAuthenticated(false);
    // remove token
    await SecureStore.deleteItemAsync("access_token");
    await AsyncStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
