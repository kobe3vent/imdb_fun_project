import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { isNil } from "lodash";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  private get(key: string): string | undefined {
    const value = this.configService.get<string>(key);

    /*  if (isNil(value)) {
      return undefined;
    } */

    return value;
  }
  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + " environment variable is not a number");
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, "\n");
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
  } {
    return {
      READ_KEY: this.getString("TMDB_READ_KEY"),
      KEY: this.getString("TMDB_KEY"),
      HOST: this.getString("TMBD_HOST"),
      VERSION: this.getString("TMBD_VERSION"),
    };
  }
}
