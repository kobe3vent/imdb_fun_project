import { Injectable } from "@nestjs/common";
import axios from "axios";
import { MovieDTO } from "./dto/movie.dto";

interface MovieInfoDisplayOnPdf {
  title: string;
  release_date: string;
  vote_average: number;
  hyperLink: string;
}

interface TmdbResponse {
  page: number;
  results: MovieDTO[];
}

@Injectable()
export class MovieService {
  async findAll() {
    const url = "https://api.themoviedb.org/3/movie/popular";
    const { data } = await axios.get<TmdbResponse>(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_KEY}`,
      },
    });
    console.log("data: ", data);
    const formattedData = data.results.map(movie =>
      this.movieAdapterForPdf(movie),
    );

    return `This action returns all movie`;
  }

  async findOne(id: number) {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const { data } = await axios.get<TmdbResponse>(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_KEY}`,
      },
    });
    return `This action returns a #${id} movie`;
  }

  movieAdapterForPdf(movie: MovieDTO): MovieInfoDisplayOnPdf {
    return {
      title: movie.original_title,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      hyperLink: `${process.env.APP_HOST}/movie/${movie.id}`,
    };
  }
}
