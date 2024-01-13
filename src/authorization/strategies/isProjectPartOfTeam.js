const ProjectService = require("../../application/ProjectService")

module.exports = isProjectPartOfTeam = async function(id_user, id_team) {
	const res = await ProjectService.isProjectPartOfTeam(id_user, id_team)
	if (res) { return res }
	else return { message: "Project is not part of this team" }
}
