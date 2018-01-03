import React from 'react';
import styled, {css} from 'styled-components'
import {sizes} from '../Themes/Metrics'

// Iterate through the sizes and create a media template
export const mediaMax = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(...args)}
    }
  `

  return acc
}, {})

export const mediaMin = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (min-width: ${sizes[label] / 16}em) {
      ${css(...args)}
    }
  `

  return acc
}, {})

const ContentDiv = styled.div`
  margin: 80px;

  ${mediaMax.desktop`
    margin: 40px;
  `}

  ${mediaMax.phone`
    margin: 10px;
  `}

  ${mediaMax.tablet`
    margin: 10px;
  `}
`

const ContentLayout = (props) => {
  return (
    <ContentDiv {...props} />
  )
}

export default ContentLayout
