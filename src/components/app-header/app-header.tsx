import { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getUser } from '../../services/slices/userSlice';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './app-header.module.css';

export const AppHeader: FC = () => {
  const location = useLocation();
  const user = useSelector(getUser);
  const userName = user?.name || '';

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            <BurgerIcon
              type={location.pathname === '/' ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            <ListIcon
              type={location.pathname === '/feed' ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to='/'>
            <Logo className='' />
          </NavLink>
        </div>

        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            <ProfileIcon
              type={
                location.pathname.startsWith('/profile')
                  ? 'primary'
                  : 'secondary'
              }
            />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
