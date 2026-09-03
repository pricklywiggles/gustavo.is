// Node's ESM resolver ignores extensionless relative imports; the source uses bundler specifiers.
export async function resolve(specifier, context, next) {
	try {
		return await next(specifier, context);
	} catch (error) {
		if (
			error?.code === "ERR_MODULE_NOT_FOUND" &&
			/^\.\.?\//.test(specifier) &&
			!/\.[cm]?[jt]sx?$/.test(specifier)
		) {
			return next(`${specifier}.ts`, context);
		}
		throw error;
	}
}
