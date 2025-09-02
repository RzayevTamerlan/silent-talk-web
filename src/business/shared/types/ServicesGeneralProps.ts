export type BaseServiceProps = {
  showErrorNotification?: boolean;
  showSuccessNotification?: boolean;
  afterError?: () => void;
  afterSuccess?: () => void;
  clearForm?: boolean;
};
