import { NavLink, Outlet } from 'react-router-dom'
import { FiUsers, FiUserCheck, FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp } from 'react-icons/fi'

const navItems = [
  { to: '/admin/dashboard', icon: FiDollarSign, label: 'Dashboard' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/sellers', icon: FiUserCheck, label: 'Sellers' },
  { to: '/admin/products', icon: FiPackage, label: 'Products' },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/admin/analytics', icon: FiTrendingUp, label: 'Revenue' },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <nav className="p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors ${
                  isActive ? 'bg-primary-100 text-primary-700 font-medium' : ''
                }`
              }
            >
              <Icon className="text-xl" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
