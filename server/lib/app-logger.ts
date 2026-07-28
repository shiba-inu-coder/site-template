import logger from "pino";
import { isDev } from "#shared/constants/base";
import type { Logger as ILogger } from "pino";

export type Log = ILogger;

export const AppLogger = (op: string) => {
  return logger({
    hooks: {
      logMethod(inputArgs: any[], method: Function) {
        const string = inputArgs
          .map((item: unknown) =>
            typeof item === "object" ? JSON.stringify(item) : item,
          )
          .join(" ");
        return method.call(this, string);
      },
    },
    mixin: () => {
      return {
        date: new Date(Date.now()).toISOString(),
      };
    },
    ...(isDev
      ? {
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
            },
          },
        }
      : {}),
  }).child({ op });
};
