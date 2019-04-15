
export default function resetPasswordRedirect(req, res) {
  return res.redirect(`com.herotraveler.herotraveler-beta://resetpassword/${req.params.token}`)
}
