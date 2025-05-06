import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-100 dark:bg-neutral-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">LawLink</h4>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Connecting legal professionals with clients through an innovative online platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/lawyers" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-500">
                  Find a Lawyer
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-500">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-neutral-600 dark:text-neutral-400">
                Riyadh, Saudi Arabia
              </li>
              <li>
                <a href="mailto:info@lawlink.com" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-500">
                  info@lawlink.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-center text-neutral-600 dark:text-neutral-400">
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer