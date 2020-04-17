import React from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import ClientsTable from './ClientsTable';
import ClientsHeader from './ClientsHeader';
import reducer from './store/reducers';

function Clients() {
	return (
		<FusePageCarded
			classes={{
				content : 'flex',
				header  : 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<ClientsHeader />}
			content={<ClientsTable />}
			innerScroll
		/>
	);
}

export default withReducer('clients', reducer)(Clients);
