import { mapState } from 'vuex'

const AuthMixin = {
  computed: {
    ...mapState({
      user: state => state.auth.payload ? state.auth.payload.user : undefined
    }),
    isAdministrator () {
      if (this.user) {
        return this.user.role === 'administrator'
      }
      return false
    },
    isManager () {
      if (this.user) {
        return this.user.role === 'manager'
      }
      return false
    },
    isReadOnly () {
      return !this.isAdministrator && !this.isManager
    },
    isInterviewer () {
      if (this.user) {
        return this.user.role === 'interviewer'
      }
      return false
    },
    isGuest () {
      if (this.user) {
        return this.user.role === 'guest'
      }
      return true
    },
    userEmail () {
      if (this.user) {
        return this.user.email
      }
      return '?'
    }
  }
}

export default AuthMixin
