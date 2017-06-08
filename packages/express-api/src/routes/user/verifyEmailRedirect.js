
export default function verifyEmailRedirect(req, res) {
  return res.redirect(`com.rehashstudio.herotraveler://emailverify/${req.params.token}`)
}
