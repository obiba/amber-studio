// Converts the forms of an Amber database export and reports the diagnostics, changing nothing.
//
//   mongoexport --uri mongodb://localhost:27017/amber --collection forms --jsonArray --out forms.json
//   node scripts/convert-dry-run.js forms.json
//
// Also works with the formrevisions collection.
import { readFileSync } from 'fs'
import { convertForm } from '../src/utils/convertForm.js'

const file = process.argv[2]
if (!file) {
  console.error('Usage: node scripts/convert-dry-run.js <forms.json>')
  process.exit(1)
}

const docs = JSON.parse(readFileSync(file, 'utf-8'))
const total = { forms: 0, converted: 0, skipped: 0, failed: 0, warned: 0, warnings: 0 }
docs.forEach(doc => {
  const name = `${doc.name || doc.form?.$oid || doc._id?.$oid || '?'}${doc.revision ? ' v' + doc.revision : ''}`
  total.forms++
  if (!doc.schema || doc.schema.uischema) {
    total.skipped++
    return
  }
  try {
    const warnings = convertForm(doc.schema).diagnostics.filter(diag => diag.level === 'warn')
    total.converted++
    if (warnings.length > 0) {
      total.warned++
      total.warnings += warnings.length
      console.log(`${name}: ${warnings.length} warning(s)`)
      warnings.forEach(diag => console.log(`  ${diag.key ? diag.key + ': ' : ''}${diag.message.split('\n')[0]}`))
    }
  } catch (e) {
    total.failed++
    console.log(`${name}: conversion failed: ${e.message}`)
  }
})
console.log(`\n${total.forms} forms: ${total.converted} converted (${total.converted - total.warned} without warnings, ` +
  `${total.warned} with ${total.warnings} warnings), ${total.failed} failed, ${total.skipped} skipped (no schema or already converted)`)
