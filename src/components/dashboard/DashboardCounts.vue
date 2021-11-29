<template>
  <q-card class="bg-transparent no-shadow no-border">
    <q-card-section class="q-pa-none">
      <div class="row q-col-gutter-sm ">
        <div v-for="(item, index) in items" :key="index" class="col-md-2 col-sm-6 col-xs-12">
          <q-item :style="`background-color: ${item.color1}`" class="q-pa-none">
            <q-item-section side :style="`background-color: ${item.color2}`"
                            class=" q-pa-lg q-mr-none text-white">
              <router-link v-if="item.link" class="text-white" :to="item.link">
                <q-icon :name="item.icon" color="white" size="24px"></q-icon>
              </router-link>
              <q-icon v-else :name="item.icon" color="white" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">
                <router-link v-if="item.link" class="text-white" :to="item.link">{{ item.value }}</router-link>
                <span v-else>{{ item.value }}</span>
              </q-item-label>
              <q-item-label>
                <router-link v-if="item.link" class="text-white" :to="item.link">{{ $t(item.title) }}</router-link>
                <span v-else>{{ $t(item.title) }}</span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DashboardCounts',
  props: {
    counts: {
      type: Object,
      required: false
    }
  },
  watch: {
    counts () {
      console.log(this.counts)
    }
  },
  computed: {
    items: function () {
      return [
        {
          title: 'users.title',
          icon: 'person',
          value: this.counts.users ? this.counts.users : '-',
          color1: '#5064b5',
          color2: '#3e51b5',
          link: '/users'
        },
        {
          title: 'groups.title',
          icon: 'people',
          value: this.counts.groups ? this.counts.groups : '-',
          color1: '#5064b5',
          color2: '#3e51b5',
          link: '/groups'
        },
        {
          title: 'studies.title',
          icon: 'inventory',
          value: this.counts.studies ? this.counts.studies : '-',
          color1: '#f37169',
          color2: '#f34636',
          link: '/studies'
        },
        {
          title: 'study.forms',
          icon: 'speaker_notes',
          value: this.counts.forms ? this.counts.forms : '-',
          color1: '#ea6a7f',
          color2: '#ea4b64'
        },
        {
          title: 'Case Report Forms',
          icon: 'ballot',
          value: '-',
          color1: '#a270b1',
          color2: '#9f52b1'
        },
        {
          title: 'Case Reports',
          icon: 'bar_chart',
          value: '-',
          color1: '#a270b1',
          color2: '#9f52b1'
        }
      ]
    }
  }
})
</script>