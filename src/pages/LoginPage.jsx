import { useState } from 'react';
import { useStore, DEMO_CREDS } from '../store';
import { Field } from '../components/ui';
import Icon from '../components/Icon';

export default function LoginPage() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!login(email, password)) {
      setError('Wrong email or password.');
    }
    // on success the app re-renders and routes to Catalog
  };

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={submit}>
        <div className="login-brand">
          <span className="brand-mark">
            <Icon name="logo" size={20} />
          </span>
          ProductHub
        </div>
        <h1>Sign in</h1>
        <p className="login-sub">Store admin console</p>

        <Field label="Email" htmlFor="login-email">
          <input
            id="login-email"
            type="email"
            className="input"
            autoFocus
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
          />
        </Field>

        <Field label="Password" htmlFor="login-password" error={error || undefined}>
          <input
            id="login-password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
          />
        </Field>

        <button type="submit" className="btn btn-primary btn-lg">
          Sign in
        </button>

        <p className="login-hint">
          Demo: <code>{DEMO_CREDS.email}</code> / <code>{DEMO_CREDS.password}</code>
        </p>
      </form>
    </div>
  );
}
