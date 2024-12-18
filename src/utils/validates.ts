const ipv4Pattern =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/

export const ValidateIsIPv4 = (value: string) => ipv4Pattern.test(value)

export const ValidateIsIPv6 = (value: string) => ipv6Pattern.test(value)

export const ValidateIsIp = (value: string) => (ValidateIsIPv4(value) ? true : ValidateIsIPv6(value) ? true : false)
