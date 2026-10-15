import { formService } from '../services/form'

export const EXPORT_FORMAT = 'amber-interview-design'

export async function getStudyForms (study) {
  const result = await formService.getForms({ page: 1, rowsPerPage: 0 }, study)
  return result?.data || []
}

export async function exportInterviewDesign (design) {
  const forms = await getStudyForms(design.study)
  const data = {
    format: EXPORT_FORMAT,
    version: 1,
    name: design.name,
    label: design.label,
    description: design.description,
    interviewer_instructions: design.interviewer_instructions,
    participant_instructions: design.participant_instructions,
    // form ids are platform specific: keep the form name to link it on import
    steps: (design.steps || []).map(({ _id, ...step }) => ({
      ...step,
      formName: forms.find(f => f._id === step.form)?.name
    })),
    i18n: design.i18n || {}
  }
  const blob = new Blob([JSON.stringify(data, null, '  ')], { type: 'application/json' })
  const a = document.createElement('a')
  a.download = `${design.name}-design.json`
  a.href = window.URL.createObjectURL(blob)
  a.click()
  a.remove()
}
