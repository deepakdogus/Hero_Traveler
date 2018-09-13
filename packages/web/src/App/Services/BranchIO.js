import env from '../Config/Env'
/* global branch*/
export function  branchInit (){
    branch.init(env.BRANCH_IO_LIVE_KEY, (err, data) => {
    if (err) console.log('branch error: ', err)
    else console.log('branch data:', data)
  })
}

const linkData = {
  campaign: 'content 123',
  channel: 'web',
  feature: 'dashboard',
  stage: 'new user',
  tags: [ 'tag1', 'tag2', 'tag3' ],
  alias: '',
  data: {
    'custom_bool': true,
    'custom_int': Date.now(),
    'custom_string': 'hello',
    '$og_title': 'Title',
    '$og_description': 'Description',
    '$og_image_url':'http://lorempixel.com/400/400'
  }
};

export function branchLink(){
  let theLink;
  branch.link(linkData, (err, link)=> {
    if(err) console.log('branchLink error: ', err)
    else {
      console.log('link: ', link)
    }
  })
  return theLink
}
