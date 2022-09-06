const tuple = <T extends string[]>(...args: T) => args;

export const iconNames = tuple(
  "account-create",
  "account-connect",
  "account-export",
  "account-import",
  "add-name",
  "add",
  "back",
  "checkmark",
  "checkmark-circle",
  "copy",
  "close",
  "danger",
  "danger-big",
  "downarrow",
  "dropdown",
  "failed",
  "hamburger",
  "link",
  "logo",
  "network-other",
  "next",
  "tab-history",
  "tab-send",
  "tab-wallet",
  "tab-sign",
  "title-network",
  "title-request",
  "title-security",
  "title-trash",
  "trash",
  "tx-in",
  "tx-out",
  "tx-self",
  "usb",
  "view-disabled",
  "view-enabled",
  "aergo-gem"
);

export type IconName = typeof iconNames[number];
