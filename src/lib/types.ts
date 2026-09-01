export type Role = 'admin' | 'staff';

export type User = {
  id: number;
  username: string;
  display_name: string;
  role: Role;
  must_change_password: boolean;
  is_active: boolean;
  token_version: number;
  last_login_at: string | null;
  created_at: string;
};

export type SessionUser = Pick<User, 'id' | 'username' | 'display_name' | 'role' | 'must_change_password'>;

export type TaskStatus = 'bekliyor' | 'devam' | 'tamamlandi' | 'iptal';
export type TaskPriority = 'dusuk' | 'normal' | 'yuksek';
export type CustomerStatus = 'aktif' | 'duraklatildi' | 'ayrildi';
export type TxType = 'gelir' | 'gider';
export type DebtDirection = 'alacak' | 'borc';
