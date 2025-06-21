import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: { email: string } | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simple sign in function that checks hardcoded credentials
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', email);
      
      // Simple hardcoded check
      if (email === 'savienglish@gmail.com' && password === 'savi123') {
        console.log('Sign in successful');
        
        // Set user and admin status
        const userData = { email };
        setUser(userData);
        setIsAdmin(true);
        
        // Store in local storage
        localStorage.setItem('savi_user', JSON.stringify(userData));
        localStorage.setItem('savi_admin', 'true');
        
        return { error: null };
      } else {
        console.error('Sign in failed: Invalid credentials');
        return { error: { message: 'Invalid email or password' } };
      }
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      return { error: err as any };
    }
  };

  const signOut = async () => {
    // Clear user state
    setUser(null);
    setIsAdmin(false);
    
    // Clear local storage
    localStorage.removeItem('savi_user');
    localStorage.removeItem('savi_admin');
  };

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check local storage for user data
        const storedUser = localStorage.getItem('savi_user');
        const storedAdmin = localStorage.getItem('savi_admin');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAdmin(storedAdmin === 'true');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 