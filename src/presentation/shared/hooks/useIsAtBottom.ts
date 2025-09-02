import { Ref, useCallback, useEffect, useState } from 'react';

type UseIsAtBottomProps = {
  ref?: Ref<HTMLElement>;
  threshold?: number;
};

type UseIsAtBottomReturn = {
  isAtBottom: boolean;
  scrollToBottom: () => void;
};

const useIsAtBottom = ({ ref, threshold = 100 }: UseIsAtBottomProps): UseIsAtBottomReturn => {
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

  useEffect(() => {
    if (!ref || !('current' in ref) || !ref.current) return;

    const handleScroll = () => {
      if (!ref.current) return;
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      setIsAtBottom(scrollHeight - scrollTop - clientHeight <= threshold);
    };

    const element = ref.current;
    element.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [ref, threshold]);

  const scrollToBottom = useCallback(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [ref]);

  return {
    isAtBottom,
    scrollToBottom,
  };
};

export default useIsAtBottom;
