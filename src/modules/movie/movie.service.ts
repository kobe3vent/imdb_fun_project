import { BadRequestException, Injectable } from "@nestjs/common";
import axios from "axios";

import { AppConfigService } from "@/src/shared/config.service";
import { ITableRow, PdfGenerator } from "@/src/shared/pdf-tool";

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

    const rowsForPdf = data.results.map(movie =>
      this.convertMovieDtoForPdf(movie),
    );
    const pdfHandler = new PdfGenerator({
      title: "Movie List",
      columNames: [
        { name: "Title", position: 1 },
        { name: "Release", position: 2 },
        { name: "Vote", position: 3 },
      ],
      tableRows: rowsForPdf,
      footer: `Popular movie list requested at ${new Date().toLocaleDateString()}`,
    });
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

    const pdfHandler = new PdfGenerator({
      title: `Movie: ${data.title}`,
      columNames: [
        { name: "Title", position: 1 },
        { name: "Release", position: 2 },
        { name: "Vote", position: 3 },
      ],
      tableRows: [this.convertMovieDtoForPdf(data)],
      footer: `Information on the movie ${data.title} at ${new Date().toLocaleDateString()}`,
    });
    const pdfBuffer = await pdfHandler.createBuffer(true);
    return pdfBuffer;
  }

  convertMovieDtoForPdf(movie: MovieDTO): { [key: string]: ITableRow[] } {
    return {
      [movie.id]: [
        {
          columnName: "Title",
          text: movie.title,
          hyperlink: `http://${process.env.APP_HOST}:${process.env.PORT}/movie/${movie.id}`,
          columnPosition: 1,
        },
        {
          columnName: "Release",
          text: movie.release_date,
          columnPosition: 2,
        },

        {
          columnName: "Vote",
          text: movie.vote_average.toString(),
          columnPosition: 3,
        },
      ],
    };
  }
}
