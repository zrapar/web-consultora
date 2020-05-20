import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';
import '../styles/500.css';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { eventId: null };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		Sentry.withScope((scope) => {
			scope.setExtras(errorInfo);
			const eventId = Sentry.captureException(error);
			this.setState({ eventId });
		});
	}

	render() {
		if (this.state.hasError) {
			setTimeout(function() {
				const container = document.getElementById('container');
				container.classList.remove('loading');
			}, 1000);

			return (
				<div id='container' className='loading'>
					<h1>500</h1>
					<h2>
						Ha ocurrido un error inesperado <b>:(</b>
					</h2>
					<div className='btn-container'>
						<button
							className='button-error'
							onClick={() => Sentry.showReportDialog({ lang: 'es', eventId: this.state.eventId })}
						>
							¿Cuéntanos que paso?
						</button>
					</div>
					<div className='btn-container'>
						<button
							className='button-back'
							onClick={() => {
								window.location.replace(window.location.origin);
							}}
						>
							Volver al inicio
						</button>
					</div>
					<div className='gears'>
						<div className='gear one'>
							<div className='bar' />
							<div className='bar' />
							<div className='bar' />
						</div>
						<div className='gear two'>
							<div className='bar' />
							<div className='bar' />
							<div className='bar' />
						</div>
						<div className='gear three'>
							<div className='bar' />
							<div className='bar' />
							<div className='bar' />
						</div>
					</div>
				</div>
			);
		}

		//when there's not an error, render children untouched
		return this.props.children;
	}
}

export default ErrorBoundary;
