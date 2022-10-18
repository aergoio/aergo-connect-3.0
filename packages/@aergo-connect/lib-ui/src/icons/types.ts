const tuple = <T extends string[]>(...args: T) => args;
export const iconNames = tuple(
  'account-create',
  'account-connect',
  'account-export',
  'account-import',
  'add-name',
  'add',
  'aergo-gem',
  'aergoMainLogo',
  'arrow-down',
  'arrow-right',
  'arrow-up',
  'back',
  'checkmark',
  'checkmark-circle',
  'copy',
  'close',
  'danger-big',
  'danger',
  'delete',
  'downarrow',
  'dropdown',
  'failed',
  'go-to-detail-transaction',
  'hamburger',
  'link',
  'lock',
  'logo-circle',
  'logo',
  'nav-logo',
  'network-other',
  'next',
  'refresh',
  'security',
  'sign-message',
  'tab-history',
  'tab-send',
  'tab-wallet',
  'tab-sign',
  'title-network',
  'title-request',
  'title-security',
  'title-trash',
  'trash',
  'tx-in',
  'tx-out',
  'tx-self',
  'usb',
  'view-disabled',
  'view-enabled',
  'warning',
  'warning2',
  'edit',
  'x',
  'check',
  'send',
  'plus',
  'next_grey',
  'pointer',
  'delete2',
  'redTrashBin',
  'aergo',
  'nothing',
  'confirmation',
  'password',
);
export type IconName = typeof iconNames[number];
