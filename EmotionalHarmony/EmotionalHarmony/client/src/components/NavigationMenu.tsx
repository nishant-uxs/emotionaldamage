import React from 'react';
import { Link, useLocation } from 'wouter';

const NavigationMenu: React.FC = () => {
  const [location] = useLocation();

  return (
    <div className="hidden md:block">
      <nav>
        <ul className="flex gap-6 font-poppins">
          <li>
            <Link href="/">
              <a className={location === '/' ? "text-primary font-medium" : "text-gray-600 hover:text-primary transition-colors"}>
                Home
              </a>
            </Link>
          </li>
          <li>
            <Link href="/library">
              <a className={location === '/library' ? "text-primary font-medium" : "text-gray-600 hover:text-primary transition-colors"}>
                Library
              </a>
            </Link>
          </li>
          <li>
            <Link href="/history">
              <a className={location === '/history' ? "text-primary font-medium" : "text-gray-600 hover:text-primary transition-colors"}>
                History
              </a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a className={location === '/about' ? "text-primary font-medium" : "text-gray-600 hover:text-primary transition-colors"}>
                About
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavigationMenu;
