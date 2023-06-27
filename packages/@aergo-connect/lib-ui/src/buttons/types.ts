const tuple = <T extends string[]>(...args: T) => args;

export const ButtonTypes = tuple(
  'default',
  'primary',
  'primary-outline',
  'secondary',
  'secondary-outline',
  'gradation',
  'font-gradation',
);
export type ButtonType = typeof ButtonTypes[number];

export const ButtonSizes = tuple('default', 'small', 'medium', 'large');
export type ButtonSize = typeof ButtonSizes[number];

export interface ButtonProps {
  type?: ButtonType;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  hover?: boolean;
}
