import { v4 as uuidv4 } from 'uuid'

export function useFormMixin() {
  function generateId() {
    return uuidv4()
  }

  function generateIds(items) {
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (!items[i]._id) {
          items[i]._id = generateId()
        }
        if (items[i].items) {
          generateIds(items[i].items)
        }
      }
    }
  }

  function deleteIds(items) {
    if (items) {
      items.forEach(item => {
        delete item._id
        if (item.items) {
          deleteIds(item.items)
        }
      })
    }
  }

  return {
    generateId,
    generateIds,
    deleteIds
  }
}
