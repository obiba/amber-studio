export default {
  account: {
    title: 'User Account'
  },
  login: {
    title: 'Sign in to start your session',
    submit: 'Sign in',
    forgot_password: 'Forgot password?',
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
    success: 'Thanks, your email address is verified.',
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
    events: 'Events',
    add_study_form_hint: 'Add a new form',
    delete_study_forms_hint: 'Delete selected forms',
    search_study_form_hint: 'Search by name or description',
    edit_study_form_hint: 'Edit form',
    delete_study_form_hint: 'Delete form',
    delete_study_form_confirm: 'Please confirm that you want to remove the form:',
    delete_study_forms_confirm: 'Please confirm that you want to remove all the selected forms:'
  },
  studyForm: {
    definition: 'Definition',
    items: 'Items',
    translations: 'Translations',
    builder: 'Builder'
  },
  datasets: {
    title: 'Datasets'
  },
  main: {
    brand: 'Amber Studio',
    organisation: 'OBiBa',
    profile: 'Profile',
    logout: 'Sign out',
    dashboard: 'Dashboard',
    content: 'Content',
    administration: 'Administration',
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
    general: 'There was an error while processing this request. If this problem persists, contact support.',
    account_already_exists: 'This account already exists. Try resetting your password or contact support.',
    create_account: 'There was an error while creating your account. If this issue persists, contact support.',
    update_account: 'There was an error while updating your profile. If this persists, contact support.',
    get_users: 'There was an error while retrieving users.',
    get_user: 'There was an error while retrieving the user.',
    get_groups: 'There was an error while retrieving groups.',
    get_group: 'There was an error while retrieving the group.',
    get_group_users: 'There was an error while retrieving the users of the group.',
    get_studies: 'There was an error while retrieving studies.',
    get_study: 'There was an error while retrieving the study.',
    get_study_forms: 'There was an error while retrieving study\'s forms.',
    get_study_form: 'There was an error while retrieving the study\'s form.'
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
    create_study_form: 'Study\'s form successfully added. Edit to add items.',
    update_study_form: 'Study\'s form successfully updated.',
    delete_study_form: 'Study\'s form successfully deleted.',
    delete_study_forms: 'Study\'s forms successfully deleted.'
  },
  form: {
    tr_add: 'Add a translation',
    tr_merge_items: 'Merge with items translation keys',
    tr_clean: 'Remove translations unused in the items',
    tr_delete_selected: 'Remove the selected translations',
    tr_search_hint: 'Search translations',
    tr_key: 'Key',
    tr_value: 'Translation',
    tr_delete_selected_confirm: 'Please confirm that you want to remove all the selected translations.',
    add_item_hint: 'Add a form item',
    builder: 'Builder',
    schema: 'Schema',
    preview: 'Preview',
    preview_data_clear: 'Clear',
    definition: 'Definition',
    logic: 'Logic',
    settings: 'Settings',
    name: 'Name',
    name_hint: 'Required unique identifier, will be used as the variable name.',
    section_hint: 'Name to group items by section.',
    type: 'Type',
    type_hint: 'Required element type.',
    types: {
      form: 'Form',
      text: 'Short answer',
      textarea: 'Paragraph',
      number: 'Number',
      date: 'Date',
      datetime: 'Date and time',
      time: 'Time',
      radiogroup: 'Single choice',
      checkboxgroup: 'Multiple choices',
      select: 'Dropdown',
      multiselect: 'Multi select dropdown',
      toggle: 'Toggle',
      slider: 'Slider',
      section: 'Section',
      group: 'Group',
      rating: 'Rating'
    },
    title: 'Title',
    form_title_hint: 'Published form title',
    form_description_hint: 'Published description of the form.',
    label: 'Label',
    label_hint: 'Field label or title.',
    description: 'Description',
    description_hint: 'Description or help text below the field\'s label.',
    validation: 'Validation',
    validation_hint: 'Validation rule. When evaluated to false, the field is in error.',
    validation_message: 'Validation error message',
    validation_message_hint: 'Message to display when validation fails.',
    condition: 'Condition',
    condition_hint: 'Visibility conditions.',
    default: 'Default',
    default_hint: 'Default value.',
    placeholder: 'Placeholder',
    placeholder_hint: 'Help text within the field.',
    hint: 'Hint',
    hint_hint: 'Help text below the field.',
    min: 'Minimum',
    min_hint: 'Minimum value.',
    max: 'Maximum',
    max_hint: 'Maximum value.',
    format: 'Format',
    format_hint: 'Value formatting rule.',
    icon: 'Icon',
    icon_hint: 'Icon name.',
    size: 'Size',
    size_hint: 'Size of the element.',
    color: 'Color',
    color_hint: 'Color name.',
    options: 'Options',
    options_hint: 'Value is required and unique. If the form is to be translated, provide the translation key as the label.',
    option_value: 'Value',
    option_label: 'Label',
    add_option: 'Add option',
    move_up: 'Move item up',
    move_down: 'Move item down',
    delete: 'Delete item',
    no_item_selected: 'No item selected.'
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
