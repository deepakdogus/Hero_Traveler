export const roleToIconName = {
  'contributor': 'contributor',
  'founding member': 'founder',
  'fellow': 'fellow',
  'local hero': 'local',
}

export const roleToLabel = {
  'contributor': 'Contributor',
  'founding member': 'Founding Member',
  'fellow': 'Fellow',
  'local hero': 'Local Hero',
}

export function hasBadge (role) {
  return role === 'contributor'
  || role === 'founding member'
  || role === 'fellow'
  || role === 'local hero'
}
