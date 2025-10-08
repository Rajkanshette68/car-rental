import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'motion/react'

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext()

  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()

  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/owner/change-role')
      if (data.success) {
        setIsOwner(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getUserName = () => user?.name || user?.fullName || user?.username || 'User'
  const getUserEmail = () => user?.email || 'user@example.com'
  const roleLabel = isOwner ? 'Owner' : 'Customer'

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
        location.pathname === '/' && 'bg-light'
      }`}
    >
      {/* Logo */}
      <Link to='/'>
        <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt='logo' className='h-8' />
      </Link>

      {/* Menu */}
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${
          location.pathname === '/' ? 'bg-light' : 'bg-white'
        } ${open ? 'max-sm:translate-x-0' : 'max-sm:translate-x-full'}`}
      >
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.name}
          </Link>
        ))}

        {/* Search */}
        <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56'>
          <input
            type='text'
            className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500'
            placeholder='Search cars'
          />
          <img src={assets.search_icon} alt='search' />
        </div>

        <button
          onClick={() => (isOwner ? navigate('/owner') : changeRole())}
          className='cursor-pointer'
        >
          {isOwner ? 'Dashboard' : 'List cars'}
        </button>

        {/* Login or Profile */}
        {!user ? (
          <button
            onClick={() => setShowLogin(true)}
            className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg'
          >
            Login
          </button>
        ) : (
          <>
            <button
              aria-label='Profile'
              onClick={() => setProfileOpen(true)}
              className='cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-semibold hover:scale-110 transition-transform duration-300'
            >
              {getUserName().charAt(0).toUpperCase()}
            </button>

            {/* Right Drawer */}
            <AnimatePresence>
              {profileOpen && (
                <>
                  {/* Overlay */}
                  <motion.div
                    className='fixed inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/60 backdrop-blur-sm z-[59]'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setProfileOpen(false)}
                  />

                  {/* Drawer */}
                  <motion.div
                    className='fixed top-0 right-0 h-full w-full max-w-sm z-[60] bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-2xl border-l border-white/20 shadow-2xl rounded-l-3xl overflow-hidden flex flex-col'
                    initial={{ x: '100%', rotateY: 15, opacity: 0 }}
                    animate={{ x: 0, rotateY: 0, opacity: 1 }}
                    exit={{ x: '100%', rotateY: 10, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 90, damping: 14 }}
                  >
                    {/* Header */}
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className='flex justify-between items-center p-5 border-b border-white/20'
                    >
                      <div className='flex items-center gap-4'>
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 1.2 }}
                          className='w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white/30'
                        >
                          {getUserName().charAt(0).toUpperCase()}
                        </motion.div>
                        <div>
                          <h2 className='text-gray-900 font-semibold text-lg'>{getUserName()}</h2>
                          <p className='text-gray-500 text-sm'>{getUserEmail()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setProfileOpen(false)}
                        className='p-2 rounded-full hover:bg-white/30 transition'
                      >
                        ✕
                      </button>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      className='p-5 space-y-4 flex-1'
                      initial='hidden'
                      animate='visible'
                      variants={{
                        hidden: {},
                        visible: {
                          transition: { staggerChildren: 0.1, delayChildren: 0.3 }
                        }
                      }}
                    >
                      {[
                        { label: 'Name', value: getUserName() },
                        { label: 'Email', value: getUserEmail() },
                        { label: 'Role', value: roleLabel }
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          variants={{
                            hidden: { opacity: 0, x: 20 },
                            visible: { opacity: 1, x: 0 }
                          }}
                          className='flex justify-between items-center p-3 bg-white/40 rounded-xl shadow-sm hover:shadow-md transition'
                        >
                          <span className='text-gray-600'>{item.label}</span>
                          <span className='font-medium text-gray-800 truncate'>{item.value}</span>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                      className='p-5 border-t border-white/20 bg-white/30 backdrop-blur-sm'
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={async () => {
                          try {
                            await logout()
                          } finally {
                            setProfileOpen(false)
                          }
                        }}
                        className='w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition'
                      >
                        Logout
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <button
        className='sm:hidden cursor-pointer'
        aria-label='Menu'
        onClick={() => setOpen(!open)}
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt='menu' />
      </button>
    </motion.div>
  )
}

export default Navbar
