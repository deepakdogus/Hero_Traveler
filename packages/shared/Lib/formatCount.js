import Numeral from 'numeral'

export default function formatCount(count) {
  const num = Numeral(count)

  if (count < 10000) {
    return num.format('0,0')
  }

  return num.format('0.0a')
}
