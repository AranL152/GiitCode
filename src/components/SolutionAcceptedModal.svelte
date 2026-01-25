<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import MacCloseButton from './MacCloseButton.svelte';
  import AcceptedBadge from './AcceptedBadge.svelte';

  interface Props {
    visible: boolean;
    onClose: () => void;
    message?: string;
    problemTitle?: string;
    language?: string;
  }

  let { visible, onClose, message, problemTitle, language }: Props = $props();

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if visible}
  <div
    class="backdrop"
    onclick={handleBackdropClick}
    transition:fade={{ duration: 200 }}
    role="dialog"
    aria-modal="true"
  >
    <div class="modal" transition:scale={{ duration: 250, start: 0.9 }}>
      <header class="mac-header">
        <div class="traffic-lights">
          <MacCloseButton onclick={onClose} />
          <div class="traffic-light minimize"></div>
          <div class="traffic-light maximize"></div>
        </div>
        <span class="title">GeetCode</span>
      </header>

      <div class="content">
        <div class="badge-container">
          <AcceptedBadge size="large" />
        </div>

        {#if problemTitle}
          <h2 class="problem-title">{problemTitle}</h2>
        {/if}

        {#if language}
          <p class="language">Language: {language}</p>
        {/if}

        {#if message}
          <p class="message">{message}</p>
        {:else}
          <p class="message">Your solution has been accepted! Click the extension icon to push it to GitHub.</p>
        {/if}

        <div class="actions">
          <button class="btn btn-primary" onclick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
  }

  .modal {
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    min-width: 320px;
    max-width: 400px;
    overflow: hidden;
  }

  .mac-header {
    background: linear-gradient(180deg, #f6f6f6 0%, #e8e8e8 100%);
    padding: var(--spacing-sm) var(--spacing-md);
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-border);
  }

  .traffic-lights {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .traffic-light {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .traffic-light.minimize {
    background: var(--mac-minimize);
  }

  .traffic-light.maximize {
    background: var(--mac-maximize);
  }

  .title {
    flex: 1;
    text-align: center;
    font-size: var(--font-size-base);
    font-weight: 500;
    color: var(--color-text-secondary);
    margin-right: 44px; /* Balance the traffic lights */
  }

  .content {
    padding: var(--spacing-xl);
    text-align: center;
  }

  .badge-container {
    margin-bottom: var(--spacing-lg);
  }

  .problem-title {
    font-size: var(--font-size-xl);
    margin: 0 0 var(--spacing-sm);
    color: var(--color-text-primary);
  }

  .language {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0 0 var(--spacing-md);
    font-family: var(--font-family-mono);
  }

  .message {
    font-size: var(--font-size-md);
    color: var(--color-text-secondary);
    margin: 0 0 var(--spacing-xl);
    line-height: 1.5;
  }

  .actions {
    display: flex;
    justify-content: center;
  }

  .actions .btn {
    width: auto;
    min-width: 120px;
  }
</style>
