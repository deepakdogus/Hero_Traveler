export default function getUserByUserName(users, name) {
	let user

	for (const i in users) {
		if (users.hasOwnProperty(i) && users[i].username === name) {
			user = users[i]
		}
	}

	return user
}
