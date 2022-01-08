import { log } from "../deps.ts";

export async function setupLog(): Promise<void> {
  await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler("DEBUG", {
        formatter: (logRecord) => {
          let msg = logRecord.msg;
          if (typeof msg !== "string") {
            return format(msg);
          }

          const specifiers = msg.match(/%[sdifoO]/g) ?? [];
          let args: Array<unknown>;

          if (specifiers.length) {
            for (let i = 0; i < specifiers.length; i++) {
              let value: string;

              switch (specifiers[i]) {
                case "%s":
                  value = String(logRecord.args[i]);
                  break;
                case "%o":
                  value = format(logRecord.args[i], true);
                  break;
                case "%d":
                case "%i":
                case "%f":
                case "%O":
                default:
                  value = format(logRecord.args[i]);
              }
              msg = msg.replace(specifiers[i], value);
            }
            args = logRecord.args.slice(specifiers.length);
          } else {
            args = logRecord.args;
          }

          for (const arg of args) {
            msg += " " + (typeof arg === "string" ? arg : format(arg));
          }

          return `[${logRecord.levelName}] ${msg}`;
        },
      }),
    },
    loggers: {
      default: {
        level: Deno.env.get("LOG_LEVEL") as log.LevelName | undefined || "INFO",
        handlers: ["console"],
      },
    },
  });
}

function format(arg: unknown, compact?: boolean): string {
  return Deno.inspect(arg, {
    colors: true,
    depth: 5,
    compact,
  });
}
