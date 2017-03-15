const storyData = [
    {
        title: "Story 1",
        description: "Test Story 1",
        author: null,
        likes: 10,
        createdAt: Date.now(),
        coverImage: "http://www.discover-bali-indonesia.com/photos/bali-rice-fields-02.jpg"
    },
    {
        title: "My Longer Story Title 2",
        description: "Testing the longer titles is probably something that we should be doing anyway",
        author: null,
        likes: 0,
        createdAt: Date.now(),
        coverImage: "https://pix6.agoda.net/city/17193/17193-7x3.jpg"
    }
];

export default (users) =>{
    if (!users || !users.length){
        throw new Error("No users supplied to story generator")
    } else {
        return storyData.map( (story, idx) => {
            story.author = users[0]._id
            return story;
        })
    }
}