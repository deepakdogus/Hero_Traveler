import {Image} from 'react-native'

export default function(imageUrl, componentThis) {
	if (!imageUrl || !componentThis) return
	Image.getSize(imageUrl, (width, height) => {
		componentThis.setState({
			width,
			height,
			imageUrl,
		})
	})
}