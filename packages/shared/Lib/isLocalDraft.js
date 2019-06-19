export default function isLocalDraft(id = '') {
  return id.startsWith('local-')
}
