const UserService = require("../../application/UserService")

module.exports = isUserPartOfTeam = async function(id_user, id_team) {
	const res = await UserService.isUserPartOfTeam(id_user, id_team)
	if (res) { return res }
	else return { message: "User is not part of this team" }
}
