import { SyntheticEvent } from 'react';

export type ProfileUIProps = {
  formValue: {
    name: string;
    email: string;
    password: string;
  };
  isFormChanged: boolean;
  handleCancel: (e: SyntheticEvent) => void;
  handleSubmit: (e: SyntheticEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogout: () => void;
};
