export default {
  account: {
    title: 'Compte utilisateur'
  },
  login: {
    title: 'Identifiez vous pour commencer une session',
    submit: 'Connexion',
    forgot_password: 'Mot de passe oublié ?',
    register: 'Enregistrement',
    validate: 'Valider',
    token: 'Code à 6 chiffres',
    totp: 'Scanner ce code QR avec une app d\'authentification multifacteur (Microsoft authenticator est recommandée), puis entrer le code temporaire indiqué.',
    totp_secret: 'Ou copié ce code secret à ajouter manuellement à l\'application d\'authentification multifacteur.',
    secret_copied: 'Code secret copié.',
    failed: 'Combinaison courriel/mot de passe incorrecte.',
    failed_token: 'Code incorrect.'
  },
  register: {
    title: 'Créer un compte',
    submit: 'S\'enregister',
    login: 'Connexion',
    success: 'Enregistrement effectué ! Veuillez vérifier votre corriel pour confirmer l\'enregistrement.',
    google_policy: 'Ce site est protégé par reCAPTCHA et <a class="text-grey" href="https://policies.google.com/privacy">la politique de confidentialité</a> et <a class="text-grey" href="https://policies.google.com/terms">les conditions d\'utilisation</a> de Google s\'appliquent.'
  },
  forgot_password: {
    title: 'Réinitialiser le mot de passe',
    hint: 'Entrer le courriel du compte pour réinitialiser le mot de passe.',
    submit: 'Réinitialiser',
    login: 'Connexion'
  },
  reset: {
    title: 'Réinitialisation du mot de passe',
    submit: 'Réinitialiser',
    bad_link: 'Ce lien de réinitialisation n\'est pas valide. Veuillez vérifier votre courriel et essayer de nouveau.',
    failure: 'Le changement de mot a échoué. Veuillez contacter le support.',
    success: 'Mot de passe changé avec succés.'
  },
  verify: {
    title: 'Vérification du courriel',
    login: 'Connexion',
    bad_link: 'Ce lien de vérification n\'est pas valide. Veuillez vérifier ce lien et essayer de nouveau.',
    failure: 'La vérification du courriel a échoué. Veuillez contacter le support.',
    success: 'Merci, votre adresse courriel est vérifiée.',
    pending: 'Vérification en cours... merci de patienter...'
  },
  users: {
    title: 'Utilisateurs',
    edit_user_hint: 'Éditer l\'utilisateur',
    resend_email_hint: 'Renvoyer le courriel de vérification',
    reset_password_hint: 'Réinitialiser le mot de passe',
    activate_user_hint: 'Activer l\'utilisateur',
    deactivate_user_hint: 'Désactiver l\'utilisateur',
    add_user_hint: 'Ajouter un nouvel utilisateur',
    group_users_hint: 'Grouper les utilisateurs sélectionnés',
    group_add_hint: 'Groupe dans lequel les utilisateurs seront ajoutés',
    delete_users_hint: 'Supprimer les utilisateurs sélectionnés',
    delete_users_confirm: 'Veuillez confirmer la suppression des utilisateurs sélectionnés :',
    delete_user_hint: 'Supprimer l\'utilisateur',
    delete_user_confirm: 'Veuillez confirmer la suppression de l\'utilisateur :',
    last_seen: 'Dernière conn.',
    roles_filter: 'Rôles',
    search_hint: 'Chercher par nom ou courriel',
    reset_2fa: 'Réinitialiser 2FA',
    required_2fa: 'L\'authentification à deux facteurs (2FA) est requise'
  },
  groups: {
    title: 'Groupes',
    edit_group_hint: 'Éditer le groupe',
    add_group_hint: 'Ajouter un nouveau groupe',
    delete_groups: 'Supprimer',
    delete_groups_hint: 'Supprimer les groupes sélectionnés',
    delete_groups_confirm: 'Veuillez confirmer la suppression des groupes sélectionnés (les utilisateurs ne seront pas affectés) :',
    delete_group_hint: 'Supprimer le groupe',
    delete_group_confirm: 'Veuillez confirmer la suppression du groupe (les utilisateurs ne seront pas affectés) :',
    search_hint: 'Chercher par nom ou description'
  },
  group: {
    title: 'Groupe',
    search_users: 'Chercher',
    search_users_hint: 'Chercher les utilisateurs à ajouter par email ou nom'
  },
  tasks: {
    title: 'Tâches',
    add_task_hint: 'Ajouter une tâche',
    delete_tasks: 'Supprimer les tâches',
    delete_tasks_hint: 'Supprimer les tâches sélectionnées',
    delete_tasks_confirm: 'Veuillez confirmer la suppression de toutes les tâches sélectionnées :',
    delete_task_hint: 'Supprimer la tâche',
    delete_task_confirm: 'Veuillez confirmer la suppression de la tâche :',
    search_hint: 'Chercher par type, état ou message d\'erreur',
    error: 'Erreur',
    types: {
      'participants-init': 'Initialisation des participants',
      'participants-reminder': 'Rappels aux participants',
      'participants-expired': 'Expiration des participants',
      'participants-summary': 'Résumé sur les participants'
    },
    states: {
      in_progress: 'En cours',
      completed: 'Complétée',
      aborted: 'Annulée'
    }
  },
  studies: {
    title: 'Études',
    edit_study_hint: 'Éditer l\'étude',
    add_study_hint: 'Ajouter une nouvelle étude',
    delete_studies_hint: 'Supprimer les études sélectionnées',
    delete_studies_confirm: 'Veuillez confirmer la suppression les études sélectionnés:',
    delete_study_hint: 'Supprimer l\'étude',
    delete_study_confirm: 'Veuillez confirmer la suppression l\'étude:',
    search_hint: 'Chercher par nom ou description'
  },
  study: {
    design: 'Conception',
    title: 'Étude',
    definition: 'Définition',
    forms: 'Formulaires',
    forms_hint: 'Un formulaire définit comment collecter les données. Il est constitué d\'un schéma (questions, sections, champs calculés etc.) et de versions de formulaire (chaque version est un instantané du formulaire à un moment donné). Un formulaire (ou une version de formulaire) ne peut être supprimée quand des enregistrements y sont associés. Voir la <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/content/forms.html" target="_blank">Documentation des formulaires [en]</a>.',
    form_hint: 'Le schéma du formulaire est une suite d\'éléments: voir la <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/content/items/index.html" target="_blank">Documentation des éléments de formulaire [en]</a>. Voir également les <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/cookbook/form-builder/index.html" target="_blank">Recettes pour bâtir un formulaire [en]</a>, décrivant procédures standards et bonnes pratiques. La saisie de données se fait à partir d\'une version de formulaire, permettant ainsi l\'édition du formulaire sans affecter la collecte de données et le suivi des changements de formulaire dans les enregistrements.',
    data_collection: 'Collecte de données',
    case_reports: 'Rapports de cas',
    case_report_form: 'Formulaire de rapport de cas',
    case_report_forms: 'Formulaires de rapport de cas',
    case_report_forms_hint: 'Un formulaire de rapport de cas est basé sur une version de formulaire spécifique (ou la dernière). Les rapports de cas sont enregistrés quand le formulaire a été complété. L\'accès au formulaire de rapport de cas peut être restreint à un ensemble d\'utilisateurs ou de groupes d\'utilisateurs. Un formulaire de rapport de cas peut être (dés)activé à n\'importe quel moment. Voir la <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/content/crfs.html" target="_blank">Documentation des formulaires de rapport de cas [en]</a> ainsi que les <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/cookbook/case-reports/" target="_blank">Recettes sur les rapports de cas [en]</a>.',
    interviews: 'Entrevues',
    instruments: 'Instruments',
    records: 'Enregistrements',
    case_report_records: 'Enregistrements de rapport de cas',
    case_report_records_hint: 'Les données enregistrées (rapport de cas) ont été saisies via un formulaire de rapport de cas, qui est lui-même associé à une version de formulaire. Voir la <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/content/records.html" target="_blank">Documentation des enregistrements [en]</a> ainsi que les <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/cookbook/case-reports/" target="_blank">Recettes sur les rapports de cas [en]</a>',
    events: 'Évènements',
    form: 'Formulaire',
    form_revision: 'Version',
    permitted_users: 'Utilisateurs ayant accès',
    permitted_groups: 'Groupes ayant accès',
    add_study_form_hint: 'Ajouter un nouveau formulaire',
    delete_study_forms_hint: 'Supprimer les fomulaires sélectionnés',
    search_study_form_hint: 'Chercher par nom ou description',
    edit_study_form_hint: 'Éditer le formulaire',
    delete_study_form_hint: 'Supprimer le formulaire',
    delete_study_form_confirm: 'Veuillez confirmer la suppression du formulaire:',
    delete_study_forms_confirm: 'Veuillez confirmer la suppression des formulaires sélectionnés:',
    add_case_report_form_hint: 'Ajouter un formulaire de rapport de cas',
    edit_case_report_form_hint: 'Éditer le formulaire de rapport de cas',
    import_schema: 'Import d\'un ficher de schéma',
    import_schema_hint: 'Fichier de schéma à importer, incluant les éléments et les traductions du formulaire.',
    latest_revision: '(dernière)',
    search_case_report_form_hint: 'Chercher par version',
    start_case_report_form_hint: 'Démarrer le fomulaire de rapport de cas',
    pause_case_report_form_hint: 'Metter en pause le fomulaire de rapport de cas',
    add_form_revision_confirm: 'Il n\'y a pas de version pour le formulaire sélectionné. Voulez vous en ajouter une?',
    delete_case_report_form_hint: 'Supprimer le fomulaire de rapport de cas',
    delete_case_report_form_confirm: 'Veuillez confirmer la suppression du formulaires de rapport de cas:',
    delete_case_report_forms_hint: 'Supprimer les fomulaires de rapport de cas sélectionnés',
    delete_case_report_forms_confirm: 'Veuillez confirmer la suppression des formulaires de rapport de cas sélectionnés:',
    case_report_form_state: {
      active: 'Actif',
      paused: 'En pause'
    },
    case_report_form_repeat_policy: {
      title: 'Enregistrements',
      hint: 'La stratégie à adopter quand un enregistrement est soumis plusieurs fois (basé sur l\'identifiant personel). Plusieurs enregistrements peuvent être accepté, ou un unique enregistrement pour un individu donné. Dans ce dernier cas, un nouvel enregistrement sera rejeté ou mettre à jour l\'enregistrement existant.',
      single_reject: 'Enregistrement unique, rejet',
      single_update: 'Enregistrement unique, mise à jour',
      multiple: 'Enregistrements multiples'
    },
    search_case_report_hint: 'Chercher par ID',
    view_case_report_hint: 'Voir le rapport de cas',
    edit_case_report_hint: 'Éditer le rapport de cas',
    delete_case_report_hint: 'Supprimer le rapport de cas',
    delete_case_report_confirm: 'Veuillez confirmer que vous voulez supprimer le rapport de cas:',
    delete_case_reports_hint: 'Supprimer les rapports de case sélectionnés',
    delete_case_reports_confirm: 'Veuillez confirmer que vous voulez supprimer tous les rapport de cas sélectionnés:',
    case_report_state: {
      in_progress: 'En cours',
      completed: 'Complété'
    },
    export_case_reports_hint: 'Exporter les rapports de cas',
    all_forms: '(tous)',
    designs: 'Conceptions',
    interview_design: 'Conception d\'entrevue',
    interview_designs: 'Conceptions d\'entrevue',
    interview_designs_hint: 'An interview design is a sequence of steps which are themselves based on forms with a specific (or the latest) revision. The interviews are to be answered by participants defined in data collection campaigns. The interview can be self-administered by the participant or assisted by an interviewer. Interviews are recorded after each step form is completed. Access to the interview design can be limited to a set of users or groups of users. An interview design can be enabled or disabled at any time. See the <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/content/itws.html" target="_blank">Interview designs documentation</a> and the <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/cookbook/interviews/" target="_blank">Interviews cookbook</a>.',
    add_interview_design_hint: 'Ajouter une onception d\'entrevue',
    interview_records: 'Enregistrement d\'entrevues',
    interview_records_hint: 'Data records (interviews) are captured through each interview step, which are themself based on a form revision. See the <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/content/itw-records.html" target="_blank">Interview records documentation</a> and the <a href="https://amberdoc.obiba.org/en/latest/studio-user-guide/cookbook/interviews/" target="_blank">Interviews cookbook</a>.',
    edit_interview_design_hint: 'Éditer la conception d\'entrevue',
    start_interview_design_hint: 'Démarrer la conception d\'entrevue',
    pause_interview_design_hint: 'Mettre en pause la conception d\'entrevue',
    delete_interview_design_hint: 'Supprimer la conception d\'entrevue',
    delete_interview_design_confirm: 'Veuillez confirmer la suppression de la conception d\'entrevue:',
    delete_interview_designs_hint: 'Supprimer les conceptions d\'entrevue sélectionnées',
    delete_interview_designs_confirm: 'Veuillez confirmer la suppression des conceptions d\'entrevue:',
    interview_design_state: {
      active: 'Actif',
      paused: 'En pause'
    },
    interview_design_repeat_policy: {
      title: 'Enregistrements',
      hint: 'La stratégie à adopter quand un enregistrement est soumis plusieurs fois (basé sur l\'identifiant personel). Plusieurs enregistrements peuvent être accepté, ou un unique enregistrement pour un individu donné. Dans ce dernier cas, un nouvel enregistrement sera rejeté ou mettre à jour l\'enregistrement existant.',
      single_reject: 'Enregistrement unique, rejet',
      single_update: 'Enregistrement unique, mise à jour',
      multiple: 'Enregistrements multiples'
    },
    search_interview_hint: 'Chercher les entrevues par code de participant',
    view_interview_hint: 'Voir l\'entrevue',
    edit_interview_hint: 'Éditer l\'entrevue',
    delete_interview_hint: 'Supprimer l\'entrevue',
    delete_interview_confirm: 'Veuiilez confirmer la suppression de l\'entrevue:',
    delete_interviews_hint: 'Supprimer les entrevues sélectionnées',
    delete_interviews_confirm: 'Veuillez confirmer la suppression des entrevues sélectionnées:',
    interview_state: {
      in_progress: 'En cours',
      completed: 'Complétée'
    },
    export_interviews_hint: 'Exporter les entrevues',
    all_designs: '(toutes)',
    all_states: '(tous)',
    campaign: 'Campagne',
    all_campaigns: '(toutes)'
  },
  datasets: {
    title: 'Données'
  },
  main: {
    brand: 'Amber Studio',
    brand_caption: 'Système de rapport de cas',
    organisation: 'OBiBa',
    profile: 'Profile',
    my_profile: 'Mon profile',
    logout: 'Déconnexion',
    dashboard: 'Tableau de bord',
    content: 'Contenu',
    administration: 'Administration',
    settings: 'Paramètres',
    copyright: 'Droits de reproduction',
    all_rights_reserved: 'Tous droits réservés',
    powered_by: 'Propulsé par'
  },
  chart: {
    cumulated_records: 'Nombre cumulé de rapports de cas',
    cumulated_interviews: 'Nombre cumulé d\'entrevues',
    zoom: 'Zoom',
    reset_zoom: 'Réinitialiser le zoom',
    restore: 'Restaurer'
  },
  loading: {
    title: 'Chargement',
    caption: 'Veuillez patienter...'
  },
  validations: {
    required: 'Une valeur est requise',
    minLength: 'Ce champ doit faire au moins {min} caractères',
    maxLength: 'Ce champ peut faire au maximum {max} caractères',
    email: 'Adresse courriel non valide',
    strongPassword: 'Le mot de passe de passe doit avoir au moins un caractère pour chaque type : minuscule, majuscule, chiffre, caractère spécial.'
  },
  roles: {
    guest: 'Invité',
    interviewer: 'Interviewer',
    manager: 'Gestionnaire',
    administrator: 'Administrateur',
    inactive: 'Inactif'
  },
  error: {
    general: 'Erreur dans le traitement de la requète. Si ce problème persiste, contacter le support.',
    account_already_exists: 'Ce compte existe déjà. Essayez de réinitialiser votre mot de passe ou contactez le support.',
    create_account_invalid: 'Les informations du compte ne sont pas valides.',
    create_account: 'Erreur à la creation du compte. Si ce problème persiste, contacter le support.',
    update_account: 'Erreur à la mise à jour du compte. Si ce problème persiste, contacter le support.',
    get_users: 'Erreur à la récupération des utilisateurs.',
    get_user: 'Erreur à la récupération de l\'utilisateur.',
    get_groups: 'Erreur à la récupération des groupes.',
    get_group: 'Erreur à la récupération du groupe.',
    get_group_users: 'Erreur à la récupération des utilisateurs du groupe.',
    get_studies: 'Erreur à la récupération des études.',
    get_study: 'Erreur à la récupération de l\'étude.',
    get_study_forms: 'Erreur à la récupération des formulaires.',
    get_study_form: 'Erreur à la récupération du formulaire.',
    get_form_revisions: 'Erreur à la récupération des versions du formulaire.',
    get_case_report_forms: 'Erreur à la récupération des formulaires de rapport de cas.',
    get_case_reports: 'Erreur à la récupération des rapport de cas.',
    form_revision_has_case_reports: 'Le formulaire {name} dans la version {revision} ne peut être supprimé car des rapports de cas sont toujours associés.',
    get_tasks: 'Erreur à la récupération des tâches.'
  },
  success: {
    create_account: 'Compte créé avec succès. Un courriel de vérification d\'adresse a été envoyé.',
    update_account: 'Compte mise à jour avec succès.',
    send_reset_password: 'Demande de réinitialisation de mot de passe envoyée.',
    reset_password: 'Mot de passe réinitialisé avec succès.',
    update_password: 'Mot de passe mis à jour avec succès.',
    send_verify_email: 'Courriel de vérification pour la nouvelle adresse envoyé.',
    resend_verify_email: 'Courriel de vérification envoyé.',
    create_user: 'Utilisateur ajouté avec succès.',
    update_user: 'Utilisateur mis à jour avec succès.',
    delete_user: 'Utilisateur supprimé avec succès.',
    delete_users: 'Utilisateurs supprimés avec succès.',
    create_group: 'Groupe ajouté avec succès. Éditer pour ajouter des membres.',
    update_group: 'Groupe mis à jour avec succès.',
    delete_group: 'Groupe supprimé avec succès.',
    delete_groups: 'Groupes supprimés avec succès.',
    create_study: 'Étude ajoutée avec succès. Éditer pour ajouter des populations et des formulaires.',
    update_study: 'Étude mise à jour avec succès.',
    delete_study: 'Étude supprimée avec succès.',
    delete_studies: 'Études supprimées avec succès.',
    create_study_form: 'Formulaire ajouté avec succès. Éditer pour ajouter des éléments.',
    update_study_form: 'Formulaire mis à jour avec succès.',
    delete_study_form: 'Formulaire supprimé avec succès.',
    delete_study_forms: 'Formulaires supprimés avec succès.',
    tagged_form: 'Formulaire étiquetté avec succès.',
    delete_form_revision: 'Version du formulaire supprimée avec succès.',
    delete_form_revisions: 'Versions des formulaires supprimées avec succès.',
    create_case_report_form: 'Formulaire de rapport de cas ajouté avec succès.',
    update_case_report_form: 'Formulaire de rapport de cas mis à jour avec succès.',
    delete_case_report_form: 'Formulaire de rapport de cas supprimé avec succès.',
    delete_case_report_forms: 'Formulaires de rapport de cas supprimés avec succès.',
    update_case_report: 'Rapport de cas mis à jour avec succès.',
    delete_case_report: 'Rapport de cas supprimé avec succès.',
    delete_case_reports: 'Rapport de cas supprimés avec succès.',
    create_interview_design: 'Conception d\'entrevue ajoutée avec succès.',
    update_interview_design: 'Conception d\'entrevue mis à jour avec succès.',
    delete_interview_design: 'Conception d\'entrevue supprimée avec succès.',
    delete_interview_designs: 'Conceptions d\'entrevue supprimées avec succès.',
    create_campaign: 'Campagne ajoutée avec succès.',
    update_campaign: 'Campagne mis à jour avec succès.',
    delete_campaign: 'Campagne supprimée avec succès.',
    delete_campaigns: 'Campagnes supprimées avec succès.',
    create_participant: 'Participant ajouté avec succès.',
    create_participants: 'Participants ajoutés avec succès (peu prendre du temps pour être complet).',
    update_participant: 'Participant mis à jour avec succès.',
    activate_participant: 'Participant activé.',
    pause_participant: 'Participant en pause.',
    delete_participant: 'Participant supprimé avec succès.',
    delete_participants: 'Participants supprimés avec succès.',
    update_interview: 'Entrevue mis à jour avec succès.',
    delete_interview: 'Entrevue supprimée avec succès.',
    delete_interviews: 'Entrevues supprimée avec succès.',
    reset_participant_password: 'Mot de passe du participant réinitialisé avec succès.',
    create_task: 'Tâche ajoutée avec succès.',
    delete_task: 'Tâche supprimée avec succès.',
    delete_tasks: 'Tâches supprimées avec succès.'
  },
  form: {
    tr_add: 'Ajouter une traduction',
    tr_add_key: 'Ajouter une clé de traduction',
    tr_merge_items: 'Ajouter les clés de traduction des éléments',
    tr_merge_confirm: 'Veuillez confirmer l\'ajout des paramètres observés dans le formulaire (libellé, description, placeholder, indice et message de validation) comme clés de traduction. Les clés de traduction existantes ne seront pas modifiées.',
    tr_clean: 'Supprimer les traductions non utilisées dans les éléments',
    tr_clean_confirm: 'Veuillez confirmer la suppression des clés de traduction n\'apparaissant pas dans les paramètres du formulaire (libellé, description, placeholder, indice et message de validation).',
    tr_delete_selected: 'Supprimer les traductions sélectionnées',
    tr_search_hint: 'Chercher des traductions',
    tr_locales_hint: 'Selectionner les langues',
    tr_export_hint: 'Exporter les traductions',
    tr_key: 'Clé',
    tr_value: 'Traduction',
    tr_delete_selected_confirm: 'Veuillez confirmer la suppression des traductions sélectionnées.',
    tr_delete_locale_confirm: 'Veuillez confirmer la suppression de toutes les traductions pour cette langue.',
    tr_import: 'Importer des traductions',
    tr_import_hint: 'Téléverser des traductions à partir d\'un fichier (.txt, .csv, .tsv).',
    tr_import_file: 'Fichier de traductions',
    import_schema: 'Ficher de schéma',
    import_schema_hint: 'Ficher de schéma à importer, contenant les éléments et les traductions du formulaire.',
    add_item_hint: 'Ajouter un élément',
    design: 'Conception',
    schema: 'Schéma',
    preview: 'Prévue',
    preview_data_clear: 'Effacer',
    definition: 'Définition',
    data: 'Données',
    settings: 'Paramètres',
    rendering: 'Rendu',
    name: 'Nom',
    name_hint: 'Identifiant unique, requis, sera utilisé comme nom de variable.',
    section_hint: 'Identifiant pour grouper les éléments par section.',
    type: 'Type',
    type_hint: 'Type d\'élément.',
    types: {
      form: 'Formulaire',
      text: 'Réponse courte',
      textarea: 'Paragraphe',
      number: 'Number',
      date: 'Date',
      datetime: 'Date et temps',
      time: 'Temps',
      radiogroup: 'Choix unique',
      checkboxgroup: 'Choix multiple',
      select: 'Menu déroulant',
      autocomplete: 'Auto complétion',
      'image-select': 'Image à sélectionner',
      toggle: 'Bascule',
      slider: 'Glissière',
      section: 'Section',
      group: 'Groupe',
      rating: 'Échelle',
      computed: 'Calculé',
      map: 'Donnée géographique'
    },
    geo_types: {
      Point: 'Point',
      Polygon: 'Polygone'
    },
    layout: 'Mise en page préferée',
    layout_hint: 'Mise en page du formulaire : use seule page ou plusieurs.',
    single_page: 'Une seule page',
    multi_steps: 'Étapes multiples',
    title: 'Titre',
    form_title_hint: 'Titre du formulaire publié',
    form_description_hint: 'Description du formulaire publié.',
    copyright: 'Droit d\'auteur',
    form_copyright_hint: 'Qui possède la propriété intellectuelle de ce formulaire.',
    license: 'Licence',
    form_license_hint: 'Licence sous laquelle ce formulaire peut être utilisé et partagé.',
    form_license_cc: 'Les licences suggérées sont celles de <a href="https://creativecommons.org/about/cclicenses/" target="_blank">Creative Commons</a>.',
    id_label: 'Libellé de l\'identifiant',
    id_label_hint: 'Libellé du champ de l\'identifiant unique du patient/participant.',
    id_description: 'Instructions pour l\'identifiant',
    id_description_hint: 'Instructions pour la saisie de l\'identifiant du patient/participant.',
    id_mask: 'Masque de l\'identifiant',
    id_validation: 'Validation de l\'identifiant',
    id_validation_hint: 'Règle de validation de l\'identifiant. Utiliser $(\'_id\') pour accèder à la valeur. Si le résultat est négatif, un message d\'erreur est affiché.',
    id_validation_message: 'Message d\'échec de la validation de l\'identifiant',
    label: 'Libellé',
    label_hint: 'Libellé ou titre du champ.',
    label_class: 'Classe du libellé',
    label_class_hint: 'Classe CSS à appliquer au libellé du champ.',
    image_class: 'Image class',
    image_class_hint: 'CSS class to apply to the image.',
    description: 'Description',
    description_hint: 'Texte d\'aide pour le champ.',
    description_class: 'Classe de la description',
    description_class_hint: 'Classe CSS à appliquer à la description du champ.',
    validation: 'Validation',
    validation_hint: 'Règle de validation. Si le résultat est négatif, un message d\'erreur est affiché.',
    validation_message: 'Message d\'échec de la validation',
    validation_message_hint: 'Message à affiché quand la validation échoue.',
    compute: 'Calcul',
    compute_hint: 'Calcul de la valeur du champ.',
    condition: 'Condition',
    condition_hint: 'Condition de visibilité. Quand le champ n\'est pas visible la valeur de ce champ est supprimée.',
    default: 'Défaut',
    default_hint: 'Valeur par défaut.',
    placeholder: 'Placeholder',
    placeholder_hint: 'Text d\'aide dans le champ.',
    close_label: 'Libellé de fermeture',
    close_label_hint: 'Ajoute un bouton avec le libellé fourni pour fermer la boite de dialogue.',
    hint: 'Indice',
    hint_hint: 'Text d\'aide sous le champ.',
    mask: 'Masque',
    mask_hint: 'Formattage du texte à l\'aide d\'un masque (voir la documentation pour le codage du masque).',
    required: 'Requis',
    required_hint: 'Une valeur est requise. Vérifé avant la validation.',
    multiple: 'Choix multiple',
    new_value: 'Possibilté d\'ajouter une nouvelle valeur (non listée dans les options)',
    min: 'Minimum',
    min_hint: 'Valeur minimum.',
    max: 'Maximum',
    max_hint: 'Valeur maximum.',
    format: 'Format',
    format_hint: 'Règle de mise en forme.',
    geo: {
      types: {
        Point: 'Point',
        Polygon: 'Polygône'
      },
      type: 'Type de géometrie',
      type_hint: 'Le type de géometrie à dessiner sur la carte.',
      center: 'Centre de la carte',
      center_hint: 'Position du centre de la carte, au format: [longitude,latitude]. La valeur par défaut est [0,0].',
      zoom: 'Zoom',
      zoom_hint: 'Zoom initial. La valeur par défaut est 12.',
      geo_location: 'Avec géolocalisation',
      map_height: 'Hauteur de la carte',
      map_height_hint: 'La hauteur par défault est 400px.'
    },
    icon: 'Icône',
    icon_hint: 'Nom de l\'icône.',
    size: 'Taille',
    size_hint: 'Taille de l\'élément.',
    color: 'Coleur',
    color_hint: 'Nom de la couleur.',
    options: 'Options',
    options_hint: 'Pour chaque option, la valeur est requise et unique.',
    option_value: 'Valeur',
    option_label: 'Libellé',
    show_more_options: 'Montrer plus...',
    add_option: 'Ajouter une option',
    delete_options: 'Suprimer toutes les options',
    upload_options: 'Téléverser des options',
    upload_options_hint: 'Téléverser des options à partir d\'un fichier (.txt, .csv, .tsv).',
    image: 'Image',
    image_hint: 'Définir une image et ses zones de sélection.',
    image_src: 'Source de l\'mage',
    image_src_hint: 'La source de l\'image peut être une adresse web ou encodée au format base64.',
    upload_image: 'Téléverser une image',
    upload_image_hint: 'Téléverser une image à partir d\'un fichier (.jpg, .png).',
    image_areas: 'Zones de sélection',
    image_areas_hint: 'Les zones de sélection sont des polygones ayant une couleur et une valeur. Cette valeur est associée à une option. Plusieurs zones peuvent sélectionner la même valeur. Les points sont des coordonnées x,y séparées par des espaces.',
    area_value: 'Valeur',
    area_fill: 'Couleur',
    area_points: 'Points',
    show_more_areas: 'Montrer plus...',
    add_area_hint: 'Ajouter une zone de sélection',
    delete_areas_hint: 'Supprimer les zones de sélection',
    upload_areas: 'Téléverser des zones',
    upload_areas_hint: 'Téléverser les zones de sélection à partir d\'un fichier texte (.txt, .csv, .tsv).',
    show_area_select: 'Voir le menu déroulant des options',
    select_next: 'Sélectionner l\'élément suivant (alt-bas)',
    select_previous: 'Sélectionner l\'élément précédent (alt-haut)',
    move_up: 'Monter',
    move_down: 'Descendre',
    copy_item: 'Copier',
    cut_item: 'Couper',
    paste_item: 'Coller',
    paste_copied_item: 'Ajouter la copie de {name}',
    paste_cut_item: 'Déplacer {name}',
    delete: 'Supprimer',
    no_item_selected: 'Aucun élément sélectionné.',
    revisions: 'Version',
    items: 'Éléments',
    translations: 'Traductions',
    no_revision: 'Aucune version du formulaire n\'a été publiée. Publier le formulaire est requis afin de pouvoir l\'inclure dans un formulaire de rapport de cas.',
    search_form_revision_hint: 'Chercher par numéro de version ou par commentaire',
    export_form_revision_hint: 'Exporter cette version du formulaire',
    view_form_revision_hint: 'Voir le formulaire de cette version',
    reinstate_form_revision_hint: 'Rétablir la version',
    reinstate_form_revision_confirm: 'Veuillez confirmer le rétablissement de la version du formulaire:',
    delete_form_revisions_hint: 'Supprimer les versions sélectionnées',
    delete_form_revisions_confirm: 'Veuillez confirmer la suppression des versions du formulaire:',
    delete_form_revision_hint: 'Supprimer la version',
    delete_form_revision_confirm: 'Veuillez confirmer la suppression de la version du formulaire:',
    tag_comment_hint: 'Commentaire optionnel à propos des changements dans le formulaire.'
  },
  interview: {
    design: 'Conception',
    steps: 'Étapes',
    campaigns: 'Campagnes',
    definition: 'Définition',
    schedule: 'Calendrier',
    interviewer_instructions: 'Instructions pour l\'enquêteur·rice',
    interviewer_instructions_hint: 'Explications optionnelles de la procédure, le format markdown est supporté.',
    participant_instructions: 'Instructions pour le participant',
    participant_instructions_hint: 'Explications optionnelles de la procédure, le format markdown est supporté.',
    add_step_hint: 'Ajouter une étape',
    step_name_hint: 'Nom unique qui servira pour groupes les données collectées durant cette étape. Notez que "participant" est un nom réservé.',
    step_rendering: 'Rendu',
    step_time_estimate: 'Estimation de temps (moyen ou min)',
    step_time_estimate_hint: 'Temps moyen ou minimum estimé pour répondre aux questions de cette étape, en minutes, optionnel.',
    step_time_estimate_max: 'Estimation de temps (max)',
    step_time_estimate_max_hint: 'Temps maximum estimé pour répondre aux questions de cette étape, en minutes, optionnel.',
    step_condition: 'Condition',
    step_condition_hint: 'Condition de visibilité. Une étape qui n\'est pas visible est supprimée.',
    step_disable: 'Inactif',
    step_disable_hint: 'Règle d\'activation. Quand une étape est désactivée, elle est visible mais ne peut être commencée (quand des étapes sont inter-dépendantes par exemple).',
    edit_step_hint: 'Éditer l\'étape',
    move_up_step_hint: 'Monter l\'étape',
    move_down_step_hint: 'Descendre l\'étape',
    delete_step_confirm: 'Veuillez confirmer la suppression de l\'étape:',
    delete_step_hint: 'Supprimer l\'étape',
    delete_steps_hint: 'Supprimer les étapes sélectionnées',
    no_step_selected: 'Aucune étape n\'est sélectionnée',
    add_campaign_hint: 'Ajouter une campagne',
    delete_campaign_confirm: 'Veuillez confirmer la suppression de la campagne:',
    delete_campaign_hint: 'Supprimer une campagne',
    delete_campaigns_hint: 'Supprimer les campagnes sélectionnées',
    campaign_visit: 'Amber Visit',
    campaign_visit_hint: 'Addresse de l\'application Amber Visit à utiliser pour cette campagne. Non requis s\'il y a une seule application Amber Visit.',
    campaign_investigators: 'Investigateurs',
    campaign_investigators_hint: 'Les investigateurs recevront des courriels les invitant à faire le suivi des participants, et ils pourront saisir les réponses des participants. Au moins un est requis.',
    campaign_notifications: 'Send notifications',
    campaign_supporters: 'Enquêteurs de soutien',
    campaign_supporters_hint: 'Les enquêteurs sont les personnes de contact pour les participants, et ils pourront saisir les réponses des participants. Au moins un est requis.',
    campaign_security: 'Sécurité',
    campaign_with_password: 'Mot de passe de participant',
    campaign_with_password_hint: 'Le participant doit entrer un mot de passe à la première connexion.',
    campaign_valid_from: 'Valide depuis',
    campaign_valid_from_hint: 'Date à partir de laquelle les invitations de participants commencera. Si non renseignée, le calendrier des invitations est effectif immédiatement.',
    campaign_valid_until: 'Valide jusqu\'à',
    campaign_valid_until_hint: 'Date d\'échéance des invitations. Si non renseignée les invitations seront opérationnelles indéfiniment.',
    campaign_weeks_reminder: 'Semaines entre rappels',
    campaign_weeks_reminder_hint: 'Nombre de semaines à attendre entre rappels, à compter du contact initial.',
    campaign_reminders_count: 'Nombre de rappels',
    campaign_reminders_count_hint: 'Nombre de rappels à envoyer aux enquêteurs jusqu\'à ce que l\'entrevue soit complétée ou l\'invitation soit désactivée.',
    campaign_weeks_deactivate: 'Semaines avant désactivation',
    campaign_weeks_deactivate_hint: 'Nombre de semaines à attendre avant la désactivation d\'un participant, à compter du contact initial.',
    add_participants: 'Ajouter des participants',
    import_participants: 'Importer des participants',
    add_participant_hint: 'Ajouter un ou plusieurs participants',
    add_single_participant: 'Un participant',
    add_multiple_participants: 'Plusieurs participants',
    add_participants_count: 'Nombre de participants',
    add_participants_count_hint: 'Le nombre de participants à ajouter et ayant le même profile, mais sans identifiant d\'étude (pour des participants anonymes par exemple).',
    participant_code: 'Code',
    participant_identifier: 'Identifiant',
    participant_identifier_hint: 'Identifiant du participant dans l\'étude, optionnel.',
    participant_active: 'Actif',
    participant_valid_from: 'Valide depuis',
    participant_valid_from_hint: 'Date à partir de laquelle l\'invitation du participant est effective. Si non renseignée, l\'invitation est effective immédiatement.',
    participant_valid_until: 'Valide jusqu\'à',
    participant_valid_until_hint: 'Date d\'échéance de l\'invitation. Si non renseignée l\'invitation est opérationelle jsuqu\'à ce que l\'entrevue soit complétée.',
    participant_initial_contact: 'Contact initial',
    participant_reminders_count: '# Rappels',
    participant_attributes: 'Attributs',
    participant_attributes_hint: 'Les attributs du participant peuvent être utilisés dans l\'entrevue comme paramètre conditionnel ou dans des champs calculés.',
    add_participant_attribute_hint: 'Ajouter un attribut',
    delete_participant_attributes_hint: 'Supprimer tous les attributs',
    upload_participants: 'Importer des participants',
    upload_participants_hint: 'Importer des participants depuis un fichier texte (.txt, .csv, .tsv).',
    delete_participants_hint: 'Supprimer les participants sélectionnés',
    delete_participants_confirm: 'Veuillez confirmer la suppression des participants sélectionnés:',
    delete_participant_hint: 'Supprimer un participant',
    delete_participant_confirm: 'Veuillez confirmer la suppression du participant:',
    view_participant_hint: 'Voir les détails du participant',
    edit_participant_hint: 'Éditer les détails du participant',
    pause_participant_hint: 'Mettre le participant en pause',
    activate_participant_hint: 'Activater le participant',
    reset_participant_password_hint: 'Réinitialiser le mot de passe du participant',
    go_to_form: 'Aller au formulaire'
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
  add: 'Ajouter',
  update: 'Appliquer',
  delete: 'Supprimer',
  cancel: 'Annuler',
  save: 'Sauvegarder',
  saving: 'Sauvegarde en cours...',
  save_done: 'Toutes les modifications ont été sauvegardées',
  edit_settings: 'Éditer les paramètres',
  reinstate: 'Rétablir',
  export: 'Exporter',
  import: 'Importer',
  tag: 'Étiquetter',
  search: 'Chercher',
  role: 'Rôle',
  institution: 'Institution',
  city: 'Ville',
  title: 'Titre',
  phone: 'Téléphone',
  email: 'Courriel',
  email_hint: 'Adresse courriel vérifiable.',
  password: 'Mot de passe',
  password_hint: 'Créer un mot de passe de 8 caractères au minimum avec majuscule et minuscule, chiffre et caractère spécial.',
  firstname: 'Prénom',
  lastname: 'Nom de famille',
  preferred_language: 'Langue préférée',
  name: 'Nom',
  description: 'Description',
  comment: 'Commentaire',
  revision: 'Version',
  permissions: 'Permissions',
  restricted_access: 'Accès restreint',
  state: 'État',
  type: 'Type',
  date: 'Date',
  status: 'Statuts',
  members: 'Membres',
  action: 'Action',
  required: 'Requis',
  confirmed: 'Confirmé',
  pending: 'En attente',
  unknown: 'Inconnue',
  no_results: 'Pas de resultats',
  close: 'Fermer',
  id: 'ID',
  go_home: 'Retour à l\'accueil',
  nothing_here: 'Il n\'y a rien ici...',
  updated_at: 'Mise à jour',
  from: 'Depuis',
  to: 'Jusqu\'à',
  key: 'Clé',
  value: 'Valeur'
}
