import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { api, ApiError } from '../services/api';
import type { LoginResponse } from '../types/api';

interface LoginProps {
  onLogin: (rol: 'coordinador' | 'estudiante', user?: LoginResponse['user']) => void;
}

function PathwayIllustration() {
  const stages = ['Postulación', 'Revisión', 'Aprobación', 'Práctica', 'Evaluación'];
  return (
    <div className="relative mt-10 mb-8">
      <div className="flex items-center gap-0">
        {stages.map((stage, i) => (
          <div key={stage} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative z-10">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-semibold"
                style={{
                  backgroundColor: i < 3 ? '#0F9F92' : i === 3 ? 'rgba(15,159,146,0.3)' : 'rgba(255,255,255,0.1)',
                  borderColor: i < 3 ? '#0F9F92' : i === 3 ? '#0F9F92' : 'rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                }}
              >
                {i < 3 ? '✓' : i + 1}
              </div>
              <div className="mt-2 text-center" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, width: 68 }}>
                {stage}
              </div>
            </div>
            {i < stages.length - 1 && (
              <div
                className="flex-1 h-0.5 -mt-5"
                style={{
                  backgroundColor: i < 2 ? '#0F9F92' : 'rgba(255,255,255,0.15)',
                  backgroundImage: i === 2 ? 'linear-gradient(90deg, #0F9F92 40%, rgba(255,255,255,0.15) 100%)' : undefined,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        correo: email,
        password,
      });

      // After auto-unwrap in api.ts, response = { token, user }
      localStorage.setItem('smcpp_token', response.token);
      localStorage.setItem('smcpp_user', JSON.stringify(response.user));

      const appRol: 'coordinador' | 'estudiante' =
        response.user.rol === 'COORDINADOR' || response.user.rol === 'ADMINISTRADOR'
          ? 'coordinador'
          : 'estudiante';

      localStorage.setItem('smcpp_rol', appRol);
      onLogin(appRol, response.user);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        // Show backend message directly
        setError(err.message || 'Credenciales incorrectas.');
      } else {
        // Unexpected network / TypeError — log for debugging
        console.error('[Login] Error inesperado al conectar con el backend:', err);
        setError('Error al conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="flex h-screen" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden"
        style={{ backgroundColor: '#152A43', width: '42%' }}
      >
        {/* Background pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <circle cx="6" cy="16" r="4" fill="#0F9F92" />
              <circle cx="16" cy="8" r="4" fill="#0F9F92" fillOpacity="0.7" />
              <circle cx="26" cy="16" r="4" fill="#0F9F92" />
              <line x1="10" y1="16" x2="14" y2="10" stroke="#0F9F92" strokeWidth="1.5" strokeOpacity="0.5" />
              <line x1="18" y1="10" x2="22" y2="14" stroke="#0F9F92" strokeWidth="1.5" strokeOpacity="0.5" />
              <polyline points="22,18 26,22 30,14" stroke="#0F9F92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <div>
              <div className="text-white font-bold text-lg">SMCPP</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Prácticas preprofesionales</div>
            </div>
          </div>

          <h1 className="text-3xl font-semibold text-white leading-snug mb-4">
            Cada práctica,<br />claramente acompañada.
          </h1>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.60)', lineHeight: 1.6 }}>
            Centraliza postulaciones, documentos, horas y evaluaciones en una sola trayectoria.
          </p>

          <PathwayIllustration />

          {/* Metrics */}
          <div className="flex gap-6 mt-2">
            {[['128', 'estudiantes en seguimiento'], ['24', 'convenios activos']].map(([n, l]) => (
              <div key={l} className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
                <div className="text-2xl font-bold text-white">{n}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.50)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>
          Universidad Nacional del Altiplano · Puno, Perú
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-1" style={{ color: '#172033' }}>Bienvenido al SMCPP</h2>
            <p className="text-sm" style={{ color: '#5F6B7A' }}>Ingresa con tus credenciales institucionales.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg border text-sm" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#C43D4D' }}>
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#172033' }}>
                Correo institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="coordinador@unap.edu.pe"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition-colors focus:border-blue-500"
                style={{ borderColor: '#DCE3EA', color: '#172033' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#172033' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition-colors focus:border-blue-500 pr-10"
                  style={{ borderColor: '#DCE3EA', color: '#172033' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#5F6B7A' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#2563EB' }}
                />
                <span className="text-sm" style={{ color: '#5F6B7A' }}>Mantener mi sesión iniciada</span>
              </label>
              <button type="button" className="text-sm font-medium" style={{ color: '#2563EB' }}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{ backgroundColor: '#2563EB', color: '#FFFFFF', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Verificando con backend…' : 'Ingresar al sistema'}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl text-xs space-y-1.5" style={{ backgroundColor: '#F4F7FA', color: '#5F6B7A' }}>
            <strong style={{ color: '#172033' }}>Credenciales backend activas:</strong>
            <div><span className="font-semibold text-gray-800">Coordinador:</span> coordinador@unap.edu.pe / Coordinador123*</div>
            <div><span className="font-semibold text-gray-800">Estudiante:</span> ana.torres@unap.edu.pe / Estudiante123*</div>
          </div>

          <p className="mt-6 text-center text-xs" style={{ color: '#5F6B7A' }}>
            ¿Problemas para ingresar? Comunícate con la Oficina de Prácticas.
          </p>
        </div>
      </div>
    </div>
  );
}
