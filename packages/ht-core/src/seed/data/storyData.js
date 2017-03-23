const storyData = [
  {
    title: "The first story ever",
    description: "Rufus the Retriever get Lost in Paradise",
    author: null,
    likes: 10,
    coverImage: "https://c1.staticflickr.com/5/4123/4796402805_ea2c065272_b.jpg"
  },
  {
    title: "Napa Valley Tour",
    description: "The Incredible Journey of Fido into Bali's Ancient Heartland",
    author: null,
    likes: 0,
    coverImage: "https://c1.staticflickr.com/5/4082/4776008973_7617678619_b.jpg"
  }
];

export default (users) => {
    if (!users || !users.length){
        throw new Error("No users supplied to story generator")
    } else {
        return storyData.map( (story, idx) => {
            story.author = users[1]._id
            return story;
        })
    }
}
