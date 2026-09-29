import { useState } from "react";
import { loginUser, loginWithGoogle, registerUser } from "../api/auth";
import { Brand } from "../components/common/Brand";
import { Button } from "../components/common/Button";
import { GoogleSignInButton } from "../components/common/GoogleSignInButton";

export const AuthPage = ({ onAuthenticated }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const isRegistering = mode === "register";

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = isRegistering
        ? await registerUser(form)
        : await loginUser({ email: form.email, password: form.password });
      onAuthenticated({ token: result.token, user: result.user });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not reach SupportAI. Check the API URL and that the API server is available.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential, nonce) => {
    setLoading(true);
    setError("");
    setGoogleError("");
    try {
      const result = await loginWithGoogle(credential, nonce);
      onAuthenticated({ token: result.token, user: result.user });
      return true;
    } catch (requestError) {
      setGoogleError(requestError.response?.data?.message || "Could not complete Google sign-in. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-panel">
        <Brand />
        <div className="auth-heading">
          <p className="eyebrow">CUSTOMER SUPPORT WORKSPACE</p>
          <h1>{isRegistering ? "Create your account" : "Welcome back"}</h1>
          <p>{isRegistering ? "Start a support conversation with your team." : "Sign in to manage your support workspace."}</p>
        </div>
        <div className="auth-google">
          <GoogleSignInButton
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            onCredential={handleGoogleCredential}
            disabled={loading}
            onError={setGoogleError}
          />
          {googleError && <p className="form-error" role="alert">{googleError}</p>}
          {import.meta.env.VITE_GOOGLE_CLIENT_ID && <div className="auth-divider"><span>or continue with email</span></div>}
        </div>
        <form onSubmit={submit} className="auth-form">
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="auth-name">Full name</label>
              <input id="auth-name" autoComplete="name" required maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="auth-email">Work email</label>
            <input id="auth-email" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input id="auth-password" type="password" autoComplete={isRegistering ? "new-password" : "current-password"} minLength={8} required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            {isRegistering && <small className="field-hint">Use at least 8 characters.</small>}
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <Button type="submit" disabled={loading} className="auth-submit">{loading ? "Please wait…" : isRegistering ? "Create account" : "Sign in"}</Button>
        </form>
        <p className="auth-switch">
          {isRegistering ? "Already have an account?" : "New to SupportAI?"}{" "}
          <button type="button" onClick={() => { setError(""); setMode(isRegistering ? "login" : "register"); }}> {isRegistering ? "Sign in" : "Create an account"}</button>
        </p>
        <p className="auth-footnote">Secure access to your customer conversations.</p>
      </section>
      <aside className="auth-aside" aria-hidden="true">
        <div className="auth-aside-content">
          <div className="auth-aside-rule" />
          <p className="eyebrow">SUPPORT, IN SYNC</p>
          <h2>Every conversation, moving forward.</h2>
          <p>Keep customer context, team replies, and next steps together in one calm workspace.</p>
        </div>
        <div className="auth-aside-orbit auth-aside-orbit-one" />
        <div className="auth-aside-orbit auth-aside-orbit-two" />
      </aside>
    </main>
  );
};
