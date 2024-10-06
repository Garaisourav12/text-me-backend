const redis = require("../redis");

const cachingMiddleware = async (req, res, next) => {
	const id = req.userId;

	try {
		const user = await redis.get(id);
		if (user) {
			return res.status(200).json({
				source: "cache",
				user: JSON.parse(user),
			});
		}

		next();
	} catch (error) {}
};

module.exports = cachingMiddleware;
