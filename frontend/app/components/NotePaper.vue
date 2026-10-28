<script setup lang="ts">
import type { NoteShape } from '~/types/note'

defineProps<{ shape: NoteShape; color: string }>()
</script>

<!-- Purely visual paper layer that fills its positioned parent. -->
<template>
  <div class="paper-root" :class="shape" :style="{ '--paper': color }">
    <div v-if="shape !== 'arrow'" class="curl-shadow" />
    <div class="paper" />
  </div>
</template>

<style scoped>
.paper-root,
.paper {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.paper {
  background: var(--paper);
}

/* Square and rounded: the bottom-right corner lifts off the canvas. */
.square .paper,
.rounded .paper {
  background:
    radial-gradient(ellipse at 100% 100%, rgb(0 0 0 / 0.1), transparent 45%),
    linear-gradient(160deg, rgb(255 255 255 / 0.35), transparent 30%),
    var(--paper);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.15), 0 2px 6px rgb(0 0 0 / 0.06);
}

.square .paper {
  border-radius: 0 0 60% 0 / 0 0 8px 0;
}

.rounded .paper {
  border-radius: 16px 16px 60% 16px / 16px 16px 8px 16px;
}

/* Shadow cast by the lifted corner, peeking out below the paper. */
.curl-shadow {
  position: absolute;
  right: 6px;
  bottom: 8px;
  width: 55%;
  height: 25%;
  box-shadow: 4px 12px 12px rgb(0 0 0 / 0.3);
  transform: rotate(3deg);
  transform-origin: right bottom;
}

/* Circle: same lifted look, with the curl following the bottom-right arc. */
.circle .paper {
  border-radius: 50% 50% 46% 50% / 50% 50% 44% 50%;
  background:
    radial-gradient(ellipse at 85% 85%, rgb(0 0 0 / 0.1), transparent 40%),
    radial-gradient(circle at 35% 30%, rgb(255 255 255 / 0.35), transparent 55%),
    var(--paper);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.15), 0 2px 6px rgb(0 0 0 / 0.06);
}

.circle .curl-shadow {
  right: 6%;
  bottom: 12%;
  width: 45%;
  height: 22%;
  border-radius: 50%;
  /* Offset is in the rotated frame; it points diagonally down-right on screen. */
  box-shadow: 1px 14px 12px rgb(0 0 0 / 0.35);
  transform: rotate(-40deg);
  transform-origin: center;
}

/* clip-path cuts off box-shadow, so the arrow's shadow comes from a filter on the parent. */
.arrow {
  filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.15)) drop-shadow(0 6px 8px rgb(0 0 0 / 0.15));
}

.arrow .paper {
  clip-path: polygon(0 15%, 70% 15%, 70% 0, 100% 50%, 70% 100%, 70% 85%, 0 85%);
  background:
    linear-gradient(160deg, rgb(255 255 255 / 0.35), transparent 35%),
    var(--paper);
}
</style>
