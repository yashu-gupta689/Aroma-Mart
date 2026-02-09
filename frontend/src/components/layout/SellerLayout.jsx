import { NavLink, Outlet } from 'react-router-dom'
import { FiGrid, FiPackage, FiPlusCircle, FiShoppingBag, FiBarChart2 } from 'react-icons/fi'

const navItems = [
  { to: '/seller/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/seller/products', icon: FiPackage, label: 'My Products' },
  { to: '/seller/products/add', icon: FiPlusCircle, label: 'Add Product' },
  { to: '/seller/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/seller/analytics', icon: FiBarChart2, label: 'Analytics' },
]

export default function SellerLayout() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <nav className="p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/seller/products'}
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
