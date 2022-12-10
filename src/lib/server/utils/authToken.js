import jwt from 'jsonwebtoken';
import { JWT_EXPIRATION, JWT_SECRET } from '$env/static/private';

const issuer = 'anfest';

/**
 * @param {Object} params
 * @param {number} params.id
 * @param {string} params.name
 * @param {string} params.profile_picture_url
 */
function generate({ id, name, profile_picture_url }) {
	const access_token = jwt.sign(
		{
			sub: id,
			name,
			profile_picture_url,
		},
		JWT_SECRET,
		{
			issuer,
			expiresIn: JWT_EXPIRATION,
		}
	);

	return {
		access_token,
	};
}

/**
 * @param {string} accessToken
 */

function validate(accessToken) {
	return jwt.verify(accessToken, JWT_SECRET, { issuer });
}

export default { generate, validate };
