export const roleToIconName = {
  'contributor': 'contributor',
  'founding member': 'founder',
  'fellow': 'fellow'
}

export function hasBadge (role) {
  return role === 'contributor' 
  || role === 'founding member' 
  || role === 'fellow'
}