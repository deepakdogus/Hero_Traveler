export const roleToIconName = {
  'contributor': 'contributor',
  'founding member': 'founder',
  'fellow': 'fellow'
}

export const roleToLabel = {
  'contributor': 'Contributor',
  'founding member': 'Founding Member',
  'fellow': 'Fellow'
}

export function hasBadge (role) {
  return role === 'contributor'
  || role === 'founding member'
  || role === 'fellow'
}
