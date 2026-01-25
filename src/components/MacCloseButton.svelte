<script lang="ts">
  interface Props {
    onclick?: () => void;
  }

  let { onclick }: Props = $props();
  let isHovered = $state(false);
</script>

<button
  class="mac-close"
  {onclick}
  onmouseenter={() => isHovered = true}
  onmouseleave={() => isHovered = false}
  aria-label="Close"
>
  {#if isHovered}
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
      <line x1="3" y1="3" x2="9" y2="9"></line>
      <line x1="9" y1="3" x2="3" y2="9"></line>
    </svg>
  {/if}
</button>

<style>
  .mac-close {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--mac-close);
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
  }

  .mac-close:hover {
    filter: brightness(0.9);
  }

  .mac-close:active {
    filter: brightness(0.8);
  }

  .mac-close svg {
    width: 8px;
    height: 8px;
    color: rgba(0, 0, 0, 0.5);
  }
</style>
