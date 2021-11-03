<template>
    <div>
    <q-splitter
      v-model="splitterModel">

      <template v-slot:before>
        <div>
          <q-tree 
            v-if="items.length>0"
            :nodes="items"
            node-key="name"
            children-key="items"
            default-expand-all
            selected-color="primary"
            v-model:selected="selected"
            @keyup.alt.up="selectUpItem"
            @keyup.alt.down="selectDownItem">

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
        this.selected = this.form.items[0].name;
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
      if (newValue === null) {
        this.selected = oldValue;
      } else {
        const found = this.findItemAndParent(newValue);
        this.selectItem(found.item);
      }
    }
  },
  methods: {
    selectItem(item) {
      this.formItemSelected = item;
    },
    addItem() {
      const found = this.findItemAndParent(this.selected);
      let i = 1;
      let test = this.findItemAndParent('ITEM' + i);
      while (test.item !== null) {
        i = i + 1;
        test = this.findItemAndParent('ITEM' + i);
      }
      const newItem = { 
        name: 'ITEM' + i,
        type: 'static'
      };
      if (found.item !== null && found.item.type === 'group') {
        // add last in the group
        if (!found.item.items)
          found.item.items = [newItem];
        else
          found.item.items.push(newItem);
      } else {
        // add after selected one
        const idx = found.parent.items.indexOf(found.item);
        found.parent.items.splice(idx+1, 0, newItem);
      }
      this.selected = newItem.name;
    },
    selectUpItem() {
      if (this.selected === null)
        return;
      
      const found = this.findItemAndParent(this.selected);
      const idx = found.parent.items.indexOf(found.item);
      if (idx === 0 && found.parent.type === 'group')
        this.selected = found.parent.name; // case selected item is a group
      else if (idx>0) {
        const upItem = found.parent.items[idx-1];
        if (upItem.type === 'group' && upItem.items && upItem.items.length>0)
          this.selected = upItem.items[upItem.items.length-1].name; // case selected item is after a group with items
        else
          this.selected = upItem.name; // case regular up item
      }
    },
    moveUpItem(item) {
      let found = this.findItemAndParent(item.name);
      if (found.item === null)
        return;
      
      let idx = found.parent.items.indexOf(item);
      if (found.parent.type === 'group') {
        found.parent.items.splice(idx, 1);
        if (idx === 0) {
          // case first in a group, move item before the group
          found = this.findItemAndParent(found.parent.name);
          idx = found.parent.items.indexOf(found.item);
          found.parent.items.splice(idx, 0, item);
        } else {
          // case move up in the group
          found.parent.items.splice(idx-1, 0, item);
        }
      } else if (idx>0) {
        found.parent.items.splice(idx, 1);
        const upItem = found.parent.items[idx-1];
        if (upItem.type === 'group') {
          // case up item is a group, then insert it as last item
          if (!upItem.items)
            upItem.items = [item];
          else
            upItem.items.push(item)
        } else {
          // regular case
          found.parent.items.splice(idx-1, 0, item);
        }
      }
    },
    selectDownItem() {
      if (this.selected === null)
        return;

      let found = this.findItemAndParent(this.selected);
      if (found.item.type === 'group' && found.item.items && found.item.items.length>0)
        this.selected = found.item.items[0].name; // case selected item is a group with items
      else {
        let idx = found.parent.items.indexOf(found.item);
        if (idx === found.parent.items.length-1 && found.parent.type === 'group') {
          found = this.findItemAndParent(found.parent.name);
          idx = found.parent.items.indexOf(found.item); // case selected item is last item in a group
        }
        if (idx<found.parent.items.length-1)
          this.selected = found.parent.items[idx+1].name; // case selected is last in the group
      }
    },
    moveDownItem(item) {
      let found = this.findItemAndParent(item.name);
      if (found.item === null)
        return;

      let idx = found.parent.items.indexOf(item);
      if (found.parent.type === 'group') {
        found.parent.items.splice(idx, 1);
        if (idx === found.parent.items.length) {
          // case it was last, move it after the parent
          found = this.findItemAndParent(found.parent.name);
          idx = found.parent.items.indexOf(found.item);
        }
        found.parent.items.splice(idx+1, 0, item);
      } else if (idx<found.parent.items.length-1) {
        found.parent.items.splice(idx, 1);
        const downItem = found.parent.items[idx];
        if (downItem.type === 'group') {
          if (!downItem.items)
            downItem.items = [item];
          else
            downItem.items.splice(0, 0, item);
        } else {
          // regular case
          found.parent.items.splice(idx+1, 0, item);
        }
      }
    },
    deleteItem(item) {
      let found = this.findItemAndParent(item.name);
      if (found.item === null)
        return;

      const idx = found.parent.items.indexOf(item);
      if (idx === 0)
        if (found.parent.type === 'group')
          this.selected = found.parent.name;
        else
          this.selectDownItem(item);
      else
        this.selectUpItem(item);
      found.parent.items.splice(idx, 1);
      if (this.form.items.length === 0) {
        this.selectItem(null);
      }
    },
    isItemSelected(item) {
      return this.formItemSelected && this.formItemSelected.name === item.name;
    },
    findItemAndParent(name) {
      return this.findItemInParent(this.form, name);
    },
    findItemInParent(parent, name) {
      let rval = {
        parent: parent,
        name: name,
        item: null
      };

      if (parent.items) {
        const item = parent.items.filter(it => it.name === name).pop();
        if (item) {
          rval.item = item;
          return rval;
        } else {
          const groups = parent.items.filter(it => it.type === 'group');
          if (groups) {
            groups.forEach(group => {
              if (rval.item === null) {
                const grval = this.findItemInParent(group, name);
                if (grval.item !== null)
                  rval = grval;
              }
            });
          }
        }
      }
      return rval;
    }
  }
})
</script>