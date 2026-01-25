<script lang="ts">
  interface Props {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'outline';
  }

  let { size = 'md', variant = 'default' }: Props = $props();
</script>

<span class="accepted-badge size-{size} variant-{variant}">
  <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
  <span class="text">Accepted</span>
</span>

<style>
  .accepted-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    border-radius: var(--radius-full);
  }

  /* Default variant */
  .variant-default {
    background: rgba(166, 227, 161, 0.15);
    color: var(--ctp-green);
  }

  /* Outline variant */
  .variant-outline {
    background: transparent;
    border: 1px solid var(--ctp-green);
    color: var(--ctp-green);
  }

  /* Size: small */
  .size-sm {
    padding: 2px 8px;
    font-size: 10px;
  }

  .size-sm .check-icon {
    width: 10px;
    height: 10px;
  }

  /* Size: medium */
  .size-md {
    padding: 4px 10px;
    font-size: 11px;
  }

  .size-md .check-icon {
    width: 12px;
    height: 12px;
  }

  /* Size: large */
  .size-lg {
    padding: 6px 14px;
    font-size: 13px;
  }

  .size-lg .check-icon {
    width: 14px;
    height: 14px;
  }

  .check-icon {
    animation: checkPop 0.3s ease-out;
  }

  @keyframes checkPop {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
