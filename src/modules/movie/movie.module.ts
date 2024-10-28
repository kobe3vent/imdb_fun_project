import { Module } from "@nestjs/common";

import { SharedModule } from "@/src/shared/shared.module";

import { MovieController } from "./movie.controller";
import { MovieService } from "./movie.service";

@Module({
  imports: [SharedModule],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
