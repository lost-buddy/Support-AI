import { useEffect, useRef, useState } from "react";
import { getGoogleNonce } from "../../api/auth";

let googleScriptPromise;

function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      const script = existing || document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google);
      script.onerror = () => reject(new Error("Could not load Google sign-in. Check your connection and try again."));
      if (!existing) document.head.appendChild(script);
    }).catch((error) => {
      googleScriptPromise = undefined;
      throw error;
    });
  }
  return googleScriptPromise;
}

export const GoogleSignInButton = ({ clientId, onCredential, disabled, onError }) => {
  const buttonRef = useRef(null);
  const credentialRef = useRef(onCredential);
  const errorRef = useRef(onError);
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [setupError, setSetupError] = useState(false);

  useEffect(() => { credentialRef.current = onCredential; }, [onCredential]);
  useEffect(() => { errorRef.current = onError; }, [onError]);

  useEffect(() => {
    let cancelled = false;
    let host;
    if (!clientId) return undefined;
    loadGoogleIdentity().then(async (google) => {
      const nonce = await getGoogleNonce();
      if (cancelled) return;
      google.accounts.id.initialize({
        client_id: clientId,
        nonce,
        callback: (response) => {
          if (!response.credential) {
            errorRef.current("Google did not return a sign-in credential. Please try again.");
            return;
          }
          Promise.resolve(credentialRef.current(response.credential, nonce)).then((success) => {
            if (success === false) setAttempt((current) => current + 1);
          }).catch(() => {
            errorRef.current("Could not complete Google sign-in. Please try again.");
            setAttempt((current) => current + 1);
          });
        },
      });
      host = buttonRef.current;
      if (!host) return;
      host.replaceChildren();
      google.accounts.id.renderButton(host, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: Math.min(360, Math.max(240, host.clientWidth || 320)),
      });
      setReady(true);
    }).catch((error) => {
      if (!cancelled) {
        setSetupError(true);
        errorRef.current(error.response?.data?.message || error.message || "Google sign-in is unavailable.");
      }
    });
    return () => {
      cancelled = true;
      host?.replaceChildren();
    };
  }, [clientId, attempt]);

  if (!clientId) {
    return <p className="google-setup" role="status">Google sign-in setup required: set <code>VITE_GOOGLE_CLIENT_ID</code> in client/.env and <code>GOOGLE_CLIENT_ID</code> in server/.env.</p>;
  }

  return <div className={`google-button-wrap${disabled ? " is-disabled" : ""}`} aria-busy={!ready || disabled}>
    {setupError ? <button className="google-retry" type="button" onClick={() => { errorRef.current(""); setSetupError(false); setAttempt((current) => current + 1); }}>Retry Google sign-in</button> : <>
      {!ready && <span className="google-button-loading">Loading Google sign-in…</span>}
      <div className="google-button-host" ref={buttonRef} />
    </>}
  </div>;
};
