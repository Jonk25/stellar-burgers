import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  selectUser,
  updateUser,
  logoutUser
} from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  // Кнопки видны только если пользователь загружен и данные изменены
  const isFormChanged = user
    ? formValue.name !== user.name ||
      formValue.email !== user.email ||
      !!formValue.password
    : false;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!user) return;
    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password || undefined
      })
    )
      .unwrap()
      .then(() => {
        setFormValue((prev) => ({ ...prev, password: '' }));
      })
      .catch((err) => console.error('Ошибка обновления:', err));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => navigate('/login'))
      .catch((err) => console.error('Ошибка выхода:', err));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      handleLogout={handleLogout}
    />
  );
};
