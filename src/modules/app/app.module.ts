import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SharedModule } from "@/src/shared/shared.module";

import { HealthModule } from "../health/health.module";
import { MovieModule } from "../movie/movie.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    SharedModule,
    HealthModule,
    MovieModule,
  ],
})
export class AppModule {}
