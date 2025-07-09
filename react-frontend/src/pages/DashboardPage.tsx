import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const DashboardPage: React.FC = () => {
	const { user, logout } = useAuth()

	const handleLogout = () => {
		logout()
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navigation */}
			<nav className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-gray-700">Welcome, {user?.username}!</span>
							<button
								onClick={handleLogout}
								className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
								Logout
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="min-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
						<div className="text-center">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to your Dashboard!</h2>
							<p className="text-gray-600 mb-6">You are successfully authenticated. Here's your user information:</p>

							<div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700">Name</label>
										<p className="mt-1 text-sm text-gray-900">{user?.username}</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">Email</label>
										<p className="mt-1 text-sm text-gray-900">{user?.email}</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">User ID</label>
										<p className="mt-1 text-sm text-gray-900 font-mono">{user?.id}</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">Member Since</label>
										<p className="mt-1 text-sm text-gray-900">
											{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
										</p>
									</div>
								</div>
							</div>

							<div className="mt-8">
								<p className="text-gray-500 text-sm">This is a protected route that requires authentication.</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}

export default DashboardPage
