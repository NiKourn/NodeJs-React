import React from 'react'
import { Link } from 'react-router-dom'

const HomePage: React.FC = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			{/* Navigation */}
			<nav className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<h1 className="text-xl font-bold text-gray-900">MyApp</h1>
						</div>
						<div className="flex items-center space-x-4">
							<Link to="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
								Sign In
							</Link>
							<Link
								to="/register"
								className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
								Sign Up
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
						<span className="block">Welcome to</span>
						<span className="block text-blue-600">Your Modern App</span>
					</h1>
					<p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
						A full-stack application built with React, Node.js, TypeScript, PostgreSQL, and Prisma. Experience modern
						authentication and beautiful user interfaces.
					</p>
					<div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
						<div className="rounded-md shadow">
							<Link
								to="/register"
								className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
								Get Started
							</Link>
						</div>
						<div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
							<Link
								to="/login"
								className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
								Sign In
							</Link>
						</div>
					</div>
				</div>

				{/* Features */}
				<div className="mt-20">
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
						<div className="bg-white rounded-lg shadow-md p-6">
							<div className="text-center">
								<div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-blue-500 text-white">
									<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
								</div>
								<h3 className="mt-4 text-lg font-medium text-gray-900">Secure Authentication</h3>
								<p className="mt-2 text-sm text-gray-500">
									JWT-based authentication with secure password hashing and token management.
								</p>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-md p-6">
							<div className="text-center">
								<div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-green-500 text-white">
									<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
									</svg>
								</div>
								<h3 className="mt-4 text-lg font-medium text-gray-900">Modern Stack</h3>
								<p className="mt-2 text-sm text-gray-500">
									Built with React, TypeScript, Node.js, PostgreSQL, and Prisma for optimal performance.
								</p>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-md p-6">
							<div className="text-center">
								<div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-purple-500 text-white">
									<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4a2 2 0 012-2z"
										/>
									</svg>
								</div>
								<h3 className="mt-4 text-lg font-medium text-gray-900">Beautiful UI</h3>
								<p className="mt-2 text-sm text-gray-500">
									Clean, responsive design with Tailwind CSS for a great user experience.
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}

export default HomePage
