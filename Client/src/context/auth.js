import { useState, useEffect, useContext, createContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from "axios";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        userId: "",
        token: "",

    });

    //default axios
    axios.defaults.headers.common["Authorization"] = auth?.token;

    useEffect(() => {
        const fetchAuth = async () => {
            try {
                const data = await AsyncStorage.getItem("auth");
                if (data) {
                    const parseData = JSON.parse(data);
                    setAuth({
                        ...auth,
                        user: parseData.user,
                        userId: parseData.user._id,
                        token: parseData.token,
                    });

                }
                // console.log(auth)
            } catch (error) {
                console.log("Error retrieving auth data:", error);
            }
        };

        fetchAuth();
    }, []);

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
};
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };