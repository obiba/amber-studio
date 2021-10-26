export default {
  account: {
    title: 'User Account'
  },
  login: {
    title: 'Sign in to start your session',
    submit: 'Sign in',
    forgot_password: "Forgot password?",
    register: 'Sign up'
  },
  register: {
    title: 'Register new membership',
    submit: 'Sign up',
    login: 'Sign in',
    success: 'Registration complete! Please check your email to confirm your registration.',
    google_policy: 'This site is protected by reCAPTCHA and the Google <a class="text-grey" href="https://policies.google.com/privacy">Privacy Policy</a> and <a class="text-grey" href="https://policies.google.com/terms">Terms of Service</a> apply.'
  },
  forgot_password: {
    title: 'Reset password',
    hint: 'Enter account\'s email to reset password.',
    submit: 'Reset',
    login: 'Sign in'
  },
  reset: {
    title: 'Reset password',
    submit: 'Reset',
    bad_link: 'Not a valid password reset link. Please check your email for the password reset link and try again.',
    failure: 'Unable to reset password. Please contact support.',
    success: 'Password successfully changed.'
  },
  verify: {
    title: 'Verify email',
    login: 'Sign in',
    bad_link: 'Not a valid email verification link. Please check your email for the verification link and try again.',
    failure: 'Unable to verify email. Please contact support.',
    success: 'Thanks, your eamil address is verified.',
    pending: 'Verifying account... please wait...'
  },
  users: {
    title: 'Users',
    edit_user_hint: 'Edit user',
    resend_email_hint: 'Resend verification email',
    reset_password_hint: 'Reset password',
    activate_user_hint: 'Activate user',
    deactivate_user_hint: 'Deactivate user',
    add_user_hint: 'Add a new user',
    group_users_hint: 'Group selected users',
    group_add_hint: 'Group in which the users will be added',
    delete_users_hint: 'Delete selected users',
    delete_users_confirm: 'Please confirm that you want to remove all the selected users:',
    delete_user_hint: 'Delete user',
    delete_user_confirm: 'Please confirm that you want to remove the user:',
    last_seen: 'Last Seen',
    roles_filter: 'Roles',
    search_hint: 'Search by name or email'
  },
  groups: {
    title: 'Groups',
    edit_group_hint: 'Edit group',
    add_group_hint: 'Add a new group',
    delete_groups: 'Delete Groups',
    delete_groups_hint: 'Delete selected groups',
    delete_groups_confirm: 'Please confirm that you want to remove all the selected groups (users will not be affected):',
    delete_group_hint: 'Delete group',
    delete_group_confirm: 'Please confirm that you want to remove the group (users will not be affected):',
    search_hint: 'Search by name or description'
  },
  group: {
    title: 'Group',
    search_users: 'Search',
    search_users_hint: 'Search users to add by email or name'
  },
  studies: {
    title: 'Studies',
    edit_study_hint: 'Edit study',
    add_study_hint: 'Add a new study',
    delete_studies: 'Delete Studies',
    delete_studies_hint: 'Delete selected studies',
    delete_studies_confirm: 'Please confirm that you want to remove all the selected studies:',
    delete_study_hint: 'Delete study',
    delete_study_confirm: 'Please confirm that you want to remove the study:',
    search_hint: 'Search by name or description'
  },
  study: {
    title: 'Study',
    definition: 'Definition',
    forms: 'Forms',
    events: 'Events'
  },
  datasets: {
    title: 'Datasets',
  },
  main: {
    brand: 'Amber Studio',
    organisation: 'OBiBa',
    profile: 'Profile',
    logout: 'Sign out',
    dashboard: 'Dashboard',
    settings: 'Settings',
    copyright: 'Copyright',
    all_rights_reserved: 'All rights reserved',
    powered_by: 'Powered by'
  },
  loading: {
    title: 'Loading',
    caption: 'Please wait...'
  },
  validations: {
    required: 'Value is required',
    minLength: 'The minimum length required is {min}',
    maxLength: 'The maximum length allowed is {max}',
    email: 'Value is not a valid email address'
  },
  locales: {
    en: 'English',
    fr: 'français'
  },
  roles: {
    guest: 'Gest',
    interviewer: 'Interviewer',
    manager: 'Manager',
    administrator: 'Administrator',
    inactive: 'Inactive'
  },
  error: {
    general: 'There was an error processing this request. If this problem persists, contact support.',
    account_already_exists: 'This account already exists. Try resetting your password or contact support.',
    create_account: 'There was an error creating your account. If this issue persists, contact support.',
    update_account: 'There was an error updating your profile. If this persists, contact support.',
    get_users: 'There was an error retrieving users.',
    get_user: 'There was an error retrieving the user.',
    get_groups: 'There was an error retrieving groups.',
    get_group: 'There was an error retrieving the group.',
    get_group_users: 'There was an error retrieving the users of the group.',
  },
  success: {
    create_account: 'Account successfully created. Please check your email to verify your account.',
    update_account: 'Account successfully updated.',
    send_reset_password: 'Password reset sent.',
    reset_password: 'Password reset successful.',
    update_password: 'Password update successful.',
    send_verify_email: 'Email verification sent. Verify new email to update your email address.',
    resend_verify_email: 'Email verification resent.',
    create_user: 'User successfully added.',
    update_user: 'User successfully updated.',
    delete_user: 'User successfully deleted.',
    delete_users: 'Users successfully deleted.',
    create_group: 'Group successfully added. Edit to add members.',
    update_group: 'Group successfully updated.',
    delete_group: 'Group successfully deleted.',
    delete_groups: 'Groups successfully deleted.',
    create_study: 'Study successfully added. Edit to add populations and forms.',
    update_study: 'Study successfully updated.',
    delete_study: 'Study successfully deleted.',
    delete_studies: 'Studies successfully deleted.',
  },
  add: 'Add',
  update: 'Update',
  delete: 'Delete',
  cancel: 'Cancel',
  save: 'Save',
  search: 'Search',
  role: 'Role',
  institution: 'Institution',
  city: 'City',
  title: 'Title',
  phone: 'Phone',
  email: 'Email',
  email_hint: 'Verifiable email address.',
  password: 'Password',
  password_hint: 'Create a password. 8 character minimum.',
  firstname: 'First Name',
  lastname: 'Last Name',
  preferred_language: 'Preferred Language',
  name: 'Name',
  description: 'Description',
  status: 'Status',
  members: 'Members',
  action: 'Action',
  required: 'Required',
  confirmed: 'Confirmed',
  pending: 'Pending',
  unknown: 'Unknown',
  no_results: 'No results'
}
