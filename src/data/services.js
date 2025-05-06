import { FiUsers, FiBriefcase, FiShield, FiHome, FiClock, FiGlobe } from 'react-icons/fi'

const services = [
  {
    id: 1,
    title: 'Family Law',
    description: 'Marriage contracts, divorce proceedings, child custody, inheritance claims, and other family-related legal matters.',
    icon: FiUsers,
    color: 'primary'
  },
  {
    id: 2,
    title: 'Corporate Law',
    description: 'Business formation, contracts, commercial disputes, mergers and acquisitions, and regulatory compliance.',
    icon: FiBriefcase,
    color: 'secondary'
  },
  {
    id: 3,
    title: 'Criminal Law',
    description: 'Defense against criminal charges, legal representation in criminal proceedings, and appeals.',
    icon: FiShield,
    color: 'accent'
  },
  {
    id: 4,
    title: 'Real Estate Law',
    description: 'Property transactions, landlord-tenant disputes, construction contracts, and property rights issues.',
    icon: FiHome,
    color: 'success'
  },
  {
    id: 5,
    title: 'Labor Law',
    description: 'Employment contracts, workplace disputes, termination issues, and compensation claims.',
    icon: FiClock,
    color: 'warning'
  },
  {
    id: 6,
    title: 'Immigration Law',
    description: 'Visa applications, residency issues, citizenship applications, and deportation defense.',
    icon: FiGlobe,
    color: 'secondary'
  }
]

export default services