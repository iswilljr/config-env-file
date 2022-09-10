declare module "config-env-file" {
  export declare interface Options {
    /** destination path to env file
     * @example ```js
     * await configEnvFile("config.json", {destination:"my-app"})
     * // env file written to my-app/.env.local
     * ```
     * @default "." */
    destination?: string;
    /** how to access variables
     * @example ```js
     * await configEnvFile("config.json", {env:"import"})
     * // will print your new config accessing the variables with import
     * ```
     * @default "process" */
    env?: "process" | "import";
    /** extension to env file name
     * @example
     * ```js
     * await configEnvFile("config.json", {extension:"prod"})
     * // filename: .env.prod
     * ```
     * @default "local" */
    extension?: string;
    /** prefix to variables name
     * @example
     * ```js
     * await configEnvFile("config.json", {prefix:"my_app"})
     * // env variables will be written with the prefix my_app
     * ```
     * @default null */
    prefix?: string;
    /** @default false */
    exitOnError?: boolean;
  }

  export declare const configEnvFile: (file: string, options?: Options) => Promise<void>;
}
