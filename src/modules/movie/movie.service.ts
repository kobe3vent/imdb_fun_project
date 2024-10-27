import { Injectable } from "@nestjs/common";
import axios from "axios";
import { MovieDTO } from "./dto/movie.dto";
import { PdfGenerator } from "@/src/shared/pdf-tool";

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
  async findAll(): Promise<any> {
    const url = "https://api.themoviedb.org/3/movie/popular";
    const { data } = await axios.get<TmdbResponse>(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_KEY}`,
      },
    });
    console.log("data: ", data);

    const pdfHandler = new PdfGenerator(data.results);
    const pdfBuffer = await pdfHandler.createBuffer();
    return pdfBuffer;
  }

  async findOne(id: number) {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const { data } = await axios.get<MovieDTO>(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_KEY}`,
      },
    });
    console.log("data: ", data);
    const pdfHandler = new PdfGenerator([data]);
    const pdfBuffer = await pdfHandler.createBuffer(true);
    return pdfBuffer;

    /*     {{ title }} 
{{ release_date }} 
{{ vote_average }} 
{{ poster_image }} */
  }
}
