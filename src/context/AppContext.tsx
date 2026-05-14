'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AppContextType {
  user: any;
  company: any;
  role: string;
  isAdmin: boolean;
  orders: any[];
  menuItems: any[];
  categories: any[];
  tables: any[];
  staffList: any[];
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [role, setRole] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('quiosque_session_v2');
    if (saved) {
      try {
        const session = JSON.parse(saved);
        setUser(session.user || session.staff);
        setCompany(session.company);
        setRole(session.role);
        setIsAdmin(!!session.isAdmin);
      } catch (e) {
        console.error('Failed to parse session', e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (company && company.id) {
      refreshData();
      
      // Start Realtime
      const channel = supabase
        .channel(`company_${company.id}_events`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'food_orders', filter: `company_id=eq.${company.id}` },
          () => refreshOrders()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [company]);

  const refreshOrders = async () => {
    if (!company) return;
    const { data } = await supabase
      .from('food_orders')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const refreshData = async () => {
    if (!company) return;
    
    const [ordersRes, menuRes, catRes, tableRes, staffRes] = await Promise.all([
      supabase.from('food_orders').select('*').eq('company_id', company.id).order('created_at', { ascending: false }),
      supabase.from('food_menu_items').select('*').eq('company_id', company.id).order('display_order'),
      supabase.from('food_categories').select('*').eq('company_id', company.id).order('display_order'),
      supabase.from('food_tables').select('*').eq('company_id', company.id).order('number'),
      supabase.from('food_users').select('*').eq('company_id', company.id)
    ]);

    if (ordersRes.data) setOrders(ordersRes.data);
    if (menuRes.data) setMenuItems(menuRes.data);
    if (catRes.data) setCategories(catRes.data);
    if (tableRes.data) setTables(tableRes.data);
    if (staffRes.data) setStaffList(staffRes.data);
  };

  const login = async (email: string, pass: string) => {
    // Admin login
    const { data: adminUser } = await supabase.from('fluxa_kitchens_admin').select('*').eq('email', email).single();
    if (adminUser && adminUser.password === pass) {
      const session = { user: adminUser, company: { name: 'Flüxa Admin', is_admin: true }, role: 'admin', isAdmin: true };
      localStorage.setItem('quiosque_session_v2', JSON.stringify(session));
      setUser(adminUser);
      setCompany(session.company);
      setRole('admin');
      setIsAdmin(true);
      return true;
    }

    // Normal login
    const { data: userData, error } = await supabase
      .from('food_users')
      .select('*, company:food_companies(*)')
      .eq('email', email)
      .single();

    if (!error && userData && userData.password === pass) {
      const session = { user: userData, company: userData.company, role: userData.role };
      localStorage.setItem('quiosque_session_v2', JSON.stringify(session));
      setUser(userData);
      setCompany(userData.company);
      setRole(userData.role);
      setIsAdmin(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('quiosque_session_v2');
    setUser(null);
    setCompany(null);
    setRole('');
    setIsAdmin(false);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        company,
        role,
        isAdmin,
        orders,
        menuItems,
        categories,
        tables,
        staffList,
        isLoading,
        login,
        logout,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
