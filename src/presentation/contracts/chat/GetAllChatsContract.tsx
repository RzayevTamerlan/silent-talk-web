import { Chat } from '@domain/entities/Chat.ts';
import { PaginatedResult } from '@infra/dtos/common/PaginatedResult.ts';
import { createContext, type ReactNode, useContext } from 'react';
import { memo } from 'react';

export type GetAllChatsContract = {
  loading: boolean;
  error: string[] | null;
  data?: PaginatedResult<Chat>;
  limit?: number;
  search?: string;
  inputSearchValue?: string;
  page?: number;
  sort?: 'asc' | 'desc';
  setSort?: (sort: 'asc' | 'desc') => void;
  setPage?: (page: number) => void;
  setLimit?: (limit: number) => void;
  setSearch?: (search: string) => void;
  resetFilters?: () => void;
};

const GetAllChatsContractContext = createContext<GetAllChatsContract | null>(null);

interface GetAllChatsContractProviderProps extends GetAllChatsContract {
  children: ReactNode;
}

export const GetAllChatsContractProvider = memo(
  ({ children, ...value }: GetAllChatsContractProviderProps) => {
    return (
      <GetAllChatsContractContext.Provider value={value}>
        {children}
      </GetAllChatsContractContext.Provider>
    );
  },
);

export const useGetAllChatsContract = () => {
  const context = useContext(GetAllChatsContractContext);

  if (!context) {
    throw new Error('useGetAllChatsContract must be used within a GetAllChatsContractProvider');
  }

  return context;
};
