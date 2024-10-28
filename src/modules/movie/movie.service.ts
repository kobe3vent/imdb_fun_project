import { BadRequestException, Injectable } from "@nestjs/common";
import axios from "axios";

import { AppConfigService } from "@/src/shared/config.service";
import { PdfGenerator } from "@/src/shared/pdf-tool";

import { MovieDTO } from "./dto/movie.dto";

export interface TmdbResponse {
  page: number;
  results: MovieDTO[];
  total_pages: number;
  total_results: number;
}

export interface TmdbMovieDetailResponse {
  id: number;
  title: string;
  release_date: string;
  vote_average: string;
  poster_path: string;
}
@Injectable()
export class MovieService {
  constructor(readonly appConfig: AppConfigService) {}
  async findAll(): Promise<Buffer> {
    const url = `${this.appConfig.TMBD_CONFIG.HOST}/${this.appConfig.TMBD_CONFIG.VERSION}/movie/popular`;

    const { data } = await axios.get<TmdbResponse>(url, {
      headers: {
        Authorization: `Bearer ${this.appConfig.TMBD_CONFIG.READ_KEY}`,
      },
    });

    const pdfHandler = new PdfGenerator(data.results);
    const pdfBuffer = await pdfHandler.createBuffer();
    return pdfBuffer;
  }

  async findOne(id: number): Promise<Buffer> {
    if (!id || !Number.isInteger(id))
      throw new BadRequestException("id not valid");

    const url = `${this.appConfig.TMBD_CONFIG.HOST}/${this.appConfig.TMBD_CONFIG.VERSION}/movie/${id}`;
    const { data } = await axios.get<MovieDTO>(url, {
      headers: {
        Authorization: `Bearer ${this.appConfig.TMBD_CONFIG.READ_KEY}`,
      },
    });
    const pdfHandler = new PdfGenerator([data]);
    const pdfBuffer = await pdfHandler.createBuffer(true);
    return pdfBuffer;
  }
}
