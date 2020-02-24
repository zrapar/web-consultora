import mock from './../mock';
import { FuseUtils } from '@fuse';

const calendarDB = {
	events : []
};

mock.onGet('/api/calendar-app/events').reply((config) => {
	return [ 200, calendarDB.events ];
});

mock.onPost('/api/calendar-app/add-event').reply((request) => {
	const data = JSON.parse(request.data);
	calendarDB.events = [
		...calendarDB.events,
		{
			...data.newEvent,
			id : FuseUtils.generateGUID()
		}
	];
	return [ 200, calendarDB.events ];
});

mock.onPost('/api/calendar-app/update-event').reply((request) => {
	const data = JSON.parse(request.data);

	calendarDB.events = calendarDB.events.map((event) => {
		if (data.event.id === event.id) {
			return data.event;
		}
		return event;
	});

	return [ 200, calendarDB.events ];
});

mock.onPost('/api/calendar-app/remove-event').reply((request) => {
	const data = JSON.parse(request.data);

	calendarDB.events = calendarDB.events.filter((event) => data.eventId !== event.id);

	return [ 200, calendarDB.events ];
});
