export function getStatusColor(status: string): 'info' | 'warning' | 'success' {
  switch (status) {
    case 'MANUAL':
      return 'info';
    case 'PENDING':
      return 'warning';
    case 'COMPLETED':
      return 'success';
    default:
      return 'info';
  }
}
