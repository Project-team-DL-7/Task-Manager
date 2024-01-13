const TaskService = require("../../application/TaskService")

module.exports = isTaskAccesibleByUser = async function(id_task, id_user) {
	const res = await TaskService.isTaskAccesibleByUser(id_task, id_user)
	if (res) { return res }
	else return { message: "This task is not accessible by this user" }
}
