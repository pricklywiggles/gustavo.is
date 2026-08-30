// Node strips types from .ts modules but resolves extensionless relative imports the way
// ESM does (not at all); the source keeps bundler-style specifiers, so retry with .ts.
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
