import React, { FC } from 'react';
import { ProfileUIProps } from './type';
import { ProfileMenuUI } from '../../profile-menu';
import styles from './profile.module.css';
import { Input, Button } from '@zlden/react-developer-burger-ui-components';

export const ProfileUI: FC<ProfileUIProps> = ({
  formValue,
  isFormChanged,
  handleCancel,
  handleSubmit,
  handleInputChange,
  handleLogout
}) => (
  <div className={styles.container}>
    <div className={styles.menu}>
      <ProfileMenuUI pathname='/profile' handleLogout={handleLogout} />
    </div>
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        type='text'
        placeholder='Имя'
        name='name'
        value={formValue.name}
        onChange={handleInputChange}
        size='default'
        extraClass='mb-3'
      />
      <Input
        type='email'
        placeholder='E-mail'
        name='email'
        value={formValue.email}
        onChange={handleInputChange}
        size='default'
        extraClass='mb-3'
      />
      <Input
        type='password'
        placeholder='Пароль'
        name='password'
        value={formValue.password}
        onChange={handleInputChange}
        size='default'
        extraClass='mb-3'
        icon='EditIcon'
      />
      {isFormChanged && (
        <div className={styles.buttons}>
          <Button
            type='secondary'
            size='medium'
            htmlType='button'
            onClick={handleCancel}
            extraClass='mr-2'
          >
            Отменить
          </Button>
          <Button type='primary' size='medium' htmlType='submit'>
            Сохранить
          </Button>
        </div>
      )}
    </form>
  </div>
);
