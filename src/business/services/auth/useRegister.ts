import type { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { showToasts } from '@business/shared/utils/showToasts';
import { RegisterValidationSchema } from '@business/validations/auth/RegisterValidationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { HttpError } from '@infra/api/HttpError';
import { RegisterDto } from '@infra/dtos/auth/RegisterDto.ts';
import authRepository from '@infra/repositories/auth';
import { useMutation } from '@tanstack/react-query';
import { dFunc } from 'd-func';
import type { BaseSyntheticEvent } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type UseRegisterReturn = {
  loading: boolean;
  error: string[];
  signUp: (e?: BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<RegisterDto>;
};

export type UseRegisterProps = BaseServiceProps & {
  redirectUrl?: string;
};

const useRegister = ({
  afterSuccess = dFunc,
  afterError = dFunc,
  redirectUrl = '/',
  showSuccessNotification = true,
  showErrorNotification = false,
}: UseRegisterProps): UseRegisterReturn => {
  const navigate = useNavigate();
  const { error, isPending, mutateAsync, isError } = useMutation<void, HttpError, RegisterDto>({
    mutationFn: authRepository.register,
    onSuccess: async () => {
      if (showSuccessNotification)
        showToasts(
          'Вы успешно зарегестрировались! Теперь, пожалуйста, войдите в аккаунт.',
          'success',
        );
      navigate(redirectUrl);
      if (afterSuccess) afterSuccess();
    },
    onError: async resError => {
      if (showErrorNotification) showToasts(resError.message, 'error');
      if (afterError) afterError();
    },
  });

  const form = useForm<RegisterDto>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(RegisterValidationSchema),
  });

  const handleSubmit = form.handleSubmit(async data => {
    await mutateAsync(data);
  });

  return {
    form,
    loading: isPending,
    signUp: handleSubmit,
    error: isError ? error?.message : [],
  };
};

export default useRegister;
