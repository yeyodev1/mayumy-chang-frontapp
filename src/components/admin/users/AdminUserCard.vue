<script setup lang="ts">
import { computed } from 'vue'
import type { AdminUser } from '@/types'
import { formatDate } from '@/utils/format'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'

const props = defineProps<{ user: AdminUser; isMe: boolean; busy: boolean }>()
const emit = defineEmits<{
  notify: [value: boolean]
  active: [value: boolean]
  remove: []
}>()

const initial = computed(() => (props.user.name || props.user.email).trim().charAt(0).toUpperCase())
const lastLogin = computed(() =>
  props.user.lastLoginAt ? `Último ingreso: ${formatDate(props.user.lastLoginAt)}` : 'Aún no ha ingresado',
)
</script>

<template>
  <article class="ucard" :class="{ 'ucard--off': !user.isActive }">
    <div class="ucard__who">
      <span class="ucard__avatar" aria-hidden="true">{{ initial }}</span>
      <div class="ucard__text">
        <p class="ucard__name">
          {{ user.name || 'Sin nombre' }}
          <span v-if="isMe" class="ucard__tag">Tú</span>
          <span v-if="!user.isActive" class="ucard__tag ucard__tag--off">Sin acceso</span>
        </p>
        <a :href="`mailto:${user.email}`" class="ucard__email">{{ user.email }}</a>
        <p class="ucard__meta">{{ lastLogin }}</p>
      </div>
    </div>

    <div class="ucard__controls">
      <AdminSwitch
        :model-value="user.notifyOrders"
        label="Correo de ventas"
        show-label
        :busy="busy"
        @update:model-value="emit('notify', $event)"
      />
      <AdminSwitch
        v-if="!isMe"
        :model-value="user.isActive"
        label="Acceso al panel"
        show-label
        :busy="busy"
        @update:model-value="emit('active', $event)"
      />
      <button
        v-if="!isMe"
        type="button"
        class="ucard__remove"
        :disabled="busy"
        :aria-label="`Quitar a ${user.name || user.email}`"
        @click="emit('remove')"
      >
        <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
        <span>Quitar</span>
      </button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.ucard {
  @include card;
  @include flex(column, stretch, flex-start, 1rem);
  padding: 1.1rem 1.2rem;

  @include from('lg') {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  &--off {
    opacity: 0.7;
  }

  &__who {
    @include flex(row, center, flex-start, 0.9rem);
    min-width: 0;
  }

  &__avatar {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    background: $quartz;
    color: $basalt;
    font-family: $font-serif;
    font-size: 1.15rem;
  }

  &__text {
    min-width: 0;
  }

  &__name {
    @include flex(row, center, flex-start, 0.45rem);
    flex-wrap: wrap;
    font-family: $font-serif;
    color: $basalt;
  }

  &__tag {
    font-family: $font-body;
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.15rem 0.55rem;
    border-radius: $radius-pill;
    background: $quartz-deep;
    color: $basalt;

    &--off {
      background: $danger-bg;
      color: $danger;
    }
  }

  &__email {
    display: block;
    color: $ink-soft;
    font-size: $text-sm;
    overflow-wrap: anywhere;
  }

  &__meta {
    color: $ink-muted;
    font-size: $text-xs;
  }

  &__controls {
    @include flex(row, center, flex-start, 0.4rem 1rem);
    flex-wrap: wrap;
  }

  &__remove {
    @include flex(row, center, center, 0.4rem);
    min-height: 2.75rem;
    padding: 0 0.9rem;
    border-radius: $radius-pill;
    color: $danger;
    font-weight: 600;
    font-size: $text-sm;
    @include focus-ring($danger);
    @include transition(background);

    &:hover {
      background: $danger-bg;
    }
  }
}
</style>
