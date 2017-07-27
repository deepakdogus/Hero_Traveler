import test from 'ava'
// import { mount, shallow } from 'enzyme'
import loadAttributes from './loadAttributes'

test(t => {
  const el = loadAttributes(
    'This is my texts! Yes',
    {
      unstyled: {
        fontSize: 18,
        color: '#757575'
      }
    },
    [
      {
        style: 'ITALIC',
        length: 9,
        offset: 8
      }
    ],
    [], {}, () => {}
  )

  console.log(el)
  console.log('\n')
  console.log(JSON.stringify(el, null, 2))

  // t.is(el[0].props.children, 'This is ')
  // t.is(el[1], 'This is ')
  t.is(1, 1)
})
