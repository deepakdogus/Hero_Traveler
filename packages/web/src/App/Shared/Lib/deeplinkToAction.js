
export default function deeplinkToAction(url) {
  if (!url) return {}

  const [action, id] = url.slice(url.indexOf('//') + 2).split('/')

  return {
    action,
    id
  }
}
