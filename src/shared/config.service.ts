import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    return value || "";
  }
  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("config.Service:", JSON.stringify(error));
      throw new Error(key + " environment variable is not a number");
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value?.replaceAll(String.raw`\n`, "\n") || "";
  }
  public getPort() {
    return this.getNumber("PORT");
  }

  public isProduction() {
    const mode = this.getString("MODE");
    return mode == "prod";
  }

  get TMBD_CONFIG(): {
    READ_KEY: string;
    KEY: string;
    HOST: string;
    VERSION: string;
    IMG_BASE_URL: string;
  } {
    return {
      READ_KEY: this.getString("TMDB_READ_KEY"),
      KEY: this.getString("TMDB_KEY"),
      HOST: this.getString("TMBD_HOST"),
      VERSION: this.getString("TMBD_VERSION"),
      IMG_BASE_URL: this.getString("TMBD_IMG_BASE_URL"),
    };
  }
}
