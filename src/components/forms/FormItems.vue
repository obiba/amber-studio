<template>
  <div>
    <q-splitter
      v-model="splitterModel">

      <template v-slot:before>
        <div class="q-ma-sm">
          <q-btn
            class="text-grey-8"
            size="10px"
            flat
            dense
            round
            icon='chevron_left'
            :disable="!selectedItem"
            :title="$t('form.select_previous')"
            @click='selectUpItem'>
          </q-btn>
          <q-btn
            class="text-grey-8"
            size="10px"
            flat
            dense
            round
            icon='chevron_right'
            :disable="!selectedItem"
            :title="$t('form.select_next')"
            @click='selectDownItem'>
          </q-btn>
          <q-btn
            v-if="!isReadOnly"
            class="text-grey-8"
            size="10px"
            flat
            dense
            round
            icon='add'
            :title="$t('form.add_item_hint')"
            @click='addItem'>
          </q-btn>
        </div>
        <q-separator/>
        <div class="q-pl-sm">
          <q-tree
            v-if="items.length>0"
            :nodes="items"
            node-key="name"
            children-key="items"
            selected-color="primary"
            v-model:selected="selected"
            default-expand-all
            @keyup.alt.up="selectUpItem"
            @keyup.alt.down="selectDownItem">

            <template v-slot:default-header="prop">
              <div class="row items-center">
                <div>
                  <q-icon v-if="prop.node.name === '.'" name="feed"/>
                  <span v-else>{{ prop.node.name }}</span>
                  <span class="text-caption text-grey q-ml-xs">[{{ $t('form.types.' + (prop.node.type ? prop.node.type : 'form')) }}]</span>
                </div>
              </div>
            </template>

            <template v-slot:default-body="prop">
              <div>
                <span class="text-caption">{{ prop.node.label }}</span>
              </div>
            </template>

          </q-tree>
        <q-btn
          v-if="!isReadOnly"
          color="primary"
          icon="add"
          :title="$t('form.add_item_hint')"
          :label="$t('add')"
          @click="addItem()"
          class="q-ma-md" />
        </div>
      </template>

      <template v-slot:after>
        <div v-if="selectedItem">
          <div class="row">
            <div class="float-left text-h6 q-mt-sm q-ml-md">
              <span v-if="isRootSelected">{{ $t('form.types.form') }}</span>
              <span v-else>{{ selectedItem.name }}</span>
            </div>
            <div v-if="!isRootSelected" class="q-mt-sm q-ml-md">
              <q-btn
                v-if="!isReadOnly"
                class="text-grey-8"
                size="10px"
                flat
                dense
                round
                icon='arrow_upward'
                :title="$t('form.move_up')"
                @click='moveUpItem(formItemSelected)'>
              </q-btn>
              <q-btn
                v-if="!isReadOnly"
                class="text-grey-8"
                size="10px"
                flat
                dense
                round
                icon='arrow_downward'
                :title="$t('form.move_down')"
                @click='moveDownItem(formItemSelected)'>
              </q-btn>
              <q-btn
                v-if="!isReadOnly"
                class="text-grey-8"
                size="10px"
                flat
                dense
                round
                icon='content_copy'
                :title="$t('form.copy_item')"
                @click='copyItem(formItemSelected)'>
              </q-btn>
              <q-btn
                v-if="!isReadOnly"
                class="text-grey-8"
                size="10px"
                flat
                dense
                round
                icon='content_cut'
                :title="$t('form.cut_item')"
                @click='cutItem(formItemSelected)'>
              </q-btn>
              <q-btn
                v-if="!isReadOnly"
                class="text-grey-8"
                size="10px"
                flat
                dense
                round
                icon='content_paste'
                :disable="!canPaste"
                :title="formItemCopied ? $t('form.paste_copied_item', { name: formItemCopied.name }) : (formItemCut ? $t('form.paste_cut_item', { name: formItemCut.name }) : $t('form.paste_item'))"
                @click='pasteItem(formItemSelected)'>
              </q-btn>
              <q-btn
                v-if="!isReadOnly"
                class="text-grey-8"
                size="10px"
                flat
                dense
                round
                icon='delete'
                :title="$t('form.delete')"
                @click='deleteItem(formItemSelected)'>
              </q-btn>
            </div>
          </div>
          <q-separator/>
          <div>
            <form-item v-model="formItemSelected" :i18n="i18n" />
          </div>
        </div>
        <div v-else class="q-ma-md text-grey-6">
          {{$t('form.no_item_selected')}}
        </div>
      </template>

    </q-splitter>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import AuthMixin from '../../mixins/AuthMixin'

