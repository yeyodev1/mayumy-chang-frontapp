<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ id: string; autocomplete: string; minlength?: number; describedby?: string }>()
const model = defineModel<string>({ required: true })
const show = ref(false)
</script>

<template>
  <div class="pwd">
    <input
      :id="id"
      v-model="model"
      :type="show ? 'text' : 'password'"
      :autocomplete="autocomplete"
      :minlength="minlength"
      :aria-describedby="describedby"
      required
    />
    <button type="button" class="pwd__toggle" :aria-label="show ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="show" @click="show = !show">
      <i :class="show ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" aria-hidden="true"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.pwd {
  position: relative;

  input {
    min-height: 50px;
    padding-right: 3rem;
  }

  &__toggle {
    position: absolute;
    right: 0.3rem;
    top: 50%;
    transform: translateY(-50%);
    width: 42px;
    height: 42px;
    border-radius: 50%;
    color: $ink-soft;
    @include focus-ring;

    &:hover {
      background: $quartz-deep;
    }
  }
}
</style>
