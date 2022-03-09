const FormMixin = {
  methods: {
    generateId () {
      return Date.now() + Math.floor(Math.random() * 100) + ''
    },
    generateIds (items) {
      if (items) {
        items.forEach(item => {
          if (!item._id) {
            item._id = this.generateId()
          }
          if (item.items) {
            this.generateIds(item.items)
          }
        })
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
