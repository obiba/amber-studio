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
    design: 'Design',
    title: 'Study',
    definition: 'Definition',
    forms: 'Forms',
    forms_hint: 'A form defines how to collect data. It is made of a schema (questions, sections, computed fields etc.) and of revisions (each revision is a snapshot of the form at a given point of time). A form (or a form revision) cannot be deleted when there are associated records. See the <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/content/forms.html" target="_blank">Forms documentation</a>.',
    form_hint: 'The form schema is a sequence of items: see the <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/content/items/index.html" target="_blank">Form items documentation</a>. See also the <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/cookbook/form-builder/" target="_blank">Form builder cookbook</a> for standard operation procedures and best practices. Data collection is based on form revisions, allowing the safe edition of the form and the tracking of form changes in the records.',
    data_collection: 'Data collection',
    case_report_forms: 'Case report Forms',
    case_report_forms_hint: 'A case report form is based on a specific (or the latest) form revision. Case reports are recorded after the form is completed. Access to the case report form can be limited to a set of users or groups of users. A case report form can be enabled or disabled at any time. See the <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/content/crfs.html" target="_blank">Case report forms documentation</a> and the <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/cookbook/case-reports/" target="_blank">Case reports cookbook</a>.',
    interviews: 'Interviews',
    instruments: 'Instruments',
    records: 'Records',
    records_hint: 'Data records (case reports) are captured through a case report form, which is itself based on a form revision. See the <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/content/records.html" target="_blank">Records documentation</a> and the <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/cookbook/case-reports/" target="_blank">Case reports cookbook</a>.',
    events: 'Events',
    form: 'Form',
    form_revision: 'Revision',
    form_permitted_users: 'Permitted users',
    form_permitted_groups: 'Permitted groups',
    add_study_form_hint: 'Add a new form',
    delete_study_forms_hint: 'Delete selected forms',
    search_study_form_hint: 'Search by name or description',
    edit_study_form_hint: 'Edit form',
    delete_study_form_hint: 'Delete form',
    delete_study_form_confirm: 'Please confirm that you want to remove the form:',
    delete_study_forms_confirm: 'Please confirm that you want to remove all the selected forms:',
    add_case_report_form_hint: 'Add a case report form',
    edit_case_report_form_hint: 'Edit the case report form',
    import_schema: 'Import schema file',
    import_schema_hint: 'Optional schema file to import. Includes form items and translations.',
    latest_revision: '(latest)',
    search_case_report_form_hint: 'Search by revision',
    start_case_report_form_hint: 'Start case report form',
    pause_case_report_form_hint: 'Pause case report form',
    add_form_revision_confirm: 'There is no revision tag for the selected form. Would you like to add one?',
    delete_case_report_form_hint: 'Delete case report form',
    delete_case_report_form_confirm: 'Please confirm that you want to remove the case report form:',
    delete_case_report_forms_hint: 'Delete selected case report forms',
    delete_case_report_forms_confirm: 'Please confirm that you want to remove all the selected case report forms:',
    case_report_form_state: {
      active: 'Active',
      paused: 'Paused'
    },
    search_case_report_hint: 'Search case reports by ID',
    view_case_report_hint: 'View the case report',
    delete_case_report_hint: 'Delete case report',
    delete_case_report_confirm: 'Please confirm that you want to remove the case report:',
    delete_case_reports_hint: 'Delete selected case reports',
    delete_case_reports_confirm: 'Please confirm that you want to remove all the selected case reports:',
    case_report_state: {
      in_progress: 'In progress',
      completed: 'Completed'
    },
    export_case_reports_hint: 'Export case reports',
    all_forms: '(all)'
  },
  datasets: {
    title: 'Datasets'
  },
  main: {
    brand: 'Amber Studio',
    brand_caption: 'Case reporting system',
    organisation: 'OBiBa',
    profile: 'Profile',
    my_profile: 'My profile',
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
    guest: 'Guest',
    interviewer: 'Interviewer',
    manager: 'Manager',
    administrator: 'Administrator',
    inactive: 'Inactive'
  },
  error: {
    general: 'There was an error while processing this request. If this problem persists, contact support.',
    account_already_exists: 'This account already exists. Try resetting your password or contact support.',
    create_account_invalid: 'The account information are not valid.',
    create_account: 'There was an error while creating your account. If this issue persists, contact support.',
    update_account: 'There was an error while updating your profile. If this persists, contact support.',
    get_users: 'There was an error while retrieving users.',
    get_user: 'There was an error while retrieving the user.',
    get_groups: 'There was an error while retrieving groups.',
    get_group: 'There was an error while retrieving the group.',
    get_group_users: 'There was an error while retrieving the users of the group.',
    get_studies: 'There was an error while retrieving studies.',
    get_study: 'There was an error while retrieving the study.',
    get_study_forms: 'There was an error while retrieving forms.',
    get_study_form: 'There was an error while retrieving the form.',
    get_form_revisions: 'There was an error while retrieving form\'s versions.',
    get_case_report_forms: 'There was an error while retrieving the case report forms.',
    get_case_reports: 'There was an error while retrieving the case reports.',
    form_revision_has_case_reports: 'The form {name} with revision {revision} cannot be removed because case reports are still associated to it.'
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
    create_study_form: 'Form successfully added. Edit to add items.',
    update_study_form: 'Form successfully updated.',
    delete_study_form: 'Form successfully deleted.',
    delete_study_forms: 'Forms successfully deleted.',
    tagged_form: 'Form successfully tagged.',
    delete_form_revision: 'Form tag successfully deleted.',
    delete_form_revisions: 'Form tags successfully deleted.',
    create_case_report_form: 'Case report form successfully added.',
    update_case_report_form: 'Case report form successfully updated.',
    delete_case_report_form: 'Case report form successfully deleted.',
    delete_case_report_forms: 'Case report forms successfully deleted.'
  },
  form: {
    tr_add: 'Add translation',
    tr_add_key: 'Add a translation key',
    tr_merge_items: 'Merge with items translation keys',
    tr_merge_confirm: 'Please confirm that you want to merge observed item settings (label, description, placeholder, hint and validation message) as translation keys. Existing translation keys will not be modified.',
    tr_clean: 'Remove translations unused in the items',
    tr_clean_confirm: 'Please confirm the removal of the translation keys which cannot be observed in the item settings (label, description, placeholder, hint and validation message).',
    tr_delete_selected: 'Remove the selected translations',
    tr_search_hint: 'Search translations',
    tr_key: 'Key',
    tr_value: 'Translation',
    tr_delete_selected_confirm: 'Please confirm that you want to remove all the selected translations.',
    import_schema: 'Schema file',
    import_schema_hint: 'Schema file to import. Form items and translations will be replaced by the ones provided.',
    add_item_hint: 'Add a form item',
    design: 'Design',
    schema: 'Schema',
    preview: 'Preview',
    preview_data_clear: 'Clear',
    definition: 'Definition',
    logic: 'Logic',
    settings: 'Settings',
    style: 'Style',
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
      autocomplete: 'Auto complete',
      'image-select': 'Image select',
      toggle: 'Toggle',
      slider: 'Slider',
      section: 'Section',
      group: 'Group',
      rating: 'Rating',
      computed: 'Computed',
      map: 'Geographic data'
    },
    title: 'Title',
    form_title_hint: 'Published form title',
    form_description_hint: 'Published description of the form.',
    copyright: 'Copyright',
    form_copyright_hint: 'The intellectual property on this form.',
    license: 'License',
    form_license_hint: 'License under which the form can be used and shared.',
    form_license_cc: 'Suggested licenses are the ones of <a href="https://creativecommons.org/about/cclicenses/" target="_blank">Creative Commons</a>.',
    id_label: 'ID label',
    id_label_hint: 'Patient or participant\'s unique identifier field label.',
    id_description: 'ID instructions',
    id_description_hint: 'Instructions for the input of the patient or participant\'s unique identifier field.',
    id_mask: 'ID mask',
    id_validation: 'ID validation',
    id_validation_hint: 'ID validation rule script. Use $(\'_id\') to access the ID value. When evaluated to false, the field is in error.',
    id_validation_message: 'ID validation message',
    label: 'Label',
    label_hint: 'Field label or title.',
    label_class: 'Label class',
    label_class_hint: 'CSS class to apply to field\'s label or title.',
    image_class: 'Image class',
    image_class_hint: 'CSS class to apply to the image.',
    description: 'Description',
    description_hint: 'Description or help text below the field\'s label.',
    description_class: 'Description class',
    description_class_hint: 'CSS class to apply to field\'s description.',
    validation: 'Validation',
    validation_hint: 'Validation rule script. When evaluated to false, the field is in error.',
    validation_message: 'Validation error message',
    validation_message_hint: 'Message to display when validation fails.',
    compute: 'Compute',
    compute_hint: 'Computation script.',
    condition: 'Condition',
    condition_hint: 'Visibility condition script. When not visible, the field\'s value is removed.',
    default: 'Default',
    default_hint: 'Default value.',
    placeholder: 'Placeholder',
    placeholder_hint: 'Help text within the field.',
    close_label: 'Close label',
    close_label_hint: 'Adds a button with the provided label to close the popup.',
    hint: 'Hint',
    hint_hint: 'Help text below the field.',
    mask: 'Mask',
    mask_hint: 'Text formating using a mask (see documentation for input mask coding).',
    required: 'Required',
    required_hint: 'Whether a value is required. Checked before value validation.',
    multiple: 'Multiple choices',
    new_value: 'Can enter new value (not in the options)',
    min: 'Minimum',
    min_hint: 'Minimum value.',
    max: 'Maximum',
    max_hint: 'Maximum value.',
    format: 'Format',
    format_hint: 'Value formatting rule.',
    geo: {
      types: {
        Point: 'Point',
        Polygon: 'Polygon'
      },
      type: 'Geometry type',
      type_hint: 'The type of geometry to be drawn on the map.',
      center: 'Map center',
      center_hint: 'Position of the center of the map, using format: [longitude,latitude]. Default is [0,0].',
      zoom: 'Zoom',
      zoom_hint: 'Initial zoom, default is 12.',
      geo_location: 'With geo location reported by device',
      map_height: 'Map height',
      map_height_hint: 'Default height is 400px.'
    },
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
    show_more_options: 'Show more...',
    add_option_hint: 'Add an option',
    delete_options_hint: 'Delete all options',
    upload_options: 'Upload options',
    upload_options_hint: 'Upload options from a text file (.txt, .csv, .tsv).',
    image: 'Image',
    image_hint: 'Define an image and its areas of selection.',
    image_src: 'Image source',
    image_src_hint: 'Image source can be a web address or base64 format encoded.',
    upload_image: 'Upload image',
    upload_image_hint: 'Upload image from a file (.jpg, .png).',
    image_areas: 'Image areas',
    image_areas_hint: 'Selection areas are polygons with a color and a value to be associated with an option. Several areas can select the same value. Points are space-separated x,y coordinates.',
    area_value: 'Value',
    area_fill: 'Color',
    area_points: 'Points',
    show_more_areas: 'Show more...',
    add_area_hint: 'Add an image area',
    delete_areas_hint: 'Delete all image areas',
    upload_areas: 'Upload areas',
    upload_areas_hint: 'Upload image areas from a text file (.txt, .csv, .tsv).',
    show_area_select: 'Show options selection widget',
    select_next: 'Select next item (Alt-Down)',
    select_previous: 'Select previous item (Alt-Up)',
    move_up: 'Move item up',
    move_down: 'Move item down',
    copy_item: 'Copy item',
    cut_item: 'Cut item',
    paste_item: 'Paste item',
    paste_copied_item: 'Add copy of item: {name}',
    paste_cut_item: 'Move item: {name}',
    delete: 'Delete item',
    no_item_selected: 'No item selected.',
    revisions: 'Revisions',
    items: 'Items',
    translations: 'Translations',
    no_revision: 'No form revisions have been tagged. Tagging the form is required so that it can be referred by a case report form.',
    search_form_revision_hint: 'Search by revision number or comment',
    export_form_revision_hint: 'Export form',
    view_form_revision_hint: 'View form',
    reinstate_form_revision_hint: 'Reinstate revision',
    reinstate_form_revision_confirm: 'Please confirm that you want to reinstate the form revision:',
    delete_form_revisions_hint: 'Delete selected revisions',
    delete_form_revisions_confirm: 'Please confirm that you want to delete the selected form revisions:',
    delete_form_revision_hint: 'Delete form revision',
    delete_form_revision_confirm: 'Please confirm that you want to delete the form revision:',
    tag_comment_hint: 'Optional comment about the changes in the form\'s schema.'
  },
  license: {
    cc_by_40: 'Creative Commons BY 4.0',
    cc_by_sa_40: 'Creative Commons BY SA 4.0',
    cc_by_nc_40: 'Creative Commons BY NC 4.0',
    cc_by_nc_sa_40: 'Creative Commons BY NC SA 4.0',
    cc_by_nd_40: 'Creative Commons BY ND 4.0',
    cc_by_nc_nd_40: 'Creative Commons BY NC ND 4.0',
    cc_cc0_10: 'Creative Commons CC0 1.0'
  },
  add: 'Add',
  update: 'Update',
  delete: 'Delete',
  cancel: 'Cancel',
  save: 'Save',
  saving: 'Saving...',
  save_done: 'All changes saved',
  edit_settings: 'Edit settings',
  reinstate: 'Reinstate',
  export: 'Export',
  import: 'Import',
  tag: 'Tag',
  search: 'Search',
  role: 'Role',
  institution: 'Institution',
  city: 'City',
  title: 'Title',
  phone: 'Phone',
  email: 'Email',
  email_hint: 'Verifiable email address.',
  password: 'Password',
  password_hint: 'Create a password. 8 character minimum with lower and upper case, digit and special character.',
  firstname: 'First Name',
  lastname: 'Last Name',
  preferred_language: 'Preferred Language',
  name: 'Name',
  description: 'Description',
  comment: 'Comment',
  revision: 'Revision',
  permissions: 'Permissions',
  restricted_access: 'Restricted access',
  state: 'State',
  date: 'Date',
  status: 'Status',
  members: 'Members',
  action: 'Action',
  required: 'Required',
  confirmed: 'Confirmed',
  pending: 'Pending',
  unknown: 'Unknown',
  no_results: 'No results',
  close: 'Close',
  id: 'ID',
  go_home: 'Go Home',
  nothing_here: 'Oops. Nothing here...',
  updated_at: 'Updated at'
}
