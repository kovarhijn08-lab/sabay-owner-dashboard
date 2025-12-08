'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../../lib/api-client';
import { useToastContext } from '../../components/ToastProvider';

/**
 * Страница входа
 * 
 * Улучшения для мобильных:
 * - Toast-уведомления вместо alert()
 * - Показать/скрыть пароль
 * - Улучшенные touch-таргеты (минимум 44x44px)
 * - Автозаполнение
 * - Визуальная обратная связь при загрузке
 */
export default function LoginPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Попытка входа:', { login });
      const response = await authApi.login({ login, password });
      console.log('Вход успешен:', response);
      
      if (response && response.user && response.accessToken) {
        toast.success('Вход выполнен успешно');
        router.push('/portfolio');
        router.refresh();
      } else {
        throw new Error('Неверный формат ответа от сервера');
      }
    } catch (err: any) {
      console.error('Ошибка входа:', err);
      const errorMessage = err?.message || err?.toString() || 'Ошибка входа. Проверьте логин и пароль.';
      setError(errorMessage);
      
      // Показываем детальную ошибку через toast
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
        toast.error('Не удалось подключиться к серверу. Убедитесь, что API сервер запущен на порту 4000');
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        toast.error('Неверный логин или пароль');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-2 text-center">Sabay Owner Dashboard</h1>
        <p className="text-white/60 text-center mb-8">Вход в личный кабинет</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="login" className="block text-sm font-medium mb-2">
              Логин
            </label>
            <input
              id="login"
              type="text"
              required
              autoComplete="username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Введите логин"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Пароль
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Введите пароль"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-sabay-primary rounded"
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-sabay-primary bg-sabay-primary/10 px-6 py-4 text-base font-medium text-sabay-primary transition hover:bg-sabay-primary/20 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Вход...</span>
              </>
            ) : (
              'Войти'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}