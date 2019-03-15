export const browserIs = (checkFor) => {

	const browsers = ["MSIE", "Firefox", "Safari", "Chrome", "Opera"]
  const sUsrAg = navigator.userAgent
  
  let nIdx = browsers.length - 1
  for (nIdx; nIdx > -1 && sUsrAg.indexOf(browsers[nIdx]) === -1; nIdx--){}
  
  return (browsers[nIdx] === checkFor)
}
