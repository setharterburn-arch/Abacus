import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Breadcrumb - Navigation breadcrumb trail
 * 
 * Props:
 * - items: Array of { label, path } objects (optional - auto-generates from route if not provided)
 * - separator: String separator between items (default: '›')
 */

const routeLabels = {
  '': 'Home',
  'dashboard': 'Dashboard',
  'practice': 'Practice',
  'diagnostic': 'Diagnostic',
  'worksheets': 'Worksheets',
  'feedback': 'Feedback',
  'beta': 'Beta',
  'learning-paths': 'Learning Paths',
  'assignments': 'Assignments',
  'shop': 'Shop',
  'admin': 'Admin',
  'account': 'My Account',
  'auth': 'Sign In',
  'demo': 'Demo',
  'faq': 'FAQ',
  'changelog': 'Changelog',
  'test': 'Test Zone',
  'interactive-test': 'Interactive Test',
};

const Breadcrumb = ({ items, separator = '›' }) => {
  const location = useLocation();
  
  // Auto-generate items from route if not provided
  const breadcrumbItems = items || (() => {
    const paths = location.pathname.split('/').filter(Boolean);
    const result = [{ label: '🏠 Home', path: '/' }];
    
    let currentPath = '';
    for (const segment of paths) {
      currentPath += `/${segment}`;
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      result.push({ label, path: currentPath });
    }
    
    return result;
  })();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb"
      style={{
        padding: '0.75rem 1rem',
        fontSize: '0.9rem',
        color: 'var(--color-text-muted)',
      }}
    >
      <ol style={{
        display: 'flex',
        flexWrap: 'wrap',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <motion.li
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {isLast ? (
                <span 
                  style={{ 
                    fontWeight: 'bold',
                    color: 'var(--color-text)'
                  }}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.path}
                    style={{
                      color: 'var(--color-primary)',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    {item.label}
                  </Link>
                  <span style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>
                    {separator}
                  </span>
                </>
              )}
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