export default defineComponent({
  name: 'FormItems',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  components: {
    FormItem: defineAsyncComponent(() => import('src/components/forms/FormItem.vue'))
  },
  mixins: [AuthMixin],
  setup () {
    return {
      splitterModel: ref(30),
      formItemSelected: ref(null),
      selected: ref(null),
      formItemCut: ref(null),
      formItemCopied: ref(null)
    }
  },
  computed: {
    value: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    },
    i18n () {
      return this.modelValue.schema.i18n
    },
    selectedItem () {
      return this.formItemSelected
    },
    isRootSelected () {
      return this.formItemSelected && this.formItemSelected.name === '.'
    },
    items () {
      if (this.value && this.value.schema) {
        return [this.value.schema]
      }
      return []
    },
    canPaste () {
      return this.formItemCut !== null || this.formItemCopied !== null
    }
  },
  watch: {
    selected (newValue, oldValue) {
      if (newValue === null) {
        this.selected = oldValue
      } else {
        const found = this.findItemAndParent(newValue)
        this.selectItem(found.item)
      }
    }
  },
  methods: {
    selectItem (item) {
      this.formItemSelected = item
    },
    addItem (itemToAdd, name) {
      const found = this.findItemAndParent(this.selected)
      let i = 1
      let test = this.findItemAndParent('ITEM' + i)
      while (test.item !== null) {
        i = i + 1
        test = this.findItemAndParent('ITEM' + i)
      }
      const newItem = itemToAdd ? { ...itemToAdd } : {
        name: 'ITEM' + i,
        type: 'text',
        label: 'item_' + i
      }
      newItem.name = name || ('ITEM' + i)
      if (found.item !== null && found.item.type === 'group') {
        // add last in the group
        if (!found.item.items) {
          found.item.items = [newItem]
        } else {
          found.item.items.push(newItem)
        }
      } else if (found.parent) {
        // add after selected one
        const idx = found.parent.items.indexOf(found.item)
        found.parent.items.splice(idx + 1, 0, newItem)
      } else {
        found.item.items.push(newItem)
      }
      this.selected = newItem.name
    },
    selectUpItem () {
      if (this.selected === null) {
        return
      }
      const found = this.findItemAndParent(this.selected)
      if (found.parent === null) {
        return
      }
      const idx = found.parent.items.indexOf(found.item)
      if (idx === 0 && (!found.parent.type || found.parent.type === 'group')) {
        this.selected = found.parent.name // case selected item is a group or main form
      } else if (idx > 0) {
        const upItem = found.parent.items[idx - 1]
        if (upItem.type === 'group' && upItem.items && upItem.items.length > 0) {
          this.selected = upItem.items[upItem.items.length - 1].name // case selected item is after a group with items
        } else {
          this.selected = upItem.name // case regular up item
        }
      }
    },
    moveUpItem (item) {
      let found = this.findItemAndParent(item.name)
      if (found.item === null) {
        return
      }

      let idx = found.parent.items.indexOf(item)
      if (found.parent.type === 'group') {
        found.parent.items.splice(idx, 1)
        if (idx === 0) {
          // case first in a group, move item before the group
          found = this.findItemAndParent(found.parent.name)
          idx = found.parent.items.indexOf(found.item)
          found.parent.items.splice(idx, 0, item)
        } else {
          // case move up in the group
          found.parent.items.splice(idx - 1, 0, item)
        }
      } else if (idx > 0) {
        found.parent.items.splice(idx, 1)
        const upItem = found.parent.items[idx - 1]
        if (upItem.type === 'group') {
          // case up item is a group, then insert it as last item
          if (!upItem.items) {
            upItem.items = [item]
          } else {
            upItem.items.push(item)
          }
        } else {
          // regular case
          found.parent.items.splice(idx - 1, 0, item)
        }
      }
    },
    selectDownItem () {
      if (this.selected === null) {
        return
      }

      let found = this.findItemAndParent(this.selected)
      if (found.item.type === 'group' && found.item.items && found.item.items.length > 0) {
        this.selected = found.item.items[0].name // case selected item is a group with items
      } else if (found.parent) {
        let idx = found.parent.items.indexOf(found.item)
        if (idx === found.parent.items.length - 1 && found.parent.type === 'group') {
          found = this.findItemAndParent(found.parent.name)
          idx = found.parent.items.indexOf(found.item) // case selected item is last item in a group
        }
        if (idx < found.parent.items.length - 1) {
          this.selected = found.parent.items[idx + 1].name // case selected is last in the group
        }
      } else if (found.item.items && found.item.items.length > 0) {
        this.selected = found.item.items[0].name
      }
    },
    moveDownItem (item) {
      let found = this.findItemAndParent(item.name)
      if (found.item === null) {
        return
      }

      let idx = found.parent.items.indexOf(item)
      if (found.parent.type === 'group') {
        found.parent.items.splice(idx, 1)
        if (idx === found.parent.items.length) {
          // case it was last, move it after the parent
          found = this.findItemAndParent(found.parent.name)
          idx = found.parent.items.indexOf(found.item)
        }
        found.parent.items.splice(idx + 1, 0, item)
      } else if (idx < found.parent.items.length - 1) {
        found.parent.items.splice(idx, 1)
        const downItem = found.parent.items[idx]
        if (downItem.type === 'group') {
          if (!downItem.items) {
            downItem.items = [item]
          } else {
            downItem.items.splice(0, 0, item)
          }
        } else {
          // regular case
          found.parent.items.splice(idx + 1, 0, item)
        }
      }
    },
    copyItem (item) {
      this.formItemCopied = item
      this.formItemCut = null
    },
    cutItem (item) {
      this.formItemCut = item
      this.formItemCopied = null
    },
    pasteItem (item) {
      if (this.formItemCopied !== null) {
        this.addItem(this.formItemCopied)
      } else if (this.formItemCut !== null) {
        // cannot cut and paste the selected item
        if (this.selected !== this.formItemCut.name) {
          const found = this.findItemAndParent(this.formItemCut.name)
          const idx = found.parent.items.indexOf(this.formItemCut)
          found.parent.items.splice(idx, 1)
          this.addItem(this.formItemCut, this.formItemCut.name)
        }
      }
      this.formItemCut = null
      this.formItemCopied = null
    },
    deleteItem (item) {
      const found = this.findItemAndParent(item.name)
      if (found.item === null) {
        return
      }

      const idx = found.parent.items.indexOf(item)
      if (idx === 0) {
        if (found.parent.type === 'group') {
          this.selected = found.parent.name
        } else {
          this.selectDownItem(item)
        }
      } else {
        this.selectUpItem(item)
      }
      found.parent.items.splice(idx, 1)
      if (this.value.schema.items.length === 0) {
        this.selectItem(this.value.schema)
      }
    },
    isItemSelected (item) {
      return this.formItemSelected && this.formItemSelected.name === item.name
    },
    findItemAndParent (name) {
      if (name === '.') {
        return {
          parent: null,
          name: name,
          item: this.value.schema
        }
      }
      return this.findItemInParent(this.value.schema, name)
    },
    findItemInParent (parent, name) {
      let rval = {
        parent: parent,
        name: name,
        item: null
      }

      if (parent.items) {
        const item = parent.items.filter(it => it.name === name).pop()
        if (item) {
          rval.item = item
          return rval
        } else {
          const groups = parent.items.filter(it => it.type === 'group')
          if (groups) {
            groups.forEach(group => {
              if (rval.item === null) {
                const grval = this.findItemInParent(group, name)
                if (grval.item !== null) {
                  rval = grval
                }
              }
            })
          }
        }
      }
      return rval
    }
  }
})
</script>
