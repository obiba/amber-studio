<template>
    <div>
    <q-splitter
      v-model="splitterModel">

      <template v-slot:before>
        <div>
          <q-tree 
            :nodes="items"
            node-key="name"
            children-key="items"
            default-expand-all
            selected-color="primary"
            v-model:selected="selected"
            @keyup.alt.up="moveUp"
            @keyup.alt.down="moveDown">

            <template v-slot:default-header="prop">
              <div class="row items-center">
                <div>{{ prop.node.name }} <span class="text-caption text-grey">[{{ prop.node.type ? $t("formel.types." + prop.node.type) : "?" }}]</span></div>
              </div>
            </template>

            <template v-slot:default-body="prop">
              <div>
                <span class="text-caption">{{ prop.node.label }}</span>
              </div>
            </template>

          </q-tree>
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
        <div v-if="selectedItem">
          <div class="row">
            <span class="float-left text-h6 q-mt-sm q-ml-md">
              {{ selectedItem.name }}
            </span>
            <div class="q-mt-sm q-ml-md">
              <q-btn
                class="text-grey-8"
                size="10px"
                flat
                dense
                round
                icon='arrow_upward'
                :title="$t('formel.move_up')"
                @click='moveUpItem(formItemSelected)'>
              </q-btn>
              <q-btn
                class="text-grey-8"
                size="10px"
                flat
                dense
                round
                icon='arrow_downward'
                :title="$t('formel.move_down')"
                @click='moveDownItem(formItemSelected)'>
              </q-btn>
              <q-btn
                class="text-grey-8"
                size="10px"
                flat
                dense
                round
                icon='delete'
                :title="$t('formel.delete')"
                @click='deleteItem(formItemSelected)'>
              </q-btn>
            </div>
          </div>
          <q-separator/>
          <div>
            <form-item-builder :schema="selectedItem" />
          </div>
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
    FormItemBuilder: defineAsyncComponent(() => import('src/components/forms/FormItemBuilder.vue')),
  },
  setup() {
    return {
      splitterModel: ref(30),
      formItemSelected: ref(null),
      selected: ref(null)
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
    },
    items() {
      if (this.form)
        return this.form.items ? this.form.items : [];
      return [];
    }
  },
  watch: {
    selected: function(newValue, oldValue) {
      console.log(newValue);
      if (newValue !== null)
        this.selectItem(this.form.items.filter(item => item.name === newValue).pop());
    }
  },
  methods: {
    selectItem(item) {
      this.formItemSelected = item;
    },
    addItem() {
      this.form.items.push({ name: "item" + (this.form.items.length + 1) });
    },
    moveUp() {
      this.moveUpItem(this.formItemSelected);
    },
    moveUpItem(item) {
      const idx = this.form.items.indexOf(item);
      if (idx>0) {
        this.form.items.splice(idx, 1);
        this.form.items.splice(idx-1, 0, item);
      }
    },
    moveDown() {
      this.moveDownItem(this.formItemSelected);
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