import { convert } from '@obiba/quasar-ui-json-form/amber'

/**
 * Converts a legacy Amber form schema (items and i18n) into the JSON Forms
 * format: the form-level settings (label, idLabel, layout, license...) are kept
 * as they are, next to the schema, the UI schema and the translations.
 */
export function convertForm (amberSchema) {
  const { items, i18n, ...settings } = amberSchema
  const { schema, uischema, translations, diagnostics } = convert(amberSchema, { logger: false })
  return { form: { ...settings, schema, uischema, translations }, diagnostics }
}
