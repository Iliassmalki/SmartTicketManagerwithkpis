// context/AuthContext.js → VERSION 100% FONCTIONNELLE (copie-colle ça)

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // important au démarrage

  useEffect(() => {
    loadStorageData();
  }, []);
const isUserLoggedIn = !!user;
  const loadStorageData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.log('Erreur chargement auth');
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://192.168.1.104:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Identifiants incorrects' };
      }

      const { token, user: userInfo } = data;

      // SAUVEGARDE + UPDATE DU STATE (C’EST ÇA QUI MANQUAIT)
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userInfo));
      setUser(userInfo); // CETTE LIGNE EST CRITIQUE

      return { success: true };

    } catch (error) {
      return { success: false, message: 'Pas de connexion au serveur' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userData']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginUser, logout, setUser, isUserLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);