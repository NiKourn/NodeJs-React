import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

function App() {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState<string[]>([]);

	useEffect(() => {
		// Connect to the WebSocket server
		const socket = io('ws://localhost:5500', {
			// transports: ['websocket'], // Ensure it's using WebSocket transport
		}); // Replace with your backend URL
		setSocket(socket);
		socket.emit('register', 'React Frontend');
		console.log('Connected to WebSocket server', socket);

		// Listen for messages
		socket.on('welcome', (data) => {
			console.log(data.message);
			setMessages((prev) => [...prev, data.message]);
		});

		socket.on('server-message', (data) => {
			console.log(data);
			setMessages((prev) => [...prev, data.message]);
		});

		// Cleanup on component unmount
		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p className="text-4xl">WebSocket Messages:</p>
				<ul className="text-left mt-10">
					{messages.map((msg, index) => (
						<li className="text-lg text-yellow" key={index}>
							{msg}
						</li>
					))}
				</ul>
			</header>
		</div>
	);
}

export default App;
