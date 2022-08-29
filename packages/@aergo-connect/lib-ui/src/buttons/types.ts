const tuple = <T extends string[]>(...args: T) => args;

<<<<<<< Updated upstream
export const ButtonTypes = tuple('default', 'primary', 'secondary', 'danger');
=======
export const ButtonTypes = tuple(
  "default",
  "primary",
  "primary-outline",
  "secondary",
  "secondary-outline",
  "gradation",
  "font-gradation",
  "white"
);
>>>>>>> Stashed changes
export type ButtonType = typeof ButtonTypes[number];

export const ButtonSizes = tuple('default');
export type ButtonSize = typeof ButtonSizes[number];

export interface ButtonProps {
  type?: ButtonType;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
}