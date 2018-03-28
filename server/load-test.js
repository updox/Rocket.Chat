let counter = 0;

/**
 * Empty endpoint that does no work
 */
Meteor.methods({
	'dummy-endpoint': function() {
		if (!(counter % 1000)) {
			console.log(`Dummy endpoint counter: ${ counter } at ${ new Date().getTime() }`);
		}

		return counter++;
	}
});
