
export default function deeplinkToAction(url) {
  console.log('DEEPLINK TO ACTION URL', url)
  if (!url) return {}

  const [action, id] = url.slice(url.indexOf('//') + 2).split('/')

  console.log('action, id', action, id)

  return {
    action,
    id
  }
}
