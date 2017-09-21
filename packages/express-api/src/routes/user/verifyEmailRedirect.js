
export default function verifyEmailRedirect(req, res) {
  return res.redirect(`com.herotraveler.herotraveler-beta://emailverify/${req.params.token}`)
}
