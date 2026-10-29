<script setup lang="ts">
import { ref } from 'vue'

const model = defineModel<string[]>({ required: true })
const props = defineProps<{ label: string; hint?: string; suggestions?: string[] }>()
const id = `chips-${Math.random().toString(36).slice(2, 8)}`
const draft = ref('')

function add(value = draft.value) {
  const clean = value.trim()
  if (clean && !model.value.some((v) => v.toLowerCase() === clean.toLowerCase())) {
    model.value = [...model.value, clean]
  }
  draft.value = ''
}

function removeAt(i: number) {
  model.value = model.value.filter((_, idx) => idx !== i)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    add()
  } else if (e.key === 'Backspace' && !draft.value && model.value.length) {
    removeAt(model.value.length - 1)
  }
}

const missing = () => (props.suggestions ?? []).filter((s) => !model.value.includes(s))
</script>

<template>
  <div class="chips-input">
    <label :for="id">{{ label }}</label>
    <div class="chips-input__box">
      <span v-for="(chip, i) in model" :key="chip" class="chips-input__chip">
        {{ chip }}
        <button type="button" :aria-label="`Quitar ${chip}`" @click="removeAt(i)">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </span>
      <input
        :id="id"
        v-model="draft"
        type="text"
        class="chips-input__field"
        :placeholder="model.length ? 'Agregar…' : 'Escribe y presiona Enter'"
        enterkeyhint="done"
        @keydown="onKey"
        @blur="add()"
      />
    </div>
    <div v-if="missing().length" class="chips-input__suggest">
      <span>Sugeridos:</span>
      <button v-for="s in missing()" :key="s" type="button" @click="add(s)">+ {{ s }}</button>
    </div>
    <p v-if="hint" class="chips-input__hint">{{ hint }}</p>
  </div>
</template>

<style scoped lang="scss">
.chips-input {
  &__box {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
    min-height: 2.9rem;
    padding: 0.35rem 0.5rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $surface;

    &:focus-within {
      border-color: $accent;
      box-shadow: 0 0 0 3px rgba($accent, 0.15);
    }
  }

  &__chip {
    @include flex(row, center, flex-start, 0.2rem);
    padding: 0.15rem 0.2rem 0.15rem 0.7rem;
    border-radius: $radius-pill;
    background: $quartz-deep;
    color: $basalt;
    font-size: 0.85rem;
    font-weight: 600;

    button {
      @include flex(row, center, center);
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 50%;
      font-size: 0.75rem;
      @include focus-ring;

      &:hover {
        background: rgba($basalt, 0.12);
      }
    }
  }

  &__field {
    flex: 1 1 120px;
    min-width: 100px;
    border: 0;
    padding: 0.35rem 0.3rem;
    background: transparent;

    &:focus {
      box-shadow: none;
    }
  }

  &__suggest {
    @include flex(row, center, flex-start, 0.35rem);
    flex-wrap: wrap;
    margin-top: 0.45rem;
    font-size: 0.8rem;
    color: $ink-muted;

    button {
      padding: 0.2rem 0.6rem;
      border-radius: $radius-pill;
      border: 1px dashed $line;
      font-size: 0.8rem;
      color: $ink-soft;
      @include focus-ring;

      &:hover {
        border-color: $basalt;
        color: $basalt;
      }
    }
  }

  &__hint {
    margin-top: 0.35rem;
    font-size: 0.78rem;
    color: $ink-muted;
  }
}
</style>
