// here handle all the intricacies of save version switching to handle specific save upgrade/downgrade issues
globalThis.handleVersionTransition = function(saveData, newVersion) {
	saveData.version = newVersion;
	return saveData;
}