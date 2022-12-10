import { DATABASE_URL } from '$env/static/private';
import pg from 'pg';

const pgPool = new pg.Pool({
	connectionString: DATABASE_URL,
});

export default pgPool;
