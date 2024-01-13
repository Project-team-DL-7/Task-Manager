const TaskService = require("../../application/TaskService")

module.exports = isTaskPartOfTeam = async function(id_task, id_team) {
	const res = await TaskService.isTaskPartOfTeam(id_task, id_team)
	if (res) { return res }
	else return { message: "Task is not part of this team" }
}
