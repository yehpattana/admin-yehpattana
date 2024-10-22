import * as React from 'react';

import { DataContext, DataContextValue } from '@/contexts/data-context';

export function useProducts(): DataContextValue {
  const context = React.useContext(DataContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
