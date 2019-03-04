import React from 'react'
import PropTypes from 'prop-types'

import {
  SmallTitle,
  TableStyled,
  TrStyled,
  TdStyledGrey,
  TdStyled,
} from './StyledEditComponents'

const StatsTable = ({ title, columns}) => {
  return (
    <div>
        <SmallTitle>
          {title}
        </SmallTitle>
        <TableStyled>
          <tbody>
            {columns.map((c, i) => (
              <TrStyled key={`${i}`}>
                <TdStyledGrey>{c.title}</TdStyledGrey>
                <TdStyled>
                  {c.render
                    ? c.render()
                    : c.text
                  }
                </TdStyled>
              </TrStyled>
            ))}
          </tbody>
        </TableStyled>
      </div>
  )
}

StatsTable.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.array,
}

export default StatsTable
