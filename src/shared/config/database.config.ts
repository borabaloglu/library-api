import * as envLoader from 'load-env-var';

export default {
	uri: envLoader.loadString('DATABASE_URI'),
};
