import { Global, Logger, LogLevel, Module, Provider } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AppConfigService } from "./config.service";

const loggerProvider: Provider = {
  provide: Logger,
  useFactory: (configService: ConfigService) => {
    const level = configService.get<LogLevel>("LOGGER_LEVEL", "log");
    const logger = new Logger();
    logger.localInstance.setLogLevels?.([level]);
    return logger;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [AppConfigService, loggerProvider],
  imports: [ConfigModule],
  exports: [AppConfigService, loggerProvider],
})
export class SharedModule {}
