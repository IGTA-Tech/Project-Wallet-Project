export function checkAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD not configured');
    return false;
  }
  return password === adminPassword;
}

export function getAdminPasswordFromHeaders(headers: Headers): string | null {
  return headers.get('x-admin-password');
}
