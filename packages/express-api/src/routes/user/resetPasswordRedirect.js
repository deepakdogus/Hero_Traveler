
export default function resetPasswordRedirect(req, res) {
  return res.redirect(`com.rehashstudio.herotraveler://resetpassword/${req.params.token}`)
}
