<script lang="ts">
  import { authenticate, authError, authLoading } from '../../stores/auth';
  import { getExtensionId } from '../../lib/storage';
  import { onMount } from 'svelte';
  import logoSvg from '../../../public/Dieppe1.svg';

  let extensionId = $state('Loading...');
  let redirectUri = $state('Loading...');
  let connecting = $state(false);
  let showSetup = $state(false);

  onMount(async () => {
    const id = await getExtensionId();
    extensionId = id;
    redirectUri = `https://${id}.chromiumapp.org/`;
  });

  async function handleConnect() {
    connecting = true;
    try {
      await authenticate();
    } catch {
      // Error is already set in store
    } finally {
      connecting = false;
    }
  }
</script>

<div class="auth-screen">
  <div class="auth-header">
    <div class="logo">
      <img src={logoSvg} alt="GeetCode" class="logo-img" />
    </div>
    <h1>GeetCode</h1>
    <p>Push your LeetCode solutions to GitHub automatically</p>
  </div>

  <div class="auth-card card">
    <div class="github-icon">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    </div>

    <h2>Connect to GitHub</h2>
    <p>Authorize GeetCode to push solutions to your repositories</p>

    <button
      class="btn btn-primary btn-lg"
      onclick={handleConnect}
      disabled={connecting || $authLoading}
    >
      {#if connecting}
        <span class="btn-spinner"></span>
        Connecting...
      {:else}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Connect with GitHub
      {/if}
    </button>

    {#if $authError}
      <div class="error-message">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        {$authError}
      </div>
    {/if}
  </div>

  <button class="setup-toggle" onclick={() => showSetup = !showSetup}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
    {showSetup ? 'Hide' : 'Show'} setup info
  </button>

  {#if showSetup}
    <div class="setup-info card">
      <h3>First-time Setup</h3>
      <div class="info-row">
        <span class="info-label">Extension ID</span>
        <code>{extensionId}</code>
      </div>
      <div class="info-row">
        <span class="info-label">Redirect URI</span>
        <code class="small">{redirectUri}</code>
      </div>
      <a href="https://github.com/settings/developers" target="_blank" rel="noopener" class="setup-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
        Configure OAuth App
      </a>
    </div>
  {/if}
</div>

<style>
  .auth-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-lg);
    padding: var(--space-lg) 0;
  }

  .auth-header {
    text-align: center;
  }

  .logo {
    margin-bottom: var(--space-md);
  }

  .logo-img {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-xl);
    object-fit: cover;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  }

  .auth-header h1 {
    font-size: var(--text-2xl);
    margin-bottom: var(--space-xs);
  }

  .auth-header p {
    color: var(--text-muted);
    font-size: var(--text-sm);
  }

  .auth-card {
    width: 100%;
    text-align: center;
    padding: var(--space-xl);
  }

  .github-icon {
    color: var(--text-muted);
    margin-bottom: var(--space-md);
  }

  .auth-card h2 {
    font-size: var(--text-lg);
    margin-bottom: var(--space-xs);
  }

  .auth-card p {
    font-size: var(--text-sm);
    margin-bottom: var(--space-lg);
  }

  .btn-lg {
    width: 100%;
    padding: var(--space-md) var(--space-xl);
    font-size: var(--text-base);
  }

  .btn-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-top: var(--space-md);
    padding: var(--space-sm) var(--space-md);
    background: rgba(243, 139, 168, 0.1);
    border-radius: var(--radius-md);
    color: var(--error);
    font-size: var(--text-sm);
  }

  .setup-toggle {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: var(--text-sm);
    cursor: pointer;
    transition: color var(--transition-fast);
  }

  .setup-toggle:hover {
    color: var(--text-secondary);
  }

  .setup-info {
    width: 100%;
    font-size: var(--text-sm);
  }

  .setup-info h3 {
    font-size: var(--text-base);
    margin-bottom: var(--space-md);
  }

  .info-row {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    margin-bottom: var(--space-md);
  }

  .info-label {
    color: var(--text-muted);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .setup-info code {
    display: block;
    padding: var(--space-sm);
    background: var(--bg-secondary);
    border-radius: var(--radius-sm);
    word-break: break-all;
  }

  .setup-info code.small {
    font-size: var(--text-xs);
  }

  .setup-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    color: var(--accent);
    font-size: var(--text-sm);
  }

  .setup-link:hover {
    color: var(--ctp-rosewater);
  }
</style>
