import React, { createContext, useContext, useReducer } from 'react';
import { sampleUser, sampleProducts, sampleSuppliers, sampleNotifications, sampleActivities } from '../data/sampleData';

const initialState = {
  user: null,
  currentPage: 'intro',
  isDarkMode: false,
  products: sampleProducts,
  suppliers: sampleSuppliers,
  notifications: sampleNotifications,
  alerts: [],
  activities: sampleActivities,
  isChatbotOpen: false,
  dailyStreak: 7,
  rewardPoints: 1250,
  isAuthenticated: false
};

const AppContext = createContext(null);

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [{
          id: Date.now().toString(),
          timestamp: Date.now(),
          ...action.payload
        }, ...state.alerts]
      };
    case 'REMOVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== action.payload)
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        )
      };
    case 'TOGGLE_CHATBOT':
      return { ...state, isChatbotOpen: !state.isChatbotOpen };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    case 'ADD_SUPPLIER':
      return { ...state, suppliers: [...state.suppliers, action.payload] };
    case 'UPDATE_SUPPLIER':
      return {
        ...state,
        suppliers: state.suppliers.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_SUPPLIER':
      return {
        ...state,
        suppliers: state.suppliers.filter(s => s.id !== action.payload)
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}