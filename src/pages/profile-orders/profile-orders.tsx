import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getUserOrders,
  selectUserOrders,
  selectUserOrdersLoading
} from '../../services/slices/userOrdersSlice';
import { ProfileMenuUI } from '../../components/ui/profile-menu';
import { logoutUser } from '../../services/slices/userSlice';
import { Preloader } from '../../components/ui/preloader';
import { OrderCard } from '../../components/order-card';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectUserOrdersLoading);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => navigate('/login'))
      .catch((err) => console.error('Ошибка выхода:', err));
  };

  if (isLoading) return <Preloader />;

  return (
    <div
      style={{
        display: 'flex',
        gap: '60px',
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '20px 0'
      }}
    >
      {/* Меню слева */}
      <div style={{ flex: '0 0 320px' }}>
        <ProfileMenuUI
          pathname={location.pathname}
          handleLogout={handleLogout}
        />
      </div>

      {/* Список заказов справа */}
      <div style={{ flex: 1 }}>
        {orders.length === 0 ? (
          <p className='text text_type_main-medium'>У вас пока нет заказов</p>
        ) : (
          orders.map((order) => <OrderCard key={order._id} order={order} />)
        )}
      </div>
    </div>
  );
};
