export default function(state) {
	if (state.height && state.width && state.width > state.height) return 'contain'
	return 'cover'
}