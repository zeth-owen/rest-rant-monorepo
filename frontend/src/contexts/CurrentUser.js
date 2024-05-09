import { createContext, useState, useEffect } from "react";

export const CurrentUser = createContext();


function CurrentUserProvider({ children }) {

    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {

        const getLoggedInUser = async () => {
            try {
                let response = await fetch('http://localhost:5000/authentication/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    let user = await response.json();
                    setCurrentUser(user);
                } else {
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error('Error fetching logged-in user:', error);
                setCurrentUser(null);
            }
        };
        getLoggedInUser();
    }, []);

    return (
        <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </CurrentUser.Provider>
    );
}

export default CurrentUserProvider;

