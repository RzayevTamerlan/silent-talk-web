import { Button } from 'antd';
import { type FC, memo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface GoBackProps {
  placeholder?: ReactNode;
  className?: string;
  route?: string;
}

const GoBack: FC<GoBackProps> = ({ placeholder, className, route }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (route) {
      navigate(route);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      type="primary"
      onClick={handleGoBack}
      className={className}
      style={{ cursor: 'pointer' }}
    >
      {placeholder || 'Geri Qayıt'}
    </Button>
  );
};

const MemoizedGoBack = memo(GoBack);

export default MemoizedGoBack;
