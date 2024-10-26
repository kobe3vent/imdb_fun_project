import { Controller, Get, Param, Post } from "@nestjs/common";

import { MovieService } from "./movie.service";

@Controller("movie")
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  findAll() {
    return this.movieService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.movieService.findOne(+id);
  }
}
