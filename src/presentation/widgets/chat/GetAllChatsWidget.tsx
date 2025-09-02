import useGetAllChats from '@business/services/chat/useGetAllChats';
import type { GetAllChatsQueryDto } from '@infra/dtos/chat/GetAllChatsQueryDto';
import { GetAllChatsContractProvider } from '@presentation/contracts/chat/GetAllChatsContract';
import { type FC, memo, type ReactNode } from 'react';

type GetAllChatsWidgetProps = GetAllChatsQueryDto & {
  children?: ReactNode;
  setPage?: (page: number) => void;
  setLimit?: (limit: number) => void;
  setSearch?: (search: string) => void;
  setSort?: (sort: 'asc' | 'desc') => void;
  resetFilters?: () => void;
  inputSearchValue?: string;
};

const GetAllChatsWidget: FC<GetAllChatsWidgetProps> = ({
  limit,
  search,
  page,
  children,
  setPage,
  setSearch,
  setLimit,
  resetFilters,
  inputSearchValue = '',
  setSort,
  sortBy,
  sortOrder,
}) => {
  const { error, data, loading } = useGetAllChats({
    dto: {
      limit,
      search,
      page,
      sortOrder,
      sortBy,
    },
  });

  return (
    <GetAllChatsContractProvider
      data={data}
      loading={loading}
      error={error}
      limit={limit}
      search={search}
      page={page}
      setPage={setPage}
      setSearch={setSearch}
      resetFilters={resetFilters}
      setLimit={setLimit}
      inputSearchValue={inputSearchValue}
      setSort={setSort}
      sort={sortOrder}
    >
      {children}
    </GetAllChatsContractProvider>
  );
};

const MemoizedGetAllChatsWidget = memo(GetAllChatsWidget);

export default MemoizedGetAllChatsWidget;
