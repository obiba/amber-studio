<template>
  <div>
    <q-splitter
      v-model="splitterModel">

      <template v-slot:before>
        <div class="q-ma-sm">
          <q-btn
            color="secondary"
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
            color="secondary"
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
            color="secondary"
            size="10px"
            flat
            dense
            round
            icon='add'
            :title="$t('form.add_item_hint')"
            @click='addItem()'>
          </q-btn>
        </div>
        <q-separator/>
        <div class="q-pl-sm">
          <q-tree
            v-if="items.length>0"
            :nodes="items"
            node-key="_id"
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
                color="secondary"
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
                color="secondary"
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
                color="secondary"
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
                color="secondary"
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
                color="secondary"
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
                color="secondary"
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

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuth } from 'src/composables/useAuth'
import { useFormUtils } from 'src/composables/useFormUtils'
import FormItem from 'src/components/forms/FormItem.vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const { isReadOnly } = useAuth()
const { generateId } = useFormUtils()

// Refs
const splitterModel = ref(20)
const formItemSelected = ref(null)
const selected = ref(null)
const formItemCut = ref(null)
const formItemCopied = ref(null)

// Computed
const value = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emit('update:modelValue', val)
  }
})

const i18n = computed(() => {
  return props.modelValue.schema.i18n
})

const selectedItem = computed(() => {
  return formItemSelected.value
})

const isRootSelected = computed(() => {
  return formItemSelected.value && formItemSelected.value.name === '.'
})

const items = computed(() => {
  if (value.value && value.value.schema) {
    return [value.value.schema]
  }
  return []
})

const canPaste = computed(() => {
  return formItemCut.value !== null || formItemCopied.value !== null
})

// Watch
watch(selected, (newValue, oldValue) => {
  if (newValue === null) {
    selected.value = oldValue
  } else {
    const found = findItemAndParent(newValue)
    selectItem(found.item)
  }
})

// Methods
function selectItem (item) {
  formItemSelected.value = item
}

function addItem (itemToAdd, name) {
  const found = findItemAndParent(selected.value)

  const makeNewName = function (items) {
    let i = 1
    if (items) {
      let found = items.filter(item => item.name === 'ITEM' + i).pop()
      while (found) {
        i++
        found = items.filter(item => item.name === 'ITEM' + i).pop()
      }
    }
    return 'ITEM' + i
  }

  const newItem = itemToAdd ? { ...itemToAdd } : {
    type: 'text',
    label: 'item_label'
  }
  newItem._id = generateId()
  if (found.item !== null && found.item.type === 'group') {
    newItem.name = name || makeNewName(found.item.items)
    // add last in the group
    if (!found.item.items) {
      found.item.items = [newItem]
    } else {
      found.item.items.push(newItem)
    }
  } else if (found.parent) {
    newItem.name = name || makeNewName(found.parent.items)
    // add after selected one
    const idx = found.parent.items.indexOf(found.item)
    found.parent.items.splice(idx + 1, 0, newItem)
  } else {
    newItem.name = name || makeNewName(found.item.items)
    found.item.items.push(newItem)
  }
  selected.value = newItem._id
}

function selectUpItem () {
  if (selected.value === null) {
    return
  }
  const found = findItemAndParent(selected.value)
  if (found.parent === null) {
    return
  }
  const idx = found.parent.items.indexOf(found.item)
  if (idx === 0 && (!found.parent.type || found.parent.type === 'group')) {
    selected.value = found.parent._id // case selected item is a group or main form
  } else if (idx > 0) {
    const upItem = found.parent.items[idx - 1]
    if (upItem.type === 'group' && upItem.items && upItem.items.length > 0) {
      selected.value = upItem.items[upItem.items.length - 1]._id // case selected item is after a group with items
    } else {
      selected.value = upItem._id // case regular up item
    }
  }
}

function moveUpItem (item) {
  let found = findItemAndParent(item._id)
  if (found.item === null) {
    return
  }

  let idx = found.parent.items.indexOf(item)
  if (found.parent.type === 'group') {
    found.parent.items.splice(idx, 1)
    if (idx === 0) {
      // case first in a group, move item before the group
      found = findItemAndParent(found.parent._id)
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
}

function selectDownItem () {
  console.log(selected.value)
  if (selected.value === null) {
    return
  }

  let found = findItemAndParent(selected.value)
  if (found.item.type === 'group' && found.item.items && found.item.items.length > 0) {
    selected.value = found.item.items[0]._id // case selected item is a group with items
  } else if (found.parent) {
    let idx = found.parent.items.indexOf(found.item)
    if (idx === found.parent.items.length - 1 && found.parent.type === 'group') {
      found = findItemAndParent(found.parent._id)
      idx = found.parent.items.indexOf(found.item) // case selected item is last item in a group
    }
    if (idx < found.parent.items.length - 1) {
      selected.value = found.parent.items[idx + 1]._id // case selected is last in the group
    }
  } else if (found.item.items && found.item.items.length > 0) {
    selected.value = found.item.items[0]._id
  }
}

function moveDownItem (item) {
  let found = findItemAndParent(item._id)
  if (found.item === null) {
    return
  }

  let idx = found.parent.items.indexOf(item)
  if (found.parent.type === 'group') {
    found.parent.items.splice(idx, 1)
    if (idx === found.parent.items.length) {
      // case it was last, move it after the parent
      found = findItemAndParent(found.parent._id)
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
}

function copyItem (item) {
  formItemCopied.value = item
  formItemCut.value = null
}

function cutItem (item) {
  formItemCut.value = item
  formItemCopied.value = null
}

function pasteItem (item) {
  if (formItemCopied.value !== null) {
    addItem(formItemCopied.value)
  } else if (formItemCut.value !== null) {
    // cannot cut and paste the selected item
    if (selected.value !== formItemCut.value.name) {
      const found = findItemAndParent(formItemCut.value._id)
      const idx = found.parent.items.indexOf(formItemCut.value)
      found.parent.items.splice(idx, 1)
      addItem(formItemCut.value, formItemCut.value.name)
    }
  }
  formItemCut.value = null
  formItemCopied.value = null
}

function deleteItem (item) {
  const found = findItemAndParent(item._id)
  if (found.item === null) {
    return
  }

  const idx = found.parent.items.indexOf(item)
  if (idx === 0) {
    if (found.parent.type === 'group') {
      selected.value = found.parent.name
    } else {
      selectDownItem(item)
    }
  } else {
    selectUpItem(item)
  }
  found.parent.items.splice(idx, 1)
  if (value.value.schema.items.length === 0) {
    selectItem(value.value.schema)
  }
}

function isItemSelected (item) {
  return formItemSelected.value && formItemSelected.value.name === item.name
}

function findItemAndParent (id) {
  if (id === value.value.schema._id) {
    return {
      parent: null,
      _id: id,
      item: value.value.schema
    }
  }
  return findItemInParent(value.value.schema, id)
}

function findItemInParent (parent, id) {
  let rval = {
    parent: parent,
    _id: id,
    item: null
  }

  if (parent.items) {
    const item = parent.items.filter(it => it._id === id).pop()
    if (item) {
      rval.item = item
      return rval
    } else {
      const groups = parent.items.filter(it => it.type === 'group')
      if (groups) {
        groups.forEach(group => {
          if (rval.item === null) {
            const grval = findItemInParent(group, id)
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
</script>
