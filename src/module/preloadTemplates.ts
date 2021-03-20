export const preloadTemplates = async function() {
	const templatePaths = [
		// Add paths to "systems/overlight-vtt/templates"
	];

	return loadTemplates(templatePaths);
}
