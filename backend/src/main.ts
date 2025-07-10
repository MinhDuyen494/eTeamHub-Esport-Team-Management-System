import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
app.enableCors({
  origin: 'http://localhost:5173', // Cho phép từ frontend
  credentials: true,               // (Nếu có dùng cookie/session)
});
app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Tự động loại bỏ các thuộc tính không được định nghĩa trong DTO
    transform: true, // Tự động chuyển đổi kiểu dữ liệu (ví dụ: string -> Date)
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
