<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { useAdminPending } from '@/composables/useAdminPending'
import type { ApiError, Order, OrderStatus } from '@/types'
import { ORDER_STATUS } from '@/utils/orderStatus'
import { formatDateTime } from '@/components/admin/adminFormat'
import { site } from '@/config/site'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import OrderStatusActions from '@/components/admin/OrderStatusActions.vue'
import OrderCustomerCard from '@/components/admin/OrderCustomerCard.vue'
import OrderItemsCard from '@/components/admin/OrderItemsCard.vue'
import OrderPaymentCard from '@/components/admin/OrderPaymentCard.vue'

const route = useRoute()
const toast = useToastStore()
const { refreshPending } = useAdminPending()

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref('')
const busy = ref(false)

async function load() {
  loading.value = true
  error.value = ''
  try {
    order.value = await adminService.order(String(route.params.id))
  } catch (e) {
    error.value = (e as ApiError).message || 'No se pudo cargar el pedido'
  } finally {
    loading.value = false
  }
}

async function changeStatus(status: OrderStatus) {
  if (!order.value) return
  busy.value = true
  try {
    order.value = await adminService.setOrderStatus(order.value._id, status)
    toast.success(`Pedido ${order.value.code}: ${ORDER_STATUS[status].label.toLowerCase()}`)
    refreshPending()
  } catch (e) {
    toast.error((e as ApiError).message || 'No se pudo cambiar el estado')
  } finally {
    busy.value = false
  }
}

function print() {
  window.print()
}

onMounted(load)
</script>

<template>
  <section class="detail">
    <AdminState :loading="loading" :error="error" shape="form" @retry="load" />

    <template v-if="order && !loading">
      <p class="detail__print-head">{{ site.name }} · Orden de despacho</p>
      <AdminPageHeader
        :eyebrow="`Pedido · ${formatDateTime(order.createdAt)}`"
        :title="order.code"
        back="/admin/pedidos"
      >
        <button type="button" class="btn btn--ghost detail__print" @click="print">
          <i class="fa-solid fa-print" aria-hidden="true"></i> Imprimir orden de despacho
        </button>
      </AdminPageHeader>

      <OrderStatusActions :order="order" :busy="busy" @change="changeStatus" />

      <div class="detail__cols">
        <div class="detail__main">
          <OrderItemsCard :order="order" />
          <OrderPaymentCard :order="order" class="detail__pay" />
        </div>
        <div class="detail__side">
          <OrderCustomerCard :order="order" />
        </div>
      </div>

      <div class="detail__sign" aria-hidden="true">
        <span>Preparado por</span>
        <span>Recibido por</span>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.detail {
  &__print-head,
  &__sign {
    display: none;
  }

  &__cols {
    @include flex(column, stretch, flex-start, 1rem);
    margin-top: 1rem;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, 1rem);
    flex: 1.5 1 0;
    min-width: 0;
  }

  &__side {
    @include flex(column, stretch, flex-start, 1rem);
    flex: 1 1 0;
    min-width: 0;
  }
}

// Orden de despacho: una hoja limpia con lo que necesita quien empaca y quien entrega.
@media print {
  .detail {
    font-size: 11pt;
    color: #000;

    &__print-head {
      display: block;
      margin-bottom: 0.4rem;
      font-family: $font-mono;
      font-size: 10pt;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    &__cols {
      flex-direction: column;
      gap: 0.6rem;
    }

    &__side {
      order: -1;
    }

    &__pay {
      display: none;
    }

    &__sign {
      @include flex(row, flex-end, space-between, 3rem);
      margin-top: 3rem;

      span {
        flex: 1;
        padding-top: 0.4rem;
        border-top: 1px solid #000;
        font-size: 9pt;
      }
    }
  }
}
</style>
