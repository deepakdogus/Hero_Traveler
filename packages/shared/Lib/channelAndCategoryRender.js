const getCategoriesOrChannels = (selectedTab, channelsByID, users, categories, tabTypes) => {
    const channels = []
    if (selectedTab === tabTypes.channels){
      for (let i = 0; i < channelsByID.length; i++){
        if (users[channelsByID[i]]){
          channels.push(users[channelsByID[i]])
        }
      }
    }

    switch(selectedTab){
      case tabTypes.categories:
        return categories
      case tabTypes.channels:
        return channels
      default:
        return []
    }
}

export default getCategoriesOrChannels
