import { v4 as uuidv4 } from 'uuid'

const FormMixin = {
  methods: {
    generateId () {
      return uuidv4()
    },
    generateIds (items) {
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (!items[i]._id) {
            items[i]._id = this.generateId()
          }
          if (items[i].items) {
            this.generateIds(items[i].items)
          }
        }
      }
    },
    deleteIds (items) {
      if (items) {
        items.forEach(item => {
          delete item._id
          if (item.items) {
            this.deleteIds(item.items)
          }
        })
      }
    }
  }
}

export default FormMixin
