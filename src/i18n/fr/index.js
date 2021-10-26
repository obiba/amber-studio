export default {
  account: {
    title: 'Compte utilisateur'
  },
  login: {
    title: 'Identifiez vous pour commencer une session',
    submit: 'Connexion',
    forgot_password: "Mot de passe oublié ?",
    register: 'Enregistrement'
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
    add_user: 'Ajouter',
    add_user_hint: 'Ajouter un nouvel utilisateur',
    group_users_hint: 'Grouper les utilisateurs sélectionnés',
    group_add_hint: 'Groupe dans lequel les utilisateurs seront ajoutés',
    delete_users_hint: 'Supprimer les utilisateurs sélectionnés',
    delete_users_confirm: 'Veuillez confirmer la suppression des utilisateurs sélectionnés :',
    delete_user_hint: 'Supprimer l\'utilisateur',
    delete_user_confirm: 'Veuillez confirmer la suppression de l\'utilisateur :',
    last_seen: 'Dernière conn.',
    roles_filter: 'Rôles',
    search_hint: 'Chercher par nom ou courriel'
  },
  groups: {
    title: 'Groupes',
    edit_group_hint: 'Éditer le groupe',
    add_group: 'Ajouter',
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
  studies: {
    title: 'Études',
    edit_study_hint: 'Éditer l\'étude',
    add_study_hint: 'Ajouter une nouvelle étude',
    delete_studies: 'Supprimer',
    delete_studies_hint: 'Supprimer les études sélectionnées',
    delete_studies_confirm: 'Veuillez confirmer la suppression les études sélectionnés:',
    delete_study_hint: 'Supprimer l\'étude',
    delete_study_confirm: 'Veuillez confirmer la suppression l\'étude:',
    search_hint: 'Chercher par nom ou description'
  },
  study: {
    title: 'Étude',
    definition: 'Definition',
    forms: 'Formulaires',
    events: 'Évènements'
  },
  datasets: {
    title: 'Données',
  },
  main: {
    brand: 'Amber Studio',
    organisation: 'OBiBa',
    profile: 'Profile',
    logout: 'Déconnexion',
    dashboard: 'Tableau de bord',
    settings: 'Paramètres',
    copyright: 'Droits de reproduction',
    all_rights_reserved: 'Tous droits réservés',
    powered_by: 'Propulsé par'
  },
  loading: {
    title: 'Chargement',
    caption: 'Veuillez patienter...'
  },
  validations: {
    required: 'Une valeur est requise',
    minLength: 'Ce champ doit faire au moins {min} charactères',
    maxLength: 'Ce champ peut faire au maximum {max} charactères',
    email: 'Adresse courriel non valide'
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
    create_account: 'Erreur à la creation du compte. Si ce problème persiste, contacter le support.',
    update_account: 'Erreur à la mise à jour du compte. Si ce problème persiste, contacter le support.',
    get_users: 'Erreur à la récupération des utilisateurs.',
    get_user: 'Erreur à la récupération de l\'utilisateur.',
    get_groups: 'Erreur à la récupération des groupes.',
    get_group: 'Erreur à la récupération du groupe.',
    get_group_users: 'Erreur à la récupération des utilisateurs du groupe.',
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
  },
  add: 'Ajouter',
  update: 'Appliquer',
  delete: 'Supprimer',
  cancel: 'Annuler',
  save: 'Sauvegarder',
  search: 'Chercher',
  role: 'Rôle',
  institution: 'Institution',
  city: 'Ville',
  title: 'Titre',
  phone: 'Téléphone',
  email: 'Courriel',
  email_hint: 'Adresse courriel vérifiable.',
  password: 'Mot de passe',
  password_hint: 'Créer un mot de passe de 8 character au minimum.',
  firstname: 'Prénom',
  lastname: 'Nom de famille',
  preferred_language: 'Langue préférée',
  name: 'Nom',
  description: 'Description',
  status: 'Statuts',
  members: 'Membres',
  action: 'Action',
  required: 'Requis',
  confirmed: 'Confirmé',
  pending: 'En attente',
  unknown: 'Inconnue',
  no_results: 'Pas de resultats'
}
