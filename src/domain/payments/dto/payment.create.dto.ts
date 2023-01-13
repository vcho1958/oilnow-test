export interface PaymentCreateRequsetDto {
  id: string;
  amount: number;
}

export interface PaymentCreateResponseDto {
  message: 'The request is successful';
}
