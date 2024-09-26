export interface ApiResponse<T> {
  data: T;
  errors: any;  // Eğer hata yoksa, bunu da tip olarak belirtin
}

