/**
 * Creates test users on the fly. If the requested number of test users
 * already exists then new ones will not be created.
 */
Meteor.startup(function() {
	if (process.env.TEST_MODE === 'true' && process.env.TEST_USER_COUNT) {

		const totalTestUsersCount = Number.parseInt(process.env.TEST_USER_COUNT);
		const isNumber = +totalTestUsersCount === +totalTestUsersCount;

		if (!totalTestUsersCount || !isNumber) {
			throw new Error(`Failed to parse env variable TEST_USER_COUNT as an integer. Got '${ totalTestUsersCount }'`);
		}

		console.log(`Attempting to create ${ totalTestUsersCount } test users`);

		let existingUsersCount = 0;

		try {

			for (let i = 0; i < totalTestUsersCount; i++) {
				const id = `testUser-${ i }`;
				const user = {
					_id: id,
					name: id,
					username: id,
					emails: [
						{
							address: `${ id }@rocket.chat`,
							verified: true
						}
					],
					status: 'offline',
					statusDefault: 'online',
					utcOffset: 0,
					active: true,
					type: 'user'
				};

				if (!RocketChat.checkUsernameAvailability(user.username)) {
					console.debug(`Test user ${ user.username } already exists`);
					existingUsersCount++;
					continue;
				}

				RocketChat.models.Users.create(user);

				const password = 'pw';
				Accounts.setPassword(user._id, password);

				RocketChat.authz.addUserRoles(user._id, 'admin');

				RocketChat.addUserToDefaultChannels(user, true);

				console.debug(`Created new test user with username and password: '${ id }'`);
			}

			const usersCreatedCount = totalTestUsersCount - existingUsersCount;
			console.log(`Successfully created test users. total requested = ${ totalTestUsersCount }, already existing = ${ existingUsersCount }, newly created = ${ usersCreatedCount }`);

		} catch (e) {
			console.error(`Error while creating ${ totalTestUsersCount } test users: `, e.message);
		}
	}
});
