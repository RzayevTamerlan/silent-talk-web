import { useDebounce } from '@presentation/shared/hooks/useDebounce';
import { validateNumberParam } from '@presentation/shared/utils/validateNumberParam';
import {
  Children,
  cloneElement,
  isValidElement,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';

interface GetAllChatsSearchParamsManagerProps {
  children: ReactNode;
}

const GetAllChatsSearchParamsManager = ({ children }: GetAllChatsSearchParamsManagerProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = validateNumberParam(searchParams.get('page'), 1);
  const limit = validateNumberParam(searchParams.get('limit'), 50);
  const search = searchParams.get('search') || '';
  const [inputSearchValue, setInputSearchValue] = useState(search);
  const debouncedSearchValue = useDebounce(inputSearchValue, 500);

  const sortOrder = searchParams.get('sortOrder') || ('asc' as 'asc' | 'desc');
  const isPublic = searchParams.get('isPublic');

  if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
    throw new Error(`Invalid sortOrder: ${sortOrder}. Valid sortOrders are 'asc', 'desc'.`);
  }

  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        params.set('page', String(newPage));
        return params;
      });
    },
    [setSearchParams],
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        if (newLimit < 1 || newLimit > 100) {
          params.set('limit', String(50));
          params.set('page', '1');
          return params;
        }
        params.set('limit', String(newLimit));
        params.set('page', '1');
        return params;
      });
    },
    [setSearchParams],
  );

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        if (newSearch.trim() === '') {
          params.delete('search');
        } else {
          params.set('search', newSearch);
        }
        params.set('page', '1');
        return params;
      });
    },
    [setSearchParams],
  );

  const handleChangeInputSearchValue = useCallback((newValue: string) => {
    if (newValue.trim() === '') {
      setInputSearchValue('');
    } else {
      setInputSearchValue(newValue);
    }
  }, []);

  const handleSortChange = useCallback(
    (newSort: 'asc' | 'desc') => {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        if (newSort === 'asc' || newSort === 'desc') {
          params.set('sortOrder', newSort);
        } else {
          params.delete('sortOrder');
        }
        return params;
      });
    },
    [setSearchParams],
  );

  const handleResetFilters = useCallback(() => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.delete('search');
      params.delete('sortOrder');
      params.set('page', '1');
      params.set('limit', '50');
      return params;
    });
    setInputSearchValue('');
  }, [setSearchParams]);

  useEffect(() => {
    handleSearchChange(debouncedSearchValue);
  }, [debouncedSearchValue, handleSearchChange]);

  const childrenWithProps = Children.map(children, child => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        // @ts-expect-error Children first approach has bad type support
        page,
        limit,
        search,
        inputSearchValue,
        sortOrder,
        isPublic,
        setSort: handleSortChange,
        setPage: handlePageChange,
        setLimit: handleLimitChange,
        setSearch: handleChangeInputSearchValue,
        resetFilters: handleResetFilters,
      });
    }
    return child;
  });

  return <>{childrenWithProps}</>;
};

const MemoizedGetAllChatsSearchParamsManager = memo(GetAllChatsSearchParamsManager);

export default MemoizedGetAllChatsSearchParamsManager;
