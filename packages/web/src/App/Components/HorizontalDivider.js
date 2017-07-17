import styled from 'styled-components'

export default styled.hr`
	border-color: ${props => {
		switch (props.color) {
			case 'grey':
				return props.theme.Colors.lightGreyAreas
			default:
				return props.theme.Colors.snow
		}}
	};
	border-style: solid;
`