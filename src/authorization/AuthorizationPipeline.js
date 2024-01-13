module.exports = async function authorizationPipeline(...authorizationStrategies) {
	const results = await Promise.all(authorizationStrategies)

	const failedStrategies = results.filter((res) => res !== true)

	return failedStrategies
}
