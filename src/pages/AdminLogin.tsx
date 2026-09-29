import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, UserPlus, ArrowLeft, LogOut } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BUSINESS_INFO } from '../types';
import { BrandBagEmblem } from '../components/BrandLogo';

export const AdminLogin: React.FC = () => {
  const {
    isAuthenticated,
    isAdminAuthenticated,
    currentUserEmail,
    currentUserName,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    showToast,
  } = useStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialMode =
    searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const queryMode = searchParams.get('mode');
    if (queryMode === 'signup') {
      setMode('signup');
    } else if (queryMode === 'signin') {
      setMode('signin');
    }
  }, [searchParams]);

  const switchMode = (nextMode: 'signin' | 'signup') => {
    setMode(nextMode);
    setErrorMessage(null);
    setSearchParams({ mode: nextMode }, { replace: true });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password.trim().length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === 'signup') {
        const { role } = await registerWithEmail(name, email, password);
        if (role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/shop', { replace: true });
        }
      } else {
        const { role } = await loginWithEmail(email, password);
        if (role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/shop', { replace: true });
        }
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Authentication failed. Please try again.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setSubmitting(true);
    try {
      const { role } = await loginWithGoogle();
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/shop', { replace: true });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Google authentication was cancelled or failed.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md bg-[#FFFFFF] border-2 border-[#0A0A0A] p-7 sm:p-9 rounded-none space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <BrandBagEmblem className="w-16 h-16 border border-[#0A0A0A]" />
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0A0A0A]">
              {mode === 'signin' ? '"SIGN IN"' : '"SIGN UP"'}
            </h1>
            <p className="text-xs font-mono-tabular text-[#52514E] mt-1">
              {BUSINESS_INFO.name} · Account Access
            </p>
          </div>
        </div>

        {/* Active Session Banner if already signed in */}
        {isAuthenticated && currentUserEmail && (
          <div className="p-4 bg-[#F6F5F0] border border-[#0A0A0A] space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs font-mono-tabular">
              <span className="font-bold text-[#0A0A0A] truncate">
                Signed in: {currentUserName || currentUserEmail}
              </span>
            </div>
            <p className="text-xs text-[#52514E] truncate">{currentUserEmail}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {isAdminAuthenticated ? (
                <Link
                  to="/admin/dashboard"
                  className="flex-1 text-center px-3 py-2 text-xs font-bold bg-[#0A0A0A] text-[#F6F5F0] hover:bg-[#C5A059] hover:text-[#0A0A0A] transition-colors rounded-none whitespace-nowrap"
                >
                  "DASHBOARD"
                </Link>
              ) : (
                <Link
                  to="/shop"
                  className="flex-1 text-center px-3 py-2 text-xs font-bold bg-[#0A0A0A] text-[#F6F5F0] hover:bg-[#C5A059] hover:text-[#0A0A0A] transition-colors rounded-none whitespace-nowrap"
                >
                  "BROWSE SHOP"
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#FFFFFF] text-[#0A0A0A] hover:bg-[#C62828] hover:text-white border border-[#0A0A0A] transition-colors rounded-none whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Segmented Mode Selector: Sign In / Sign Up */}
        <div
          role="tablist"
          aria-label="Authentication Mode"
          className="grid grid-cols-2 border border-[#0A0A0A] bg-[#F6F5F0]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signin'}
            onClick={() => switchMode('signin')}
            className={`py-3 text-xs font-bold tracking-wider transition-colors rounded-none whitespace-nowrap ${
              mode === 'signin'
                ? 'bg-[#0A0A0A] text-[#F6F5F0]'
                : 'text-[#52514E] hover:text-[#0A0A0A]'
            }`}
          >
            "SIGN IN"
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            onClick={() => switchMode('signup')}
            className={`py-3 text-xs font-bold tracking-wider border-l border-[#0A0A0A] transition-colors rounded-none whitespace-nowrap ${
              mode === 'signup'
                ? 'bg-[#0A0A0A] text-[#F6F5F0]'
                : 'text-[#52514E] hover:text-[#0A0A0A]'
            }`}
          >
            "SIGN UP"
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 text-xs font-medium bg-[#FFEBEE] border border-[#C62828] text-[#C62828] rounded-none">
            {errorMessage}
          </div>
        )}

        {/* Unified Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label
                htmlFor="auth-name"
                className="block text-xs font-bold text-[#0A0A0A]"
              >
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A] focus:outline-none focus:bg-[#FFFFFF]"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="auth-email"
              className="block text-xs font-bold text-[#0A0A0A]"
            >
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A] focus:outline-none focus:bg-[#FFFFFF]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="auth-password"
              className="block text-xs font-bold text-[#0A0A0A]"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === 'signup'
                  ? 'Create a password (min. 6 characters)'
                  : 'Enter your password'
              }
              className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A] focus:outline-none focus:bg-[#FFFFFF]"
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label
                htmlFor="auth-confirm-password"
                className="block text-xs font-bold text-[#0A0A0A]"
              >
                Confirm Password
              </label>
              <input
                id="auth-confirm-password"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A] focus:outline-none focus:bg-[#FFFFFF]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-bold tracking-wider bg-[#0A0A0A] text-[#F6F5F0] hover:bg-[#C5A059] hover:text-[#0A0A0A] disabled:opacity-50 border border-[#0A0A0A] transition-colors rounded-none whitespace-nowrap"
          >
            {mode === 'signin' ? (
              <>
                <Lock className="w-4 h-4" />
                <span>{submitting ? 'Signing In...' : '"SIGN IN"'}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>
                  {submitting ? 'Creating Account...' : '"CREATE ACCOUNT"'}
                </span>
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center py-1">
          <div className="border-t border-[#0A0A0A]/20 w-full" />
          <span className="bg-[#FFFFFF] px-3 text-[11px] font-mono-tabular text-[#52514E] whitespace-nowrap">
            or continue with Google
          </span>
          <div className="border-t border-[#0A0A0A]/20 w-full" />
        </div>

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold bg-[#F6F5F0] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F6F5F0] border border-[#0A0A0A] transition-colors rounded-none whitespace-nowrap"
        >
          <span>Continue with Google</span>
        </button>

        <div className="pt-3 border-t border-[#0A0A0A]/15 flex items-center justify-start text-xs text-[#52514E]">
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-medium hover:text-[#0A0A0A]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
