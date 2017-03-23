export default (users) => {
  if (!users || !users.length){
      throw new Error("No users supplied to story generator")
  }

  return [
    {
      follower: users[1]._id,
      followee: users[0]._id
    }
  ]
}
