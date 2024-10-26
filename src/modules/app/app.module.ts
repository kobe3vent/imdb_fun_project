import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { LoggerModule } from "@/src/shared/logger/logger.module";

import { HealthModule } from "../health/health.module";
import { MovieModule } from "../movie/movie.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule,
    HealthModule,
    MovieModule,
  ],
})
export class AppModule {}
