<template>
    <div>
    <q-splitter
      v-model="splitterModel">

      <template v-slot:before>
        <div>
          <q-list>
            <q-item v-for="item in form.items" :key="item.name" :active="isItemSelected(item)" active-class="bg-grey-3 text-grey-8" clickable @click="selectItem(item)">
              <q-item-section :title="item.description ? item.description : ''">
                <q-item-label>{{item.label}} <small class="text-grey">[{{item.name}}]</small></q-item-label>
                <q-item-label caption lines="2">{{item.type ? $t("formel.types." + item.type) : ""}}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row">
                  <div class="col">
                    <q-btn
                        class="gt-xs q-mt-xs text-grey-8"
                        size="10px"
                        flat
                        dense
                        round
                        icon='arrow_upward'
                        @click='moveUpItem(item)'>
                    </q-btn>
                  </div>
                  <div class="col">
                    <q-btn
                        class="gt-xs q-mt-xs text-grey-8"
                        size="10px"
                        flat
                        dense
                        round
                        icon='arrow_downward'
                        @click='moveDownItem(item)'>
                    </q-btn>
                  </div>
                  <div class="col">
                    <q-btn
                        class="gt-xs q-mt-xs text-grey-8"
                        size="10px"
                        flat
                        dense
                        round
                        icon='delete'
                        @click='deleteItem(item)'>
                    </q-btn>
                  </div>
                </div>
              </q-item-section>
            </q-item>

          </q-list>
        <q-btn
          color="primary"
          icon="add"
          :title="$t('formel.add_item_hint')"
          :label="$t('add')"
          @click="addItem()"
          class="q-ma-md" />
        </div>
      </template>

      <template v-slot:after>
        <div>
          <form-item v-if="selectedItem" :schema="selectedItem" />
        </div>
      </template>

    </q-splitter>
  </div>
</template>

<script>
import {defineComponent, defineAsyncComponent, ref} from 'vue'

export default defineComponent({
  name: "FormElement",
  props: {
      form: Object
  },
  components: {
    FormItem: defineAsyncComponent(() => import('components/forms/FormItem.vue')),
  },
  setup() {
    return {
      splitterModel: ref(30),
      formItemSelected: ref(null)
    }
  },
  computed: {
    selectedItem() {
      if (!this.form.items) {
        this.form.items = [];
      }
      if (!this.formItemSelected && this.form.items.length>0) {
        this.formItemSelected = this.form.items[0];
      }
      return this.formItemSelected;
    }
  },
  methods: {
    selectItem(item) {
      this.formItemSelected = item;
    },
    addItem() {
      this.form.items.push({ name: "item" + (this.form.items.length + 1) });
    },
    moveUpItem(item) {
      const idx = this.form.items.indexOf(item);
      if (idx>0) {
        this.form.items.splice(idx, 1);
        this.form.items.splice(idx-1, 0, item);
      }
    },
    moveDownItem(item) {
      const idx = this.form.items.indexOf(item);
      if (idx<this.form.items.length) {
        this.form.items.splice(idx, 1);
        this.form.items.splice(idx+1, 0, item);
      }
    },
    deleteItem(item) {
      if (this.form.items) {
        if (item === this.formItemSelected) {
          let idx = this.form.items.indexOf(item);
          console.log(idx)
          console.log(this.formItemSelected)
          if (idx>=1) {
            this.selectItem(this.form.items[idx - 1]);
          } else if (this.form.items.length>(idx + 1)) {
            this.selectItem(this.form.items[idx + 1]);
          } else {
            this.selectItem(undefined);
          }
          console.log(this.formItemSelected)
        }
        this.form.items = this.form.items.filter(it => it.name !== item.name);
      }
    },
    isItemSelected(item) {
      return this.formItemSelected && this.formItemSelected.name === item.name;
    }
  }
})
</script>