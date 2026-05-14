'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    const success = await login(email, password);
    if (!success) {
      alert('Acesso negado');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Start Waterfall animation logic
    const container = document.getElementById('login-food-waterfall');
    if (!container) return;

    const shapes = ["circle", "square", "triangle", "diamond", "line"];
    const colors = ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.04)", "rgba(255,255,255,0.05)"];
    
    const interval = setInterval(() => {
      const type = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 18 + 8;
      const el = document.createElement("div");
      
      el.className = "food-emoji";
      el.style.left = Math.random() * 100 + "vw";
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.background = color;
      
      if (type === "circle") el.style.borderRadius = "50%";
      else if (type === "diamond") { el.style.transform = "rotate(45deg)"; el.style.borderRadius = "3px"; }
      else if (type === "line") { el.style.height = "2px"; el.style.width = (Math.random()*30+20)+"px"; el.style.borderRadius = "1px"; }
      else if (type === "triangle") { 
        el.style.background="transparent"; 
        el.style.width="0"; 
        el.style.height="0"; 
        el.style.borderLeft=(size/2)+"px solid transparent"; 
        el.style.borderRight=(size/2)+"px solid transparent"; 
        el.style.borderBottom=size+"px solid "+color; 
      }
      else el.style.borderRadius = "3px";
      
      const duration = Math.random() * 6 + 6;
      el.style.animationDuration = duration + "s";
      container.appendChild(el);
      
      setTimeout(() => el.remove(), duration * 1000);
    }, 350);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="s-login">
      <div id="login-food-waterfall"></div>
      <div className="login-beam"></div>

      <div className="login-card">
        <div className="login-title hl">Flüxa Kitchens</div>

        <div className="login-field-wrap" style={{ marginTop: '24px' }}>
          <label className="login-label">EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-field"
            placeholder="usuario@dominio"
          />
        </div>
        <div className="login-field-wrap">
          <label className="login-label">SENHA</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-field"
            placeholder="••••••••••••"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <button className="btn-login" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'ENTRANDO...' : 'ENTRAR'} <span className="ms">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
